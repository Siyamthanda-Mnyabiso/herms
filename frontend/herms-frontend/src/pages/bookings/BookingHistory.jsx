import { useMemo, useState } from "react";
import Select from "../../components/common/Select";
import BookingStatusList from "../../components/cards/BookingStatusList";
import { mockBookings } from "./data/mockBookings";

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
    const [filter, setFilter] = useState("all");

    const bookings = useMemo(() => {
        const sorted = [...mockBookings].sort(
            (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
        );
        return filter === "all" ? sorted : sorted.filter((b) => b.status === filter);
    }, [filter]);

    return (
        <BookingStatusList
            title="Booking History"
            bookings={bookings}
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
