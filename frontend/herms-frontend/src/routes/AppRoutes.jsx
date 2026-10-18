import { Routes, Route } from "react-router-dom";

import RoleRoute from "./RoleRoute.jsx";

import Home from "../pages/Home";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import NotFound from "../pages/NotFound";

import OrganizationLayout from "../layouts/OrganizationLayout";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import BrowseCandidates from "../pages/organization/BrowseCandidates";
import Shortlisted from "../pages/organization/Shortlisted";

import ProfessionalLayout from "../layouts/ProfessionalLayout";
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import ProfessionalProfile from "../pages/professional/Profile";
import ProfessionalAvailability from "../pages/professional/Availability";
import ProfessionalQualifications from "../pages/professional/Qualifications";
import ProfessionalExperience from "../pages/professional/Experience";
import ProfessionalSkills from "../pages/professional/Skills";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminOrganizations from "../pages/admin/AdminOrganizations";
import RegisterOrganization from "../pages/auth/RegisterOrganization.jsx";
import AccountType from "../components/forms/AccountType.jsx";
import Account from "../pages/auth/Account.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

import BookingRequest from "../pages/bookings/BookingRequest";
import PendingBookings from "../pages/bookings/PendingBookings";
import AcceptedBookings from "../pages/bookings/AcceptedBookings";
import DeclinedBookings from "../pages/bookings/DeclinedBookings";
import ExpiredBookings from "../pages/bookings/ExpiredBookings";
import ConfirmedBookings from "../pages/bookings/ConfirmedBookings";
import BookingHistory from "../pages/bookings/BookingHistory";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/organization" element={<RegisterOrganization />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account" element={<Account/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/forgot-password/reset-password" element={<ResetPassword />} />

      <Route element={<RoleRoute roles={["hospital", "pharmacy", "school"]} />}>
        <Route path="/organization" element={<OrganizationLayout />}>
          <Route index element={<OrganizationDashboard />} />
          <Route path="browse" element={<BrowseCandidates />} />
          <Route path="shortlisted" element={<Shortlisted />} />
          <Route path="bookings" element={<PendingBookings />} />
          <Route path="bookings/accepted" element={<AcceptedBookings />} />
          <Route path="bookings/declined" element={<DeclinedBookings />} />
          <Route path="bookings/expired" element={<ExpiredBookings />} />
          <Route path="bookings/confirmed" element={<ConfirmedBookings />} />
          <Route path="bookings/history" element={<BookingHistory />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={["doctor", "nurse", "teacher", "pharmacist"]} />}>
        <Route path="/professional" element={<ProfessionalLayout />}>
          <Route index element={<ProfessionalDashboard />} />
          <Route path="profile" element={<ProfessionalProfile />} />
          <Route path="availability" element={<ProfessionalAvailability />} />
          <Route path="qualifications" element={<ProfessionalQualifications />} />
          <Route path="experience" element={<ProfessionalExperience />} />
          <Route path="skills" element={<ProfessionalSkills />} />
          <Route path="requests" element={<BookingRequest />} />
          <Route path="bookings" element={<AcceptedBookings />} />
          <Route path="bookings/history" element={<BookingHistory />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="organizations" element={<AdminOrganizations />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}