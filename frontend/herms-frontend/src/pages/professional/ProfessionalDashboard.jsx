import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Inbox, UserCheck } from "lucide-react";
import Button from "../../components/common/Button";
import BookingCard from "../../components/cards/BookingCard";
import { useUpcomingBookings, useMyBookings } from "../../hooks/useBookings";
import StatusBadge from "../../components/common/StatusBadge";
import ErrorMessage from "../../components/common/ErrorMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateProfile } from "../../services/professionalService";
import { useNotification } from "../../context/NotificationContext";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—");

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [profile, setProfile] = useState(null);
  const [available, setAvailable] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const { bookings: UPCOMING_BOOKINGS, loading, error, refetch } = useUpcomingBookings();
  const { bookings: myBookings } = useMyBookings();
  const PENDING_REQUESTS = useMemo(() => myBookings.filter((b) => b.status === "pending"), [myBookings]);
  const STATS = [
    { icon: CalendarCheck, value: UPCOMING_BOOKINGS.length, label: "Upcoming bookings" },
    { icon: Inbox, value: PENDING_REQUESTS.length, label: "Pending requests" },
    { icon: UserCheck, value: available ? "Available" : "Unavailable", label: "Status" },
  ];

  useEffect(() => {
    if (!user?.role || !user?.refId) {
      return;
    }
    getProfile(user.role, user.refId)
      .then((data) => {
        setProfile(data);
        setAvailable(data.availabilityStatus === "AVAILABLE");
      })
      .catch((err) => console.error("Failed to load profile:", err));
  }, [user?.role, user?.refId]);

  async function handleUpdateAvailability() {
    if (!user?.role || !profile) {
      return;
    }
    setSavingAvailability(true);
    try {
      const nextStatus = available ? "AVAILABLE" : "NOT_AVAILABLE";
      const updated = await updateProfile(user.role, { ...profile, availabilityStatus: nextStatus });
      setProfile(updated);
      notify("Availability updated", "success");
    } catch (err) {
      console.error("Failed to update availability:", err);
      notify("Could not update availability", "error");
    } finally {
      setSavingAvailability(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500">Here's your professional overview.</p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Pending Requests</h2>
              <Link to="/professional/requests" className="flex items-center gap-1 text-xs font-medium text-primary-500">
                View all requests
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div>
              {PENDING_REQUESTS.length === 0 && <p className="text-sm text-gray-400">No pending requests.</p>}
              {PENDING_REQUESTS.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-900">{request.organization}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500">
                      {formatDate(request.startDate)} – {formatDate(request.endDate)}
                    </p>
                    <StatusBadge status="pending" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Upcoming Bookings</h2>
              <Link to="/professional/bookings" className="flex items-center gap-1 text-xs font-medium text-primary-500">
                View all bookings
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div>
              {loading && <LoadingSpinner />}
              {error && <ErrorMessage message={error} onRetry={refetch} />}
              {!loading && !error && UPCOMING_BOOKINGS.length === 0 && (
                <p className="text-sm text-gray-400">No upcoming bookings.</p>
              )}
              {!loading && !error && UPCOMING_BOOKINGS.map((booking) => (
                  <BookingCard key={booking.id} {...booking} />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Availability</h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">You are available</span>
            <button
              type="button"
              role="switch"
              aria-checked={available}
              onClick={() => setAvailable((value) => !value)}
              className={[
                "relative h-6 w-11 rounded-full transition-colors",
                available ? "bg-primary-500" : "bg-gray-200",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                  available ? "translate-x-5.5 left-0.5" : "left-0.5",
                ].join(" ")}
              />
            </button>
          </div>

          <Link to="/professional/availability" className="mt-4 block text-xs font-medium text-primary-500">
            Manage availability dates
          </Link>

          <Button
            variant="amber"
            fullWidth
            className="mt-5"
            onClick={handleUpdateAvailability}
            disabled={savingAvailability}
          >
            {savingAvailability ? "Updating..." : "Update Availability"}
          </Button>
        </div>
      </div>
    </div>
  );
}
