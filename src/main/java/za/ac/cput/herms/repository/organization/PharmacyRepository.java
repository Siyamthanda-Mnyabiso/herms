package za.ac.cput.herms.repository.organization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.herms.domain.organization.Pharmacy;

import java.util.List;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, String> {
    List<Pharmacy> findAll();
    Pharmacy findPharmacyById(String organizationId);
}
