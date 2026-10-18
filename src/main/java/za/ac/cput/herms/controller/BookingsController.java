package za.ac.cput.herms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.service.IBookingService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/Bookings")
public class BookingsController {
    private final IBookingService bookingsController;

    @Autowired
    public BookingsController(IBookingService bookingService){
        this.bookingsController = bookingService;
    }
    @PostMapping("/create")
    public Bookings createBookings(@RequestBody Bookings booking){
        return bookingsController.Create(booking);
    }
    @GetMapping("/Read/{bookingId}")
    public Bookings readBooking(@PathVariable Long bookingId){
        return bookingsController.Read(bookingId);
    }
    @PutMapping("/Update")
    public Bookings updateBooking(@RequestBody Bookings booking){
        return bookingsController.Update(booking);
    }
    @DeleteMapping("Delete/{bookingId}")
    public boolean deleteBooking(@PathVariable Long bookingId){
        return  bookingsController.Delete(bookingId);
    }
    @GetMapping("/getAll")
    public List<Bookings> findAll(){
        return bookingsController.getAll();
    }
    @GetMapping("/getBookingById/{bookingId}")
    public Bookings findByBookingId(@PathVariable Long bookingId){
        return bookingsController.getBookingById(bookingId);
    }
}
