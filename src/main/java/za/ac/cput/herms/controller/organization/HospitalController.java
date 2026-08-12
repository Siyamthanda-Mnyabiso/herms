package za.ac.cput.herms.controller.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.organization.Hospital;
import za.ac.cput.herms.service.organization.IHospitalService;

import java.util.List;

@RestController
@RequestMapping
public class HospitalController {
    public final IHospitalService hospitalController;

    @Autowired
    public HospitalController(IHospitalService hospitalController){
        this.hospitalController = hospitalController;
    }

    @PostMapping("/Create/v1/hospital")
    public Hospital createHospital(@RequestBody Hospital hospital){
        return hospitalController.Create(hospital);
    }

    @GetMapping("/Read(organizationId)ead/v1/hospital")
    public Hospital readHospital(@PathVariable String organizationId){
        return hospitalController.Read(organizationId);
    }

    @PutMapping("/update/v1/hospital")
    public Hospital updateHospital(@RequestBody Hospital hospital){
        return hospitalController.Update(hospital);
    }

    @DeleteMapping("/delete(organizationId)/v1/hospital")
    public boolean deleteHospital(@PathVariable String organizationId){
        return hospitalController.Delete(organizationId);
    }

    @GetMapping("/getAll/v1/hospital")
    public List<Hospital> findAll(){
        return hospitalController.getAll();
    }

    @GetMapping("/getHospitalById(organizationId)/v1/hospital")
    public Hospital findHospitalById(@PathVariable String organizationId){
        return hospitalController.getHospitalById(organizationId);
    }


}
