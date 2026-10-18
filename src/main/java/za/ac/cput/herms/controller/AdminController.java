package za.ac.cput.herms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.Account;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.domain.organization.Organization;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.dto.AdminAccountSummary;
import za.ac.cput.herms.dto.CreateAdminRequest;
import za.ac.cput.herms.dto.OrganizationAccountSummary;
import za.ac.cput.herms.dto.UserAccountSummary;
import za.ac.cput.herms.domain.Person;
import za.ac.cput.herms.service.AuditLogService;
import za.ac.cput.herms.service.IStaffService;
import za.ac.cput.herms.domain.AuditLog;
import za.ac.cput.herms.dto.AuditLogEntry;
import za.ac.cput.herms.dto.AuditLogPage;
import za.ac.cput.herms.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.organization.IHospitalService;
import za.ac.cput.herms.service.organization.IPharmacyService;
import za.ac.cput.herms.service.organization.ISchoolService;
import za.ac.cput.herms.util.Helper;

import java.util.List;
import java.util.Optional;

/** Admin-only (see SecurityConfig): review organization registrations. */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final List<String> ORGANIZATION_ROLES = List.of("hospital", "pharmacy", "school");

    private final AccountRepository accountRepository;
    private final IHospitalService hospitalService;
    private final IPharmacyService pharmacyService;
    private final ISchoolService schoolService;
    private final IStaffService staffService;
    private final AuditLogService auditLog;
    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AdminController(AccountRepository accountRepository,
                           IHospitalService hospitalService,
                           IPharmacyService pharmacyService,
                           ISchoolService schoolService,
                           IStaffService staffService,
                           AuditLogService auditLog,
                           AuditLogRepository auditLogRepository) {
        this.accountRepository = accountRepository;
        this.hospitalService = hospitalService;
        this.pharmacyService = pharmacyService;
        this.schoolService = schoolService;
        this.staffService = staffService;
        this.auditLog = auditLog;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/audit-logs")
    public AuditLogPage listAuditLogs(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size,
                                      @RequestParam(required = false) String action) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100));
        Page<AuditLog> result = (action == null || action.isBlank())
                ? auditLogRepository.findAllByOrderByCreatedAtDescAuditLogIdDesc(pageable)
                : auditLogRepository.findByActionOrderByCreatedAtDescAuditLogIdDesc(action, pageable);
        return new AuditLogPage(
                result.getContent().stream()
                        .map(l -> new AuditLogEntry(l.getAuditLogId(), l.getCreatedAt(), l.getActor(),
                                l.getAction(), l.getTarget(), l.getDetails()))
                        .toList(),
                result.getNumber(),
                result.getTotalPages());
    }

    private String currentAdmin() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication == null ? "unknown" : authentication.getName();
    }

    @GetMapping("/users")
    public List<UserAccountSummary> listUsers() {
        return accountRepository.findAll().stream()
                .map(a -> new UserAccountSummary(a.getAccountId(), a.getEmail(), a.getRole(), a.getStatus(), displayName(a)))
                .toList();
    }

    @GetMapping("/admins")
    public List<AdminAccountSummary> listAdmins() {
        return accountRepository.findByRoleIn(List.of("admin")).stream()
                .map(a -> new AdminAccountSummary(a.getAccountId(), a.getEmail()))
                .toList();
    }

    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody CreateAdminRequest request) {
        if (!Helper.isEmailValid(request.getEmail())) {
            return ResponseEntity.badRequest().body("Invalid email address");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }
        if (Helper.isPasswordTooLong(request.getPassword())) {
            return ResponseEntity.badRequest().body("Password must be at most 72 characters");
        }
        String email = request.getEmail().trim();
        if (accountRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists");
        }
        Account account = accountRepository.save(
                new Account(email, Helper.hashPassword(request.getPassword()), "admin", "admin"));
        auditLog.record(currentAdmin(), "ADMIN_CREATED", "account:" + account.getAccountId(), "email=" + account.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AdminAccountSummary(account.getAccountId(), account.getEmail()));
    }

    @GetMapping("/organizations")
    public List<OrganizationAccountSummary> listOrganizations(@RequestParam(required = false) String status) {
        return accountRepository.findByRoleIn(ORGANIZATION_ROLES).stream()
                .filter(a -> status == null || a.getStatus().equalsIgnoreCase(status))
                .map(this::summarize)
                .toList();
    }

    @PostMapping("/organizations/{accountId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long accountId) {
        return changeStatus(accountId, Account.STATUS_ACTIVE);
    }

    @PostMapping("/organizations/{accountId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long accountId) {
        return changeStatus(accountId, Account.STATUS_REJECTED);
    }

    private ResponseEntity<?> changeStatus(Long accountId, String status) {
        Optional<Account> found = accountRepository.findById(accountId);
        if (found.isEmpty() || !ORGANIZATION_ROLES.contains(found.get().getRole())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization account not found");
        }
        Account account = found.get();
        account.setStatus(status);
        if (!Account.STATUS_ACTIVE.equals(status)) {
            account.setToken(null);
        }
        accountRepository.save(account);
        OrganizationAccountSummary summary = summarize(account);
        auditLog.record(currentAdmin(),
                Account.STATUS_ACTIVE.equals(status) ? "ORGANIZATION_APPROVED" : "ORGANIZATION_REJECTED",
                "account:" + account.getAccountId(), "name=" + summary.name());
        return ResponseEntity.ok(summary);
    }

    private OrganizationAccountSummary summarize(Account account) {
        Organization org = switch (account.getRole()) {
            case "hospital" -> hospitalService.getHospitalById(account.getRefId());
            case "pharmacy" -> pharmacyService.getPharmacyById(account.getRefId());
            case "school" -> schoolService.getSchoolById(account.getRefId());
            default -> null;
        };
        String name = org == null ? account.getEmail() : org.getOrganizationName();
        String phone = org == null || org.getContactDetails() == null ? null : org.getContactDetails().getMobileNumber();
        String address = org == null || org.getAddress() == null ? null
                : String.join(", ", org.getAddress().getStreetName(), org.getAddress().getCity(),
                org.getAddress().getProvince(), org.getAddress().getPostalCode());
        return new OrganizationAccountSummary(account.getAccountId(), account.getRole(), account.getRefId(),
                name, account.getEmail(), phone, address, account.getStatus());
    }

    private String displayName(Account account) {
        try {
            Person person = switch (account.getRole()) {
                case "doctor" -> staffService.getDoctorById(Long.valueOf(account.getRefId()));
                case "nurse" -> staffService.getNurseById(Long.valueOf(account.getRefId()));
                case "teacher" -> staffService.getTeacherById(Long.valueOf(account.getRefId()));
                case "pharmacist" -> staffService.getPharmacistById(Long.valueOf(account.getRefId()));
                default -> null;
            };
            if (person != null && person.getName() != null) {
                String full = (person.getName().getFirstName() + " " + person.getName().getLastName()).trim();
                if (!full.isEmpty()) {
                    return full;
                }
            }
            if (ORGANIZATION_ROLES.contains(account.getRole())) {
                return summarize(account).name();
            }
        } catch (RuntimeException e) {
            // fall through to the email
        }
        return account.getEmail();
    }
}
