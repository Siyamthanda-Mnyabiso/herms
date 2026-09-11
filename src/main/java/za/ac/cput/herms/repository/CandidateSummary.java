package za.ac.cput.herms.repository;

public interface CandidateSummary {
    Long getPersonId();
    String getQualification();
    String getSpecialization();
    int getYearsOfExperience();
    String getAvailabilityStatus();
    String getLicenseNo();
    AddressSummary getAddress();

    interface AddressSummary {
        String getCity();
        String getProvince();
    }
}
