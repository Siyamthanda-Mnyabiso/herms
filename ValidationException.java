package za.ac.cput.staffbooking.exception;

/**
 * Samukelisiwe maphumulo
 * 219344639
 * Thrown when a field fails validation inside a Builder's build() method
 * or ValidationUtil. Caught centrally by GlobalExceptionHandler and turned
 * into a 400 Bad Request.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }
}