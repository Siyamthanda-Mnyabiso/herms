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
import za.ac.cput.herms.dto.OrganizationAccountSummary;
import za.ac.cput.herms.repository.AccountRepository;
import za.ac.cput.herms.service.organization.IHospitalService;
import za.ac.cput.herms.service.organization.IPharmacyService;
import za.ac.cput.herms.service.organization.ISchoolService;

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

    @Autowired
    public AdminController(AccountRepository accountRepository,
                           IHospitalService hospitalService,
                           IPharmacyService pharmacyService,
                           ISchoolService schoolService) {
        this.accountRepository = accountRepository;
        this.hospitalService = hospitalService;
        this.pharmacyService = pharmacyService;
        this.schoolService = schoolService;
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
        return ResponseEntity.ok(summarize(account));
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
}
