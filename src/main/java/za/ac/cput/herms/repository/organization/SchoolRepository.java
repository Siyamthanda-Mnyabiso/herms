package za.ac.cput.herms.repository.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.organization.School;

import java.util.List;

@Repository
public interface SchoolRepository extends JpaRepository<School, String> {

    @Override
    List<School> findAll();
    School findByOrganizationId(String organizationId);
}
