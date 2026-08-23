import { useMemo, useState } from "react";
import { User, Clock, AlertTriangle } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { mockBookings, BOOKING_STATUS } from "./data/mockBookings";
import {
    displayName,
    formatDateRange,
    getResponseCountdown,
    isUrgent,
} from "./utils/bookingHelpers";

const PAGE_SIZE = 5;

export default function PendingBookings() {
    const [bookings, setBookings] = useState(
        mockBookings.filter((b) => b.status === BOOKING_STATUS.PENDING)
    );
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [cancelTarget, setCancelTarget] = useState(null);

    const filtered = useMemo(() => {
        if (!query.trim()) return bookings;
        const q = query.trim().toLowerCase();
        return bookings.filter(
            (b) =>
                displayName(b).toLowerCase().includes(q) ||
                b.role.toLowerCase().includes(q) ||
                (b.organization ?? "").toLowerCase().includes(q)
        );
    }, [bookings, query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleCancelConfirm() {
        setBookings((prev) => prev.filter((b) => b.id !== cancelTarget.id));
        setCancelTarget(null);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-900">Pending Requests</h1>
                <SearchBar
                    placeholder="Search by role, organization..."
                    className="max-w-xs"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <p>
                    Professionals have 24 hours to respond. Requests that go unanswered move
                    automatically to Expired Requests.
                </p>
            </div>

            {pageItems.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No pending booking requests right now.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {pageItems.map((booking) => {
                        const countdown = getResponseCountdown(booking);
                        const urgent = isUrgent(booking);

                        return (
                            <div key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm">
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
                                        <p className="text-gray-700">
                                            {formatDateRange(booking.startDate, booking.endDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Duration</p>
                                        <p className="text-gray-700">{booking.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Rate</p>
                                        <p className="text-gray-700">{booking.rate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Qualifications</p>
                                        <p className="text-gray-700">{booking.qualifications}</p>
                                    </div>
                                </div>

                                <div
                                    className={[
                                        "mt-3 flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                        urgent
                                            ? "bg-status-declined-bg text-status-declined"
                                            : "bg-status-pending-bg text-status-pending",
                                    ].join(" ")}
                                >
                                    {urgent ? <AlertTriangle className="size-3.5" /> : <Clock className="size-3.5" />}
                                    {countdown.label}
                                </div>

                                <div className="mt-4">
                                    <Button variant="danger" size="sm" onClick={() => setCancelTarget(booking)}>
                                        Withdraw Request
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {filtered.length > PAGE_SIZE && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}

            <ConfirmModal
                open={!!cancelTarget}
                title="Withdraw this request?"
                description="The professional will no longer be able to accept it."
                confirmLabel="Withdraw Request"
                onConfirm={handleCancelConfirm}
                onClose={() => setCancelTarget(null)}
            />
        </div>
    );
}
