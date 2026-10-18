import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  CalendarCheck,
  BarChart3,
  Settings,
  FileText,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";
import { useAuth } from "../hooks/useAuth.js";
import { initialsOf } from "../utils/initials";

const SECTIONS = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/admin" }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Users", icon: Users, to: "/admin/users" },
      { label: "Admins", icon: ShieldCheck, to: "/admin/admins" },
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = initialsOf(user?.name);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sections={SECTIONS}
        user={{ initials, name: user?.name ?? "", role: user?.role ?? "" }}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 flex-col">
        <TopBar initials={initials} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
