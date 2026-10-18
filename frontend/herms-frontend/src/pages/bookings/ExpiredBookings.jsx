import { AlertTriangle } from "lucide-react";
import { BOOKING_STATUS } from "../../utils/bookingStatus";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";
import BookingsByStatus from "../../components/cards/BookingsByStatus";

const meta = STATUS_PAGE_META[BOOKING_STATUS.EXPIRED];

export default function ExpiredBookings() {
    return (
        <BookingsByStatus
            title={meta.title}
            statuses={[BOOKING_STATUS.EXPIRED]}
            emptyMessage={meta.emptyMessage}
            banner={
                <div className="flex items-start gap-3 rounded-2xl bg-status-expired-bg p-4 text-sm text-gray-600">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-status-expired" />
                    <p>These requests received no response within 24 hours and were automatically closed.</p>
                </div>
            }
        />
    );
}
