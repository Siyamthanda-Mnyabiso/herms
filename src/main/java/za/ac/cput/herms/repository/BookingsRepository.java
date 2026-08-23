package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.Bookings;

import java.util.List;
import java.util.Set;

@Repository
public interface BookingsRepository extends JpaRepository<Bookings,Long> {
    @Override
    List<Bookings> findAll();
    Bookings findBookingsByBookingId(Long bookingId);
}
