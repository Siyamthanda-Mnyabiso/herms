package za.ac.cput.herms.factory.organizationFactory;

import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.util.Helper;

public class SchoolFactory {

    public static School createSchoolFactory(String schoolType, String Address,
                                             School.Type type, School.SchoolType typeOfSchool) {
        if(Helper.isNullOrEmpty(schoolType) ||  Helper.isNullOrEmpty(Address)) {
            return null;
        }

        if

        return new School.Builder()
                .setSchoolType(schoolType)
                .setAddress(Address)
                .setType(type)
                .setSchoolTypeOfSchool(typeOfSchool)
                .build();
    }
}
