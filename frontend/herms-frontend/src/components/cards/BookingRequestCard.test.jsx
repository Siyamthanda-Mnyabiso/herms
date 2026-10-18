import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import BookingRequestCard from "./BookingRequestCard";

afterEach(cleanup);

const future = (hours) => new Date(Date.now() + hours * 3600 * 1000).toISOString();

const booking = (overrides = {}) => ({
    id: 1,
    status: "pending",
    viewerRole: "organization",
    candidateLabel: "Candidate #003",
    candidateName: "Thandi Nkosi",
    role: "Nurse",
    qualifications: "BCur Nursing",
    organization: "City Hospital",
    startDate: "2026-10-19",
    endDate: "2026-10-21",
    duration: "3 days",
    requestedAt: "2026-10-18T10:00:00Z",
    respondBy: future(20),
    ...overrides,
});

const buttons = () => screen.queryAllByRole("button").map((b) => b.textContent);

describe("BookingRequestCard", () => {
    it("shows the anonymous label to an organization while a request is pending", () => {
        render(<BookingRequestCard booking={booking()} />);
        expect(screen.getByText("Candidate #003")).toBeTruthy();
        expect(screen.queryByText("Thandi Nkosi")).toBeNull();
    });

    it("shows the real name once accepted", () => {
        render(<BookingRequestCard booking={booking({ status: "accepted" })} />);
        expect(screen.getByText("Thandi Nkosi")).toBeTruthy();
    });

    it("shows the professional who is asking for them", () => {
        render(<BookingRequestCard booking={booking({ viewerRole: "professional" })} />);
        expect(screen.getByText("City Hospital")).toBeTruthy();
    });

    it("offers Accept and Decline on a pending request when the handlers are given", () => {
        render(<BookingRequestCard booking={booking({ viewerRole: "professional" })} onAccept={() => {}} onDecline={() => {}} />);
        expect(buttons()).toEqual(["Decline", "Accept"]);
    });

    it("offers no buttons when no handlers are given", () => {
        render(<BookingRequestCard booking={booking()} />);
        expect(buttons()).toEqual([]);
    });

    it("lets an organization confirm an accepted request, or cancel it", () => {
        render(<BookingRequestCard booking={booking({ status: "accepted" })} onConfirm={() => {}} onCancel={() => {}} />);
        expect(buttons()).toEqual(["Confirm Booking", "Cancel Booking"]);
    });

    it("calls the handler with the booking when a button is pressed", () => {
        const onAccept = vi.fn();
        const pending = booking({ viewerRole: "professional" });
        render(<BookingRequestCard booking={pending} onAccept={onAccept} />);
        fireEvent.click(screen.getByText("Accept"));
        expect(onAccept).toHaveBeenCalledWith(pending);
    });

    it("words cancel as 'Withdraw Request' while pending", () => {
        render(<BookingRequestCard booking={booking()} onCancel={() => {}} />);
        expect(buttons()).toEqual(["Withdraw Request"]);
    });

    it("offers no actions once a booking is finished", () => {
        for (const status of ["declined", "expired", "cancelled", "completed"]) {
            cleanup();
            render(
                <BookingRequestCard booking={booking({ status })} onAccept={() => {}} onDecline={() => {}} onConfirm={() => {}} onCancel={() => {}} />
            );
            expect(buttons(), status).toEqual([]);
        }
    });

    it("shows the decline reason", () => {
        render(<BookingRequestCard booking={booking({ status: "declined", declineReason: "Away that week" })} />);
        expect(screen.getByText("Away that week")).toBeTruthy();
    });
});
