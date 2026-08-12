package za.ac.cput.herms.controller.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.organization.School;
import za.ac.cput.herms.service.organization.ISchoolService;

import java.util.List;

@RestController
@RequestMapping
public class SchoolController {

    public final ISchoolService schoolController;

    @Autowired
    public SchoolController(ISchoolService schoolController){
        this.schoolController = schoolController;
    }

    @PostMapping("/create/v1/school")
    public School createSchool(@RequestBody School school){
        return schoolController.Create(school);
    }

    @GetMapping("/Read(organizationId)/v1/school")
    public School readSchool(@PathVariable String organizationId){
        return schoolController.Read(organizationId);
    }

    @PutMapping("/update/v1/school")
    public School updateSchool(@RequestBody School school){
        return schoolController.Update(school);
    }

    @DeleteMapping("/delete(organizationId)/v1/school")
    public boolean deleteSchool(@PathVariable String organizationId){
        return schoolController.Delete(organizationId);
    }

    @GetMapping("/getAll")
    public List<School> findAll(){
        return schoolController.getAll();

    }

    @GetMapping("/getSchoolById(organizationId)")
    public School getSchoolById(@PathVariable String organizationId){
        return schoolController.getSchoolById(organizationId);
    }

}
