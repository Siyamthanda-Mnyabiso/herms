package za.ac.cput.herms.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.herms.domain.*;
import za.ac.cput.herms.dto.BookingView;
import za.ac.cput.herms.repository.BookingsRepository;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.service.organization.IHospitalService;
import za.ac.cput.herms.service.organization.IPharmacyService;
import za.ac.cput.herms.service.organization.ISchoolService;
import za.ac.cput.herms.util.Helper.BookingStatus;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Booking lifecycle: an organization requests a professional (PENDING, 24h to respond);
 * the professional ACCEPTS or DECLINES; the organization CONFIRMS an accepted request.
 * Unanswered requests become EXPIRED; confirmed bookings whose end date has passed become COMPLETED.
 * Organizations may CANCEL a request or booking until it is finished.
 */
@Service
public class BookingWorkflowService {

    public static final Duration RESPONSE_WINDOW = Duration.ofHours(24);
    private static final ZoneId ZONE = ZoneId.systemDefault();
    private static final Set<BookingStatus> ACTIVE = Set.of(BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CONFIRMED);
    private static final Set<BookingStatus> REVEALED = Set.of(BookingStatus.ACCEPTED, BookingStatus.CONFIRMED, BookingStatus.COMPLETED);

    private final BookingsRepository bookings;
    private final PersonRepository people;
    private final IHospitalService hospitals;
    private final IPharmacyService pharmacies;
    private final ISchoolService schools;

    public BookingWorkflowService(BookingsRepository bookings, PersonRepository people,
                                  IHospitalService hospitals, IPharmacyService pharmacies, ISchoolService schools) {
        this.bookings = bookings;
        this.people = people;
        this.hospitals = hospitals;
        this.pharmacies = pharmacies;
        this.schools = schools;
    }

