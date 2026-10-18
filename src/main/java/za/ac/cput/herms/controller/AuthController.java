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
import za.ac.cput.herms.dto.ForgotPasswordRequest;
import za.ac.cput.herms.dto.RegisterOrganizationRequest;
import za.ac.cput.herms.dto.ResetPasswordRequest;
import za.ac.cput.herms.dto.RegisterProfessionalRequest;
import za.ac.cput.herms.factory.AddressFactory;
import za.ac.cput.herms.factory.ContactDetailsFactory;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.AuditLogService;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.service.PasswordResetService;
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
    private final AuditLogService auditLog;
    private final PasswordResetService passwordReset;

    @Autowired
    public AuthController(AccountRepository accountRepository,
                           IStaffService staffService,
                           IHospitalService hospitalService,
                           IPharmacyService pharmacyService,
                           ISchoolService schoolService,
                           AuditLogService auditLog,
                           PasswordResetService passwordReset) {
        this.accountRepository = accountRepository;
        this.staffService = staffService;
        this.hospitalService = hospitalService;
        this.pharmacyService = pharmacyService;
        this.schoolService = schoolService;
        this.auditLog = auditLog;
        this.passwordReset = passwordReset;
    }

    @PostMapping("/register/professional")
    public ResponseEntity<?> registerProfessional(@RequestBody RegisterProfessionalRequest request) {
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        if (Helper.isPasswordTooLong(request.getPassword())) {
            return ResponseEntity.badRequest().body("Password must be at most 72 characters");
        }
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
        auditLog.record(request.getEmail(), "REGISTER_PROFESSIONAL", "account:" + account.getAccountId(), "role=" + role);

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
        if (Helper.isPasswordTooLong(request.getPassword())) {
            return ResponseEntity.badRequest().body("Password must be at most 72 characters");
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

        Account saved = accountRepository.save(new Account(request.getEmail().trim(),
                Helper.hashPassword(request.getPassword()),
                role,
                organizationId,
                Account.STATUS_PENDING));
        auditLog.record(saved.getEmail(), "REGISTER_ORGANIZATION", "account:" + saved.getAccountId(),
                "role=" + role + ", name=" + name);

        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(Map.of("message", "Registration received. An admin will review your organization before you can log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Account> found = request.getEmail() == null
                ? Optional.empty()
                : accountRepository.findByEmail(request.getEmail());

        if (found.isEmpty() || !Helper.matchesPassword(request.getPassword(), found.get().getPasswordHash())) {
            auditLog.record(request.getEmail(), "LOGIN_FAILED", null, null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        Account account = found.get();
        if (Helper.isLegacyHash(account.getPasswordHash())) {
            account.setPasswordHash(Helper.hashPassword(request.getPassword()));
        }
        if (!Account.STATUS_ACTIVE.equals(account.getStatus())) {
            auditLog.record(account.getEmail(), "LOGIN_BLOCKED", "account:" + account.getAccountId(),
                    "status=" + account.getStatus());
        }
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
        auditLog.record(account.getEmail(), "LOGIN", "account:" + account.getAccountId(), "role=" + account.getRole());

        return ResponseEntity.ok(new AuthResponse(
                account.getToken(), account.getRole(), account.getRefId(), displayNameFor(account), account.getEmail()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordReset.requestReset(request.getEmail());
        // Same answer whether or not the email has an account.
        return ResponseEntity.accepted()
                .body(Map.of("message", "If that email has an account, a reset link is on its way."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }
        if (Helper.isPasswordTooLong(request.getPassword())) {
            return ResponseEntity.badRequest().body("Password must be at most 72 characters");
        }
        if (!passwordReset.resetPassword(request.getToken(), request.getPassword())) {
            return ResponseEntity.badRequest().body("This reset link is invalid or has expired");
        }
        return ResponseEntity.ok(Map.of("message", "Password updated. You can now log in."));
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
