import { Clock } from "lucide-react";
import BookingsByStatus from "../../components/cards/BookingsByStatus";
import { BOOKING_STATUS } from "../../utils/bookingStatus";
import { STATUS_PAGE_META } from "./utils/bookingHelpers";

const meta = STATUS_PAGE_META[BOOKING_STATUS.PENDING];

export default function PendingBookings() {
    return (
        <BookingsByStatus
            title={meta.title}
            statuses={[BOOKING_STATUS.PENDING]}
            emptyMessage={meta.emptyMessage}
            actions={["cancel"]}
            banner={
                <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                    <Clock className="mt-0.5 size-4 shrink-0" />
                    <p>
                        Professionals have 24 hours to respond. Requests that go unanswered move
                        automatically to Expired Requests.
                    </p>
                </div>
            }
        />
    );
}
