package za.ac.cput.herms.service.organization;

import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.service.IService;

import java.util.List;

public interface IHospitalService extends IService<Hospital, String> {
    List<Hospital> getAll();
    Hospital getHospitalById(String organizationId);
}
