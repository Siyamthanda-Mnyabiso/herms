package za.ac.cput.herms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Account {

    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_REJECTED = "REJECTED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String refId;

    private String token;

    // Null on rows created before approval existed; treated as ACTIVE.
    private String status;

    protected Account() {
    }

    public Account(String email, String passwordHash, String role, String refId) {
        this(email, passwordHash, role, refId, STATUS_ACTIVE);
    }

    public Account(String email, String passwordHash, String role, String refId, String status) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.refId = refId;
        this.status = status;
    }

    public Long getAccountId() {
        return accountId;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRole() {
        return role;
    }

    public String getRefId() {
        return refId;
    }

    public String getToken() {
        return token;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getStatus() {
        return status == null ? STATUS_ACTIVE : status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
