package za.ac.cput.herms.domain.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import za.ac.cput.herms.domain.ContactDetails;
import java.util.Objects;
@Entity
@Getter
public class School extends Organization {

    @Column(nullable = false)
    private String schoolType;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SchoolType typeOfSchool;

    public enum Type{
        Public, Private;
    }

    public enum SchoolType{
        Primary, HighSchool;
    }

    protected School() {

    }

    protected School(Builder builder) {
        super(builder);
        this.schoolType = builder.schoolType;
        this.type = builder.type;
        this.typeOfSchool = builder.typeOfSchool;
    }

    @Override
    public String toString()
    {
        return super.toString() +
                "\nSchoolType: " + schoolType +
                "\nType: " + type +
                "\nSchoolType: " + typeOfSchool;
    }


    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof School)) return false;
        School that = (School) o;
        return super.equals(o)
                && Objects.equals(schoolType, that.schoolType)
                && Objects.equals(type, that.type)
                && Objects.equals(typeOfSchool, that.typeOfSchool);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), schoolType, type, typeOfSchool);
    }

    public static class Builder extends Organization.Builder {
        private String schoolType;
        private Type type;
        private SchoolType typeOfSchool;

        public Builder setSchoolType(String schoolType) {
            this.schoolType = schoolType;
            return this;
        }

        public Builder setType(Type type) {
            this.type = type;
            return this;
        }

        public Builder setSchoolTypeOfSchool(SchoolType typeOfSchool) {
            this.typeOfSchool = typeOfSchool;
            return this;
        }

        @Override
        public Builder setOrganizationId(String organizationId) {
            super.setOrganizationId(organizationId);
            return this;
        }

        @Override
        public Builder setOrganizationName(String organizationName) {
            super.setOrganizationName(organizationName);
            return this;
        }

        @Override
        public Builder setContactDetails(ContactDetails contactDetails) {
            super.setContactDetails(contactDetails);
            return this;
        }

        public Builder copy(School school) {
            super.copy(school);
            this.schoolType = school.schoolType;
            this.type = school.type;
            this.typeOfSchool = school.typeOfSchool;
            return this;
        }

        public School build() {
            return new School(this);
        }
    }
}
