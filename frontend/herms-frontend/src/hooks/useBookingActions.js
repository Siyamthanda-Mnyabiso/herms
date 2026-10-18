import { useCallback } from "react";
import { useNotification } from "../hooks/useNotification.js";
import { acceptBooking, cancelBooking, confirmBooking, declineBooking } from "../services/bookingService";

// Wraps each booking action: call the API, tell the user how it went, then reload the list.
export function useBookingActions(refetch) {
    const { notify } = useNotification();

    const run = useCallback(
        async (action, successMessage) => {
            try {
                await action();
                notify(successMessage, "success");
            } catch (err) {
                notify(err.response?.data ?? "Something went wrong. Please try again.", "error");
            } finally {
                refetch();
            }
        },
        [notify, refetch]
    );

    return {
        accept: (b) => run(() => acceptBooking(b.id), "Request accepted"),
        decline: (b, reason) => run(() => declineBooking(b.id, reason), "Request declined"),
        confirm: (b) => run(() => confirmBooking(b.id), "Booking confirmed"),
        cancel: (b, reason) => run(() => cancelBooking(b.id, reason), "Booking cancelled"),
    };
}
