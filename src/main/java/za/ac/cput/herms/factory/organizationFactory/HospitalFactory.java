package za.ac.cput.herms.factory.organizationFactory;


import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.util.Helper;

public class HospitalFactory {

    public static Hospital createHospitalFactory(String hospitalType, Address address, String typeOfHospital) {
        if (Helper.isNullOrEmpty(hospitalType) || address == null) {
            return null;
        }
        Hospital.HospitalType type;
        try{
            type = Hospital.HospitalType.valueOf(typeOfHospital);

    } catch (IllegalArgumentException e){
            return null;
        }

        return new Hospital.Builder()
                .setHospitalType(hospitalType)
                .setTypeOfHospital(type)
                .build();
    }


}



