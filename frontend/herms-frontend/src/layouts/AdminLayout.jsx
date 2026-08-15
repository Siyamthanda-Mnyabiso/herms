import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  CalendarCheck,
  BarChart3,
  Settings,
  FileText,
  Bell,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";

const SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/admin" }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Organizations", icon: Building2, to: "/admin/organizations" },
      { label: "Professionals", icon: Stethoscope, to: "/admin/professionals" },
      { label: "Bookings", icon: CalendarCheck, to: "/admin/bookings" },
      { label: "Reports", icon: BarChart3, to: "/admin/reports" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Settings", icon: Settings, to: "/admin/settings" },
      { label: "Audit Logs", icon: FileText, to: "/admin/audit-logs" },
    ],
  },
];

export default function AdminLayout() {
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
