package za.ac.cput.herms.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Pharmacist;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.domain.Teacher;
import za.ac.cput.herms.repository.CandidateSummary;
import za.ac.cput.herms.repository.DoctorRepository;
import za.ac.cput.herms.repository.NurseRepository;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.repository.PharmacistRepository;
import za.ac.cput.herms.repository.TeacherRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StaffServiceImplTest {

    @Mock
    private PersonRepository personRepository;
    @Mock
    private NurseRepository nurseRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private TeacherRepository teacherRepository;
    @Mock
    private PharmacistRepository pharmacistRepository;

    private StaffServiceImpl staffService() {
        return new StaffServiceImpl(personRepository, nurseRepository, doctorRepository,
                teacherRepository, pharmacistRepository);
    }

    private Nurse nurse(Long id, Nurse.AvailabilityStatus status, String licenseNo) {
        return (Nurse) setPersonId(new Nurse.Builder()
                .setAvailabilityStatus(status)
                .setLicenseNo(licenseNo)
                .build(), id);
    }

    private Doctor doctor(Long id, Doctor.AvailabilityStatus status, String licenseNo) {
        return (Doctor) setPersonId(new Doctor.Builder()
                .setAvailabilityStatus(status)
                .setLicenseNo(licenseNo)
                .build(), id);
    }

    private Teacher teacher(Long id, Teacher.AvailabilityStatus status, String licenseNo) {
        return (Teacher) setPersonId(new Teacher.Builder()
                .setAvailabilityStatus(status)
                .setLicenseNo(licenseNo)
                .build(), id);
    }

    private Pharmacist pharmacist(Long id, Pharmacist.AvailabilityStatus status, String licenseNo) {
        return (Pharmacist) setPersonId(new Pharmacist.Builder()
                .setAvailabilityStatus(status)
                .setLicenseNo(licenseNo)
                .build(), id);
    }

    private Person setPersonId(Person person, Long id) {
        try {
            var field = Person.class.getDeclaredField("personId");
            field.setAccessible(true);
            field.set(person, id);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException(e);
        }
        return person;
    }

    // ---------- Nurse ----------

    @Test
    void createNurse_savesAndReturnsNurse() {
        Nurse nurse = nurse(null, Nurse.AvailabilityStatus.AVAILABLE, null);
        Nurse saved = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.save(nurse)).thenReturn(saved);

        Nurse result = staffService().createNurse(nurse);

        assertEquals(1L, result.getPersonId());
        verify(personRepository).save(nurse);
    }

    @Test
    void getNurseById_existingNurse_returnsNurse() {
        Nurse nurse = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findByPersonId(1L)).thenReturn(nurse);

        assertEquals(nurse, staffService().getNurseById(1L));
    }

    @Test
    void getNurseById_wrongType_returnsNull() {
        Doctor doctor = doctor(1L, Doctor.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findByPersonId(1L)).thenReturn(doctor);

        assertNull(staffService().getNurseById(1L));
    }

    @Test
    void getAllNurses_filtersOnlyNurses() {
        Nurse nurse = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        Doctor doctor = doctor(2L, Doctor.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findAll()).thenReturn(List.of(nurse, doctor));

        List<Nurse> result = staffService().getAllNurses();

        assertEquals(1, result.size());
        assertEquals(nurse, result.get(0));
    }

    @Test
    void getAllNurseSummaries_returnsProjectionFromRepository() {
        CandidateSummary summary = mock(CandidateSummary.class);
        when(nurseRepository.findAllBy()).thenReturn(List.of(summary));

        List<CandidateSummary> result = staffService().getAllNurseSummaries();

        assertEquals(List.of(summary), result);
    }

    @Test
    void updateNurse_savesAndReturnsNurse() {
        Nurse nurse = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.save(nurse)).thenReturn(nurse);

        assertEquals(nurse, staffService().updateNurse(nurse));
        verify(personRepository).save(nurse);
    }

    @Test
    void deleteNurse_deletesById() {
        staffService().deleteNurse(1L);
        verify(personRepository).deleteById(1L);
    }

    @Test
    void isNurseAvailable_trueWhenAvailable() {
        when(personRepository.findByPersonId(1L))
                .thenReturn(nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null));

        assertTrue(staffService().isNurseAvailable(1L));
    }

    @Test
    void isNurseAvailable_falseWhenNotAvailable() {
        when(personRepository.findByPersonId(1L))
                .thenReturn(nurse(1L, Nurse.AvailabilityStatus.NOT_AVAILABLE, null));

        assertFalse(staffService().isNurseAvailable(1L));
    }

    @Test
    void isNurseLicenseValid_trueForValidLicense() {
        when(personRepository.findByPersonId(1L))
                .thenReturn(nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, "12345678"));

        assertTrue(staffService().isNurseLicenseValid(1L));
    }

    @Test
    void isNurseLicenseValid_falseForInvalidLicense() {
        when(personRepository.findByPersonId(1L))
                .thenReturn(nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, "abc"));

        assertFalse(staffService().isNurseLicenseValid(1L));
    }

    // ---------- Doctor ----------

    @Test
    void createDoctor_savesAndReturnsDoctor() {
        Doctor doctor = doctor(null, Doctor.AvailabilityStatus.AVAILABLE, null);
        Doctor saved = doctor(1L, Doctor.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.save(doctor)).thenReturn(saved);

        assertEquals(1L, staffService().createDoctor(doctor).getPersonId());
    }

    @Test
    void getAllDoctors_filtersOnlyDoctors() {
        Nurse nurse = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        Doctor doctor = doctor(2L, Doctor.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findAll()).thenReturn(List.of(nurse, doctor));

        List<Doctor> result = staffService().getAllDoctors();

        assertEquals(1, result.size());
        assertEquals(doctor, result.get(0));
    }

    @Test
    void getAllDoctorSummaries_returnsProjectionFromRepository() {
        CandidateSummary summary = mock(CandidateSummary.class);
        when(doctorRepository.findAllBy()).thenReturn(List.of(summary));

        assertEquals(List.of(summary), staffService().getAllDoctorSummaries());
    }

    @Test
    void deleteDoctor_deletesById() {
        staffService().deleteDoctor(2L);
        verify(personRepository).deleteById(2L);
    }

    @Test
    void isDoctorAvailable_falseWhenNotAvailable() {
        when(personRepository.findByPersonId(2L))
                .thenReturn(doctor(2L, Doctor.AvailabilityStatus.NOT_AVAILABLE, null));

        assertFalse(staffService().isDoctorAvailable(2L));
    }

    @Test
    void isDoctorLicenseValid_trueForValidLicense() {
        when(personRepository.findByPersonId(2L))
                .thenReturn(doctor(2L, Doctor.AvailabilityStatus.AVAILABLE, "AB1234567"));

        assertTrue(staffService().isDoctorLicenseValid(2L));
    }

    @Test
    void isDoctorLicenseValid_falseForInvalidLicense() {
        when(personRepository.findByPersonId(2L))
                .thenReturn(doctor(2L, Doctor.AvailabilityStatus.AVAILABLE, "12345678"));

        assertFalse(staffService().isDoctorLicenseValid(2L));
    }

    // ---------- Teacher ----------

    @Test
    void createTeacher_savesAndReturnsTeacher() {
        Teacher teacher = teacher(null, Teacher.AvailabilityStatus.AVAILABLE, null);
        Teacher saved = teacher(3L, Teacher.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.save(teacher)).thenReturn(saved);

        assertEquals(3L, staffService().createTeacher(teacher).getPersonId());
    }

    @Test
    void getAllTeachers_filtersOnlyTeachers() {
        Teacher teacher = teacher(3L, Teacher.AvailabilityStatus.AVAILABLE, null);
        Doctor doctor = doctor(2L, Doctor.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findAll()).thenReturn(List.of(teacher, doctor));

        List<Teacher> result = staffService().getAllTeachers();

        assertEquals(1, result.size());
        assertEquals(teacher, result.get(0));
    }

    @Test
    void getAllTeacherSummaries_returnsProjectionFromRepository() {
        CandidateSummary summary = mock(CandidateSummary.class);
        when(teacherRepository.findAllBy()).thenReturn(List.of(summary));

        assertEquals(List.of(summary), staffService().getAllTeacherSummaries());
    }

    @Test
    void deleteTeacher_deletesById() {
        staffService().deleteTeacher(3L);
        verify(personRepository).deleteById(3L);
    }

    @Test
    void isTeacherAvailable_trueWhenAvailable() {
        when(personRepository.findByPersonId(3L))
                .thenReturn(teacher(3L, Teacher.AvailabilityStatus.AVAILABLE, null));

        assertTrue(staffService().isTeacherAvailable(3L));
    }

    @Test
    void isTeacherLicenseValid_trueForValidLicense() {
        when(personRepository.findByPersonId(3L))
                .thenReturn(teacher(3L, Teacher.AvailabilityStatus.AVAILABLE, "123456"));

        assertTrue(staffService().isTeacherLicenseValid(3L));
    }

    @Test
    void isTeacherLicenseValid_falseForInvalidLicense() {
        when(personRepository.findByPersonId(3L))
                .thenReturn(teacher(3L, Teacher.AvailabilityStatus.AVAILABLE, "1234567"));

        assertFalse(staffService().isTeacherLicenseValid(3L));
    }

    // ---------- Pharmacist ----------

    @Test
    void createPharmacist_savesAndReturnsPharmacist() {
        Pharmacist pharmacist = pharmacist(null, Pharmacist.AvailabilityStatus.AVAILABLE, null);
        Pharmacist saved = pharmacist(4L, Pharmacist.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.save(pharmacist)).thenReturn(saved);

        assertEquals(4L, staffService().createPharmacist(pharmacist).getPersonId());
    }

    @Test
    void getAllPharmacists_filtersOnlyPharmacists() {
        Pharmacist pharmacist = pharmacist(4L, Pharmacist.AvailabilityStatus.AVAILABLE, null);
        Nurse nurse = nurse(1L, Nurse.AvailabilityStatus.AVAILABLE, null);
        when(personRepository.findAll()).thenReturn(List.of(pharmacist, nurse));

        List<Pharmacist> result = staffService().getAllPharmacists();

        assertEquals(1, result.size());
        assertEquals(pharmacist, result.get(0));
    }

    @Test
    void getAllPharmacistSummaries_returnsProjectionFromRepository() {
        CandidateSummary summary = mock(CandidateSummary.class);
        when(pharmacistRepository.findAllBy()).thenReturn(List.of(summary));

        assertEquals(List.of(summary), staffService().getAllPharmacistSummaries());
    }

    @Test
    void deletePharmacist_deletesById() {
        staffService().deletePharmacist(4L);
        verify(personRepository).deleteById(4L);
    }

    @Test
    void isPharmacistAvailable_falseWhenNotAvailable() {
        when(personRepository.findByPersonId(4L))
                .thenReturn(pharmacist(4L, Pharmacist.AvailabilityStatus.NOT_AVAILABLE, null));

        assertFalse(staffService().isPharmacistAvailable(4L));
    }

    @Test
    void isPharmacistLicenseValid_trueForValidLicense() {
        when(personRepository.findByPersonId(4L))
                .thenReturn(pharmacist(4L, Pharmacist.AvailabilityStatus.AVAILABLE, "CD7654321"));

        assertTrue(staffService().isPharmacistLicenseValid(4L));
    }

    @Test
    void isPharmacistLicenseValid_falseForInvalidLicense() {
        when(personRepository.findByPersonId(4L))
                .thenReturn(pharmacist(4L, Pharmacist.AvailabilityStatus.AVAILABLE, "123456"));

        assertFalse(staffService().isPharmacistLicenseValid(4L));
    }
}
