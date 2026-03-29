import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import LandlordDashboard from "../components/landlord/LandlordDashboard";

import UserHome from "../components/user/UserHome";
import UserProfile from "../components/user/UserProfile";
import SavedPgs from "../components/user/SavedPgs";
import MyBookings from "../components/user/MyBookings";
import EditProfile from "../components/user/EditProfile";

import { AddProperty } from "../pages/AddProperty";
import { BrowsePG } from "../pages/BrowsePG";
import PropertyDetails from "../pages/PropertyDetails";
import BookPG from "../pages/BookPG";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";

const router = createBrowserRouter([
  // ── Auth routes
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // ── User routes — all nested under UserNavbar (which renders <Outlet />)
  {
    path: "/user",
    element: <UserNavbar />,
    children: [
      { index: true, element: <Navigate to="home" replace /> },

      // Main pages
      { path: "home",        element: <UserHome /> },
      { path: "browse",      element: <BrowsePG /> },
      { path: "bookings",    element: <MyBookings /> },
      { path: "savedpgs",    element: <SavedPgs /> },
      { path: "profile",     element: <UserProfile /> },
      { path: "edit-profile",element: <EditProfile /> },

      // Property flow
      { path: "property/:id", element: <PropertyDetails /> },
      { path: "book/:id",     element: <BookPG /> },

      // Misc user pages
      { path: "add-property", element: <AddProperty /> },
    ],
  },

  // ── Admin
  { path: "/admin", element: <AdminSidebar /> },

  // ── Landlord
  { path: "/landlord", element: <LandlordDashboard /> },

  // ── Static pages
  { path: "/t&c",           element: <TermsAndConditions /> },
  { path: "/privacypolicy", element: <PrivacyPolicy /> },

  // ── Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;