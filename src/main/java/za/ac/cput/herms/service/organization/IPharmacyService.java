package za.ac.cput.herms.service.organization;

import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.service.IService;

import java.util.List;

public interface IPharmacyService extends IService<Pharmacy, String> {
    List<Pharmacy> getAll();
    Pharmacy getPharmacyById(String organizationId);
}
