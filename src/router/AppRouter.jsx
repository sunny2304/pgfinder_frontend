import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Login  from "../components/Login";
import Signup from "../components/Signup";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import LandlordDashboard from "../components/landlord/LandlordDashboard";

import UserHome  from "../components/user/UserHome";
import UserProfile from "../components/user/UserProfile";
import SavedPgs from "../components/user/SavedPgs";
import MyBookings from "../components/user/MyBookings";

import { AddProperty } from "../pages/AddProperty";
import { BrowsePG }  from "../pages/BrowsePG";
import PropertyDetails from "../pages/PropertyDetails";
import BookPG from "../pages/BookPG"; // ✅ IMPORTANT
import EditProfile from "../components/user/EditProfile";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";


const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/user",
    element: <UserNavbar />,
    children: [
      { index: true, element: <Navigate to="home" /> },

      { path: "home", element: <UserHome /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "savedpgs", element: <SavedPgs /> },
      { path: "profile", element: <UserProfile /> },

      { path: "add-property", element: <AddProperty /> },
      { path: "browse", element: <BrowsePG /> },

      // ✅ PROPERTY DETAILS
      { path: "property/:id", element: <PropertyDetails /> },

      // ✅ BOOK PG (THIS IS IMPORTANT)
      { path: "book/:id", element: <BookPG /> },
      { path: "edit-profile", element: <EditProfile /> },
    ],
  },

  {
    path: "/admin",
    element: <AdminSidebar />,
  },

  {
    path: "/landlord",
    element: <LandlordDashboard/>,
  },

  {
    path: "/t&c",
    element: <TermsAndConditions/>,
  },
  {
    path: "/privacypolicy",
    element: <PrivacyPolicy/>,
  },

  // ❗ OPTIONAL SAFETY (redirect unknown routes)
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;