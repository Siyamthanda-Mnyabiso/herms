import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

function formatDateRange(start, end) {
    const format = (d) => new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    return `${format(start)} – ${format(end)}`;
}

export async function getUpcomingBookings() {
    const response = await api.get(ENDPOINTS.BOOKINGS_GET_ALL);

    return response.data
        .filter((b) => b.status === "CONFIRMED")
        .map((booking) => {
            const person = booking.person;
            const fullName = person?.name
                ? `${person.name.firstName ?? ""} ${person.name.lastName ?? ""}`.trim()
                : `Booking #${booking.bookingId}`;

            return {
                name: fullName,
                role: person?.specialization ?? "—",
                dates: formatDateRange(booking.startDay, booking.endDay),
                status: booking.status?.toLowerCase() ?? "unknown",
                startDay: booking.startDay,
                endDay: booking.endDay,
            };
        });
}
export async function createBooking(personId, startDay, endDay) {
    const response = await api.post(`/Bookings/create/${personId}`, {
        bookingDate: new Date().toISOString().split("T")[0],
        startDay,
        endDay,
        status: "PENDING",
    });
    return response.data;
}
export async function getAllBookings(){
    const response = await api.get(ENDPOINTS.BOOKINGS_GET_ALL);
    return response.data;
}
export async function updateBookingStatus(booking, newStatus) {
    const response = await api.put(`/Bookings/updateStatus/${booking.bookingId}`, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
}