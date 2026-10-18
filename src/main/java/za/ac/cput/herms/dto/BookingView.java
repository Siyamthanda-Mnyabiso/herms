package za.ac.cput.herms.dto;

import java.time.Instant;
import java.time.LocalDate;

/** A booking as seen by one viewer. The professional's real name is withheld from organizations until accepted. */
public record BookingView(
        Long id,
        String status,
        String viewerRole,
        Long personId,
        String candidateLabel,
        String candidateName,
        String role,
        String qualifications,
        String organization,
        LocalDate startDate,
        LocalDate endDate,
        Instant requestedAt,
        Instant respondBy,
        Instant acceptedAt,
        Instant confirmedAt,
        Instant declinedAt,
        String declineReason) {
}
