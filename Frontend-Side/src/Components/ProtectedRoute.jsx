import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// <ProtectedRoute>                         -> sirf login zaroori
// <ProtectedRoute roles={["volunteer"]}>   -> sirf in roles ko allow
// <ProtectedRoute admin>                   -> sirf admin
export default function ProtectedRoute({ children, roles, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p style={{ padding: "96px 16px", textAlign: "center" }}>Loading...</p>;

  // Login nahi hai to /login bhejo, login ke baad wapas yahin aayega
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}