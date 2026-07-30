package za.ac.cput.herms.factory;

import za.ac.cput.herms.domain.Name;
import za.ac.cput.herms.util.Helper;

public class NameFactory {
    public static Name createName(String firstName, String middleName, String lastName){
        if (Helper.isNullOrEmpty(firstName) || Helper.isNullOrEmpty(lastName)) {
            throw new IllegalArgumentException("First and Lastname cannot be empty");
        }
        return new Name.Builder()
                .setFirstName(firstName)
                .setMiddleName(middleName)
                .setLastName(lastName)
                .build();
    }
}
