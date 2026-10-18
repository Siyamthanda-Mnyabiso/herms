package za.ac.cput.herms.security;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.domain.PasswordResetToken;
import za.ac.cput.herms.repository.PasswordResetTokenRepository;
import za.ac.cput.herms.support.IntegrationTestSupport;

import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthFlowIntegrationTest extends IntegrationTestSupport {

    @Autowired
    private PasswordResetTokenRepository resetTokens;

    // ---- registration and login ------------------------------------------

    @Test
    void professionalRegistrationReturnsASessionAndStoresABcryptHash() throws Exception {
        String email = uniqueEmail("pro");
        postJson("/auth/register/professional", null, Map.of(
                "role", "nurse", "firstName", "A", "lastName", "B", "email", email,
                "phoneNumber", "0821234567", "password", PASSWORD, "licenseNo", "12345678"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("nurse"))
                .andExpect(jsonPath("$.token").isNotEmpty());

        String stored = accounts.findByEmail(email).orElseThrow().getPasswordHash();
        assertTrue(stored.startsWith("$2"), "password must be stored as BCrypt");
        assertNotEquals(PASSWORD, stored);
    }

    @Test
    void registeringTheSameEmailTwiceIsRejected() throws Exception {
        Session existing = newProfessional();
        postJson("/auth/register/professional", null, Map.of(
                "role", "nurse", "firstName", "A", "lastName", "B", "email", existing.email(),
                "phoneNumber", "0821234567", "password", PASSWORD, "licenseNo", "12345678"))
                .andExpect(status().isConflict());
    }

    @Test
    void invalidLicenseNumbersAndPasswordsAreRejectedAtRegistration() throws Exception {
        postJson("/auth/register/professional", null, Map.of(
                "role", "nurse", "firstName", "A", "lastName", "B", "email", uniqueEmail("pro"),
                "phoneNumber", "0821234567", "password", PASSWORD, "licenseNo", "bad"))
                .andExpect(status().isBadRequest());
        postJson("/auth/register/professional", null, Map.of(
                "role", "nurse", "firstName", "A", "lastName", "B", "email", uniqueEmail("pro"),
                "phoneNumber", "0821234567", "password", "a".repeat(73), "licenseNo", "12345678"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void wrongPasswordAndUnknownEmailGetTheSameAnswer() throws Exception {
        Session pro = newProfessional();
        String wrongPassword = text(postJson("/auth/login", null, Map.of("email", pro.email(), "password", "nope-nope-1"))
                .andExpect(status().isUnauthorized()));
        String unknownEmail = text(postJson("/auth/login", null, Map.of("email", uniqueEmail("ghost"), "password", "nope-nope-1"))
                .andExpect(status().isUnauthorized()));
        assertEquals(wrongPassword, unknownEmail);
    }

    // ---- organization approval ------------------------------------------

    @Test
    void organizationsCannotLogInUntilAnAdminApprovesThem() throws Exception {
        Session admin = newAdmin();
        String email = uniqueEmail("org");
        postJson("/auth/register/organization", null, organizationRegistration(email, "pharmacy"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.token").doesNotExist());

        assertEquals(403, loginStatus(email, PASSWORD));

        Long accountId = accounts.findByEmail(email).orElseThrow().getAccountId();
        postJson("/admin/organizations/" + accountId + "/approve", admin.token(), "{}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        assertEquals(200, loginStatus(email, PASSWORD));
    }

    @Test
    void rejectedOrRevokedOrganizationsAreLockedOutAndLoseTheirSession() throws Exception {
        Session admin = newAdmin();
        Session organization = newActiveOrganization();
        getJson("/booking-requests/mine", organization.token()).andExpect(status().isOk());

        Long accountId = accounts.findByEmail(organization.email()).orElseThrow().getAccountId();
        postJson("/admin/organizations/" + accountId + "/reject", admin.token(), "{}").andExpect(status().isOk());

        assertEquals(403, loginStatus(organization.email(), PASSWORD));
        getJson("/booking-requests/mine", organization.token()).andExpect(status().isUnauthorized());
    }

    @Test
    void onlyPendingOrganizationsAppearInThePendingList() throws Exception {
        Session admin = newAdmin();
        String pendingEmail = uniqueEmail("org");
        postJson("/auth/register/organization", null, organizationRegistration(pendingEmail, "school"))
                .andExpect(status().isAccepted());

        String pending = text(getJson("/admin/organizations?status=PENDING", admin.token()).andExpect(status().isOk()));
        assertTrue(pending.contains(pendingEmail));

        approve(pendingEmail);
        String stillPending = text(getJson("/admin/organizations?status=PENDING", admin.token()).andExpect(status().isOk()));
        assertFalse(stillPending.contains(pendingEmail));
    }

    @Test
    void everyOrganizationTypeCanRegisterGetApprovedAndLogInWithItsName() throws Exception {
        for (String role : new String[]{"hospital", "pharmacy", "school"}) {
            String email = uniqueEmail(role);
            postJson("/auth/register/organization", null, organizationRegistration(email, role)).andExpect(status().isAccepted());
            approve(email);

            postJson("/auth/login", null, Map.of("email", email, "password", PASSWORD))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.role").value(role))
                    .andExpect(jsonPath("$.name").value("Test " + role));
        }
    }

    @Test
    void organizationRegistrationValidatesItsInput() throws Exception {
        Map<String, String> shortPassword = new java.util.HashMap<>(organizationRegistration(uniqueEmail("org"), "hospital"));
        shortPassword.put("password", "short");
        postJson("/auth/register/organization", null, shortPassword).andExpect(status().isBadRequest());

        Map<String, String> badPostalCode = new java.util.HashMap<>(organizationRegistration(uniqueEmail("org"), "hospital"));
        badPostalCode.put("postalCode", "12");
        postJson("/auth/register/organization", null, badPostalCode).andExpect(status().isBadRequest());

        postJson("/auth/register/organization", null, organizationRegistration(uniqueEmail("org"), "bakery"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void duplicateOrganizationEmailIsRejected() throws Exception {
        Session organization = newActiveOrganization();
        postJson("/auth/register/organization", null, organizationRegistration(organization.email(), "hospital"))
                .andExpect(status().isConflict());
    }

    @Test
    void adminsCanCreateOtherAdminsButNotWithBadInput() throws Exception {
        Session admin = newAdmin();
        String email = uniqueEmail("second-admin");
        postJson("/admin/admins", admin.token(), Map.of("email", email, "password", PASSWORD))
                .andExpect(status().isCreated());
        assertEquals("admin", accounts.findByEmail(email).orElseThrow().getRole());
        assertEquals(200, loginStatus(email, PASSWORD));

        postJson("/admin/admins", admin.token(), Map.of("email", email, "password", PASSWORD)).andExpect(status().isConflict());
        postJson("/admin/admins", admin.token(), Map.of("email", "not-an-email", "password", PASSWORD)).andExpect(status().isBadRequest());
        postJson("/admin/admins", admin.token(), Map.of("email", uniqueEmail("x"), "password", "short")).andExpect(status().isBadRequest());
    }

    // ---- password upgrade ------------------------------------------------

    @Test
    void oldSha256PasswordsStillWorkAndAreUpgradedToBcryptAtLogin() throws Exception {
        String email = uniqueEmail("legacy");
        String legacyHash = HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest("oldpassword".getBytes(StandardCharsets.UTF_8)));
        accounts.save(new Account(email, legacyHash, "nurse", "1"));

        assertEquals(401, loginStatus(email, "wrong-password"));
        assertEquals(legacyHash, accounts.findByEmail(email).orElseThrow().getPasswordHash(), "a failed login must not change the hash");

        assertEquals(200, loginStatus(email, "oldpassword"));
        String upgraded = accounts.findByEmail(email).orElseThrow().getPasswordHash();
        assertTrue(upgraded.startsWith("$2"));

        assertEquals(200, loginStatus(email, "oldpassword"), "still works after the upgrade");
    }

    // ---- password reset --------------------------------------------------

    private String requestResetLink(String email) throws Exception {
        postJson("/auth/forgot-password", null, Map.of("email", email)).andExpect(status().isAccepted());
        ArgumentCaptor<String> body = ArgumentCaptor.forClass(String.class);
        verify(mailService).sendAsync(eq(email), anyString(), body.capture());
        Matcher matcher = Pattern.compile("reset-password\\?token=([A-Za-z0-9_-]+)").matcher(body.getValue());
        assertTrue(matcher.find(), "the email should contain a reset link");
        return matcher.group(1);
    }

    @Test
    void forgotPasswordGivesTheSameAnswerForKnownAndUnknownEmailsAndOnlyMailsKnownOnes() throws Exception {
        Session pro = newProfessional();
        String known = text(postJson("/auth/forgot-password", null, Map.of("email", pro.email())).andExpect(status().isAccepted()));
        String unknown = text(postJson("/auth/forgot-password", null, Map.of("email", uniqueEmail("ghost"))).andExpect(status().isAccepted()));

        assertEquals(known, unknown);
        verify(mailService, times(1)).sendAsync(anyString(), anyString(), anyString());
        verify(mailService).sendAsync(eq(pro.email()), anyString(), anyString());
    }

    @Test
    void aResetLinkChangesThePasswordSignsOutOldSessionsAndWorksOnlyOnce() throws Exception {
        Session pro = newProfessional();
        String token = requestResetLink(pro.email());

        postJson("/auth/reset-password", null, Map.of("token", token, "password", "brand-new-pass1"))
                .andExpect(status().isOk());

        assertEquals(401, loginStatus(pro.email(), PASSWORD));
        assertEquals(200, loginStatus(pro.email(), "brand-new-pass1"));

        // the session from before the reset is gone (the login above made a new one, so use the original token)
        getJson("/booking-requests/mine", pro.token()).andExpect(status().isUnauthorized());

        postJson("/auth/reset-password", null, Map.of("token", token, "password", "another-pass-2"))
                .andExpect(status().isBadRequest());
        assertEquals(401, loginStatus(pro.email(), "another-pass-2"));
    }

    @Test
    void resetRejectsWeakPasswordsAndBadTokensWithoutUsingUpTheLink() throws Exception {
        Session pro = newProfessional();
        String token = requestResetLink(pro.email());

        postJson("/auth/reset-password", null, Map.of("token", token, "password", "short")).andExpect(status().isBadRequest());
        postJson("/auth/reset-password", null, Map.of("token", token, "password", "a".repeat(73))).andExpect(status().isBadRequest());
        postJson("/auth/reset-password", null, Map.of("token", "not-a-real-token", "password", "brand-new-pass1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("This reset link is invalid or has expired"));
        postJson("/auth/reset-password", null, "{}").andExpect(status().isBadRequest());

        // the real link still works after those failed attempts
        postJson("/auth/reset-password", null, Map.of("token", token, "password", "brand-new-pass1")).andExpect(status().isOk());
    }

    @Test
    void expiredResetLinksAreRejected() throws Exception {
        Session pro = newProfessional();
        Long accountId = accounts.findByEmail(pro.email()).orElseThrow().getAccountId();
        String rawToken = "expired-" + System.nanoTime();
        String hash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(rawToken.getBytes(StandardCharsets.UTF_8)));
        resetTokens.save(new PasswordResetToken(accountId, hash, Instant.now().minusSeconds(7200), Instant.now().minusSeconds(3600)));

        postJson("/auth/reset-password", null, Map.of("token", rawToken, "password", "brand-new-pass1"))
                .andExpect(status().isBadRequest());
        assertEquals(200, loginStatus(pro.email(), PASSWORD), "the old password must still work");
    }

    @Test
    void resetTokensAreStoredHashedNotInTheClear() throws Exception {
        Session pro = newProfessional();
        String token = requestResetLink(pro.email());

        assertTrue(resetTokens.findByTokenHash(token).isEmpty(), "the raw token must not be what is stored");
        Long accountId = accounts.findByEmail(pro.email()).orElseThrow().getAccountId();
        assertEquals(1, resetTokens.findByAccountId(accountId).size());
    }

    @Test
    void askingAgainStraightAwayDoesNotSendASecondEmail() throws Exception {
        Session pro = newProfessional();
        postJson("/auth/forgot-password", null, Map.of("email", pro.email())).andExpect(status().isAccepted());
        postJson("/auth/forgot-password", null, Map.of("email", pro.email())).andExpect(status().isAccepted());

        verify(mailService, times(1)).sendAsync(eq(pro.email()), anyString(), anyString());
    }

    @Test
    void blankEmailsAreIgnoredQuietly() throws Exception {
        postJson("/auth/forgot-password", null, Map.of("email", "  ")).andExpect(status().isAccepted());
        postJson("/auth/forgot-password", null, "{}").andExpect(status().isAccepted());
        verify(mailService, never()).sendAsync(anyString(), anyString(), anyString());
    }
}
