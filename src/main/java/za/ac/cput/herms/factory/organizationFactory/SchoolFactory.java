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



        return new School.Builder()
                .setSchoolType(schoolType)
                .setType(type)
                .setSchoolTypeOfSchool(typeOfSchool)
                .build();
    }
}
