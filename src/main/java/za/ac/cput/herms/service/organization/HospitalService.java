package za.ac.cput.herms.service.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.repository.organization.HospitalRepository;

import java.util.List;

@Service
public class HospitalService implements IHospitalService{
    @Autowired
    private final HospitalRepository hospitalService;

    public HospitalService(HospitalRepository hospitalService) {
        this.hospitalService = hospitalService;
    }

    @Override
    public Hospital Create(Hospital hospital) {
        return hospitalService.save(hospital);
    }

    @Override
    public List<Pharmacy> Read(String organizationId) {
        return hospitalService.findHospitalById(organizationId);
    }

    @Override
    public Hospital Update(Hospital hospital) {
        return hospitalService.save(hospital);
    }

    @Override
    public boolean Delete(String organizationId) {
        if(hospitalService.existsById(organizationId)){
            hospitalService.deleteById(organizationId);
            return true;
    }
    return false;
}
    @Override
    public List<Hospital> getAll() {
        return List.of();
    }

    @Override
    public Hospital getHospitalById(String organization){

        return hospitalService.findHospitalById(organization);
    }

}
