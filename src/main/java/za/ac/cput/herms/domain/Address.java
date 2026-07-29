package za.ac.cput.herms.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
    private String streetName;
    private String postalCode;
    private String city;
    private String province;

    protected Address(Builder builder){
        this.streetName = builder.streetName;
        this.city = builder.city;
        this.postalCode = builder.postalCode;
        this.province = builder.province;
    }

    public Address() {

    }

    public String getStreetName() {
        return streetName;
    }

    public String getProvince() {
        return province;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    @Override
    public String toString() {
        return "Address{" +
                "streetName='" + streetName + '\'' +
                ", postalCode='" + postalCode + '\'' +
                ", city='" + city + '\'' +
                ", province='" + province + '\'' +
                '}';
    }

    public static class Builder{
        private String streetName;
        private String postalCode;
        private String city;
        private String province;

        public Builder setStreetName(String streetName) {
            this.streetName = streetName;
            return this;
        }

        public Builder setProvince(String province) {
            this.province = province;
            return this;
        }

        public Builder setCity(String city) {
            this.city = city;
            return this;
        }

        public Builder setPostalCode(String postalCode) {
            this.postalCode = postalCode;
            return this;
        }

        public Builder copy(Address address){
            this.streetName = address.streetName;
            this.city = address.city;
            this.postalCode = address.postalCode;
            this.province = address.province;
            return this;
        }

        public Address build(){
            return new Address(this);
        }
    }
}
