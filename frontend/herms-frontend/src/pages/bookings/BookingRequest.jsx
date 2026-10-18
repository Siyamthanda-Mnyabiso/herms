import { useMemo, useState } from "react";
import { Lightbulb } from "lucide-react";
import BookingStatusList from "../../components/cards/BookingStatusList";
import ConfirmModal from "../../components/modals/ConfirmModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useMyBookings } from "../../hooks/useBookings";
import { useBookingActions } from "../../hooks/useBookingActions";
import { BOOKING_STATUS } from "../../utils/bookingStatus";

const TABS = [
    { key: "all", label: "All Requests" },
    { key: BOOKING_STATUS.PENDING, label: "Pending" },
    { key: BOOKING_STATUS.ACCEPTED, label: "Accepted" },
    { key: BOOKING_STATUS.DECLINED, label: "Declined" },
    { key: BOOKING_STATUS.EXPIRED, label: "Expired" },
];

export default function BookingRequest() {
    const { bookings, loading, error, refetch } = useMyBookings();
    const act = useBookingActions(refetch);
    const [activeTab, setActiveTab] = useState("all");
    const [declineTarget, setDeclineTarget] = useState(null);

    const requests = useMemo(
        () => bookings.filter((b) => TABS.some((t) => t.key === b.status)),
        [bookings]
    );
    const counts = useMemo(() => {
        const base = { all: requests.length };
        for (const tab of TABS.slice(1)) {
            base[tab.key] = requests.filter((b) => b.status === tab.key).length;
        }
        return base;
    }, [requests]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    const visible = requests.filter((b) => activeTab === "all" || b.status === activeTab);

    return (
        <div className="flex flex-col gap-6">
            <BookingStatusList
                title="Booking Requests"
                bookings={visible}
                emptyMessage="No booking requests here yet."
                onAccept={act.accept}
                onDecline={setDeclineTarget}
                banner={
                    <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={[
                                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    activeTab === tab.key ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:bg-gray-50",
                                ].join(" ")}
                            >
                                {tab.label} ({counts[tab.key] ?? 0})
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                <Lightbulb className="mt-0.5 size-4 shrink-0" />
                <p>
                    <span className="font-medium">Tip:</span> You have 24 hours to respond to booking requests. If you
                    don't respond, the request will expire.
                </p>
            </div>

            <ConfirmModal
                open={!!declineTarget}
                title="Decline this request?"
                description="The organization will be notified."
                confirmLabel="Decline Request"
                requireReason
                reasonLabel="Reason (shown to the organization)"
                onConfirm={(reason) => {
                    act.decline(declineTarget, reason);
                    setDeclineTarget(null);
                }}
                onClose={() => setDeclineTarget(null)}
            />
        </div>
    );
}
