package za.ac.cput.herms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.repository.BookingsRepository;

import java.util.List;
@Service
public class BookingsServiceImpl implements IBookingService{
    private final BookingsRepository bookingsService;

    @Autowired
    public BookingsServiceImpl(BookingsRepository bookingsRepository){
        this.bookingsService = bookingsRepository;
    }

    @Override
    public Bookings Create(Bookings bookings) {
        return bookingsService.save(bookings);
    }

    @Override
    public Bookings Read(Long aLong) {
        return bookingsService.findById(aLong).orElse(null);
    }

    @Override
    public Bookings Update(Bookings bookings) {
        return bookingsService.save(bookings);
    }

    @Override
    public boolean Delete(Long aLong) {
        if (bookingsService.existsById(aLong)) {
            bookingsService.deleteById(aLong);
            return true;
        } return false;
    }
    @Override
    public List<Bookings> getAll() {
        return bookingsService.findAll();
    }

    @Override
    public Bookings getBookingById(Long booking) {
        return bookingsService.findBookingsByBookingId(booking);
    }
}
