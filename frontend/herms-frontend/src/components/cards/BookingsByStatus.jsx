import { useState } from "react";
import BookingStatusList from "./BookingStatusList";
import ConfirmModal from "../modals/ConfirmModal";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import { useMyBookings } from "../../hooks/useBookings";
import { useBookingActions } from "../../hooks/useBookingActions";
import { BOOKING_STATUS } from "../../utils/bookingStatus";

// A booking page for one or more statuses. `actions` picks which buttons the viewer gets:
// "accept" | "decline" (professional) and "confirm" | "cancel" (organization).
export default function BookingsByStatus({ title, statuses, emptyMessage, banner, actions = [] }) {
    const { bookings, loading, error, refetch } = useMyBookings();
    const act = useBookingActions(refetch);
    const [target, setTarget] = useState(null);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    const can = (name) => actions.includes(name);
    const withdrawing = target?.type === "cancel" && target.booking.status === BOOKING_STATUS.PENDING;

    function handleConfirm(reason) {
        if (target.type === "decline") act.decline(target.booking, reason);
        else act.cancel(target.booking, reason);
        setTarget(null);
    }

    return (
        <>
            <BookingStatusList
                title={title}
                bookings={bookings.filter((b) => statuses.includes(b.status))}
                emptyMessage={emptyMessage}
                banner={banner}
                onAccept={can("accept") ? act.accept : undefined}
                onDecline={can("decline") ? (b) => setTarget({ type: "decline", booking: b }) : undefined}
                onConfirm={can("confirm") ? act.confirm : undefined}
                onCancel={can("cancel") ? (b) => setTarget({ type: "cancel", booking: b }) : undefined}
            />

            <ConfirmModal
                open={!!target}
                title={
                    target?.type === "decline"
                        ? "Decline this request?"
                        : withdrawing
                          ? "Withdraw this request?"
                          : "Cancel this booking?"
                }
                description={
                    target?.type === "decline"
                        ? "The organization will be notified."
                        : withdrawing
                          ? "The professional will no longer be able to accept it."
                          : "This can't be undone."
                }
                confirmLabel={target?.type === "decline" ? "Decline Request" : withdrawing ? "Withdraw Request" : "Cancel Booking"}
                requireReason
                reasonLabel={target?.type === "decline" ? "Reason (shown to the organization)" : "Reason (optional)"}
                onConfirm={handleConfirm}
                onClose={() => setTarget(null)}
            />
        </>
    );
}
