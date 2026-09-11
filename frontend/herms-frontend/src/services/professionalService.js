import api from "../api/axios";

function basePath(profession) {
    return `/staff/${profession}`;
}

export async function getProfile(profession, personId) {
    const response = await api.get(`${basePath(profession)}/read/${personId}`);
    return response.data;
}

export async function updateProfile(profession, professional) {
    const response = await api.put(`${basePath(profession)}/update`, professional);
    return response.data;
}

export async function deleteProfile(profession, personId) {
    await api.delete(`${basePath(profession)}/delete/${personId}`);
}

export async function checkAvailability(profession, personId) {
    const response = await api.get(`${basePath(profession)}/${personId}/available`);
    return response.data;
}

export async function checkLicenseValid(profession, personId) {
    const response = await api.get(`${basePath(profession)}/${personId}/license-valid`);
    return response.data;
}
