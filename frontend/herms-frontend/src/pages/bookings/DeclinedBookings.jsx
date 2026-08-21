import { getBookingsByStatus, BOOKING_STATUS } from "./data/mockBookings";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";
import BookingStatusList from "../../components/cards/BookingStatusList";

const meta = STATUS_PAGE_META[BOOKING_STATUS.DECLINED];

export default function DeclinedBookings() {
    const bookings = getBookingsByStatus(BOOKING_STATUS.DECLINED);

    return (
        <BookingStatusList title={meta.title} bookings={bookings} emptyMessage={meta.emptyMessage} />
    );
}