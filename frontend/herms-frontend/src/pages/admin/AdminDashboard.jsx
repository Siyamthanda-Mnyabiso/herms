import { Link } from "react-router-dom";
import { Users, ArrowRight, CheckCircle2, FileBarChart, ChevronRight, Building2, Stethoscope, CalendarCheck, Clock } from "lucide-react";
import { useAdminData } from "../../hooks/useAdminData";
import { ORGANIZATION_ROLE_SET, PROFESSIONAL_ROLE_SET } from "../../utils/adminRoles";
import Select from "../../components/common/Select";

const BOOKING_SEGMENTS = [
  { label: "Pending", status: "PENDING", color: "var(--color-status-pending)" },
  { label: "Confirmed", status: "CONFIRMED", color: "var(--color-status-confirmed)" },
  { label: "Completed", status: "COMPLETED", color: "var(--color-status-completed)" },
  { label: "Canceled", status: "CANCELED", color: "var(--color-status-declined)" },
];

function donutGradient(segments) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return "var(--color-status-completed-bg)";
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / total) * 100;
    acc += s.value;
    const end = (acc / total) * 100;
    return `${s.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function AdminDashboard() {
  const { users, bookings } = useAdminData();

  const STATS = [
    { icon: Stethoscope, value: users.filter((u) => PROFESSIONAL_ROLE_SET.includes(u.role)).length, label: "Professionals" },
    { icon: Building2, value: users.filter((u) => ORGANIZATION_ROLE_SET.includes(u.role) && u.status === "ACTIVE").length, label: "Organizations" },
    { icon: Clock, value: users.filter((u) => ORGANIZATION_ROLE_SET.includes(u.role) && u.status === "PENDING").length, label: "Pending approvals" },
    { icon: CalendarCheck, value: bookings.length, label: "Bookings" },
  ];
  const REGISTRATIONS = [...users]
    .sort((a, b) => b.accountId - a.accountId)
    .slice(0, 5)
    .map((u) => ({ name: u.name, role: u.role }));
  const BOOKING_BREAKDOWN = BOOKING_SEGMENTS.map((seg) => ({
    ...seg,
    value: bookings.filter((b) => b.status === seg.status).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Platform Overview</h1>
        <Select
          options={[{ value: "month", label: "This Month" }, { value: "week", label: "This Week" }]}
          containerClassName="w-40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Registrations</h2>
            <Link to="/admin/users" className="flex items-center gap-1 text-xs font-medium text-primary-500">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div>
            {REGISTRATIONS.map((r) => (
              <div key={r.name} className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-b-0">
                <span className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Users className="size-4" />
                </span>
                <p className="flex-1 text-sm text-gray-800">{r.name}</p>
                <p className="text-xs capitalize text-gray-400">{r.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Booking Overview</h2>
          <div className="flex items-center gap-6">
            <div
              className="size-28 shrink-0 rounded-full"
              style={{
                background: donutGradient(BOOKING_BREAKDOWN),
                WebkitMask: "radial-gradient(farthest-side, transparent 62%, black 63%)",
                mask: "radial-gradient(farthest-side, transparent 62%, black 63%)",
              }}
            />
            <div className="flex flex-col gap-2">
              {BOOKING_BREAKDOWN.map((segment) => (
                <div key={segment.label} className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="text-gray-600">{segment.label}</span>
                  <span className="font-medium text-gray-900">{segment.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/admin/reports" className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-500">
            View all reports
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">System Health</p>
            <p className="text-xs text-primary-500">All systems operational</p>
          </div>
        </div>

        <Link
          to="/admin/reports"
          className="flex items-center gap-3 rounded-2xl bg-white p-5 text-left shadow-sm hover:bg-gray-50"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <FileBarChart className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Reports</p>
            <p className="text-xs text-gray-500">Generate platform reports</p>
          </div>
          <ChevronRight className="size-4 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
