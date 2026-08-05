package za.ac.cput.herms.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long personId;
    @Embedded
    protected Name name;
    @Embedded
    protected Address address;
    @Embedded
    protected ContactDetails contactDetails;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Bookings> bookings = new ArrayList<>();

    public Person(){}

    public Long getPersonId() {
        return personId;
    }

    public Name getName() {
        return name;
    }

    public Address getAddress() {
        return address;
    }

    public ContactDetails getContactDetails() {
        return contactDetails;
    }

    public List<Bookings> getBookings() {
        return bookings;
    }

    public abstract String toString() ;
}
