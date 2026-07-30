package za.ac.cput.herms.factory;

import za.ac.cput.herms.domain.ContactDetails;
import za.ac.cput.herms.util.Helper;

public class ContactDetailsFactory {
    public static ContactDetails createContactDetails(String mobileNo,String email){
        if(!Helper.isMobileNumberValid(mobileNo)){
            throw new IllegalArgumentException("Invalid phone number");
        }
        if(!Helper.isEmailValid(email)){
            throw new IllegalArgumentException("Invalid email address");
        }
        return new ContactDetails.Builder()
                .setMobileNumber(mobileNo)
                .setEmail(email)
                .build();
    }
}
