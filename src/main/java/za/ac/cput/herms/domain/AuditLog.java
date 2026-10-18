package za.ac.cput.herms.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditLogId;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private String actor;

    @Column(nullable = false)
    private String action;

    private String target;

    @Column(length = 500)
    private String details;

    protected AuditLog() {
    }

    public AuditLog(String actor, String action, String target, String details) {
        this.createdAt = Instant.now();
        this.actor = actor;
        this.action = action;
        this.target = target;
        this.details = details;
    }

    public Long getAuditLogId() {
        return auditLogId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getActor() {
        return actor;
    }

    public String getAction() {
        return action;
    }

    public String getTarget() {
        return target;
    }

    public String getDetails() {
        return details;
    }
}
