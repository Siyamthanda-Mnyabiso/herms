import { useMemo, useState } from "react";
import Select from "../../components/common/Select";
import BookingStatusList from "../../components/cards/BookingStatusList";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useMyBookings } from "../../hooks/useBookings";

const FILTERS = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
    { value: "expired", label: "Expired" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export default function BookingHistory() {
    const { bookings, loading, error, refetch } = useMyBookings();
    const [filter, setFilter] = useState("all");

    const shown = useMemo(
        () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
        [bookings, filter]
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    return (
        <BookingStatusList
            title="Booking History"
            bookings={shown}
            emptyMessage="No bookings match this filter."
            banner={
                <Select
                    options={FILTERS}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    containerClassName="w-48"
                />
            }
        />
    );
}
