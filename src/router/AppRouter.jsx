import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Auth
import Login from "../components/Login";
import Signup from "../components/Signup";

// Layout
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import LandlordDashboard from "../components/landlord/LandlordDashboard";

// User Pages
import UserHome from "../components/user/UserHome";
import UserProfile from "../components/user/UserProfile";
import SavedPgs from "../components/user/SavedPgs";
import MyBookings from "../components/user/MyBookings";
import EditProfile from "../components/user/EditProfile";

// Public Pages
import { BrowsePG } from "../pages/BrowsePG";
import PropertyDetails from "../pages/PropertyDetails";
import CheckoutPage from "../pages/CheckoutPage";

// Static
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";

// Simple Protected Route
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <UserNavbar />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "browse", element: <BrowsePG /> },
      { path: "property/:id", element: <PropertyDetails /> },

      // Protected routes
      {
        path: "bookings",
        element: <ProtectedRoute element={<MyBookings />} />,
      },
      {
        path: "savedpgs",
        element: <ProtectedRoute element={<SavedPgs />} />,
      },
      {
        path: "profile",
        element: <ProtectedRoute element={<UserProfile />} />,
      },
      {
        path: "edit-profile",
        element: <ProtectedRoute element={<EditProfile />} />,
      },
      {
        path: "checkout/:id",
        element: <ProtectedRoute element={<CheckoutPage />} />,
      },
    ],
  },

  // Auth
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // Admin
  { path: "/admin", element: <AdminSidebar /> },

  // Landlord
  { path: "/landlord", element: <LandlordDashboard /> },

  // Static
  { path: "/t&c", element: <TermsAndConditions /> },
  { path: "/privacypolicy", element: <PrivacyPolicy /> },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;