package za.ac.cput.herms.service.organization;

import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.service.IService;

import java.util.List;

public interface ISchoolService extends IService<School, String> {
    List<School> getAll();
    School getSchoolById(String organizationId);
}
