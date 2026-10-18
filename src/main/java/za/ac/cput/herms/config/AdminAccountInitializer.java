package za.ac.cput.herms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.AuditLogService;
import za.ac.cput.herms.util.Helper;

/**
 * Creates the first admin account from HERMS_ADMIN_EMAIL / HERMS_ADMIN_PASSWORD.
 * Does nothing when either is unset or the account already exists.
 */
@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final AccountRepository accountRepository;
    private final AuditLogService auditLog;
    private final String email;
    private final String password;

    public AdminAccountInitializer(AccountRepository accountRepository,
                                   AuditLogService auditLog,
                                   @Value("${herms.admin.email:}") String email,
                                   @Value("${herms.admin.password:}") String password) {
        this.accountRepository = accountRepository;
        this.auditLog = auditLog;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (email.isBlank() || password.isBlank()) {
            log.info("HERMS_ADMIN_EMAIL / HERMS_ADMIN_PASSWORD not set; no admin account created");
            return;
        }
        if (accountRepository.existsByEmail(email)) {
            log.info("Admin account {} already exists; leaving it unchanged", email);
            return;
        }
        Account account = accountRepository.save(new Account(email, Helper.hashPassword(password), "admin", "admin"));
        auditLog.record("system", "ADMIN_CREATED", "account:" + account.getAccountId(), "email=" + email + " (startup)");
        log.info("Created admin account {}", email);
    }
}
