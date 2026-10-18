package za.ac.cput.herms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.domain.PasswordResetToken;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.repository.PasswordResetTokenRepository;
import za.ac.cput.herms.util.Helper;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class PasswordResetService {

    static final Duration TOKEN_LIFETIME = Duration.ofHours(1);
    // At most one email per account per minute, so the form cannot be used to flood an inbox.
    static final Duration RESEND_DELAY = Duration.ofMinutes(1);

    private final AccountRepository accounts;
    private final PasswordResetTokenRepository tokens;
    private final MailService mail;
    private final AuditLogService auditLog;
    private final String frontendUrl;
    private final SecureRandom random = new SecureRandom();

    public PasswordResetService(AccountRepository accounts, PasswordResetTokenRepository tokens, MailService mail,
                                AuditLogService auditLog, @Value("${herms.frontend-url}") String frontendUrl) {
        this.accounts = accounts;
        this.tokens = tokens;
        this.mail = mail;
        this.auditLog = auditLog;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
    }

    /** Silently does nothing for unknown emails, so callers cannot discover which emails have accounts. */
    @Transactional
    public void requestReset(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        tokens.deleteByExpiresAtBefore(Instant.now());
        Optional<Account> found = accounts.findByEmail(email.trim());
        if (found.isEmpty()) {
            return;
        }
        Account account = found.get();
        Instant now = Instant.now();
        boolean recentlySent = tokens.findByAccountId(account.getAccountId()).stream()
                .anyMatch(t -> t.getCreatedAt().isAfter(now.minus(RESEND_DELAY)));
        if (recentlySent) {
            return;
        }
        tokens.deleteByAccountId(account.getAccountId());

        byte[] raw = new byte[32];
        random.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        tokens.save(new PasswordResetToken(account.getAccountId(), sha256(token), now, now.plus(TOKEN_LIFETIME)));

        mail.sendAsync(account.getEmail(), "Reset your HERMS password",
                "We received a request to reset your HERMS password.\n\n"
                        + "Open this link to choose a new password (valid for 1 hour):\n"
                        + frontendUrl + "/reset-password?token=" + token + "\n\n"
                        + "If you did not ask for this, you can ignore this email; your password will not change.");
        auditLog.record(account.getEmail(), "PASSWORD_RESET_REQUESTED", "account:" + account.getAccountId(), null);
    }

    /** @return true when the token was valid and the password was changed. */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        if (token == null || token.isBlank()) {
            return false;
        }
        Optional<PasswordResetToken> found = tokens.findByTokenHash(sha256(token.trim()));
        if (found.isEmpty() || found.get().getExpiresAt().isBefore(Instant.now())) {
            return false;
        }
        Optional<Account> account = accounts.findById(found.get().getAccountId());
        if (account.isEmpty()) {
            return false;
        }
        Account a = account.get();
        a.setPasswordHash(Helper.hashPassword(newPassword));
        a.setToken(null); // signs out every existing session
        accounts.save(a);
        tokens.deleteByAccountId(a.getAccountId());
        auditLog.record(a.getEmail(), "PASSWORD_RESET", "account:" + a.getAccountId(), null);
        return true;
    }

    private static String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
