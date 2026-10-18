import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  CalendarCheck,
  Inbox,
} from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";
import { initialsOf } from "../utils/initials";
import { useAuth } from "../hooks/useAuth.js";

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
