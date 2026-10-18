package za.ac.cput.herms.booking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.repository.AuditLogRepository;
import za.ac.cput.herms.repository.BookingsRepository;
import za.ac.cput.herms.support.IntegrationTestSupport;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class BookingWorkflowIntegrationTest extends IntegrationTestSupport {

    @Autowired
    private BookingsRepository bookings;
    @Autowired
    private AuditLogRepository auditLogs;

    private long request(Session organization, Session professional, String start, String end) throws Exception {
        JsonNode created = body(postJson("/booking-requests", organization.token(),
                Map.of("personId", Long.valueOf(professional.refId()), "startDate", start, "endDate", end))
                .andExpect(status().isCreated()));
        return created.get("id").asLong();
    }

    private JsonNode find(Session viewer, long bookingId) throws Exception {
        for (JsonNode booking : body(getJson("/booking-requests/mine", viewer.token()).andExpect(status().isOk()))) {
            if (booking.get("id").asLong() == bookingId) return booking;
        }
        return null;
    }

    private String statusOf(Session viewer, long bookingId) throws Exception {
        JsonNode booking = find(viewer, bookingId);
        return booking == null ? null : booking.get("status").asString();
    }

    private void act(Session actor, long id, String action) throws Exception {
        postJson("/booking-requests/" + id + "/" + action, actor.token(), "{}").andExpect(status().isOk());
    }

    private void forceChange(long bookingId, java.util.function.Consumer<Bookings.Builder> change) {
        Bookings.Builder builder = new Bookings.Builder().copy(bookings.findBookingsByBookingId(bookingId));
        change.accept(builder);
        bookings.save(builder.Build());
    }

    // ---- the happy path --------------------------------------------------

    @Test
    void aRequestMovesFromPendingToAcceptedToConfirmed() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();

        long id = request(organization, professional, inDays(2), inDays(5));
        assertEquals("PENDING", statusOf(organization, id));
        assertEquals("PENDING", statusOf(professional, id));

        act(professional, id, "accept");
        assertEquals("ACCEPTED", statusOf(organization, id));

        act(organization, id, "confirm");
        assertEquals("CONFIRMED", statusOf(organization, id));
        assertEquals("CONFIRMED", statusOf(professional, id));
        assertNotNull(find(organization, id).get("confirmedAt").asString());
    }

    @Test
    void theNewRequestCarriesTheOrganizationAndATwentyFourHourDeadline() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();

        long id = request(organization, professional, inDays(2), inDays(3));
        JsonNode booking = find(organization, id);

        assertEquals("Test hospital", booking.get("organization").asString());
        Instant requestedAt = Instant.parse(booking.get("requestedAt").asString());
        Instant respondBy = Instant.parse(booking.get("respondBy").asString());
        assertEquals(24, ChronoUnit.HOURS.between(requestedAt, respondBy));
    }

    // ---- identity rule ---------------------------------------------------

    @Test
    void organizationsDoNotSeeTheProfessionalsNameUntilTheyAccept() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        JsonNode pending = find(organization, id);
        assertTrue(pending.get("candidateName").isNull(), "name must be hidden while pending");
        assertTrue(pending.get("candidateLabel").asString().startsWith("Candidate #"));
        assertFalse(pending.toString().contains("Nkosi"), "no part of the real name may leak");

        assertEquals("Thandi Nkosi", find(professional, id).get("candidateName").asString(),
                "the professional always sees their own name");

        act(professional, id, "accept");
        assertEquals("Thandi Nkosi", find(organization, id).get("candidateName").asString());
    }

    @Test
    void aDeclinedRequestNeverRevealsTheName() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        postJson("/booking-requests/" + id + "/decline", professional.token(), Map.of("reason", "Away that week"))
                .andExpect(status().isOk());

        JsonNode declined = find(organization, id);
        assertEquals("DECLINED", declined.get("status").asString());
        assertEquals("Away that week", declined.get("declineReason").asString());
        assertTrue(declined.get("candidateName").isNull());
    }

    // ---- who may do what -------------------------------------------------

    @Test
    void onlyTheBookedProfessionalCanAcceptOrDecline() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        Session otherProfessional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        postJson("/booking-requests/" + id + "/accept", otherProfessional.token(), "{}").andExpect(status().isNotFound());
        postJson("/booking-requests/" + id + "/decline", otherProfessional.token(), "{}").andExpect(status().isNotFound());
        assertEquals("PENDING", statusOf(professional, id));
    }

    @Test
    void onlyTheRequestingOrganizationCanConfirmOrCancel() throws Exception {
        Session organization = newActiveOrganization();
        Session otherOrganization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));
        act(professional, id, "accept");

        postJson("/booking-requests/" + id + "/confirm", otherOrganization.token(), "{}").andExpect(status().isNotFound());
        postJson("/booking-requests/" + id + "/cancel", otherOrganization.token(), "{}").andExpect(status().isNotFound());
        assertEquals("ACCEPTED", statusOf(organization, id));
    }

    @Test
    void peopleOnlySeeTheirOwnBookings() throws Exception {
        Session organization = newActiveOrganization();
        Session otherOrganization = newActiveOrganization();
        Session professional = newProfessional();
        Session otherProfessional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        assertNotNull(find(organization, id));
        assertNotNull(find(professional, id));
        assertNull(find(otherOrganization, id));
        assertNull(find(otherProfessional, id));
    }

    // ---- order of steps --------------------------------------------------

    @Test
    void youCannotConfirmBeforeTheProfessionalAccepts() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        postJson("/booking-requests/" + id + "/confirm", organization.token(), "{}")
                .andExpect(status().isConflict())
                .andExpect(content().string("Only accepted requests can be confirmed"));
    }

    @Test
    void anAnsweredRequestCannotBeAnsweredAgain() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        act(professional, id, "decline");
        postJson("/booking-requests/" + id + "/accept", professional.token(), "{}").andExpect(status().isConflict());
        assertEquals("DECLINED", statusOf(professional, id));
    }

    @Test
    void anOrganizationCanWithdrawARequestAndOnlyOnce() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        postJson("/booking-requests/" + id + "/cancel", organization.token(), Map.of("reason", "No longer needed"))
                .andExpect(status().isOk());
        assertEquals("CANCELED", statusOf(organization, id));
        assertEquals("No longer needed", find(organization, id).get("declineReason").asString());

        postJson("/booking-requests/" + id + "/cancel", organization.token(), "{}").andExpect(status().isConflict());
        postJson("/booking-requests/" + id + "/accept", professional.token(), "{}").andExpect(status().isConflict());
    }

    @Test
    void aConfirmedBookingCanStillBeCancelled() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));
        act(professional, id, "accept");
        act(organization, id, "confirm");

        act(organization, id, "cancel");
        assertEquals("CANCELED", statusOf(professional, id));
    }

    // ---- time-based changes ---------------------------------------------

    @Test
    void anUnansweredRequestExpiresAndCanNoLongerBeAccepted() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        forceChange(id, b -> b.setRespondBy(Instant.now().minus(1, ChronoUnit.HOURS)));

        assertEquals("EXPIRED", statusOf(organization, id));
        postJson("/booking-requests/" + id + "/accept", professional.token(), "{}")
                .andExpect(status().isConflict())
                .andExpect(content().string("This request has expired"));
    }

    @Test
    void acceptingAnOverdueRequestFailsEvenBeforeAnyoneListsBookings() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));

        forceChange(id, b -> b.setRespondBy(Instant.now().minus(1, ChronoUnit.HOURS)));

        postJson("/booking-requests/" + id + "/accept", professional.token(), "{}").andExpect(status().isConflict());
        assertEquals("EXPIRED", statusOf(professional, id));
    }

    @Test
    void aConfirmedBookingBecomesCompletedOnceItsEndDatePasses() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));
        act(professional, id, "accept");
        act(organization, id, "confirm");

        forceChange(id, b -> b.setStartDay(Date.from(Instant.now().minus(10, ChronoUnit.DAYS)))
                .setEndDay(Date.from(Instant.now().minus(5, ChronoUnit.DAYS))));

        assertEquals("COMPLETED", statusOf(organization, id));
        assertEquals("Thandi Nkosi", find(organization, id).get("candidateName").asString());
        postJson("/booking-requests/" + id + "/cancel", organization.token(), "{}").andExpect(status().isConflict());
    }

    @Test
    void aBookingThatHasNotEndedYetIsNotCompleted() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(0), inDays(2));
        act(professional, id, "accept");
        act(organization, id, "confirm");

        assertEquals("CONFIRMED", statusOf(organization, id));
    }

    // ---- request validation ----------------------------------------------

    @Test
    void datesInThePastOrBackwardsAreRejected() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long person = Long.parseLong(professional.refId());

        postJson("/booking-requests", organization.token(), Map.of("personId", person, "startDate", inDays(-1), "endDate", inDays(2)))
                .andExpect(status().isBadRequest());
        postJson("/booking-requests", organization.token(), Map.of("personId", person, "startDate", inDays(5), "endDate", inDays(2)))
                .andExpect(status().isBadRequest());
        postJson("/booking-requests", organization.token(), Map.of("personId", person))
                .andExpect(status().isBadRequest());
    }

    @Test
    void aSingleDayBookingIsAllowed() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        request(organization, professional, inDays(3), inDays(3));
    }

    @Test
    void unknownProfessionalsAreNotFound() throws Exception {
        Session organization = newActiveOrganization();
        postJson("/booking-requests", organization.token(), Map.of("personId", 99999999L, "startDate", inDays(1), "endDate", inDays(2)))
                .andExpect(status().isNotFound());
    }

    @Test
    void unavailableProfessionalsCannotBeBooked() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        makeUnavailable(professional);

        postJson("/booking-requests", organization.token(),
                Map.of("personId", Long.valueOf(professional.refId()), "startDate", inDays(1), "endDate", inDays(2)))
                .andExpect(status().isConflict())
                .andExpect(content().string("This professional is not available"));
    }

    @Test
    void overlappingActiveRequestsForTheSameProfessionalAreRejected() throws Exception {
        Session organization = newActiveOrganization();
        Session otherOrganization = newActiveOrganization();
        Session professional = newProfessional();
        request(organization, professional, inDays(10), inDays(14));

        postJson("/booking-requests", organization.token(),
                Map.of("personId", Long.valueOf(professional.refId()), "startDate", inDays(12), "endDate", inDays(16)))
                .andExpect(status().isConflict());

        request(organization, professional, inDays(15), inDays(18)); // touching ranges that do not overlap are fine
        request(otherOrganization, professional, inDays(10), inDays(14)); // another organization may ask for the same dates
    }

    @Test
    void aWithdrawnRequestNoLongerBlocksTheDates() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long first = request(organization, professional, inDays(10), inDays(14));
        act(organization, first, "cancel");

        request(organization, professional, inDays(10), inDays(14));
    }

    // ---- audit trail -----------------------------------------------------

    @Test
    void everyStepIsWrittenToTheAuditLog() throws Exception {
        Session organization = newActiveOrganization();
        Session professional = newProfessional();
        long id = request(organization, professional, inDays(2), inDays(3));
        act(professional, id, "accept");
        act(organization, id, "confirm");

        String target = "booking:" + id;
        java.util.Set<String> actions = new java.util.HashSet<>();
        auditLogs.findAll().stream().filter(l -> target.equals(l.getTarget())).forEach(l -> {
            actions.add(l.getAction());
            if (l.getAction().equals("BOOKING_REQUESTED") || l.getAction().equals("BOOKING_CONFIRMED")) {
                assertEquals(organization.email(), l.getActor());
            } else {
                assertEquals(professional.email(), l.getActor());
            }
        });
        assertEquals(java.util.Set.of("BOOKING_REQUESTED", "BOOKING_ACCEPTED", "BOOKING_CONFIRMED"), actions);
    }
}
