import BookingsByStatus from "../../components/cards/BookingsByStatus";
import { BOOKING_STATUS } from "../../utils/bookingStatus";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";

const meta = STATUS_PAGE_META[BOOKING_STATUS.DECLINED];

export default function DeclinedBookings() {
    return <BookingsByStatus title={meta.title} statuses={[BOOKING_STATUS.DECLINED]} emptyMessage={meta.emptyMessage} />;
}
