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

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
        private SimpleDateFormat sdf;
        private Date bookingDate;
        private Date startDay;
        private Date endDay;



    BookingFactoryTest() throws ParseException {
        sdf = new SimpleDateFormat("dd/MM/yyyy");
        sdf.setLenient(false);

         bookingDate = sdf.parse("05/08/2026");
         startDay = sdf.parse("07/08/2026");
         endDay = sdf.parse("07/09/2026");
    }

    @Test
    void createBooking() {
        booking =  BookingFactory.createBooking(bookingDate,startDay,endDay, Helper.BookingStatus.CONFIRMED);
        saved = bookingsRepository.save(booking);
        assertNotNull(saved.getBookingId());
        System.out.println(booking);
    }
}