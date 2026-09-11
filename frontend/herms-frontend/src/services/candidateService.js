import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

const PROFESSION_ENDPOINTS = {
    nurse: ENDPOINTS.STAFF_NURSE_ALL,
    doctor: ENDPOINTS.STAFF_DOCTOR_ALL,
    teacher: ENDPOINTS.STAFF_TEACHER_ALL,
    pharmacist: ENDPOINTS.STAFF_PHARMACIST_ALL,
};

// Backend returns the anonymized CandidateSummary projection (no name/contactDetails) -
// this maps it into the display shape the candidate-browsing UI expects.
function mapCandidate(person, profession) {
    return {
        id: person.personId,
        name: `Candidate #${String(person.personId).padStart(3, "0")}`,
        profession_number: person.licenseNo ?? "—",
        qualification: person.qualification ?? "—",
        skills: person.specialization ?? "—",
        availabilityStatus: person.availabilityStatus ?? "NOT_AVAILABLE",
        availability: person.availabilityStatus === "AVAILABLE" ? "Available" : "Not Available",
        location: person.address?.city ?? "—",
        province: person.address?.province ?? "—",
        experience: person.yearsOfExperience ? `${person.yearsOfExperience} years` : "—",
        profession,
    };
}

export async function getCandidatesByProfession(profession) {
    const endpoint = PROFESSION_ENDPOINTS[profession];
    if (!endpoint) {
        return [];
    }
    const response = await api.get(endpoint);
    return response.data.map((person) => mapCandidate(person, profession));
}

export async function getAllCandidates() {
    const professions = Object.keys(PROFESSION_ENDPOINTS);
    const results = await Promise.all(professions.map(getCandidatesByProfession));
    return results.flat();
}
