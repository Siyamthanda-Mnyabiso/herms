package za.ac.cput.herms.service.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.Bookings;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.repository.organization.PharmacyRepository;

import java.util.List;

@Service
public class PharmacyService  implements IPharmacyService {
    @Autowired
    private final PharmacyRepository pharmacyService;

    public PharmacyService(PharmacyRepository pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    @Override
    public List<Pharmacy> getAll() {
        return List.of();
    }

    @Override
    public Pharmacy getPharmacyById(String organizationId) {
        return pharmacyService.findPharmacyByOrganizationId(organizationId);
    }

    @Override
    public Pharmacy Create(Pharmacy pharmacy) {
        return pharmacyService.save(pharmacy);
    }

    @Override
    public Pharmacy Read(String organizationId) {
        return pharmacyService.findPharmacyByOrganizationId(organizationId);
    }

    @Override
    public Pharmacy Update(Pharmacy pharmacy) {
        return pharmacyService.save(pharmacy);
    }

    @Override
    public boolean Delete(String organizationId) {
        if(pharmacyService.existsById(organizationId)) {
            pharmacyService.deleteById(organizationId);
            return true;
        }
        return false;
    }
}
