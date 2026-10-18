package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.Bookings;

import za.ac.cput.herms.util.Helper;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface BookingsRepository extends JpaRepository<Bookings,Long> {
    @Override
    List<Bookings> findAll();
    Bookings findBookingsByBookingId(Long bookingId);
    List<Bookings> findByOrganizationId(String organizationId);
    List<Bookings> findByPerson_PersonId(Long personId);
    List<Bookings> findByOrganizationIdAndPerson_PersonIdAndStatusIn(
            String organizationId, Long personId, Collection<Helper.BookingStatus> statuses);
    List<Bookings> findByStatusAndRespondByBefore(Helper.BookingStatus status, Instant cutoff);
    List<Bookings> findByStatusAndEndDayBefore(Helper.BookingStatus status, Date cutoff);
}
