package za.ac.cput.herms.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;
import org.apache.commons.validator.routines.EmailValidator;
import za.ac.cput.herms.domain.Person;

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
        String regex = "^[A-Za-z\\s'-]{2,50}$";
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
    public static boolean isDateValid(Date date){
        if(date == null ){
            return false;
        }
        java.time.LocalDate bookingDate = date.toInstant()
                .atZone(java.time.ZoneId.systemDefault()).toLocalDate();
            return !bookingDate.isBefore(java.time.LocalDate.now()) ;
    }
    public static boolean isStartDayEndDay(Date startDay,Date endDay){
        if((startDay == null || endDay == null)){
            return false;
        }
        return startDay.before(endDay);
    }
    public enum BookingStatus{
        PENDING,
        CONFIRMED,
        CANCELED,
        COMPLETED
    }

    public static boolean isPersonNullOrEmpty(Person person){
        if((person == null)){
            return true;
        }
        return false;
    }

    public static boolean isNurseLicenseNoValid(String licenseNo){
        String regex = "^\\d{8}$";
        if((licenseNo == null) || (licenseNo.isBlank())){
            return false;
        }
        return licenseNo.trim().matches(regex);
    }

    public static boolean isDoctorLicenseNoValid(String licenseNo){
        String regex = "^[A-Za-z]{2}\\d{7}$";
        if((licenseNo == null) || (licenseNo.isBlank())){
            return false;
        }
        return licenseNo.trim().matches(regex);
    }

    public static boolean isTeacherLicenseNoValid(String licenseNo){
        String regex = "^\\d{6}$";
        if((licenseNo == null) || (licenseNo.isBlank())){
            return false;
        }
        return licenseNo.trim().matches(regex);
    }

    public static boolean isPharmacistLicenseNoValid(String licenseNo){
        // Pharmacist format matches Doctors
        return isDoctorLicenseNoValid(licenseNo);
    }

    public static String hashPassword(String password){
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    public static boolean matchesPassword(String rawPassword, String hashedPassword){
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        return hashPassword(rawPassword).equals(hashedPassword);
    }

}
