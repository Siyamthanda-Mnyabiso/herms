package za.ac.cput.herms.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import za.ac.cput.herms.domain.Address;
import za.ac.cput.herms.domain.ContactDetails;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Name;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Pharmacist;
import za.ac.cput.herms.domain.Teacher;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Verifies the CandidateSummary projection end-to-end against a real database (herms_test_db,
 * isolated from the dev database via src/test/resources/application.properties): that the
 * repository query returns the expected professional-specific fields, while Name and
 * ContactDetails are structurally unreachable through the projection interface, so real
 * identifying data never travels further than this query.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CandidateSummaryProjectionTest {

    @Autowired
    private NurseRepository nurseRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private PharmacistRepository pharmacistRepository;

    private Name name() {
        return new Name.Builder().setFirstName("Jane").setLastName("Doe").build();
    }

    private ContactDetails contactDetails() {
        return new ContactDetails.Builder()
                .setEmail("jane.doe@example.com")
                .setMobileNumber("0821234567")
                .build();
    }

    private Address address() {
        return new Address.Builder()
                .setStreetName("Main Rd")
                .setPostalCode("7530")
                .setCity("Bellville")
                .setProvince("WC")
                .build();
    }

    @Test
    void nurseFindAllBy_returnsExpectedFields() {
        Nurse nurse = new Nurse.Builder()
                .setName(name())
                .setContactDetails(contactDetails())
                .setAddress(address())
                .setQualification("BSc Nursing")
                .setSpecialization("Pediatrics")
                .setYearsOfExperience(5)
                .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("12345678")
                .build();
        nurseRepository.save(nurse);

        List<CandidateSummary> summaries = nurseRepository.findAllBy();

        assertEquals(1, summaries.size());
        CandidateSummary summary = summaries.get(0);
        assertEquals("BSc Nursing", summary.getQualification());
        assertEquals("Pediatrics", summary.getSpecialization());
        assertEquals(5, summary.getYearsOfExperience());
        assertEquals("AVAILABLE", summary.getAvailabilityStatus());
        assertEquals("12345678", summary.getLicenseNo());
        assertEquals("Bellville", summary.getAddress().getCity());
        assertEquals("WC", summary.getAddress().getProvince());
        // CandidateSummary has no getName()/getContactDetails() method at all -
        // real identifying data is structurally unreachable here, not just unused.
    }

    @Test
    void doctorFindAllBy_returnsExpectedFields() {
        Doctor doctor = new Doctor.Builder()
                .setName(name())
                .setContactDetails(contactDetails())
                .setAddress(address())
                .setQualification("MBChB")
                .setSpecialization("Cardiology")
                .setYearsOfExperience(10)
                .setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("AB1234567")
                .build();
        doctorRepository.save(doctor);

        List<CandidateSummary> summaries = doctorRepository.findAllBy();

        assertEquals(1, summaries.size());
        assertEquals("AB1234567", summaries.get(0).getLicenseNo());
        assertEquals("Cardiology", summaries.get(0).getSpecialization());
    }

    @Test
    void teacherFindAllBy_returnsExpectedFields() {
        Teacher teacher = new Teacher.Builder()
                .setName(name())
                .setContactDetails(contactDetails())
                .setAddress(address())
                .setQualification("BEd")
                .setSpecialization("Mathematics")
                .setYearsOfExperience(3)
                .setAvailabilityStatus(Teacher.AvailabilityStatus.NOT_AVAILABLE)
                .setLicenseNo("123456")
                .build();
        teacherRepository.save(teacher);

        List<CandidateSummary> summaries = teacherRepository.findAllBy();

        assertEquals(1, summaries.size());
        assertEquals("123456", summaries.get(0).getLicenseNo());
        assertEquals("NOT_AVAILABLE", summaries.get(0).getAvailabilityStatus());
    }

    @Test
    void pharmacistFindAllBy_returnsExpectedFields() {
        Pharmacist pharmacist = new Pharmacist.Builder()
                .setName(name())
                .setContactDetails(contactDetails())
                .setAddress(address())
                .setQualification("BPharm")
                .setSpecialization("Retail")
                .setYearsOfExperience(2)
                .setAvailabilityStatus(Pharmacist.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("CD7654321")
                .build();
        pharmacistRepository.save(pharmacist);

        List<CandidateSummary> summaries = pharmacistRepository.findAllBy();

        assertEquals(1, summaries.size());
        assertEquals("CD7654321", summaries.get(0).getLicenseNo());
        assertEquals("Retail", summaries.get(0).getSpecialization());
    }

    @Test
    void findAllBy_excludesOtherProfessionTypes() {
        nurseRepository.save(new Nurse.Builder()
                .setName(name())
                .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("12345678")
                .build());
        doctorRepository.save(new Doctor.Builder()
                .setName(name())
                .setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE)
                .setLicenseNo("AB1234567")
                .build());

        assertEquals(1, nurseRepository.findAllBy().size());
        assertEquals(1, doctorRepository.findAllBy().size());
        assertEquals(0, teacherRepository.findAllBy().size());
        assertEquals(0, pharmacistRepository.findAllBy().size());
    }
}
