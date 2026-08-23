export const ENDPOINTS = {

    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",

    BOOKINGS_CREATE: "/Bookings/create",
    BOOKINGS_READ: (id) => `/Bookings/Read/${id}`,
    BOOKINGS_UPDATE: "/Bookings/Update",
    BOOKINGS_DELETE: (id) => `/Bookings/Delete/${id}`,
    BOOKINGS_GET_ALL: "/Bookings/getAll",
    BOOKINGS_GET_BY_ID: (id) => `/Bookings/getBookingById/${id}`,
};