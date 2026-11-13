import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // sirf ek baar chalao
    ran.current = true;
    Promise.resolve(logout())
      .catch(() => {})
      .finally(() => navigate("/", { replace: true })); // "/" par Auth page dikhega
  }, [logout, navigate]);

  return (
    <p style={{ padding: "96px 16px", textAlign: "center" }}>
      Logout ho raha hai...
    </p>
  );
}