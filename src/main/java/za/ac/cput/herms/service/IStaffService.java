package za.ac.cput.herms.service;

import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Teacher;
import za.ac.cput.herms.domain.Pharmacist;
import za.ac.cput.herms.repository.CandidateSummary;

import java.util.List;

public interface IStaffService {

    Nurse createNurse(Nurse nurse);
    Nurse getNurseById(Long personId);
    List<Nurse> getAllNurses();
    List<CandidateSummary> getAllNurseSummaries();
    Nurse updateNurse(Nurse nurse);
    void deleteNurse(Long personId);
    boolean isNurseAvailable(Long personId);
    boolean isNurseLicenseValid(Long personId);

    Doctor createDoctor(Doctor doctor);
    Doctor getDoctorById(Long personId);
    List<Doctor> getAllDoctors();
    List<CandidateSummary> getAllDoctorSummaries();
    Doctor updateDoctor(Doctor doctor);
    void deleteDoctor(Long personId);
    boolean isDoctorAvailable(Long personId);
    boolean isDoctorLicenseValid(Long personId);

    Teacher createTeacher(Teacher teacher);
    Teacher getTeacherById(Long personId);
    List<Teacher> getAllTeachers();
    List<CandidateSummary> getAllTeacherSummaries();
    Teacher updateTeacher(Teacher teacher);
    void deleteTeacher(Long personId);
    boolean isTeacherAvailable(Long personId);
    boolean isTeacherLicenseValid(Long personId);

    Pharmacist createPharmacist(Pharmacist pharmacist);
    Pharmacist getPharmacistById(Long personId);
    List<Pharmacist> getAllPharmacists();
    List<CandidateSummary> getAllPharmacistSummaries();
    Pharmacist updatePharmacist(Pharmacist pharmacist);
    void deletePharmacist(Long personId);
    boolean isPharmacistAvailable(Long personId);
    boolean isPharmacistLicenseValid(Long personId);
}