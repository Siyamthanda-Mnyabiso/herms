import { useMemo, useState } from "react";
import { Lightbulb, User, Clock, AlertTriangle } from "lucide-react";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { mockBookings, BOOKING_STATUS } from "./data/mockBookings";
import {
    formatDateRange,
    getResponseCountdown,
    isUrgent,
} from "./utils/bookingHelpers";

const TABS = [
    { key: "all", label: "All Requests" },
    { key: BOOKING_STATUS.PENDING, label: "Pending" },
    { key: BOOKING_STATUS.ACCEPTED, label: "Accepted" },
    { key: BOOKING_STATUS.DECLINED, label: "Declined" },
    { key: BOOKING_STATUS.EXPIRED, label: "Expired" },
];

export default function BookingRequest() {
    const [bookings, setBookings] = useState(mockBookings);
    const [activeTab, setActiveTab] = useState("all");
    const [declineTarget, setDeclineTarget] = useState(null);

    const counts = useMemo(() => {
        const base = { all: bookings.length };
        for (const tab of TABS.slice(1)) {
            base[tab.key] = bookings.filter((b) => b.status === tab.key).length;
        }
        return base;
    }, [bookings]);

    const visible = bookings.filter((b) => activeTab === "all" || b.status === activeTab);

    function handleAccept(booking) {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === booking.id
                    ? { ...b, status: BOOKING_STATUS.ACCEPTED, acceptedAt: new Date().toISOString() }
                    : b
            )
        );
    }

    function handleDeclineConfirm(reason) {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === declineTarget.id
                    ? {
                        ...b,
                        status: BOOKING_STATUS.DECLINED,
                        declinedAt: new Date().toISOString(),
                        declineReason: reason || b.declineReason,
                    }
                    : b
            )
        );
        setDeclineTarget(null);
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold text-gray-900">Booking Requests</h1>

            <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={[
                            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            activeTab === tab.key
                                ? "bg-primary-50 text-primary-600"
                                : "text-gray-500 hover:bg-gray-50",
                        ].join(" ")}
                    >
                        {tab.label} ({counts[tab.key] ?? 0})
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {visible.map((booking) => {
                    const countdown = booking.respondBy ? getResponseCountdown(booking) : null;
                    const urgent = booking.respondBy ? isUrgent(booking) : false;

                    return (
                        <div key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <User className="size-4" />
                  </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{booking.organization}</p>
                                        <p className="text-xs text-gray-500">{booking.role}</p>
                                    </div>
                                </div>
                                <StatusBadge status={booking.status} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-gray-400">Dates</p>
                                    <p className="text-gray-700">
                                        {formatDateRange(booking.startDate, booking.endDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="text-gray-700">{booking.duration}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Rate</p>
                                    <p className="text-gray-700">{booking.rate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Requested</p>
                                    <p className="text-gray-700">
                                        {new Date(booking.requestedAt).toLocaleDateString("en-ZA", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {booking.declineReason && (
                                <p className="mt-3 text-xs text-gray-500">
                                    <span className="font-medium text-gray-600">Reason:</span>{" "}
                                    {booking.declineReason}
                                </p>
                            )}

                            {countdown && (
                                <div
                                    className={[
                                        "mt-3 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                        urgent
                                            ? "bg-status-declined-bg text-status-declined"
                                            : "bg-status-pending-bg text-status-pending",
                                    ].join(" ")}
                                >
                                    {urgent ? <AlertTriangle className="size-3.5" /> : <Clock className="size-3.5" />}
                                    {countdown.label}
                                </div>
                            )}

                            {booking.status === BOOKING_STATUS.PENDING && (
                                <div className="mt-4 flex gap-3">
                                    <Button variant="secondary" size="sm" onClick={() => setDeclineTarget(booking)}>
                                        Decline
                                    </Button>
                                    <Button variant="amber" size="sm" onClick={() => handleAccept(booking)}>
                                        Accept
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                <Lightbulb className="mt-0.5 size-4 shrink-0" />
                <p>
                    <span className="font-medium">Tip:</span> You have 24 hours to respond to booking
                    requests. If you don't respond, the request will expire and move to the next
                    candidate.
                </p>
            </div>

            <ConfirmModal
                open={!!declineTarget}
                title="Decline this request?"
                description="The organization will be notified and the request will move to the next candidate."
                confirmLabel="Decline Request"
                requireReason
                reasonLabel="Reason (shown to the organization)"
                onConfirm={handleDeclineConfirm}
                onClose={() => setDeclineTarget(null)}
            />
        </div>
    );
}
