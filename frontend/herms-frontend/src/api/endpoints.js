export const ENDPOINTS = {

    LOGIN: "/auth/login",
    REGISTER_PROFESSIONAL: "/auth/register/professional",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REGISTER_ORGANIZATION: "/auth/register/organization",

    ADMIN_AUDIT_LOGS: "/admin/audit-logs",
    ADMIN_USERS: "/admin/users",
    ADMIN_ADMINS: "/admin/admins",
    ADMIN_ORGANIZATIONS: "/admin/organizations",
    ADMIN_ORGANIZATION_APPROVE: (id) => `/admin/organizations/${id}/approve`,
    ADMIN_ORGANIZATION_REJECT: (id) => `/admin/organizations/${id}/reject`,

    BOOKINGS_CREATE: "/Bookings/create",
    BOOKINGS_READ: (id) => `/Bookings/Read/${id}`,
    BOOKINGS_UPDATE: "/Bookings/Update",
    BOOKINGS_DELETE: (id) => `/Bookings/Delete/${id}`,
    BOOKINGS_GET_ALL: "/Bookings/getAll",
    BOOKINGS_GET_BY_ID: (id) => `/Bookings/getBookingById/${id}`,

    STAFF_NURSE_ALL: "/staff/nurse/all",
    STAFF_DOCTOR_ALL: "/staff/doctor/all",
    STAFF_TEACHER_ALL: "/staff/teacher/all",
    STAFF_PHARMACIST_ALL: "/staff/pharmacist/all",
};