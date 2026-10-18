import { useState } from "react";
import Select from "../../components/common/Select";
import StatusBadge from "../../components/common/StatusBadge";
import { useAdminData } from "../../hooks/useAdminData";
import { BOOKING_STATUSES } from "../../utils/adminRoles";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export default function AdminBookings() {
  const { bookings, loading } = useAdminData();
  const [status, setStatus] = useState("all");

  const shown = bookings.filter((b) => status === "all" || b.status === status);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Bookings</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Select
          label="Status"
          value={status}
          onChange={(ev) => setStatus(ev.target.value)}
          options={[{ value: "all", label: "All" }, ...BOOKING_STATUSES.map((s) => ({ value: s, label: s }))]}
          containerClassName="w-40"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Booking</th>
              <th className="px-5 py-3 font-medium">Booked on</th>
              <th className="px-5 py-3 font-medium">Start</th>
              <th className="px-5 py-3 font-medium">End</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading && shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">No bookings found.</td>
              </tr>
            )}
            {shown.map((b) => (
              <tr key={b.bookingId} className="border-b border-gray-50 last:border-b-0">
                <td className="px-5 py-3 font-medium text-gray-900">#{b.bookingId}</td>
                <td className="px-5 py-3 text-gray-600">{formatDate(b.bookingDate)}</td>
                <td className="px-5 py-3 text-gray-600">{formatDate(b.startDay)}</td>
                <td className="px-5 py-3 text-gray-600">{formatDate(b.endDay)}</td>
                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
