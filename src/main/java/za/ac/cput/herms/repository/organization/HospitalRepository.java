package za.ac.cput.herms.repository.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.organization.Hospital;

import java.util.List;
@Repository
public interface HospitalRepository extends JpaRepository<Hospital, String> {

    @Override
    List<Hospital> findAll();
    Hospital findHospitalById(String organizationId);

}
