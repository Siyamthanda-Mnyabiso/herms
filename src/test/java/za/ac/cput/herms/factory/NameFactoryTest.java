package za.ac.cput.herms.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.herms.domain.Name;

import static org.junit.jupiter.api.Assertions.*;

class NameFactoryTest {
    private Name name;
    @Test
    void createName() {
        Name name = NameFactory.createName("Gee","","Mangaliso");
        assertNotNull(name);
        assertEquals("Gee",name.getFirstName());
        assertEquals("",name.getMiddleName());
        assertEquals("Mangaliso",name.getLastName());
        System.out.println(name);
    }

    @Test
    void testToFail(){
        assertThrows(IllegalArgumentException.class, ()->
                NameFactory.createName("","Gee",""));
    }
}