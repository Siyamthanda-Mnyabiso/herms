package za.ac.cput.herms.util;

import java.util.Map;
import org.apache.commons.validator.routines.EmailValidator;

public class Helper {
    public static boolean isNullOrEmpty(String str){
        if((str==null) || (str.isEmpty())){
            return  true;
        }
        return false;
    }

    public static boolean isPostalCodeValid(String code){
        String regex = "^\\d{4}$";
        if((code== null || (code.isBlank()))){
            return false;
        }
        return code.matches(regex);
    }

    public static boolean isCityValid(String city){
        String regex = "^[A-Za-z\\\\s'-]{2,50}$";
        if((city== null || (city.isBlank()))){
            return false;
        }
        return city.matches(regex);
    }

    private static final Map<String, String> provinces = Map.ofEntries(
            Map.entry("EC", "Eastern Cape"),
            Map.entry("Eastern Cape", "Eastern Cape"),

            Map.entry("FS", "Free State"),
            Map.entry("Free State", "Free State"),

            Map.entry("GP", "Gauteng"),
            Map.entry("Gauteng", "Gauteng"),

            Map.entry("KZN", "KwaZulu-Natal"),
            Map.entry("KwaZulu-Natal", "KwaZulu-Natal"),

            Map.entry("LP", "Limpopo"),
            Map.entry("Limpopo", "Limpopo"),

            Map.entry("MP", "Mpumalanga"),
            Map.entry("Mpumalanga", "Mpumalanga"),

            Map.entry("NC", "Northern Cape"),
            Map.entry("Northern Cape", "Northern Cape"),

            Map.entry("NW", "North West"),
            Map.entry("North West", "North West"),

            Map.entry("WC", "Western Cape"),
            Map.entry("Western Cape", "Western Cape")
    );
    public static boolean isProvinceValid(String str){
//        System.out.println("Province received: '" + str + "'");
        System.out.println("Province received: '" + str + "'");
        System.out.println("Contains WC: " + provinces.containsKey("WC"));
        System.out.println("All keys: " + provinces.keySet());

        if ((str==null) || (str.isBlank())) {
            return false;
        }
        return provinces.containsKey(str.trim());
    }

    public static boolean isEmailValid(String email){
       if((email==null || (email.isBlank()))){
           return false;
       }
       return EmailValidator.getInstance().isValid(email.trim());
    }

    public static boolean isMobileNumberValid(String phone){
        String regex =  "^(\\+27|0)[6-8][0-9]{8}$";
        if((phone==null) || (phone.isBlank())){
            return false;
        }
        return phone.matches(regex.trim());
    }


}
