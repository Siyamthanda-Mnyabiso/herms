package za.ac.cput.herms.dto;

public record UserAccountSummary(Long accountId, String email, String role, String status, String name) {
}
