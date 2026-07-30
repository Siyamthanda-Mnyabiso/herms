package za.ac.cput.herms.util;

public class Helper {
    public static boolean isNullOrEmpty(String str){
        if((str==null) || (str.isEmpty())){
            return  true;
        }
        return false;
    }
}
