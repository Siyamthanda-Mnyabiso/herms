package za.ac.cput.herms.service;

import za.ac.cput.herms.domain.Bookings;

import java.util.List;

public interface IBookingService extends IService<Bookings,Long>{
    List<Bookings> getAll();
    Bookings getBookingById(Long booking);
}
