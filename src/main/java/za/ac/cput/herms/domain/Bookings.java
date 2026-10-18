package za.ac.cput.herms.domain;

import jakarta.persistence.*;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.util.Helper;

import java.sql.Time;
import java.time.Instant;
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
    private String organizationId;
    private String organizationName;
    private Instant requestedAt;
    private Instant respondBy;
    private Instant respondedAt;
    private Instant confirmedAt;
    private String declineReason;

    public Bookings(){}
    public Bookings(Builder builder){
        this.bookingId = builder.bookingId;
        this.bookingDate = builder.bookingDate;
        this.startDay = builder.startDay;
        this.endDay = builder.endDay;
        this.status = builder.status;
        this.person = builder.person;
        this.organizationId = builder.organizationId;
        this.organizationName = builder.organizationName;
        this.requestedAt = builder.requestedAt;
        this.respondBy = builder.respondBy;
        this.respondedAt = builder.respondedAt;
        this.confirmedAt = builder.confirmedAt;
        this.declineReason = builder.declineReason;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public Instant getRequestedAt() {
        return requestedAt;
    }

    public Instant getRespondBy() {
        return respondBy;
    }

    public Instant getRespondedAt() {
        return respondedAt;
    }

    public Instant getConfirmedAt() {
        return confirmedAt;
    }

    public String getDeclineReason() {
        return declineReason;
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
        private String organizationId;
        private String organizationName;
        private Instant requestedAt;
        private Instant respondBy;
        private Instant respondedAt;
        private Instant confirmedAt;
        private String declineReason;

        public Builder setOrganizationId(String organizationId){
            this.organizationId = organizationId;
            return this;
        }
        public Builder setOrganizationName(String organizationName){
            this.organizationName = organizationName;
            return this;
        }
        public Builder setRequestedAt(Instant requestedAt){
            this.requestedAt = requestedAt;
            return this;
        }
        public Builder setRespondBy(Instant respondBy){
            this.respondBy = respondBy;
            return this;
        }
        public Builder setRespondedAt(Instant respondedAt){
            this.respondedAt = respondedAt;
            return this;
        }
        public Builder setConfirmedAt(Instant confirmedAt){
            this.confirmedAt = confirmedAt;
            return this;
        }
        public Builder setDeclineReason(String declineReason){
            this.declineReason = declineReason;
            return this;
        }
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
            this.organizationId = booking.organizationId;
            this.organizationName = booking.organizationName;
            this.requestedAt = booking.requestedAt;
            this.respondBy = booking.respondBy;
            this.respondedAt = booking.respondedAt;
            this.confirmedAt = booking.confirmedAt;
            this.declineReason = booking.declineReason;
            return this;
        }
        public Bookings Build(){
            return new Bookings(this);
        }

    }

}
