package za.ac.cput.herms.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class Name {
    private String firstName;
    private String middleName;
    private String lastName;

    protected Name(Builder builder){
        this.firstName = builder.firstName;
        this.middleName = builder.middleName;
        this.lastName = builder.lastName;
    }

    public Name() {

    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    @Override
    public String toString() {
        return "Name{" +
                "firstName='" + firstName + '\'' +
                ", middleName='" + middleName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }

    public static class Builder{
        private String firstName;
        private String middleName;
        private String lastName;

        public Builder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder setMiddleName(String middleName) {
            this.middleName = middleName;
            return this;
        }

        public Builder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder copy(Name name){
            this.firstName = name.firstName;
            this.middleName = name.middleName;
            this.lastName = name.lastName;
            return this;
        }

        public Name builder(){
            return new Name(this);
        }
    }
}
