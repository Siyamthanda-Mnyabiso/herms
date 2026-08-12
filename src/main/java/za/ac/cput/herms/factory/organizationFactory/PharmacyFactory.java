package za.ac.cput.herms.factory.organizationFactory;

import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.util.Helper;

public class PharmacyFactory {

    public static Pharmacy pharmacyCreate(String pharmacyType, String address){
        if(Helper.isNullOrEmpty(pharmacyType) ||  Helper.isNullOrEmpty(address)){
            return null;
        }

        return new Pharmacy.Builder()
                .setPharmacyType(pharmacyType)
                .setAddress(address)
                .build();
    }
}
