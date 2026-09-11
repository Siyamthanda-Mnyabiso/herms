package za.ac.cput.herms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.herms.domain.Teacher;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<CandidateSummary> findAllBy();
}
