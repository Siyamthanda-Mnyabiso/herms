import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  CalendarCheck,
  Building2,
  Users,
  Settings,
  Bell,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";

const SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/organization" }],
  },
  {
    title: "PROFESSIONALS",
    items: [
      { label: "Browse Professionals", icon: Search, to: "/organization/browse" },
      { label: "Shortlisted", icon: Bookmark, to: "/organization/shortlisted" },
      { label: "Bookings", icon: CalendarCheck, to: "/organization/bookings" },
    ],
  },
  {
    title: "ORGANIZATION",
    items: [
      { label: "Profile", icon: Building2, to: "/organization/profile" },
      { label: "Team Members", icon: Users, to: "/organization/team" },
      { label: "Settings", icon: Settings, to: "/organization/settings" },
    ],
  },
];

export default function OrganizationLayout() {
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
