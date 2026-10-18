import api from "../api/axios";
import { BOOKING_STATUS } from "../utils/bookingStatus";

const STATUS_FROM_API = {
    PENDING: BOOKING_STATUS.PENDING,
    ACCEPTED: BOOKING_STATUS.ACCEPTED,
    DECLINED: BOOKING_STATUS.DECLINED,
    EXPIRED: BOOKING_STATUS.EXPIRED,
    CONFIRMED: BOOKING_STATUS.CONFIRMED,
    COMPLETED: BOOKING_STATUS.COMPLETED,
    CANCELED: BOOKING_STATUS.CANCELLED,
};

function durationLabel(startDate, endDate) {
    const days = Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1;
    return `${days} day${days === 1 ? "" : "s"}`;
}

// Maps the server's BookingView into the shape the booking pages use.
// The server already withholds the professional's name from organizations until they accept.
function toBooking(view) {
    return {
        id: view.id,
        personId: view.personId,
        viewerRole: view.viewerRole,
        candidateLabel: view.candidateLabel,
        candidateName: view.candidateName ?? view.candidateLabel,
        role: view.role,
        qualifications: view.qualifications,
        organization: view.organization,
        startDate: view.startDate,
        endDate: view.endDate,
        duration: durationLabel(view.startDate, view.endDate),
        requestedAt: view.requestedAt,
        respondBy: view.respondBy,
        acceptedAt: view.acceptedAt,
        confirmedAt: view.confirmedAt,
        declinedAt: view.declinedAt,
        declineReason: view.declineReason,
        status: STATUS_FROM_API[view.status] ?? view.status.toLowerCase(),
    };
}

function formatDateRange(start, end) {
    const format = (d) => new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    return `${format(start)} – ${format(end)}`;
}

export async function getMyBookings() {
    const response = await api.get("/booking-requests/mine");
    return response.data.map(toBooking);
}

// Confirmed bookings in the compact shape the dashboards show.
export async function getUpcomingBookings() {
    const bookings = await getMyBookings();
    return bookings
        .filter((b) => b.status === BOOKING_STATUS.CONFIRMED)
        .map((b) => ({
            id: b.id,
            personId: b.personId,
            name: b.viewerRole === "professional" ? b.organization : b.candidateName,
            role: b.role,
            dates: formatDateRange(b.startDate, b.endDate),
            status: b.status,
            startDay: b.startDate,
            endDay: b.endDate,
        }));
}

export async function createBooking(personId, startDate, endDate) {
    const response = await api.post("/booking-requests", { personId, startDate, endDate });
    return toBooking(response.data);
}

export async function acceptBooking(id) {
    await api.post(`/booking-requests/${id}/accept`);
}

export async function declineBooking(id, reason) {
    await api.post(`/booking-requests/${id}/decline`, { reason });
}

export async function confirmBooking(id) {
    await api.post(`/booking-requests/${id}/confirm`);
}

export async function cancelBooking(id, reason) {
    await api.post(`/booking-requests/${id}/cancel`, { reason });
}
