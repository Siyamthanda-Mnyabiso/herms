import { BOOKING_STATUS } from "../data/mockBookings";

// A candidate's real identity is only revealed to the organization once the
// professional has responded positively. Everywhere else in the UI, use
// candidateLabel instead of candidateName.
const IDENTITY_REVEALED_STATUSES = new Set([
    BOOKING_STATUS.ACCEPTED,
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.COMPLETED,
]);

export function isIdentityRevealed(booking) {
    return IDENTITY_REVEALED_STATUSES.has(booking.status);
}

export function displayName(booking) {
    return isIdentityRevealed(booking) ? booking.candidateName : booking.candidateLabel;
}

export function formatDateRange(startDate, endDate) {
    const opts = { month: "short", day: "numeric" };
    const start = new Date(startDate).toLocaleDateString("en-ZA", opts);
    const end = new Date(endDate).toLocaleDateString(
        "en-ZA",
        new Date(startDate).getFullYear() === new Date(endDate).getFullYear()
            ? opts
            : { ...opts, year: "numeric" }
    );
    return `${start} - ${end}`;
}

// Returns { expired, hoursLeft, label } describing time remaining in the
// 24-hour response window for a pending request.
export function getResponseCountdown(booking, now = new Date()) {
    const respondBy = new Date(booking.respondBy);
    const diffMs = respondBy.getTime() - now.getTime();

    if (diffMs <= 0) {
        return { expired: true, hoursLeft: 0, label: "Expired" };
    }

    const hoursLeft = diffMs / (1000 * 60 * 60);

    if (hoursLeft < 1) {
        const minutesLeft = Math.round(diffMs / (1000 * 60));
        return { expired: false, hoursLeft, label: `${minutesLeft}m left to respond` };
    }

    return { expired: false, hoursLeft, label: `${Math.round(hoursLeft)}h left to respond` };
}

export function isUrgent(booking) {
    const { expired, hoursLeft } = getResponseCountdown(booking);
    return !expired && hoursLeft <= 4;
}

export const STATUS_PAGE_META = {
    [BOOKING_STATUS.PENDING]: {
        title: "Pending Requests",
        emptyMessage: "No pending booking requests right now.",
    },
    [BOOKING_STATUS.ACCEPTED]: {
        title: "Accepted Bookings",
        emptyMessage: "No accepted bookings yet.",
    },
    [BOOKING_STATUS.DECLINED]: {
        title: "Declined Bookings",
        emptyMessage: "No declined bookings.",
    },
    [BOOKING_STATUS.EXPIRED]: {
        title: "Expired Requests",
        emptyMessage: "No expired requests. Requests expire after 24 hours without a response.",
    },
    [BOOKING_STATUS.CONFIRMED]: {
        title: "Confirmed Bookings",
        emptyMessage: "No confirmed bookings yet.",
    },
};