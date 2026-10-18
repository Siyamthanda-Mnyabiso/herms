import { useState, useEffect, useCallback } from "react";
import { getUpcomingBookings, getMyBookings } from "../services/bookingService";

function useLoader(loadFn, errorMessage) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setBookings(await loadFn());
        } catch {
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [loadFn, errorMessage]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, error, refetch: fetchBookings };
}

export function useUpcomingBookings() {
    return useLoader(getUpcomingBookings, "Couldn't load bookings. Check your connection and try again.");
}

// Every booking that belongs to the signed-in organization or professional.
export function useMyBookings() {
    return useLoader(getMyBookings, "Couldn't load bookings. Check your connection and try again.");
}
