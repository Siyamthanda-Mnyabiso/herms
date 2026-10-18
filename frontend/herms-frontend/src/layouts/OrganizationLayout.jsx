import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Bookmark,
  CalendarCheck,
  Building2,
  Settings,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";
import { initialsOf } from "../utils/initials";
import { useAuth } from "../hooks/useAuth.js";

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
      { label: "Settings", icon: Settings, to: "/organization/settings" },
    ],
  },
];

export default function OrganizationLayout() {
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
