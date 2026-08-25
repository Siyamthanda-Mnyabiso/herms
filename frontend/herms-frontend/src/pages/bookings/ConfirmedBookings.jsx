import { useState } from "react";
import { getBookingsByStatus, BOOKING_STATUS } from "./data/mockBookings";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";
import BookingStatusList from "../../components/cards/BookingStatusList";
import ConfirmModal from "../../components/modals/ConfirmModal";

const meta = STATUS_PAGE_META[BOOKING_STATUS.CONFIRMED];

export default function ConfirmedBookings() {
    const [bookings, setBookings] = useState(getBookingsByStatus(BOOKING_STATUS.CONFIRMED));
    const [cancelTarget, setCancelTarget] = useState(null);

    function handleCancelConfirm(reason) {
        setBookings((prev) =>
            prev.map((b) =>
                b.id === cancelTarget.id
                    ? { ...b, status: "cancelled", cancelReason: reason, cancelledAt: new Date().toISOString() }
                    : b
            )
        );
        setCancelTarget(null);
    }

    return (
        <>
            <BookingStatusList
                title={meta.title}
                bookings={bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED)}
                emptyMessage={meta.emptyMessage}
                onCancel={setCancelTarget}
            />

            <ConfirmModal
                open={!!cancelTarget}
                title="Cancel this confirmed booking?"
                description="This can't be undone. The other party will be notified immediately."
                confirmLabel="Cancel Booking"
                requireReason
                reasonLabel="Reason for cancellation"
                onConfirm={handleCancelConfirm}
                onClose={() => setCancelTarget(null)}
            />
        </>
    );
}
