// Mock booking data for the Booking & Candidate Request System.
//
// Identity rule: the organization must not see the professional's real name,
// contact details, or photo until the professional has accepted the request.
// While a booking is "pending", only anonymized/qualification-level info is
// shown (candidateLabel, role, qualifications). Once status moves to
// "accepted" (or later), candidateName becomes visible.
//
// requestedAt + respondBy implement the 24-hour response workflow: a
// professional has 24 hours from requestedAt to accept/decline before the
// request auto-expires.

function hoursFromNow(hours) {
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function hoursAgo(hours) {
    return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const BOOKING_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    DECLINED: "declined",
    EXPIRED: "expired",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

export const mockBookings = [
    {
        id: "BK-1042",
        candidateLabel: "Candidate #204",
        candidateName: "Thandiwe Nkosi",
        role: "Registered Nurse",
        qualifications: "BCur Nursing, ICU Certified",
        organization: "Groote Schuur Hospital",
        startDate: "2026-08-25",
        endDate: "2026-08-29",
        duration: "5 days",
        rate: "R650/day",
        requestedAt: hoursAgo(4),
        respondBy: hoursFromNow(20),
        status: BOOKING_STATUS.PENDING,
    },
    {
        id: "BK-1041",
        candidateLabel: "Candidate #187",
        candidateName: "Sipho Dlamini",
        role: "General Practitioner",
        qualifications: "MBChB, 6 yrs experience",
        organization: "Life Vincent Pallotti",
        startDate: "2026-08-22",
        endDate: "2026-08-24",
        duration: "3 days",
        rate: "R1200/day",
        requestedAt: hoursAgo(21),
        respondBy: hoursFromNow(3),
        status: BOOKING_STATUS.PENDING,
    },
    {
        id: "BK-1038",
        candidateLabel: "Candidate #119",
        candidateName: "Amahle Zulu",
        role: "Pharmacist",
        qualifications: "BPharm, SAPC Registered",
        organization: "Clicks Pharmacy Claremont",
        startDate: "2026-08-18",
        endDate: "2026-08-20",
        duration: "3 days",
        rate: "R800/day",
        requestedAt: hoursAgo(10),
        respondBy: hoursFromNow(14),
        acceptedAt: hoursAgo(2),
        status: BOOKING_STATUS.ACCEPTED,
    },
    {
        id: "BK-1035",
        candidateLabel: "Candidate #076",
        candidateName: "Karabo Molefe",
        role: "High School Teacher",
        qualifications: "PGCE, Mathematics",
        organization: "Westerford High School",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        duration: "1 month",
        rate: "R450/day",
        requestedAt: hoursAgo(30),
        respondBy: hoursAgo(6),
        confirmedAt: hoursAgo(5),
        status: BOOKING_STATUS.CONFIRMED,
    },
    {
        id: "BK-1029",
        candidateLabel: "Candidate #061",
        candidateName: "Naledi Mokoena",
        role: "Registered Nurse",
        qualifications: "BCur Nursing, Trauma Certified",
        organization: "Netcare Christiaan Barnard",
        startDate: "2026-07-14",
        endDate: "2026-07-18",
        duration: "5 days",
        rate: "R650/day",
        requestedAt: hoursAgo(700),
        respondBy: hoursAgo(676),
        declinedAt: hoursAgo(690),
        declineReason: "Not available for those dates",
        status: BOOKING_STATUS.DECLINED,
    },
    {
        id: "BK-1017",
        candidateLabel: "Candidate #044",
        candidateName: "Lindiwe Khumalo",
        role: "Primary School Teacher",
        qualifications: "BEd Foundation Phase",
        organization: "Rondebosch Primary",
        startDate: "2026-06-02",
        endDate: "2026-06-06",
        duration: "5 days",
        rate: "R400/day",
        requestedAt: hoursAgo(900),
        respondBy: hoursAgo(876),
        status: BOOKING_STATUS.EXPIRED,
    },
    {
        id: "BK-1002",
        candidateLabel: "Candidate #012",
        candidateName: "Bongani Sithole",
        role: "Pharmacist",
        qualifications: "BPharm, SAPC Registered",
        organization: "Dis-Chem Newlands",
        startDate: "2026-04-10",
        endDate: "2026-04-12",
        duration: "3 days",
        rate: "R800/day",
        requestedAt: hoursAgo(3200),
        respondBy: hoursAgo(3176),
        acceptedAt: hoursAgo(3190),
        confirmedAt: hoursAgo(3180),
        completedAt: hoursAgo(3050),
        status: BOOKING_STATUS.COMPLETED,
    },
];

export function getBookingsByStatus(status) {
    return mockBookings.filter((b) => b.status === status);
}