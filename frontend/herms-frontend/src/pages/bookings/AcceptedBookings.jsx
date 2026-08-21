import { useMemo, useState } from "react";
import { User } from "lucide-react";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { getBookingsByStatus, BOOKING_STATUS } from "./data/mockBookings";
import { displayName, formatDateRange } from "./utils/bookingHelpers";

const PAGE_SIZE = 5;

export default function AcceptedBookings() {
    const bookings = getBookingsByStatus(BOOKING_STATUS.ACCEPTED);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        if (!query.trim()) return bookings;
        const q = query.trim().toLowerCase();
        return bookings.filter(
            (b) => displayName(b).toLowerCase().includes(q) || b.role.toLowerCase().includes(q)
        );
    }, [bookings, query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-900">Accepted Bookings</h1>
                <SearchBar
                    placeholder="Search by name, role..."
                    className="max-w-xs"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {pageItems.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    No accepted bookings yet.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {pageItems.map((booking) => (
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
                        </div>
                    ))}
                </div>
            )}

            {filtered.length > PAGE_SIZE && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
