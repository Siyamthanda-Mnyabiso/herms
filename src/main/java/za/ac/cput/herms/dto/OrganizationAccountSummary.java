package za.ac.cput.herms.dto;

public record OrganizationAccountSummary(
        Long accountId,
        String role,
        String organizationId,
        String name,
        String email,
        String phoneNumber,
        String address,
        String status) {
}
