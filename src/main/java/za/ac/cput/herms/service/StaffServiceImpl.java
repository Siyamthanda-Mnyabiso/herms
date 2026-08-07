
package za.ac.cput.herms.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.repository.PersonRepository;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.util.Helper;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements IStaffService {

    private final PersonRepository personRepository;

    @Autowired
    public StaffServiceImpl(PersonRepository personRepository) {
        this.personRepository= personRepository;
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
}