import { describe, expect, it } from "vitest";
import {
    displayName,
    formatDateRange,
    getResponseCountdown,
    isIdentityRevealed,
    isUrgent,
} from "./bookingHelpers";

const booking = (overrides = {}) => ({
    status: "pending",
    viewerRole: "organization",
    candidateLabel: "Candidate #007",
    candidateName: "Thandi Nkosi",
    organization: "City Hospital",
    ...overrides,
});

describe("identity rule", () => {
    it("hides the professional's name from an organization until they accept", () => {
        expect(displayName(booking({ status: "pending" }))).toBe("Candidate #007");
        expect(displayName(booking({ status: "declined" }))).toBe("Candidate #007");
        expect(displayName(booking({ status: "expired" }))).toBe("Candidate #007");
        expect(displayName(booking({ status: "cancelled" }))).toBe("Candidate #007");
    });

    it("shows the name once the request is accepted, confirmed or completed", () => {
        for (const status of ["accepted", "confirmed", "completed"]) {
            expect(isIdentityRevealed({ status })).toBe(true);
            expect(displayName(booking({ status }))).toBe("Thandi Nkosi");
        }
    });

    it("shows a professional who is asking for them, not themselves", () => {
        for (const status of ["pending", "accepted", "declined"]) {
            expect(displayName(booking({ status, viewerRole: "professional" }))).toBe("City Hospital");
        }
    });
});

describe("response countdown", () => {
    const now = new Date("2026-10-18T12:00:00Z");
    const respondBy = (hoursFromNow) => new Date(now.getTime() + hoursFromNow * 3600 * 1000).toISOString();

    it("reports an overdue request as expired", () => {
        const countdown = getResponseCountdown({ respondBy: respondBy(-1) }, now);
        expect(countdown.expired).toBe(true);
        expect(countdown.label).toBe("Expired");
    });

    it("counts down in hours, then minutes", () => {
        expect(getResponseCountdown({ respondBy: respondBy(20) }, now).label).toBe("20h left to respond");
        expect(getResponseCountdown({ respondBy: respondBy(0.5) }, now).label).toBe("30m left to respond");
    });

    it("marks a request urgent in its last four hours only", () => {
        const soon = { respondBy: new Date(Date.now() + 3 * 3600 * 1000).toISOString() };
        const later = { respondBy: new Date(Date.now() + 10 * 3600 * 1000).toISOString() };
        const overdue = { respondBy: new Date(Date.now() - 3600 * 1000).toISOString() };
        expect(isUrgent(soon)).toBe(true);
        expect(isUrgent(later)).toBe(false);
        expect(isUrgent(overdue)).toBe(false);
    });
});

describe("formatDateRange", () => {
    it("formats a same-year range without the year", () => {
        const text = formatDateRange("2026-10-19", "2026-10-21");
        expect(text).toContain("19");
        expect(text).toContain("21");
        expect(text).not.toContain("2026");
    });

    it("adds the year when the range crosses years", () => {
        expect(formatDateRange("2026-12-30", "2027-01-02")).toContain("2027");
    });
});
