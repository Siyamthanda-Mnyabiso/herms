package za.ac.cput.herms.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.herms.domain.ContactDetails;

import static org.junit.jupiter.api.Assertions.*;

class ContactDetailsFactoryTest {

    @Test
    void createContactDetails() {
        ContactDetails contact = ContactDetailsFactory.createContactDetails("+27837659532","mangaliso@mycput.ac.za");
        assertNotNull(contact);
        assertEquals("+27837659532",contact.getMobileNumber());
        assertEquals("mangaliso@mycput.ac.za",contact.getEmail());
        System.out.println(contact);

    }
    @Test
    void testToFail(){
        assertThrows(IllegalArgumentException.class,()->
                ContactDetailsFactory.createContactDetails("8376592","mangalisomycput.ac.za"));
    }


}