package za.ac.cput.herms.domain;

import jakarta.persistence.*;
import za.ac.cput.herms.util.Helper;

import java.sql.Time;
import java.util.Date;

@Entity
public class Bookings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    private Date bookingDate;
    private Date startDay;
    private Date endDay;
    private Helper.BookingStatus status;
    @ManyToOne
    @JoinColumn(name ="person_id")
    private Person person;

    public Bookings(){}
    public Bookings(Builder builder){
        this.bookingId = builder.bookingId;
        this.bookingDate = builder.bookingDate;
        this.startDay = builder.startDay;
        this.endDay = builder.endDay;
        this.status = builder.status;
        this.person = builder.person;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Date getBookingDate() {
        return bookingDate;
    }

    public Date getStartDay() {
        return startDay;
    }

    public Date getEndDay() {
        return endDay;
    }

    public Helper.BookingStatus getStatus() {
        return status;
    }

    public Person getPerson() {
        return person;
    }

    @Override
    public String toString() {
        return "Bookings{" +
                "bookingId='" + bookingId + '\'' +
                ", bookingDate=" + bookingDate +
                ", startTime=" + startDay +
                ", endTime=" + endDay +
                ", status=" + status +
                ", person=" + person +
                '}';
    }
    public static class Builder{
        private Long bookingId;
        private Date bookingDate;
        private Date startDay;
        private Date endDay;
        private Helper.BookingStatus status;
        private Person person;

        public Builder setBookingId(Long bookingId){
            this.bookingId = bookingId;
            return this;
        }
        public Builder setBookingDate(Date bookingDate){
            this.bookingDate = bookingDate;
            return this;
        }
        public Builder setStartDay(Date startDay){
            this.startDay= startDay;
            return this;
        }
        public Builder setEndDay(Date endDay){
            this.endDay = endDay;
            return this;
        }
        public Builder setStatus(Helper.BookingStatus status ){
            this.status = status;
            return this;
        }
        public Builder setPerson(Person person ){
            this.person = person;
            return this;
        }
        public Builder copy(Bookings booking){
            this.bookingId = booking.bookingId;
            this.bookingDate = booking.bookingDate;
            this.startDay = booking.startDay;
            this.endDay = booking.endDay;
            this.status = booking.status;
            this.person = booking.person;
            return this;
        }
        public Bookings Build(){
            return new Bookings(this);
        }

    }

}
