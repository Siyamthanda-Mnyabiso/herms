package za.ac.cput.herms.factory;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.domain.Name;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.repository.BookingsRepository;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.util.Helper;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static za.ac.cput.herms.util.Helper.BookingStatus.CONFIRMED;
@SpringBootTest
class BookingFactoryTest {

        @Autowired
        private PersonRepository personRepository;

        @Autowired
        private BookingsRepository bookingsRepository;

        private Bookings booking,saved;
        private Date bookingDate;
        private Date startDay;
        private Date endDay;

    BookingFactoryTest() {
        ZoneId zone = ZoneId.systemDefault();
        bookingDate = Date.from(LocalDate.now().atStartOfDay(zone).toInstant());
        startDay = Date.from(LocalDate.now().plusDays(1).atStartOfDay(zone).toInstant());
        endDay = Date.from(LocalDate.now().plusDays(30).atStartOfDay(zone).toInstant());
    }

    @Test
    void createBooking() {
        booking = BookingFactory.createBooking(
                bookingDate,
                startDay,
                endDay,
                Helper.BookingStatus.CONFIRMED
        );

        assertNotNull(booking);

        saved = bookingsRepository.save(booking);

        assertNotNull(saved.getBookingId());

        System.out.println(booking);
    }
}