package za.ac.cput.herms.service.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.repository.organization.SchoolRepository;

import java.util.List;
@Service
public class SchoolService implements ISchoolService {
    @Autowired
    public final SchoolRepository schoolService;

    public SchoolService(SchoolRepository schoolService) {
        this.schoolService = schoolService;
    }

    @Override
    public List<School> getAll() {
        return schoolService.findAll();
    }

    @Override
    public School getSchoolById(String organizationId) {
        return schoolService.findByOrganizationId(organizationId);
    }

    @Override
    public School Create(School school) {
        return schoolService.save(school);
    }

    @Override
    public School Read(String organizationId) {
        return schoolService.findByOrganizationId(organizationId);
    }

    @Override
    public School Update(School school) {
        return schoolService.save(school);
    }

    @Override
    public boolean Delete(String organizationId) {
        if(schoolService.existsById(organizationId)) {
            schoolService.deleteById(organizationId);
            return true;
        }
        return false;
    }
}
