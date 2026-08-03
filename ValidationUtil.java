package za.ac.cput.staffbooking.util;

import java.util.regex.Pattern;

/**
 * Samukelisiwe maphumulo
 * 219344639
 * Shared base validation used inside every Builder's build() method
 * across Members 1-5 (e.g. AddressBuilder, NurseBuilder, BookingBuilder).
 *
 * Each throw uses ValidationException (see exception package) so the
 * GlobalExceptionHandler can catch every validation failure consistently,
 * no matter which entity threw it.
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // South African mobile numbers: 0 followed by 9 digits, e.g. 0821234567
    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^0[0-9]{9}$");

    // South African postal codes: exactly 4 digits
    private static final Pattern POSTAL_CODE_PATTERN =
            Pattern.compile("^[0-9]{4}$");

    private ValidationUtil() {
    }

    public static void requireNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new za.ac.cput.staffbooking.exception.ValidationException(
                    fieldName + " cannot be null or blank");
        }
    }

    public static void requireValidEmail(String email) {
        requireNotBlank(email, "email");
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new za.ac.cput.staffbooking.exception.ValidationException(
                    "Invalid email format: " + email);
        }
    }

    public static void requireValidPhoneNumber(String phoneNumber) {
        requireNotBlank(phoneNumber, "mobileNumber");
        if (!PHONE_PATTERN.matcher(phoneNumber).matches()) {
            throw new za.ac.cput.staffbooking.exception.ValidationException(
                    "Invalid mobile number format: " + phoneNumber);
        }
    }

    public static void requireValidPostalCode(String postalCode) {
        requireNotBlank(postalCode, "postalCode");
        if (!POSTAL_CODE_PATTERN.matcher(postalCode).matches()) {
            throw new za.ac.cput.staffbooking.exception.ValidationException(
                    "Invalid postal code format: " + postalCode);
        }
    }

    public static void requirePositive(int value, String fieldName) {
        if (value < 0) {
            throw new za.ac.cput.staffbooking.exception.ValidationException(
                    fieldName + " cannot be negative");
        }
    }
}