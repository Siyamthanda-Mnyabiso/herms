package za.ac.cput.herms.domain.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;

import java.util.Objects;

@Entity
@Getter
public class Pharmacy extends Organization {
    @Column(nullable = false)
    private String phamarcyType;



    public Pharmacy(){}

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

    public static class Builder{
        private String pharmacyType;
        private String address;

        public Builder setPharmacyType(String pharmacyType){
            this.pharmacyType = pharmacyType;
            return this;
        }

        public Builder setAddress(String address){
            this.address = address;
            return this;
        }

        public Builder copy(Pharmacy pharmacy){
            this.pharmacyType = pharmacy.phamarcyType;
            return this;
        }

        public Pharmacy build(){
            Pharmacy pharmacy = new Pharmacy();
            return  pharmacy;
        }
    }
}
