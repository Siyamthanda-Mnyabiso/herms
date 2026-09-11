import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export async function login(email, password) {
    const response = await api.post(ENDPOINTS.LOGIN, { email, password });
    return response.data;
}

export async function registerProfessional({ role, firstName, lastName, email, phoneNumber, password, licenseNo }) {
    const response = await api.post(ENDPOINTS.REGISTER_PROFESSIONAL, {
        role,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        licenseNo,
    });
    return response.data;
}

export async function logout() {
    await api.post(ENDPOINTS.LOGOUT);
}
