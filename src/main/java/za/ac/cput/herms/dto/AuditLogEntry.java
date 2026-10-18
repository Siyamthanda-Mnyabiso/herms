package za.ac.cput.herms.dto;

import java.time.Instant;

public record AuditLogEntry(Long id, Instant createdAt, String actor, String action, String target, String details) {
}
