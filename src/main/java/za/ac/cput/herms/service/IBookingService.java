package za.ac.cput.herms.service;

import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.util.Helper;

import java.util.List;

public interface IBookingService extends IService<Bookings,Long>{
    List<Bookings> getAll();
    Bookings getBookingById(Long booking);
    Bookings createForPerson(Long personId,Bookings booking);
    Bookings updateStatus(Long bookingId, Helper.BookingStatus status);
}
