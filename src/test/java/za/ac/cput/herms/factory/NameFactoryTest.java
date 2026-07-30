package za.ac.cput.herms.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.herms.domain.Name;

import static org.junit.jupiter.api.Assertions.*;

class NameFactoryTest {
    private Name name;
    @Test
    void createName() {
        Name name = NameFactory.createName("Gee","","Mangaliso");
//        assertEquals("Gee",name.getFirstName());
        assertNotNull(name);
        System.out.println("Name:"+name);
    }

    @Test
    void testToFail(){
        assertThrows(IllegalArgumentException.class, ()->
                NameFactory.createName("","Gee","Mangaliso"));
//                new Name.Builder()
//                        .setFirstName("")
//                        .setMiddleName("Gee")
//                        .setLastName("Mangaliso")
//                        .build()
//        );
    }
}