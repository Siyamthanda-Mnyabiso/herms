package za.ac.cput.herms.factory.organizationFactory;

import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.util.Helper;

public class PharmacyFactory {

    public static Pharmacy pharmacyCreate(String pharmacyType, Address address){
        if(Helper.isNullOrEmpty(pharmacyType) ||  address == null){
            return null;
        }

        return new Pharmacy.Builder()
                .setPharmacyType(pharmacyType)
                .build();
    }
}
