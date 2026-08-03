package za.ac.cput.staffbooking.exception;

/**
 * Samukelisiwe Maphumulo
 * 219344639
 * Thrown when a Service can't find an entity by ID (Person, Booking,
 * Organization, etc). Caught centrally by GlobalExceptionHandler and
 * turned into a 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String entityName, String id) {
        super(entityName + " not found with id: " + id);
    }
}