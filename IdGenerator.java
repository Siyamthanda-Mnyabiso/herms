package za.ac.cput.staffbooking.util;

import java.util.UUID;

/**
 * Samukelisiswe Maphumulo
 * 219344639
 * Keeping this in one place means every entity gets IDs in the same
 * format, and if the format needs to change later, it only changes here.
 */
public class IdGenerator {

    // Prevents instantiation - this is a static utility class only
    private IdGenerator() {
    }

    /**
     * Generates a generic unique ID with no prefix.
     * e.g. "3f2b9a1c-6d4e-4a8b-9c1d-7e5f6a2b3c4d"
     */
    public static String generate() {
        return UUID.randomUUID().toString();
    }

    /**
     * Generates a prefixed ID so IDs are readable in logs/DB rows.
     * e.g. generatePrefixed("NUR") -> "NUR-3f2b9a1c"
     *
     * @param prefix short code identifying the entity type, e.g. "NUR", "DOC", "BKG", "ORG"
     */
    public static String generatePrefixed(String prefix) {
        if (prefix == null || prefix.isBlank()) {
            throw new IllegalArgumentException("Prefix cannot be null or blank");
        }
        String shortId = UUID.randomUUID().toString().substring(0, 8);
        return prefix.toUpperCase() + "-" + shortId;
    }
}