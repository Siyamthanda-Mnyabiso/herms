import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  CalendarCheck,
  Inbox,
  Bell,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";

const SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/professional" }],
  },
  {
    title: "PROFILE",
    items: [
      { label: "My Profile", icon: User, to: "/professional/profile" },
      { label: "Availability", icon: Calendar, to: "/professional/availability" },
      { label: "Qualifications", icon: GraduationCap, to: "/professional/qualifications" },
      { label: "Experience", icon: Briefcase, to: "/professional/experience" },
      { label: "Skills", icon: Star, to: "/professional/skills" },
    ],
  },
  {
    title: "BOOKINGS",
    items: [
      { label: "My Bookings", icon: CalendarCheck, to: "/professional/bookings" },
      { label: "Requests", icon: Inbox, to: "/professional/requests" },
    ],
  },
];

export default function ProfessionalLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sections={SECTIONS} user={{ initials: "", name: "", role: "" }} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-gray-100 bg-white px-6 py-3">
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <Bell className="size-4" />
          </button>
          <span className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
