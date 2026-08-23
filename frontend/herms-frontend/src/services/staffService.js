import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export async function getProfessionalsByType(profession) {
    let endpoint;

    switch (profession) {
        case "nurse":
            endpoint = ENDPOINTS.STAFF_NURSE_ALL;
            break;
        case "doctor":
            endpoint = ENDPOINTS.STAFF_DOCTOR_ALL;
            break;
        case "teacher":
            endpoint = ENDPOINTS.STAFF_TEACHER_ALL;
            break;
        case "pharmacist":
            endpoint = ENDPOINTS.STAFF_PHARMACIST_ALL;
            break;
        default:
            return [];
    }

    const response = await api.get(endpoint);
    return response.data;
}