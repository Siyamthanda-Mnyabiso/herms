package za.ac.cput.herms.dto;

import java.util.List;

public record AuditLogPage(List<AuditLogEntry> entries, int page, int totalPages) {
}
