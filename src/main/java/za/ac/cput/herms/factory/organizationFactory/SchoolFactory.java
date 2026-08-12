package za.ac.cput.herms.factory.organizationFactory;

import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.util.Helper;

public class SchoolFactory {

    public static School createSchoolFactory(String schoolType, Address address,
                                             School.Type type, School.SchoolType typeOfSchool) {
        if(Helper.isNullOrEmpty(schoolType) ||  address == null) {
            return null;
        }

<<<<<<< HEAD
=======


>>>>>>> bd536c064be2a0542a57088e23848df8f5f56e86
        return new School.Builder()
                .setSchoolType(schoolType)
                .setType(type)
                .setSchoolTypeOfSchool(typeOfSchool)
                .build();
    }
}
