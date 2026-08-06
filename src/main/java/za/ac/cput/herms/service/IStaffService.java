package za.ac.cput.herms.service;

import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;

import java.util.List;

public interface IStaffService {

    Nurse createNurse(Nurse nurse);
    Nurse getNurseById(Long personId);
    List<Nurse> getAllNurses();
    Nurse updateNurse(Nurse nurse);
    void deleteNurse(Long personId);
    boolean isNurseAvailable(Long personId);
    boolean isNurseLicenseValid(Long personId);

    Doctor createDoctor(Doctor doctor);
    Doctor getDoctorById(Long personId);
    List<Doctor> getAllDoctors();
    Doctor updateDoctor(Doctor doctor);
    void deleteDoctor(Long personId);
    boolean isDoctorAvailable(Long personId);
    boolean isDoctorLicenseValid(Long personId);
}