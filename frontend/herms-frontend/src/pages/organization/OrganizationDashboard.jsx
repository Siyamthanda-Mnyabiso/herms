import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import BookingCard from "../../components/cards/BookingCard";
import { getUpcomingBookings } from "../../services/bookingService";

const STATS = [];
const UPCOMING_NEEDS = [];

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
  return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
  );
}

export default function OrganizationDashboard() {
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    getUpcomingBookings()
        .then((data) => {
          console.log("Loaded bookings:", data); // ← check this in console
          setAllBookings(data);
          setFilteredBookings(data);
        })
        .catch((err) => console.error("Failed to load bookings:", err))
        .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    console.log("period:", period);
    console.log("allBookings:", allBookings);

    if (period === "week") {
      const filtered = allBookings.filter((b) => isThisWeek(b.startDay));
      console.log("week filter result:", filtered);
      setFilteredBookings(filtered);
    } else {
      const filtered = allBookings.filter((b) => isThisMonth(b.startDay));
      console.log("month filter result:", filtered);
      setFilteredBookings(filtered);
    }
  }, [period, allBookings]);

  return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Here's what's happening with your bookings.
            </p>
          </div>

          <Select
              options={[
                { value: "month", label: "This Month" },
                { value: "week", label: "This Week" },
              ]}
              value={period}
              onChange={(valueOrEvent) => {
                // works with both normal <select> and custom Select
                const value =
                    typeof valueOrEvent === "string"
                        ? valueOrEvent
                        : valueOrEvent?.target?.value;
                console.log("Period changed to:", value);
                if (value) setPeriod(value);
              }}
              containerClassName="w-40"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
              <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
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
              <h2 className="text-sm font-semibold text-gray-900">
                Recent Bookings
              </h2>
              <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-primary-500"
              >
                View all bookings
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            <div>
              {loading && <p className="text-sm text-gray-400">Loading...</p>}
              {!loading && filteredBookings.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No bookings found for this {period}.
                  </p>
              )}
              {filteredBookings.map((booking) => (
                  <BookingCard key={booking.name} {...booking} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Needs</h2>
            <p className="mt-1 text-xs text-gray-500">
              You have {UPCOMING_NEEDS.length} upcoming shifts
            </p>
            <p className="mt-3 text-xs font-medium text-gray-400">August 2024</p>
            <div className="mt-2 flex flex-col gap-3">
              {UPCOMING_NEEDS.map((need) => (
                  <div
                      key={need.dates}
                      className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{need.dates}</span>
                    <span className="text-gray-500">{need.role}</span>
                  </div>
              ))}
            </div>
            <Button variant="amber" fullWidth className="mt-5">
              Post a new requirement
            </Button>
          </div>
        </div>
      </div>
  );
}