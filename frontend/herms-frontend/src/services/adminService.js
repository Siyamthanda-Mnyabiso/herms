import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export async function getOrganizations(status) {
    const response = await api.get(ENDPOINTS.ADMIN_ORGANIZATIONS, { params: status ? { status } : {} });
    return response.data;
}

export async function approveOrganization(accountId) {
    const response = await api.post(ENDPOINTS.ADMIN_ORGANIZATION_APPROVE(accountId));
    return response.data;
}

export async function rejectOrganization(accountId) {
    const response = await api.post(ENDPOINTS.ADMIN_ORGANIZATION_REJECT(accountId));
    return response.data;
}

export async function getAdmins() {
    const response = await api.get(ENDPOINTS.ADMIN_ADMINS);
    return response.data;
}

export async function createAdmin(email, password) {
    const response = await api.post(ENDPOINTS.ADMIN_ADMINS, { email, password });
    return response.data;
}

export async function getUsers() {
    const response = await api.get(ENDPOINTS.ADMIN_USERS);
    return response.data;
}

export async function getAllBookings() {
    const response = await api.get(ENDPOINTS.BOOKINGS_GET_ALL);
    return response.data;
}

export async function getAuditLogs({ page = 0, size = 20, action } = {}) {
    const response = await api.get(ENDPOINTS.ADMIN_AUDIT_LOGS, { params: { page, size, ...(action ? { action } : {}) } });
    return response.data;
}
