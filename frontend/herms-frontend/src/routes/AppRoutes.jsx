import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login.jsx";
import OrganizationLayout from "../layouts/OrganizationLayout";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import BrowseCandidates from "../pages/organization/BrowseCandidates";
import ProfessionalLayout from "../layouts/ProfessionalLayout";
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import BookingRequest from "../pages/bookings/BookingRequest";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login/>} />


      <Route path="/organization" element={<OrganizationLayout />}>
        <Route index element={<OrganizationDashboard />} />
        <Route path="browse" element={<BrowseCandidates />} />
      </Route>

      <Route path="/professional" element={<ProfessionalLayout />}>
        <Route index element={<ProfessionalDashboard />} />
        <Route path="requests" element={<BookingRequest />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
