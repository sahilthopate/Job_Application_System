import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem('role');

  // Not logged in
  if (!token || !localStorage.getItem('token')) {
    toast.error('Login Must be required');
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (allowedRole && role !== allowedRole) {
    toast.error('You Dont have an access');
    return <Navigate to="/login" replace />;
  }

  // Access allowed
  return <Outlet />;
}
