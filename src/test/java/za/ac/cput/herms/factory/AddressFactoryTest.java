package za.ac.cput.herms.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.herms.domain.Address;

import static org.junit.jupiter.api.Assertions.*;

class AddressFactoryTest {

    @Test
    void createAddress() {
        Address address = AddressFactory.createAddress("Nondulo str","7001","Cape Town","WC");
        assertEquals("7001",address.getPostalCode());
        assertEquals("Cape Town",address.getCity());
        assertEquals("WC",address.getProvince());
//        assertNotNull(address);
        System.out.println(address);
    }

    @Test

    void testToFail(){
        assertThrows(IllegalArgumentException.class,()->
                AddressFactory.createAddress("Nondulo str","3456677","","CW"));
    }
}