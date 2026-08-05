package za.ac.cput.herms.factory;

import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.util.Helper;

import java.sql.Time;
import java.util.Date;

public class BookingFactory {
    public static Bookings createBooking(Date bookingDate, Date startDay, Date endDay, Helper.BookingStatus status){

        if(!Helper.isDateValid(bookingDate) || (!Helper.isStartDayEndDay(startDay,endDay))){
            return null;
        }
        return new Bookings.Builder()
                .setBookingDate(bookingDate)
                .setStartDay(startDay)
                .setEndDay(endDay)
                .setStatus(status)
                .Build();
    }
}
