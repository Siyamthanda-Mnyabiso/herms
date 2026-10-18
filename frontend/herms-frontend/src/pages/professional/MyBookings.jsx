import BookingsByStatus from "../../components/cards/BookingsByStatus";
import { BOOKING_STATUS } from "../../utils/bookingStatus";

export default function MyBookings() {
    return (
        <BookingsByStatus
            title="My Bookings"
            statuses={[BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.CONFIRMED]}
            emptyMessage="No accepted or confirmed bookings yet."
        />
    );
}
