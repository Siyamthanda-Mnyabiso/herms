package za.ac.cput.herms.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.sql.Time;
import java.util.Date;

@Entity
public class Bookings {
    @Id
    private String bookingId;
    private Date bookingDate;
    private Time startTime;
    private Time endTime;
    private Enum status;
    @ManyToOne
    @JoinColumn(name ="person_id")
    private Person person;

    public Bookings(){}
    public Bookings(Builder builder){
        this.bookingId = builder.bookingId;
        this.bookingDate = builder.bookingDate;
        this.startTime = builder.startTime;
        this.endTime = builder.endTime;
        this.status = builder.status;
        this.person = builder.person;
    }

    public String getBookingId() {
        return bookingId;
    }

    public Date getBookingDate() {
        return bookingDate;
    }

    public Time getStartTime() {
        return startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public Enum getStatus() {
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
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", status=" + status +
                ", person=" + person +
                '}';
    }
    public static class Builder{
        private String bookingId;
        private Date bookingDate;
        private Time startTime;
        private Time endTime;
        private Enum status;
        private Person person;

        public Builder setBookingId(String bookingId){
            this.bookingId = bookingId;
            return this;
        }
        public Builder setBookingDate(Date bookingDate){
            this.bookingDate = bookingDate;
            return this;
        }
        public Builder setStartTime(Time startTime){
            this.startTime= startTime;
            return this;
        }
        public Builder setEndTime(Time endTime){
            this.endTime = endTime;
            return this;
        }
        public Builder setStatus(Enum status ){
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
            this.startTime = booking.startTime;
            this.endTime = booking.endTime;
            this.status = booking.status;
            this.person = booking.person;
            return this;
        }
        public Bookings Build(){
            return new Bookings(this);
        }

    }

}
