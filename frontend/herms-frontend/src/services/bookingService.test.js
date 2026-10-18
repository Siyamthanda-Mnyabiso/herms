import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../api/axios", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

import api from "../api/axios";
import {
    acceptBooking,
    cancelBooking,
    confirmBooking,
    createBooking,
    declineBooking,
    getMyBookings,
    getUpcomingBookings,
} from "./bookingService";

const view = (overrides = {}) => ({
    id: 1,
    status: "PENDING",
    viewerRole: "organization",
    personId: 5,
    candidateLabel: "Candidate #005",
    candidateName: null,
    role: "Nurse",
    qualifications: "BCur",
    organization: "City Hospital",
    startDate: "2026-10-19",
    endDate: "2026-10-21",
    requestedAt: "2026-10-18T10:00:00Z",
    respondBy: "2026-10-19T10:00:00Z",
    acceptedAt: null,
    confirmedAt: null,
    declinedAt: null,
    declineReason: null,
    ...overrides,
});

beforeEach(() => vi.clearAllMocks());

describe("getMyBookings", () => {
    it("calls the scoped endpoint and maps statuses to the ones the pages use", async () => {
        api.get.mockResolvedValue({
            data: [view({ id: 1, status: "CANCELED" }), view({ id: 2, status: "ACCEPTED" })],
        });

        const bookings = await getMyBookings();

        expect(api.get).toHaveBeenCalledWith("/booking-requests/mine");
        expect(bookings.map((b) => b.status)).toEqual(["cancelled", "accepted"]);
    });

    it("works out the duration in days, counting both ends", async () => {
        api.get.mockResolvedValue({
            data: [
                view({ id: 1, startDate: "2026-10-19", endDate: "2026-10-19" }),
                view({ id: 2, startDate: "2026-10-19", endDate: "2026-10-21" }),
            ],
        });

        const [one, three] = await getMyBookings();

        expect(one.duration).toBe("1 day");
        expect(three.duration).toBe("3 days");
    });

    it("falls back to the anonymous label while the server withholds the name", async () => {
        api.get.mockResolvedValue({ data: [view({ candidateName: null })] });
        const [booking] = await getMyBookings();
        expect(booking.candidateName).toBe("Candidate #005");
    });
});

describe("getUpcomingBookings", () => {
    it("keeps only confirmed bookings, named for the viewer", async () => {
        api.get.mockResolvedValue({
            data: [
                view({ id: 1, status: "CONFIRMED", candidateName: "Thandi Nkosi" }),
                view({ id: 2, status: "CONFIRMED", viewerRole: "professional", candidateName: "Thandi Nkosi" }),
                view({ id: 3, status: "PENDING" }),
                view({ id: 4, status: "DECLINED" }),
            ],
        });

        const upcoming = await getUpcomingBookings();

        expect(upcoming.map((b) => b.id)).toEqual([1, 2]);
        expect(upcoming[0].name).toBe("Thandi Nkosi"); // an organization sees the professional
        expect(upcoming[1].name).toBe("City Hospital"); // a professional sees who booked them
    });
});

describe("booking actions", () => {
    it("sends each action to its endpoint", async () => {
        api.post.mockResolvedValue({ data: view() });

        await createBooking(5, "2026-10-19", "2026-10-21");
        await acceptBooking(7);
        await declineBooking(7, "Away");
        await confirmBooking(7);
        await cancelBooking(7, "Changed plans");

        expect(api.post.mock.calls).toEqual([
            ["/booking-requests", { personId: 5, startDate: "2026-10-19", endDate: "2026-10-21" }],
            ["/booking-requests/7/accept"],
            ["/booking-requests/7/decline", { reason: "Away" }],
            ["/booking-requests/7/confirm"],
            ["/booking-requests/7/cancel", { reason: "Changed plans" }],
        ]);
    });
});
