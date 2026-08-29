import { useState, useEffect, useCallback } from "react";
import { getUpcomingBookings, getAllBookings } from "../services/bookingService";

export function useUpcomingBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUpcomingBookings();
            setBookings(data);
        } catch (err) {
            setError("Couldn't load bookings. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, error, refetch: fetchBookings };
}
export function useAllBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllBookings();
            setBookings(data);
        } catch (err) {
            setError("Couldn't load booking requests. Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return { bookings, loading, error, refetch: fetchBookings };
}