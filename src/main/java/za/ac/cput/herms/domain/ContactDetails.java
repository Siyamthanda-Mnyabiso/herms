package za.ac.cput.herms.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class ContactDetails {
    private String mobileNumber;
    private String email;

    protected ContactDetails(Builder builder){
        this.mobileNumber = builder.mobileNumber;
        this.email = builder.email;
    }

    public ContactDetails() {

    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String toString() {
        return "ContactDetails{" +
                "mobileNumber='" + mobileNumber + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    public static class Builder{
        private String mobileNumber;
        private String email;

        public Builder setMobileNumber(String mobileNumber) {
            this.mobileNumber = mobileNumber;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder copy(ContactDetails contactDetails){
            this.mobileNumber = contactDetails.mobileNumber;
            this.email = contactDetails.email;
            return this;
        }

        public ContactDetails build(){
            return new ContactDetails(this);
        }
    }
}
