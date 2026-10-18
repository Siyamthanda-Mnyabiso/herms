package za.ac.cput.herms.service;

import org.springframework.http.HttpStatus;

public class BookingWorkflowException extends RuntimeException {

    private final HttpStatus status;

    public BookingWorkflowException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
