package za.ac.cput.herms.util;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

import static org.junit.jupiter.api.Assertions.*;

class PasswordHashingTest {

    private static String legacyHash(String password) throws Exception {
        return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest(password.getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    void newHashesAreBcrypt() {
        String hash = Helper.hashPassword("correct horse");
        assertTrue(hash.startsWith("$2"), "expected a BCrypt hash but got " + hash);
        assertEquals(60, hash.length());
        assertFalse(Helper.isLegacyHash(hash));
    }

    @Test
    void samePasswordGetsADifferentSaltEachTime() {
        assertNotEquals(Helper.hashPassword("same"), Helper.hashPassword("same"));
    }

    @Test
    void correctPasswordMatchesAndWrongOneDoesNot() {
        String hash = Helper.hashPassword("correct horse");
        assertTrue(Helper.matchesPassword("correct horse", hash));
        assertFalse(Helper.matchesPassword("wrong horse", hash));
        assertFalse(Helper.matchesPassword("", hash));
    }

    @Test
    void legacySha256HashesStillVerifyAndAreRecognised() throws Exception {
        String legacy = legacyHash("oldpassword");
        assertTrue(Helper.isLegacyHash(legacy));
        assertTrue(Helper.matchesPassword("oldpassword", legacy));
        assertFalse(Helper.matchesPassword("otherpassword", legacy));
    }

    @Test
    void nullsNeverMatch() {
        assertFalse(Helper.matchesPassword(null, Helper.hashPassword("x")));
        assertFalse(Helper.matchesPassword("x", null));
        assertFalse(Helper.isLegacyHash(null));
    }

    @Test
    void passwordsOver72BytesAreTooLongAndNeverMatch() {
        String seventyTwo = "a".repeat(72);
        String seventyThree = "a".repeat(73);
        assertFalse(Helper.isPasswordTooLong(seventyTwo));
        assertTrue(Helper.isPasswordTooLong(seventyThree));
        assertFalse(Helper.matchesPassword(seventyThree, Helper.hashPassword(seventyTwo)));
    }

    @Test
    void lengthLimitCountsBytesNotCharacters() {
        // 37 two-byte characters = 74 bytes
        assertTrue(Helper.isPasswordTooLong("é".repeat(37)));
    }
}
