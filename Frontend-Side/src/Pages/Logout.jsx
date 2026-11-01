import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    logout()
      .then(() => navigate("/login", { replace: true }))
      .catch(() => setError("Logout nahi ho paya. Backend chalu hai?"));
  }, [logout, navigate]);

  if (error) return <p style={{ padding: "96px 16px", textAlign: "center", color: "#dc2626" }}>{error}</p>;
  return <p style={{ padding: "96px 16px", textAlign: "center" }}>Logout ho raha hai...</p>;
}
