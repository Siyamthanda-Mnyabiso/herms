package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.herms.domain.Doctor;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<CandidateSummary> findAllBy();
}
