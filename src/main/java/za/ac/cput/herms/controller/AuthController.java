package za.ac.cput.herms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.*;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.dto.AuthResponse;
import za.ac.cput.herms.dto.LoginRequest;
import za.ac.cput.herms.dto.RegisterOrganizationRequest;
import za.ac.cput.herms.dto.RegisterProfessionalRequest;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.service.organization.IHospitalService;
import za.ac.cput.herms.service.organization.IPharmacyService;
import za.ac.cput.herms.service.organization.ISchoolService;
import za.ac.cput.herms.util.Helper;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final IStaffService staffService;
    private final IHospitalService hospitalService;
    private final IPharmacyService pharmacyService;
    private final ISchoolService schoolService;

    @Autowired
    public AuthController(AccountRepository accountRepository,
                           IStaffService staffService,
                           IHospitalService hospitalService,
                           IPharmacyService pharmacyService,
                           ISchoolService schoolService) {
        this.accountRepository = accountRepository;
        this.staffService = staffService;
        this.hospitalService = hospitalService;
        this.pharmacyService = pharmacyService;
        this.schoolService = schoolService;
    }

    @PostMapping("/register/professional")
    public ResponseEntity<?> registerProfessional(@RequestBody RegisterProfessionalRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists");
        }

        Name name = new Name.Builder()
                .setFirstName(request.getFirstName())
                .setLastName(request.getLastName())
                .build();
        ContactDetails contactDetails = new ContactDetails.Builder()
                .setEmail(request.getEmail())
                .setMobileNumber(request.getPhoneNumber())
                .build();

        String role = request.getRole() == null ? "" : request.getRole().toLowerCase();
        Person person;
        switch (role) {
            case "doctor":
                person = staffService.createDoctor(new Doctor.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE)
                        .build());
                break;
            case "nurse":
                person = staffService.createNurse(new Nurse.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                        .build());
                break;
            case "teacher":
                person = staffService.createTeacher(new Teacher.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Teacher.AvailabilityStatus.AVAILABLE)
                        .build());
                break;
            case "pharmacist":
                person = staffService.createPharmacist(new Pharmacist.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Pharmacist.AvailabilityStatus.AVAILABLE)
                        .build());
                break;
            default:
                return ResponseEntity.badRequest().body("Unknown professional role: " + request.getRole());
        }

        Account account = new Account(request.getEmail(),
                Helper.hashPassword(request.getPassword()),
                role,
                String.valueOf(person.getPersonId()));
        account.setToken(UUID.randomUUID().toString());
        accountRepository.save(account);

        String fullName = (request.getFirstName() + " " + request.getLastName()).trim();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(account.getToken(), role, account.getRefId(), fullName, request.getEmail()));
    }

    @PostMapping("/register/organization")
    public ResponseEntity<?> registerOrganization(@RequestBody RegisterOrganizationRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists");
        }

        ContactDetails contactDetails = new ContactDetails.Builder()
                .setEmail(request.getEmail())
                .build();
        String organizationId = UUID.randomUUID().toString();
        String role = request.getRole() == null ? "" : request.getRole().toLowerCase();
        String refId;

        switch (role) {
            case "hospital": {
                Hospital hospital = hospitalService.Create(new Hospital.Builder()
                        .setOrganizationId(organizationId)
                        .setOrganizationName(request.getOrganizationName())
                        .setContactDetails(contactDetails)
                        .setHospitalType("General")
                        .setTypeOfHospital(Hospital.HospitalType.Public)
                        .build());
                refId = hospital.getOrganizationId();
                break;
            }
            case "pharmacy": {
                Pharmacy pharmacy = pharmacyService.Create(new Pharmacy.Builder()
                        .setOrganizationId(organizationId)
                        .setOrganizationName(request.getOrganizationName())
                        .setContactDetails(contactDetails)
                        .setPharmacyType("Retail")
                        .build());
                refId = pharmacy.getOrganizationId();
                break;
            }
            case "school": {
                School school = schoolService.Create(new School.Builder()
                        .setOrganizationId(organizationId)
                        .setOrganizationName(request.getOrganizationName())
                        .setContactDetails(contactDetails)
                        .setSchoolType("General")
                        .setType(School.Type.Public)
                        .setSchoolTypeOfSchool(School.SchoolType.Primary)
                        .build());
                refId = school.getOrganizationId();
                break;
            }
            default:
                return ResponseEntity.badRequest().body("Unknown organization role: " + request.getRole());
        }

        Account account = new Account(request.getEmail(),
                Helper.hashPassword(request.getPassword()),
                role,
                refId);
        account.setToken(UUID.randomUUID().toString());
        accountRepository.save(account);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(account.getToken(), role, refId, request.getOrganizationName(), request.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Account> found = request.getEmail() == null
                ? Optional.empty()
                : accountRepository.findByEmail(request.getEmail());

        if (found.isEmpty() || !Helper.matchesPassword(request.getPassword(), found.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        Account account = found.get();
        account.setToken(UUID.randomUUID().toString());
        accountRepository.save(account);

        return ResponseEntity.ok(new AuthResponse(
                account.getToken(), account.getRole(), account.getRefId(), displayNameFor(account), account.getEmail()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            accountRepository.findByToken(token).ifPresent(account -> {
                account.setToken(null);
                accountRepository.save(account);
            });
        }
        return ResponseEntity.noContent().build();
    }

    private String displayNameFor(Account account) {
        try {
            switch (account.getRole()) {
                case "doctor":
                    return fullName(staffService.getDoctorById(Long.valueOf(account.getRefId())));
                case "nurse":
                    return fullName(staffService.getNurseById(Long.valueOf(account.getRefId())));
                case "teacher":
                    return fullName(staffService.getTeacherById(Long.valueOf(account.getRefId())));
                case "pharmacist":
                    return fullName(staffService.getPharmacistById(Long.valueOf(account.getRefId())));
                case "hospital": {
                    Hospital hospital = hospitalService.getHospitalById(account.getRefId());
                    return hospital != null ? hospital.getOrganizationName() : account.getEmail();
                }
                case "pharmacy": {
                    Pharmacy pharmacy = pharmacyService.getPharmacyById(account.getRefId());
                    return pharmacy != null ? pharmacy.getOrganizationName() : account.getEmail();
                }
                case "school": {
                    School school = schoolService.getSchoolById(account.getRefId());
                    return school != null ? school.getOrganizationName() : account.getEmail();
                }
                default:
                    return account.getEmail();
            }
        } catch (RuntimeException e) {
            return account.getEmail();
        }
    }

    private static String fullName(Person person) {
        if (person == null || person.getName() == null) {
            return "";
        }
        Name name = person.getName();
        return ((name.getFirstName() == null ? "" : name.getFirstName()) + " " +
                (name.getLastName() == null ? "" : name.getLastName())).trim();
    }
}
