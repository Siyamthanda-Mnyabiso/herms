package za.ac.cput.herms.controller.organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.herms.domain.organization.Pharmacy;
import za.ac.cput.herms.service.organization.IPharmacyService;

import java.util.List;

@RestController
@RequestMapping
public class PharmacyController {
    public final IPharmacyService pharmacyController;

    @Autowired
    public PharmacyController(IPharmacyService pharmacyController) {
        this.pharmacyController = pharmacyController;
    }

    @PostMapping("/create")
    public Pharmacy createPharmacy(@RequestBody Pharmacy pharmacy){
        return pharmacyController.Create(pharmacy);
    }

    @GetMapping("/Read(organizationId)")
    public Pharmacy ReadPharmacy(@PathVariable String organizationId){
        return pharmacyController.Read(organizationId);
    }

    @PutMapping("/update")
    public void updatePharmacy(@RequestBody Pharmacy pharmacy){
        pharmacyController.Update(pharmacy);
    }

    @DeleteMapping("/delete(organizationId)")
    public void deletePharmacy(@PathVariable String organizationId){
        pharmacyController.Delete(organizationId);
    }

    @GetMapping("/getAll")
    public List<Pharmacy> findAll(){
        return pharmacyController.getAll();
    }

    @GetMapping("/getPharmacyById")
    public Pharmacy getPharmacyById(@PathVariable String organizationId){
        return pharmacyController.getPharmacyById(organizationId);
    }
}
