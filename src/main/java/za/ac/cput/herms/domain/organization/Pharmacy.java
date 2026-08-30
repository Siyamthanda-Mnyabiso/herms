package za.ac.cput.herms.domain.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import za.ac.cput.herms.domain.ContactDetails;

import java.util.Objects;

@Entity
@Getter
public class Pharmacy extends Organization {
    @Column(nullable = false)
    private String phamarcyType;

    protected Pharmacy(){}

    protected Pharmacy(Builder builder){
        super(builder);
        this.phamarcyType = builder.pharmacyType;
    }

    @Override
    public String toString(){
        return super.toString() +
                "Pharmarcy Type" +  phamarcyType;
    }

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if(!(o instanceof Pharmacy)) return false;
        return super.equals(o)
                && Objects.equals(phamarcyType, ((Pharmacy)o).phamarcyType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), phamarcyType);
    }

    public static class Builder extends Organization.Builder {
        private String pharmacyType;

        public Builder setPharmacyType(String pharmacyType){
            this.pharmacyType = pharmacyType;
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

        public Builder copy(Pharmacy pharmacy){
            super.copy(pharmacy);
            this.pharmacyType = pharmacy.phamarcyType;
            return this;
        }

        public Pharmacy build(){
            return new Pharmacy(this);
        }
    }
}
