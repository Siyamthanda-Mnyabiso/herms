package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.herms.domain.Nurse;

import java.util.List;

public interface NurseRepository extends JpaRepository<Nurse, Long> {
    List<CandidateSummary> findAllBy();
}
