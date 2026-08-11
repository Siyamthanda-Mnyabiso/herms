package za.ac.cput.herms.factory.organizationFactory;


import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.util.Helper;

public class HospitalFactory {

    public static Hospital createHospitalFactory(String hospitalType, String address, String typeOfHospital) {
        if (Helper.isNullOrEmpty(hospitalType) || Helper.isNullOrEmpty(address)) {
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
                .setAddress(address)
                .setTypeOfHospital(type)
                .build();
    }


}



