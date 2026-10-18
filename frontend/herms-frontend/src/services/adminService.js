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
