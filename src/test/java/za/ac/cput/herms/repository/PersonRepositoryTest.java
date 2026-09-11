package za.ac.cput.herms.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Name;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Person;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNull;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PersonRepositoryTest {

    @Autowired
    private PersonRepository personRepository;

    private Name name() {
        return new Name.Builder().setFirstName("Jane").setLastName("Doe").build();
    }

    @Test
    void findByPersonId_existingNurse_returnsNurseInstance() {
        Nurse nurse = new Nurse.Builder()
                .setName(name())
                .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("12345678")
                .build();
        Nurse saved = personRepository.save(nurse);

        Person found = personRepository.findByPersonId(saved.getPersonId());

        assertInstanceOf(Nurse.class, found);
    }

    @Test
    void findByPersonId_missingId_returnsNull() {
        Person found = personRepository.findByPersonId(999999L);

        assertNull(found);
    }

    @Test
    void findByPersonId_returnsCorrectSubtypeAmongMixedPeople() {
        Nurse nurse = personRepository.save(new Nurse.Builder()
                .setName(name())
                .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("12345678")
                .build());
        Doctor doctor = personRepository.save(new Doctor.Builder()
                .setName(name())
                .setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("AB1234567")
                .build());

        assertInstanceOf(Nurse.class, personRepository.findByPersonId(nurse.getPersonId()));
        assertInstanceOf(Doctor.class, personRepository.findByPersonId(doctor.getPersonId()));
    }
}
