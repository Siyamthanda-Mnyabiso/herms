import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export async function login(email, password) {
    const response = await api.post(ENDPOINTS.LOGIN, { email, password });
    return response.data;
}

export async function registerProfessional({ role, firstName, lastName, email, phoneNumber, password }) {
    const response = await api.post(ENDPOINTS.REGISTER_PROFESSIONAL, {
        role,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });
    return response.data;
}

export async function registerOrganization({ role, organizationName, email, password }) {
    const response = await api.post(ENDPOINTS.REGISTER_ORGANIZATION, {
        role,
        organizationName,
        email,
        password,
    });
    return response.data;
}

export async function logout() {
    await api.post(ENDPOINTS.LOGOUT);
}
