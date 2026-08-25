import { useState } from "react";
import { Lightbulb } from "lucide-react";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAllBookings } from "../../hooks/useBookings";
import { updateBookingStatus } from "../../services/bookingService";
import { useNotification } from "../../context/NotificationContext";

function formatDateRange(start, end) {
    const format = (d) => new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
    return `${format(start)} – ${format(end)}`;
}

export default function BookingRequest() {
    const [activeTab, setActiveTab] = useState("all");
    const { bookings, loading, error, refetch } = useAllBookings();
    const { notify } = useNotification();

    const handleUpdateStatus = async (rawBooking, newStatus) => {
        try {
            await updateBookingStatus(rawBooking, newStatus);
            notify(newStatus === "CONFIRMED" ? "Booking accepted" : "Booking declined", "success");
            refetch();
        } catch (err) {
            console.error("Failed to update booking", err);
            notify("Couldn't update the request. Please try again.", "error");
        }
    };

    const mapped = bookings.map((b) => ({
        id: b.bookingId,
        org: b.person
            ? `${b.person.name?.firstName ?? ""} ${b.person.name?.lastName ?? ""}`.trim()
            : `Booking #${b.bookingId}`,
        role: b.person?.specialization ?? "—",
        dates: formatDateRange(b.startDay, b.endDay),
        duration: "—",
        rate: "—",
        requested: b.bookingDate
            ? new Date(b.bookingDate).toLocaleDateString("en-ZA")
            : "—",
        timeLeft: "24h left",
        status: b.status,
    }));

    const filterByTab = {
        all: mapped,
        pending: mapped.filter((r) => r.status === "PENDING"),
        accepted: mapped.filter((r) => r.status === "CONFIRMED"),
        declined: mapped.filter((r) => r.status === "CANCELED"),
        expired: mapped.filter((r) => r.status === "COMPLETED"), // adjust if you add a real "expired" concept later
    };

    const TABS = [
        { key: "all", label: "All Requests", count: filterByTab.all.length },
        { key: "pending", label: "Pending", count: filterByTab.pending.length },
        { key: "accepted", label: "Accepted", count: filterByTab.accepted.length },
        { key: "declined", label: "Declined", count: filterByTab.declined.length },
        { key: "expired", label: "Expired", count: filterByTab.expired.length },
    ];

    const visibleRequests = filterByTab[activeTab];

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
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={refetch} />}

            {!loading && !error && (
                <div className="flex flex-col gap-4">
                    {visibleRequests.length === 0 && (
                        <p className="text-sm text-gray-400">No requests in this category.</p>
                    )}

                    {visibleRequests.map((request) => {
                        const rawBooking = bookings.find((b) => b.bookingId === request.id);

                        return (
                            <div key={request.id} className="rounded-2xl bg-white p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{request.org}</p>
                                        <p className="text-xs text-gray-500">{request.role}</p>
                                    </div>
                                    <span className="text-xs font-medium text-status-declined">{request.timeLeft}</span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Dates</p>
                                        <p className="text-gray-700">{request.dates}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Duration</p>
                                        <p className="text-gray-700">{request.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Rate</p>
                                        <p className="text-gray-700">{request.rate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Requested</p>
                                        <p className="text-gray-700">{request.requested}</p>
                                    </div>
                                </div>

                                {request.status === "PENDING" && (
                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleUpdateStatus(rawBooking, "CANCELED")}
                                        >
                                            Decline
                                        </Button>
                                        <Button
                                            variant="amber"
                                            size="sm"
                                            onClick={() => handleUpdateStatus(rawBooking, "CONFIRMED")}
                                        >
                                            Accept
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                <Lightbulb className="mt-0.5 size-4 shrink-0" />
                <p>
                    <span className="font-medium">Tip:</span> You have 24 hours to respond to booking requests.
                    If you don't respond, the request will expire and move to the next candidate.
                </p>
            </div>
        </div>
    );
}