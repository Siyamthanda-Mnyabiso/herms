package za.ac.cput.herms.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findAllByOrderByCreatedAtDescAuditLogIdDesc(Pageable pageable);
    Page<AuditLog> findByActionOrderByCreatedAtDescAuditLogIdDesc(String action, Pageable pageable);
}