    @Transactional
    public BookingView request(Account organization, Long personId, LocalDate start, LocalDate end) {
        if (personId == null || start == null || end == null) {
            throw new BookingWorkflowException(HttpStatus.BAD_REQUEST, "Professional, start date and end date are required");
        }
        if (start.isBefore(LocalDate.now()) || end.isBefore(start)) {
            throw new BookingWorkflowException(HttpStatus.BAD_REQUEST, "Dates must start today or later, and end on or after the start");
        }
        Person person = people.findByPersonId(personId);
        if (person == null) {
            throw new BookingWorkflowException(HttpStatus.NOT_FOUND, "Professional not found");
        }
        if (!"AVAILABLE".equals(availabilityOf(person))) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "This professional is not available");
        }
        expireOverdue();
        Date startDay = toDate(start);
        Date endDay = toDate(end);
        boolean overlaps = bookings.findByOrganizationIdAndPerson_PersonIdAndStatusIn(
                        organization.getRefId(), personId, ACTIVE).stream()
                .anyMatch(b -> !b.getStartDay().after(endDay) && !b.getEndDay().before(startDay));
        if (overlaps) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "You already have an active request for this professional on those dates");
        }
        Instant now = Instant.now();
        Bookings saved = bookings.save(new Bookings.Builder()
                .setBookingDate(new Date())
                .setStartDay(startDay)
                .setEndDay(endDay)
                .setStatus(BookingStatus.PENDING)
                .setPerson(person)
                .setOrganizationId(organization.getRefId())
                .setOrganizationName(organizationName(organization))
                .setRequestedAt(now)
                .setRespondBy(now.plus(RESPONSE_WINDOW))
                .Build());
        return view(saved, organization.getRole());
    }

    @Transactional
    public List<BookingView> mine(Account account) {
        expireOverdue();
        boolean professional = isProfessional(account);
        List<Bookings> found = professional
                ? bookings.findByPerson_PersonId(Long.valueOf(account.getRefId()))
                : bookings.findByOrganizationId(account.getRefId());
        return found.stream()
                .sorted(Comparator.comparing(Bookings::getRequestedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(b -> view(b, account.getRole()))
                .toList();
    }

    @Transactional
    public BookingView accept(Account professional, Long id) {
        Bookings booking = ownedByProfessional(professional, id);
        requirePendingAndOpen(booking);
        return view(update(booking, BookingStatus.ACCEPTED, b -> b.setRespondedAt(Instant.now())), professional.getRole());
    }

    @Transactional
    public BookingView decline(Account professional, Long id, String reason) {
        Bookings booking = ownedByProfessional(professional, id);
        requirePendingAndOpen(booking);
        return view(update(booking, BookingStatus.DECLINED, b -> b
                .setRespondedAt(Instant.now())
                .setDeclineReason(blankToNull(reason))), professional.getRole());
    }

    @Transactional
    public BookingView confirm(Account organization, Long id) {
        Bookings booking = ownedByOrganization(organization, id);
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "Only accepted requests can be confirmed");
        }
        return view(update(booking, BookingStatus.CONFIRMED, b -> b.setConfirmedAt(Instant.now())), organization.getRole());
    }

    @Transactional
    public BookingView cancel(Account organization, Long id, String reason) {
        Bookings booking = ownedByOrganization(organization, id);
        if (!ACTIVE.contains(booking.getStatus())) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "This booking can no longer be cancelled");
        }
        return view(update(booking, BookingStatus.CANCELED, b -> b.setDeclineReason(blankToNull(reason))), organization.getRole());
    }

    /** Applies the time-based transitions: unanswered requests expire, finished bookings complete. */
    @Transactional
    public void expireOverdue() {
        Instant now = Instant.now();
        bookings.findByStatusAndRespondByBefore(BookingStatus.PENDING, now)
                .forEach(b -> update(b, BookingStatus.EXPIRED, x -> { }));
        Date yesterday = Date.from(now.minus(Duration.ofDays(1)));
        bookings.findByStatusAndEndDayBefore(BookingStatus.CONFIRMED, yesterday)
                .forEach(b -> update(b, BookingStatus.COMPLETED, x -> { }));
    }

    private Bookings update(Bookings existing, BookingStatus status, java.util.function.Consumer<Bookings.Builder> changes) {
        Bookings.Builder builder = new Bookings.Builder().copy(existing).setStatus(status);
        changes.accept(builder);
        return bookings.save(builder.Build());
    }

    private void requirePendingAndOpen(Bookings booking) {
        if (booking.getStatus() == BookingStatus.EXPIRED) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "This request has expired");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "This request has already been answered or closed");
        }
        if (booking.getRespondBy() != null && booking.getRespondBy().isBefore(Instant.now())) {
            expireOverdue();
            throw new BookingWorkflowException(HttpStatus.CONFLICT, "This request has expired");
        }
    }

    private Bookings ownedByProfessional(Account professional, Long id) {
        expireOverdue();
        Bookings booking = bookings.findBookingsByBookingId(id);
        if (booking == null || booking.getPerson() == null
                || !String.valueOf(booking.getPerson().getPersonId()).equals(professional.getRefId())) {
            throw new BookingWorkflowException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        return booking;
    }

    private Bookings ownedByOrganization(Account organization, Long id) {
        expireOverdue();
        Bookings booking = bookings.findBookingsByBookingId(id);
        if (booking == null || !organization.getRefId().equals(booking.getOrganizationId())) {
            throw new BookingWorkflowException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        return booking;
    }

    private BookingView view(Bookings b, String viewerAccountRole) {
        boolean professionalViewer = isProfessionalRole(viewerAccountRole);
        Person person = b.getPerson();
        boolean revealName = professionalViewer || REVEALED.contains(b.getStatus());
        Instant responded = b.getRespondedAt();
        BookingStatus s = b.getStatus();
        return new BookingView(
                b.getBookingId(),
                s.name(),
                professionalViewer ? "professional" : "organization",
                person == null ? null : person.getPersonId(),
                person == null ? "Candidate" : String.format("Candidate #%03d", person.getPersonId()),
                revealName && person != null && person.getName() != null
                        ? (person.getName().getFirstName() + " " + person.getName().getLastName()).trim() : null,
                person == null ? "—" : professionOf(person),
                person == null ? "—" : qualificationOf(person),
                b.getOrganizationName(),
                toLocalDate(b.getStartDay()),
                toLocalDate(b.getEndDay()),
                b.getRequestedAt(),
                b.getRespondBy(),
                s == BookingStatus.ACCEPTED || s == BookingStatus.CONFIRMED || s == BookingStatus.COMPLETED ? responded : null,
                b.getConfirmedAt(),
                s == BookingStatus.DECLINED ? responded : null,
                b.getDeclineReason());
    }

    private String organizationName(Account organization) {
        try {
            return switch (organization.getRole()) {
                case "hospital" -> hospitals.getHospitalById(organization.getRefId()).getOrganizationName();
                case "pharmacy" -> pharmacies.getPharmacyById(organization.getRefId()).getOrganizationName();
                case "school" -> schools.getSchoolById(organization.getRefId()).getOrganizationName();
                default -> organization.getEmail();
            };
        } catch (RuntimeException e) {
            return organization.getEmail();
        }
    }

    private static String availabilityOf(Person p) {
        if (p instanceof Doctor d) return String.valueOf(d.getAvailabilityStatus());
        if (p instanceof Nurse n) return String.valueOf(n.getAvailabilityStatus());
        if (p instanceof Teacher t) return String.valueOf(t.getAvailabilityStatus());
        if (p instanceof Pharmacist ph) return String.valueOf(ph.getAvailabilityStatus());
        return "UNKNOWN";
    }

    private static String professionOf(Person p) {
        if (p instanceof Doctor) return "Doctor";
        if (p instanceof Nurse) return "Nurse";
        if (p instanceof Teacher) return "Teacher";
        if (p instanceof Pharmacist) return "Pharmacist";
        return "Professional";
    }

    private static String qualificationOf(Person p) {
        String q = null;
        if (p instanceof Doctor d) q = d.getQualification();
        else if (p instanceof Nurse n) q = n.getQualification();
        else if (p instanceof Teacher t) q = t.getQualification();
        else if (p instanceof Pharmacist ph) q = ph.getQualification();
        return q == null || q.isBlank() ? "—" : q;
    }

    private static boolean isProfessional(Account a) {
        return isProfessionalRole(a.getRole());
    }

    private static boolean isProfessionalRole(String role) {
        return Set.of("doctor", "nurse", "teacher", "pharmacist").contains(role);
    }

    private static Date toDate(LocalDate d) {
        return Date.from(d.atStartOfDay(ZONE).toInstant());
    }

    private static LocalDate toLocalDate(Date d) {
        return d == null ? null : d.toInstant().atZone(ZONE).toLocalDate();
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
