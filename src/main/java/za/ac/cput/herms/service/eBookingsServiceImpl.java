package za.ac.cput.herms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.repository.BookingsRepository;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.util.Helper;

import java.util.List;
@Service
public class eBookingsServiceImpl implements IBookingService{
    private final BookingsRepository bookingsService;
    private final PersonRepository personRepository;

    @Autowired
    public eBookingsServiceImpl(BookingsRepository bookingsRepository, PersonRepository personRepository){
        this.bookingsService = bookingsRepository;
        this.personRepository = personRepository;
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
    @Override
    public Bookings createForPerson(Long personId,Bookings booking){
        Person person = personRepository.findByPersonId(personId);
            if(person == null){
                return null;
            }
            Bookings toSave = new Bookings.Builder()
                    .copy(booking)
                    .setPerson(person)
                    .Build();
            return bookingsService.save(toSave);
    }
    @Override
    public Bookings updateStatus(Long bookingId, Helper.BookingStatus status){
        Bookings existing = bookingsService.findBookingsByBookingId(bookingId);
                if(existing == null){
                    throw new RuntimeException("Booking not found: "+ bookingId);
                }
                Bookings updated = new Bookings.Builder()
                        .copy(existing).
                        setStatus(status)
                        .Build();
                return bookingsService.save(updated);
    }
}
