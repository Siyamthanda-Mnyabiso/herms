package za.ac.cput.herms.factory;

import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.util.Helper;

public class AddressFactory {
    public static Address createAddress(String streetName,String postalCode, String city, String province){
        if(Helper.isNullOrEmpty(streetName)){
            throw new IllegalArgumentException("Street name cannot be empty!");
        }
        if(!Helper.isPostalCodeValid(postalCode)){
            throw new IllegalArgumentException("Invalid postal code, should be 4 digits!");
        }
        if(!Helper.isCityValid(city)){
            throw new IllegalArgumentException("Invalid city");
        }
        if(!Helper.isProvinceValid(province)){
            throw new IllegalArgumentException("Province does not exist");
        }
        return new Address.Builder()
                .setStreetName(streetName)
                .setPostalCode(postalCode)
                .setCity(city)
                .setProvince(province)
                .build();
    }
}
