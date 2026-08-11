package za.ac.cput.herms.domain.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import java.util.Objects;
@Entity
@Getter
public class School extends Organization {

    @Column(nullable = false)
    private String schoolType;

    @Column(nullable = false)
    private String address;

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

    public School() {

    }

    @Override
    public String toString()
    {
        return super.toString() +
                "\nSchoolType: " + schoolType +
                "\nAddress: " + address +
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
                && Objects.equals(address, that.address)
                && Objects.equals(type, that.type)
                && Objects.equals(typeOfSchool, that.typeOfSchool);
    }

    @Override
    public int hashCode() {
        return Objects.hash(schoolType, address, type, typeOfSchool);
    }

    public static class Builder {
        private String schoolType;
        private String address;
        private Type type;
        private SchoolType typeOfSchool;

        public Builder setSchoolType(String schoolType) {
            this.schoolType = schoolType;
            return this;
        }

        public Builder setAddress(String address) {
            this.address = address;
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

        public Builder copy(School school) {
            this.schoolType = school.schoolType;
            this.address = school.address;
            this.type = school.type;
            this.typeOfSchool = school.typeOfSchool;
            return this;
        }

        public School build() {
            School school = new School();
            return school;
        }
    }
}
