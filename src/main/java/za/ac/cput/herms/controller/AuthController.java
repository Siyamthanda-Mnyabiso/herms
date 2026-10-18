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
import za.ac.cput.herms.factory.AddressFactory;
import za.ac.cput.herms.factory.ContactDetailsFactory;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.service.organization.IHospitalService;
import za.ac.cput.herms.service.organization.IPharmacyService;
import za.ac.cput.herms.service.organization.ISchoolService;
import za.ac.cput.herms.util.Helper;

import java.util.Map;
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
        String licenseNo = request.getLicenseNo();
        Person person;
        switch (role) {
            case "doctor":
                if (!Helper.isDoctorLicenseNoValid(licenseNo)) {
                    return ResponseEntity.badRequest().body("Invalid or missing doctor license number");
                }
                person = staffService.createDoctor(new Doctor.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE)
                        .setLicenseNo(licenseNo)
                        .build());
                break;
            case "nurse":
                if (!Helper.isNurseLicenseNoValid(licenseNo)) {
                    return ResponseEntity.badRequest().body("Invalid or missing nurse license number");
                }
                person = staffService.createNurse(new Nurse.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Nurse.AvailabilityStatus.AVAILABLE)
                        .setLicenseNo(licenseNo)
                        .build());
                break;
            case "teacher":
                if (!Helper.isTeacherLicenseNoValid(licenseNo)) {
                    return ResponseEntity.badRequest().body("Invalid or missing teacher license number");
                }
                person = staffService.createTeacher(new Teacher.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Teacher.AvailabilityStatus.AVAILABLE)
                        .setLicenseNo(licenseNo)
                        .build());
                break;
            case "pharmacist":
                if (!Helper.isPharmacistLicenseNoValid(licenseNo)) {
                    return ResponseEntity.badRequest().body("Invalid or missing pharmacist license number");
                }
                person = staffService.createPharmacist(new Pharmacist.Builder()
                        .setName(name)
                        .setContactDetails(contactDetails)
                        .setAvailabilityStatus(Pharmacist.AvailabilityStatus.AVAILABLE)
                        .setLicenseNo(licenseNo)
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
        if (Helper.isNullOrEmpty(request.getOrganizationName()) || request.getOrganizationName().isBlank()) {
            return ResponseEntity.badRequest().body("Organization name is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }
        if (Helper.isNullOrEmpty(request.getOrganizationType()) || request.getOrganizationType().isBlank()) {
            return ResponseEntity.badRequest().body("Organization type is required");
        }
        if (Helper.isEmailValid(request.getEmail()) && accountRepository.existsByEmail(request.getEmail().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists");
        }

        ContactDetails contactDetails;
        Address address;
        try {
            contactDetails = ContactDetailsFactory.createContactDetails(request.getPhoneNumber(), request.getEmail());
            address = AddressFactory.createAddress(request.getStreetName(), request.getPostalCode(),
                    request.getCity(), request.getProvince());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        String role = request.getRole() == null ? "" : request.getRole().toLowerCase();
        String organizationId = UUID.randomUUID().toString();
        String name = request.getOrganizationName().trim();

        try {
            switch (role) {
                case "hospital": {
                    Hospital.Builder builder = new Hospital.Builder()
                            .setOrganizationId(organizationId)
                            .setOrganizationName(name)
                            .setContactDetails(contactDetails)
                            .setHospitalType(request.getOrganizationType())
                            .setTypeOfHospital(Hospital.HospitalType.valueOf(request.getSector()));
                    builder.setAddress(address);
                    hospitalService.Create(builder.build());
                    break;
                }
                case "pharmacy": {
                    Pharmacy.Builder builder = new Pharmacy.Builder()
                            .setOrganizationId(organizationId)
                            .setOrganizationName(name)
                            .setContactDetails(contactDetails)
                            .setPharmacyType(request.getOrganizationType());
                    builder.setAddress(address);
                    pharmacyService.Create(builder.build());
                    break;
                }
                case "school": {
                    School.Builder builder = new School.Builder()
                            .setOrganizationId(organizationId)
                            .setOrganizationName(name)
                            .setContactDetails(contactDetails)
                            .setSchoolType(request.getOrganizationType())
                            .setType(School.Type.valueOf(request.getSector()))
                            .setSchoolTypeOfSchool(School.SchoolType.valueOf(request.getSchoolLevel()));
                    builder.setAddress(address);
                    schoolService.Create(builder.build());
                    break;
                }
                default:
                    return ResponseEntity.badRequest().body("Unknown organization role: " + request.getRole());
            }
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest().body("Invalid organization sector or school level");
        }

        accountRepository.save(new Account(request.getEmail().trim(),
                Helper.hashPassword(request.getPassword()),
                role,
                organizationId,
                Account.STATUS_PENDING));

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of("message", "Registration received. An admin will review your organization before you can log in."));
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
        if (Account.STATUS_PENDING.equals(account.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your registration is awaiting admin approval");
        }
        if (Account.STATUS_REJECTED.equals(account.getStatus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your registration was not approved");
        }
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
