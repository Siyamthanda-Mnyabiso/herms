package za.ac.cput.herms.domain;

import jakarta.persistence.Embeddable;

import java.util.Objects;

@Embeddable
public class Name implements ValueObject {
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

        public Name build(){
            return new Name(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Name name)) return false;
        return Objects.equals(firstName, name.firstName) && Objects.equals(middleName, name.middleName) && Objects.equals(lastName, name.lastName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName, middleName, lastName);
    }
}
