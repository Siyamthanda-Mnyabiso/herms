package za.ac.cput.herms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.Doctor;
import za.ac.cput.herms.domain.Nurse;
import za.ac.cput.herms.domain.Teacher;
import za.ac.cput.herms.domain.Pharmacist;
import za.ac.cput.herms.service.IStaffService;

import java.util.List;

@RestController
@RequestMapping("/herms/staff")
public class StaffController {

    private final IStaffService staffService;

    @Autowired
    public StaffController(IStaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping("/nurse/create")
    public ResponseEntity<Nurse> createNurse(@RequestBody Nurse nurse) {
        return new ResponseEntity<>(staffService.createNurse(nurse), HttpStatus.CREATED);
    }

    @GetMapping("/nurse/read/{personId}")
    public ResponseEntity<Nurse> getNurse(@PathVariable Long personId) {
        Nurse nurse = staffService.getNurseById(personId);
        return (nurse == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(nurse);
    }

    @GetMapping("/nurse/all")
    public ResponseEntity<List<Nurse>> getAllNurses() {
        return ResponseEntity.ok(staffService.getAllNurses());
    }

    @PutMapping("/nurse/update")
    public ResponseEntity<Nurse> updateNurse(@RequestBody Nurse nurse) {
        return ResponseEntity.ok(staffService.updateNurse(nurse));
    }

    @DeleteMapping("/nurse/delete/{personId}")
    public ResponseEntity<Void> deleteNurse(@PathVariable Long personId) {
        staffService.deleteNurse(personId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/nurse/{personId}/available")
    public ResponseEntity<Boolean> isNurseAvailable(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isNurseAvailable(personId));
    }

    @GetMapping("/nurse/{personId}/license-valid")
    public ResponseEntity<Boolean> isNurseLicenseValid(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isNurseLicenseValid(personId));
    }

    @PostMapping("/doctor/create")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return new ResponseEntity<>(staffService.createDoctor(doctor), HttpStatus.CREATED);
    }

    @GetMapping("/doctor/read/{personId}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long personId) {
        Doctor doctor = staffService.getDoctorById(personId);
        return (doctor == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(doctor);
    }

    @GetMapping("/doctor/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(staffService.getAllDoctors());
    }

    @PutMapping("/doctor/update")
    public ResponseEntity<Doctor> updateDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(staffService.updateDoctor(doctor));
    }

    @DeleteMapping("/doctor/delete/{personId}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long personId) {
        staffService.deleteDoctor(personId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor/{personId}/available")
    public ResponseEntity<Boolean> isDoctorAvailable(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isDoctorAvailable(personId));
    }

    @GetMapping("/doctor/{personId}/license-valid")
    public ResponseEntity<Boolean> isDoctorLicenseValid(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isDoctorLicenseValid(personId));
    }

    @PostMapping("/teacher/create")
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher) {
        return new ResponseEntity<>(staffService.createTeacher(teacher), HttpStatus.CREATED);
    }

    @GetMapping("/teacher/read/{personId}")
    public ResponseEntity<Teacher> getTeacher(@PathVariable Long personId) {
        Teacher teacher = staffService.getTeacherById(personId);
        return (teacher == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(teacher);
    }

    @GetMapping("/teacher/all")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(staffService.getAllTeachers());
    }

    @PutMapping("/teacher/update")
    public ResponseEntity<Teacher> updateTeacher(@RequestBody Teacher teacher) {
        return ResponseEntity.ok(staffService.updateTeacher(teacher));
    }

    @DeleteMapping("/teacher/delete/{personId}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long personId) {
        staffService.deleteTeacher(personId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/teacher/{personId}/available")
    public ResponseEntity<Boolean> isTeacherAvailable(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isTeacherAvailable(personId));
    }

    @GetMapping("/teacher/{personId}/license-valid")
    public ResponseEntity<Boolean> isTeacherLicenseValid(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isTeacherLicenseValid(personId));
    }

    @PostMapping("/pharmacist/create")
    public ResponseEntity<Pharmacist> createPharmacist(@RequestBody Pharmacist pharmacist) {
        return new ResponseEntity<>(staffService.createPharmacist(pharmacist), HttpStatus.CREATED);
    }

    @GetMapping("/pharmacist/read/{personId}")
    public ResponseEntity<Pharmacist> getPharmacist(@PathVariable Long personId) {
        Pharmacist pharmacist = staffService.getPharmacistById(personId);
        return (pharmacist == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(pharmacist);
    }

    @GetMapping("/pharmacist/all")
    public ResponseEntity<List<Pharmacist>> getAllPharmacists() {
        return ResponseEntity.ok(staffService.getAllPharmacists());
    }

    @PutMapping("/pharmacist/update")
    public ResponseEntity<Pharmacist> updatePharmacist(@RequestBody Pharmacist pharmacist) {
        return ResponseEntity.ok(staffService.updatePharmacist(pharmacist));
    }

    @DeleteMapping("/pharmacist/delete/{personId}")
    public ResponseEntity<Void> deletePharmacist(@PathVariable Long personId) {
        staffService.deletePharmacist(personId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pharmacist/{personId}/available")
    public ResponseEntity<Boolean> isPharmacistAvailable(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isPharmacistAvailable(personId));
    }

    @GetMapping("/pharmacist/{personId}/license-valid")
    public ResponseEntity<Boolean> isPharmacistLicenseValid(@PathVariable Long personId) {
        return ResponseEntity.ok(staffService.isPharmacistLicenseValid(personId));
    }
}