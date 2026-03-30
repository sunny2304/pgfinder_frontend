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

// Protected Route
import ProtectedRoute from "../hooks/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserNavbar />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "browse", element: <BrowsePG /> },
      { path: "property/:id", element: <PropertyDetails /> },

      // 🔐 Protected Routes
      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "savedpgs",
        element: (
          <ProtectedRoute>
            <SavedPgs />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout/:id",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Auth
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // 🔐 Landlord (Protected)
  {
    path: "/landlord",
    element: (
      <ProtectedRoute>
        <LandlordDashboard />
      </ProtectedRoute>
    ),
  },

  // Admin (can protect later)
  { path: "/admin", element: <AdminSidebar /> },

  // Static
  { path: "/t&c", element: <TermsAndConditions /> },
  { path: "/privacypolicy", element: <PrivacyPolicy /> },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;