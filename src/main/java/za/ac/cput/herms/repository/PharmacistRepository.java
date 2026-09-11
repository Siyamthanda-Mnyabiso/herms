package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.herms.domain.Pharmacist;

import java.util.List;

public interface PharmacistRepository extends JpaRepository<Pharmacist, Long> {
    List<CandidateSummary> findAllBy();
}
