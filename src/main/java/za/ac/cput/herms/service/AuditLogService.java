package za.ac.cput.herms.service;

import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.AuditLog;
import za.ac.cput.herms.repository.AuditLogRepository;

/** Records who did what. Never pass passwords or tokens in {@code details}. */
@Service
public class AuditLogService {

    private static final int MAX_FIELD_LENGTH = 255;
    private static final int MAX_DETAILS_LENGTH = 500;

    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public void record(String actor, String action, String target, String details) {
        repository.save(new AuditLog(
                truncate(actor == null ? "anonymous" : actor, MAX_FIELD_LENGTH),
                action,
                truncate(target, MAX_FIELD_LENGTH),
                truncate(details, MAX_DETAILS_LENGTH)));
    }

    private static String truncate(String value, int max) {
        return value == null || value.length() <= max ? value : value.substring(0, max);
    }
}
