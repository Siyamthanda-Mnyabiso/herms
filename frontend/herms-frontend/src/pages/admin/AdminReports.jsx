import { useAdminData } from "../../hooks/useAdminData";
import { BOOKING_STATUSES, ORGANIZATION_ROLE_SET, PROFESSIONAL_ROLE_SET, countBy } from "../../utils/adminRoles";

function BarList({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">{title}</h2>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 text-sm">
            <span className="w-28 capitalize text-gray-600">{row.label}</span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-primary-500" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
            <span className="w-8 text-right font-medium text-gray-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminReports() {
  const { users, bookings, loading } = useAdminData();

  const byRole = countBy(users, (u) => u.role);
  const orgStatus = countBy(
    users.filter((u) => ORGANIZATION_ROLE_SET.includes(u.role)),
    (u) => u.status
  );
  const bookingStatus = countBy(bookings, (b) => b.status);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Reports</h1>
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarList
            title="Professionals by profession"
            rows={PROFESSIONAL_ROLE_SET.map((r) => ({ label: r, value: byRole[r] ?? 0 }))}
          />
          <BarList
            title="Organizations by type"
            rows={ORGANIZATION_ROLE_SET.map((r) => ({ label: r, value: byRole[r] ?? 0 }))}
          />
          <BarList
            title="Organization approval status"
            rows={["PENDING", "ACTIVE", "REJECTED"].map((s) => ({ label: s.toLowerCase(), value: orgStatus[s] ?? 0 }))}
          />
          <BarList
            title="Bookings by status"
            rows={BOOKING_STATUSES.map((s) => ({ label: s.toLowerCase(), value: bookingStatus[s] ?? 0 }))}
          />
        </div>
      )}
    </div>
  );
}
