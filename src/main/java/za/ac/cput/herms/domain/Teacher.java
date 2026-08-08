package za.ac.cput.herms.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
public class Teacher extends Person {

    public enum AvailabilityStatus {
        AVAILABLE,
        NOT_AVAILABLE
    }

    private String qualification;
    private String specialization;
    private int yearsOfExperience;

    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availabilityStatus;

    private String licenseNo;

    protected Teacher() {
    }

    private Teacher(Builder builder) {
        this.name = builder.name;
        this.address = builder.address;
        this.contactDetails = builder.contactDetails;

        this.qualification = builder.qualification;
        this.specialization = builder.specialization;
        this.yearsOfExperience = builder.yearsOfExperience;
        this.availabilityStatus = builder.availabilityStatus;
        this.licenseNo = builder.licenseNo;
    }

    public String getQualification() {
        return qualification;
    }

    public String getSpecialization() {
        return specialization;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    @Override
    public String toString() {
        return "Teacher{" +
                "qualification='" + qualification + '\'' +
                ", specialization='" + specialization + '\'' +
                ", yearsOfExperience=" + yearsOfExperience +
                ", availabilityStatus=" + availabilityStatus +
                ", licenseNo='" + licenseNo + '\'' +
                '}';
    }

    public static class Builder {
        private Name name;
        private Address address;
        private ContactDetails contactDetails;

        private String qualification;
        private String specialization;
        private int yearsOfExperience;
        private AvailabilityStatus availabilityStatus;
        private String licenseNo;

        public Builder setName(Name name) {
            this.name = name;
            return this;
        }

        public Builder setAddress(Address address) {
            this.address = address;
            return this;
        }

        public Builder setContactDetails(ContactDetails contactDetails) {
            this.contactDetails = contactDetails;
            return this;
        }

        public Builder setQualification(String qualification) {
            this.qualification = qualification;
            return this;
        }

        public Builder setSpecialization(String specialization) {
            this.specialization = specialization;
            return this;
        }

        public Builder setYearsOfExperience(int yearsOfExperience) {
            this.yearsOfExperience = yearsOfExperience;
            return this;
        }

        public Builder setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
            this.availabilityStatus = availabilityStatus;
            return this;
        }

        public Builder setLicenseNo(String licenseNo) {
            this.licenseNo = licenseNo;
            return this;
        }

        public Builder copy(Teacher teacher) {
            this.name = teacher.name;
            this.address = teacher.address;
            this.contactDetails = teacher.contactDetails;
            this.qualification = teacher.qualification;
            this.specialization = teacher.specialization;
            this.yearsOfExperience = teacher.yearsOfExperience;
            this.availabilityStatus = teacher.availabilityStatus;
            this.licenseNo = teacher.licenseNo;
            return this;
        }

        public Teacher build() {return new Teacher(this);
        }
    }
}