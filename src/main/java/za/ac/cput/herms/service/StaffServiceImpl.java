
package za.ac.cput.herms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.repository.CandidateSummary;
import za.ac.cput.herms.repository.DoctorRepository;
import za.ac.cput.herms.repository.NurseRepository;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.repository.PharmacistRepository;
import za.ac.cput.herms.repository.TeacherRepository;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.util.Helper;
import za.ac.cput.herms.domain.Teacher;
import za.ac.cput.herms.domain.Pharmacist;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements IStaffService {

    private final PersonRepository personRepository;
    private final NurseRepository nurseRepository;
    private final DoctorRepository doctorRepository;
    private final TeacherRepository teacherRepository;
    private final PharmacistRepository pharmacistRepository;

    @Autowired
    public StaffServiceImpl(PersonRepository personRepository,
                             NurseRepository nurseRepository,
                             DoctorRepository doctorRepository,
                             TeacherRepository teacherRepository,
                             PharmacistRepository pharmacistRepository) {
        this.personRepository = personRepository;
        this.nurseRepository = nurseRepository;
        this.doctorRepository = doctorRepository;
        this.teacherRepository = teacherRepository;
        this.pharmacistRepository = pharmacistRepository;
    }

    @Override
    public Nurse createNurse(Nurse nurse) {
        return personRepository.save(nurse);
    }

    @Override
    public Nurse getNurseById(Long personId) {
        Person person = personRepository.findByPersonId(personId);
        return (person instanceof Nurse) ? (Nurse) person : null;
    }

    @Override
    public List<Nurse> getAllNurses() {
        return personRepository.findAll().stream()
                .filter(person -> person instanceof Nurse)
                .map(person -> (Nurse) person)
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidateSummary> getAllNurseSummaries() {
        return nurseRepository.findAllBy();
    }

    @Override
    public Nurse updateNurse(Nurse nurse) {
        return personRepository.save(nurse);
    }

    @Override
    public void deleteNurse(Long personId) {
        personRepository.deleteById(personId);
    }

    @Override
    public boolean isNurseAvailable(Long personId) {
        Nurse nurse = getNurseById(personId);
        return nurse != null && nurse.getAvailabilityStatus() == Nurse.AvailabilityStatus.AVAILABLE;
    }

    @Override
    public boolean isNurseLicenseValid(Long personId) {
        Nurse nurse = getNurseById(personId);
        return nurse != null && Helper.isNurseLicenseNoValid(nurse.getLicenseNo());
    }

    @Override
    public Doctor createDoctor(Doctor doctor) {
        return personRepository.save(doctor);
    }

    @Override
    public Doctor getDoctorById(Long personId) {
        Person person = personRepository.findByPersonId(personId);
        return (person instanceof Doctor) ? (Doctor) person : null;
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return personRepository.findAll().stream()
                .filter(person -> person instanceof Doctor)
                .map(person -> (Doctor) person)
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidateSummary> getAllDoctorSummaries() {
        return doctorRepository.findAllBy();
    }

    @Override
    public Doctor updateDoctor(Doctor doctor) {
        return personRepository.save(doctor);
    }

    @Override
    public void deleteDoctor(Long personId) {
        personRepository.deleteById(personId);
    }

    @Override
    public boolean isDoctorAvailable(Long personId) {
        Doctor doctor = getDoctorById(personId);
        return doctor != null && doctor.getAvailabilityStatus() == Doctor.AvailabilityStatus.AVAILABLE;
    }

    @Override
    public boolean isDoctorLicenseValid(Long personId) {
        Doctor doctor = getDoctorById(personId);
        return doctor != null && Helper.isDoctorLicenseNoValid(doctor.getLicenseNo());
    }

    @Override
    public Teacher createTeacher(Teacher teacher) {
        return personRepository.save(teacher);
    }

    @Override
    public Teacher getTeacherById(Long personId) {
        Person person = personRepository.findByPersonId(personId);
        return (person instanceof Teacher) ? (Teacher) person : null;
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return personRepository.findAll().stream()
                .filter(person -> person instanceof Teacher)
                .map(person -> (Teacher) person)
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidateSummary> getAllTeacherSummaries() {
        return teacherRepository.findAllBy();
    }

    @Override
    public Teacher updateTeacher(Teacher teacher) {
        return personRepository.save(teacher);
    }

    @Override
    public void deleteTeacher(Long personId) {
        personRepository.deleteById(personId);
    }

    @Override
    public boolean isTeacherAvailable(Long personId) {
        Teacher teacher = getTeacherById(personId);
        return teacher != null && teacher.getAvailabilityStatus() == Teacher.AvailabilityStatus.AVAILABLE;
    }

    @Override
    public boolean isTeacherLicenseValid(Long personId) {
        Teacher teacher = getTeacherById(personId);
        return teacher != null && Helper.isTeacherLicenseNoValid(teacher.getLicenseNo());
    }

    @Override
    public Pharmacist createPharmacist(Pharmacist pharmacist) {
        return personRepository.save(pharmacist);
    }

    @Override
    public Pharmacist getPharmacistById(Long personId) {
        Person person = personRepository.findByPersonId(personId);
        return (person instanceof Pharmacist) ? (Pharmacist) person : null;
    }

    @Override
    public List<Pharmacist> getAllPharmacists() {
        return personRepository.findAll().stream()
                .filter(person -> person instanceof Pharmacist)
                .map(person -> (Pharmacist) person)
                .collect(Collectors.toList());
    }

    @Override
    public List<CandidateSummary> getAllPharmacistSummaries() {
        return pharmacistRepository.findAllBy();
    }

    @Override
    public Pharmacist updatePharmacist(Pharmacist pharmacist) {
        return personRepository.save(pharmacist);
    }

    @Override
    public void deletePharmacist(Long personId) {
        personRepository.deleteById(personId);
    }

    @Override
    public boolean isPharmacistAvailable(Long personId) {
        Pharmacist pharmacist = getPharmacistById(personId);
        return pharmacist != null && pharmacist.getAvailabilityStatus() == Pharmacist.AvailabilityStatus.AVAILABLE;
    }

    @Override
    public boolean isPharmacistLicenseValid(Long personId) {
        Pharmacist pharmacist = getPharmacistById(personId);
        return pharmacist != null && Helper.isPharmacistLicenseNoValid(pharmacist.getLicenseNo());
    }
}