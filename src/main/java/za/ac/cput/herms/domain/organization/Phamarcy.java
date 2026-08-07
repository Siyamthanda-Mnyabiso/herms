package za.ac.cput.herms.domain.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;

import java.util.Objects;

@Entity
@Getter
public class Phamarcy extends Organization {
    @Column(nullable = false)
    private String phamarcyType;

    @Column(nullable = false)
    private String address;

    public Phamarcy(){}

    @Override
    public String toString(){
        return super.toString() +
                "Pharmarcy Type" +  phamarcyType +
                "Address" + address;
    }

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if(!(o instanceof Phamarcy)) return false;
        return super.equals(o)
                && Objects.equals(phamarcyType, ((Phamarcy)o).phamarcyType)
                && Objects.equals(address, ((Phamarcy)o).address);
    }

    public static class Builder{
        private String phamarcyType;
        private String address;

        public Builder setPhamarcyType(String phamarcyType){
            this.phamarcyType = phamarcyType;
            return this;
        }

        public Builder setAddress(String address){
            this.address = address;
            return this;
        }

        public Builder copy(Phamarcy phamarcy){
            this.phamarcyType = phamarcy.phamarcyType;
            this.address = phamarcy.address;
            return this;
        }

        public Phamarcy build(){
            Phamarcy phamarcy = new Phamarcy();
            return  phamarcy;
        }
    }
}
