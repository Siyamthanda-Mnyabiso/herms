package za.ac.cput.herms.util;

import java.util.Map;

public class Helper {
    public static boolean isNullOrEmpty(String str){
        if((str==null) || (str.isEmpty())){
            return  true;
        }
        return false;
    }

    public static boolean isPostalCodeValid(String str){
        String regex = "^\\d{4}$";
        if((!str.isEmpty()) && (str.matches(regex))){
            return true;
        }
        return false;
    }

    public static boolean isCityValid(String str){
        String regex = "^[A-Za-z\\\\s'-]{2,50}$";
        if((!str.isEmpty()) || (str.matches(regex))){
            return true;
        }
        return false;
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


}
