package za.ac.cput.herms.domain.organization;


import jakarta.persistence.*;
import lombok.Getter;
import org.antlr.v4.runtime.atn.SemanticContext;
import za.ac.cput.herms.domain.ContactDetails;

import java.util.Objects;

@Entity
@Getter
public class Hospital extends Organization {

    @Column(nullable = false)
    private String hospitalType;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HospitalType typeOfHospital;

    public enum HospitalType{
        Private, Public;
    }

    protected Hospital(){
    }

    protected Hospital(Builder builder) {
        super(builder);
        this.hospitalType = builder.hospitalType;
        this.typeOfHospital = builder.typeOfHospital;
    }

    @Override
    public String toString(){
        return super.toString() +
                "Hospital type" + hospitalType +
                "\ntype of hospital" + typeOfHospital;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if(!(o instanceof Hospital)) return false;
        Hospital that = (Hospital) o;
        return super.equals(o)
                && Objects.equals(hospitalType, that.hospitalType)
                && Objects.equals(typeOfHospital, that.typeOfHospital);
    }

    public int hashCode() {
        return Objects.hash(super.hashCode(), hospitalType, typeOfHospital);
    }

    public static class Builder extends Organization.Builder {

        private String hospitalType;
        private HospitalType typeOfHospital;


    public Builder setHospitalType(String hospitalType){
        this.hospitalType = hospitalType;
        return this;
    }
    public Builder setTypeOfHospital(HospitalType typeOfHospital){
        this.typeOfHospital = typeOfHospital;
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

    public Builder copy(Hospital hospital){
        super.copy(hospital);
        this.hospitalType = hospital.hospitalType;
        this.typeOfHospital = hospital.typeOfHospital;
        return this;

    }

    public Hospital build(){
        return new Hospital(this);
    }

    }

}
