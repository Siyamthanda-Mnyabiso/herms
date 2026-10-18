import { User, Clock, AlertTriangle } from "lucide-react";
import Button from "../common/Button";
import StatusBadge from "../common/StatusBadge";
import { BOOKING_STATUS } from "../../utils/bookingStatus";
import { displayName, formatDateRange, getResponseCountdown, isUrgent } from "../../pages/bookings/utils/bookingHelpers";

const CANCELLABLE = [BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.CONFIRMED];

export default function BookingRequestCard({ booking, onAccept, onDecline, onConfirm, onCancel }) {
    const pending = booking.status === BOOKING_STATUS.PENDING;
    const countdown = pending && booking.respondBy ? getResponseCountdown(booking) : null;
    const urgent = countdown ? isUrgent(booking) : false;
    const professionalView = booking.viewerRole === "professional";

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <User className="size-5" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{displayName(booking)}</p>
                        <p className="text-xs text-gray-500">{booking.role}</p>
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                    <p className="text-xs text-gray-400">Dates</p>
                    <p className="text-gray-700">{formatDateRange(booking.startDate, booking.endDate)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-gray-700">{booking.duration}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">{professionalView ? "Requested" : "Qualifications"}</p>
                    <p className="text-gray-700">
                        {professionalView
                            ? new Date(booking.requestedAt).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })
                            : booking.qualifications}
                    </p>
                </div>
            </div>

            {booking.declineReason && (
                <p className="mt-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Reason:</span> {booking.declineReason}
                </p>
            )}

            {countdown && (
                <div
                    className={[
                        "mt-3 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        urgent ? "bg-status-declined-bg text-status-declined" : "bg-status-pending-bg text-status-pending",
                    ].join(" ")}
                >
                    {urgent ? <AlertTriangle className="size-3.5" /> : <Clock className="size-3.5" />}
                    {countdown.label}
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
                {pending && onDecline && (
                    <Button variant="secondary" size="sm" onClick={() => onDecline(booking)}>
                        Decline
                    </Button>
                )}
                {pending && onAccept && (
                    <Button variant="amber" size="sm" onClick={() => onAccept(booking)}>
                        Accept
                    </Button>
                )}
                {booking.status === BOOKING_STATUS.ACCEPTED && onConfirm && (
                    <Button variant="amber" size="sm" onClick={() => onConfirm(booking)}>
                        Confirm Booking
                    </Button>
                )}
                {CANCELLABLE.includes(booking.status) && onCancel && (
                    <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
                        {pending ? "Withdraw Request" : "Cancel Booking"}
                    </Button>
                )}
            </div>
        </div>
    );
}
