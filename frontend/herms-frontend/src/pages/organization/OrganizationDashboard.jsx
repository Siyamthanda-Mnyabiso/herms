import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarCheck, CalendarDays, CalendarClock } from "lucide-react";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import BookingCard from "../../components/cards/BookingCard";
import { getUpcomingBookings } from "../../services/bookingService";

function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();

  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return date >= monday && date <= sunday;
}

function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function OrganizationDashboard() {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState("month");
  const navigate = useNavigate();

  useEffect(() => {
    getUpcomingBookings()
      .then(setAllBookings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = useMemo(
    () => allBookings.filter((b) => (period === "week" ? isThisWeek(b.startDay) : isThisMonth(b.startDay))),
    [allBookings, period]
  );

  const upcoming = useMemo(
    () =>
      allBookings
        .filter((b) => new Date(b.startDay) >= new Date())
        .sort((a, b) => new Date(a.startDay) - new Date(b.startDay))
        .slice(0, 5),
    [allBookings]
  );

  const stats = [
    { icon: CalendarCheck, value: allBookings.length, label: "Confirmed bookings" },
    { icon: CalendarDays, value: allBookings.filter((b) => isThisWeek(b.startDay)).length, label: "Starting this week" },
    { icon: CalendarClock, value: allBookings.filter((b) => isThisMonth(b.startDay)).length, label: "Starting this month" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500">Here's what's happening with your bookings.</p>
        </div>

        <Select
          options={[
            { value: "month", label: "This Month" },
            { value: "week", label: "This Week" },
          ]}
          value={period}
          onChange={(ev) => setPeriod(ev.target.value)}
          containerClassName="w-40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(({ icon: Icon, value, label }) => (
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/organization/bookings" className="flex items-center gap-1 text-xs font-medium text-primary-500">
              View all bookings
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div>
            {loading && <p className="text-sm text-gray-400">Loading...</p>}
            {error && <p className="text-sm text-status-declined">Couldn't load bookings. Try again later.</p>}
            {!loading && !error && filteredBookings.length === 0 && (
              <p className="text-sm text-gray-400">No bookings found for this {period}.</p>
            )}
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} {...booking} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming</h2>
          <p className="mt-1 text-xs text-gray-500">
            {upcoming.length === 0 ? "No upcoming shifts" : `Your next ${upcoming.length} booked shift${upcoming.length === 1 ? "" : "s"}`}
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {upcoming.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{booking.dates}</span>
                <span className="text-gray-500">{booking.role}</span>
              </div>
            ))}
          </div>
          <Button variant="amber" fullWidth className="mt-5" onClick={() => navigate("/organization/browse")}>
            Find professionals
          </Button>
        </div>
      </div>
    </div>
  );
}
