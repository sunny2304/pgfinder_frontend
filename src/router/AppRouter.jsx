import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { UserNavbar } from "../components/user/UserNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";

import { UserHome } from "../components/user/UserHome";
import UserProfile from "../components/user/UserProfile";
import SavedPgs from "../components/user/SavedPgs";
import MyBookings from "../components/user/MyBookings";



// NEW
import { AddProperty } from "../pages/AddProperty";
import { BrowsePG } from "../pages/BrowsePG";
import { UserFooter } from "../components/user/UserFooter";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  {
    path: "/user",
    element: <UserNavbar />,
    children: [
      // ✅ default route
      { index: true, element: <Navigate to="home" /> },

      { path: "home", element: <UserHome /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "savedpgs", element: <SavedPgs /> },
      { path: "profile", element: <UserProfile /> },

      // ✅ NEW ROUTE
      { path: "add-property", element: <AddProperty />},
      { path: "browse", element: <BrowsePG /> }
    ],
    // element: <UserFooter/>
  },

  {
    path: "/admin",
    element: <AdminSidebar />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;