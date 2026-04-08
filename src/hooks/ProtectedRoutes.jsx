import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Role mismatch
  if (role && user?.role !== role) {

    // redirect based on actual role
    if (user?.role === "user") return <Navigate to="/" />;
    if (user?.role === "landlord") return <Navigate to="/landlord" />;
    if (user?.role === "admin") return <Navigate to="/admin" />;

    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;