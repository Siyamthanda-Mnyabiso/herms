import BookingsByStatus from "../../components/cards/BookingsByStatus";
import { BOOKING_STATUS } from "../../utils/bookingStatus";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";

const meta = STATUS_PAGE_META[BOOKING_STATUS.CONFIRMED];

export default function ConfirmedBookings() {
    return (
        <BookingsByStatus
            title={meta.title}
            statuses={[BOOKING_STATUS.CONFIRMED]}
            emptyMessage={meta.emptyMessage}
            actions={["cancel"]}
        />
    );
}
