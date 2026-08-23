import { useMemo, useState } from "react";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import BookingRequestCard from "./BookingRequestCard";
import { displayName } from "../../pages/bookings/utils/bookingHelpers";

const PAGE_SIZE = 5;

export default function BookingStatusList({
                                              title,
                                              bookings,
                                              emptyMessage,
                                              onAccept,
                                              onDecline,
                                              onCancel,
                                              onViewDetails,
                                              banner,
                                          }) {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

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

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <SearchBar
                    placeholder="Search by name, role, organization..."
                    className="max-w-xs"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {banner}

            {pageItems.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    {emptyMessage}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {pageItems.map((booking) => (
                        <BookingRequestCard
                            key={booking.id}
                            booking={booking}
                            onAccept={onAccept}
                            onDecline={onDecline}
                            onCancel={onCancel}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            )}

            {filtered.length > PAGE_SIZE && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
