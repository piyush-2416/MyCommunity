import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
// import NotificationBell from "./NotificationBell ";
// import NotificationBell from "./NotificationBell";
/* Sidebar ka poora menu yahin se banta hai.
   Naya item chahiye to bas yahan ek line add kar do. */
const sections = [
  {
    label: "Community",
    items: [
      { icon: "🏠", text: "Home", to: "/" },
      { icon: "🤝", text: "Volunteers", to: "/Directory", noActive: true },
      { icon: "🗳️", text: "Polls & Voting", to: "/Society_Polls" },
    ],
  },
  {
    label: "AI Features",
    items: [
      { icon: "🛡️", text: "AI Safety Planner", to: "/SafetyPlanner" },
      { icon: "🆘", text: "AI Self-Safety", to: "/SafetyChecker" },
    ],
  },
  {
    label: "Discover",
    items: [
      { icon: "🏪", text: "Business", to: "/Business" },
      { icon: "🔎", text: "Explore", to: "/Explore" },

      { icon: "🌐", text: "Community Feed", to: "/Feed" },
      { icon: "📸", text: "Memories", to: "/Gallery" },
      { icon: "🏆", text: "Achievements", to: "/Achievements" },
      { icon: "💬", text: "Feedback", to: "/Feedback" },
      { icon: "ℹ️", text: "About", to: "/About" },
    ],
  },
  {
    label: "Account",
    items: [{ icon: "👤", text: "My Profile", to: "/Profile" }],
  },
];

// Volunteer Sidebar

const volunteerSections = [
  {
    label: "Community",
    items: [
      { icon: "🏠", text: "Dashboard", to: "/", end: true },
      { icon: "🎉", text: "Community Events", to: "/Events" },
      { icon: "📢", text: "Complaints", to: "/Complaints" },
      { icon: "🚨", text: "Emergency", to: "/Emergency" },
      { icon: "🗳️", text: "Voting Polls", to: "/Society_Polls" },
      { icon: "📇", text: "Directory", to: "/Directory" },
      { icon: "🏪", text: "Business", to: "/Business" },
    ],
  },
  {
    label: "AI Features",
    items: [
      { icon: "🛡️", text: "AI Safety Planner", to: "/SafetyPlanner" },
      { icon: "🆘", text: "AI Self-Safety", to: "/SafetyChecker" },
    ],
  },
  {
    label: "Discover",
    items: [
      { icon: "📰", text: "Blogs", to: "/Blogs" },
      { icon: "📸", text: "Memories", to: "/Gallery" },
      { icon: "🌐", text: "Community Feed", to: "/Feed" },

      { icon: "💬", text: "Feedback", to: "/Feedback" },
    ],
  },
  {
    label: "Account",
    items: [{ icon: "👤", text: "My Profile", to: "/Profile" }],
  },
];

const baseItem =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium";
const idleItem = "text-slate-600 hover:bg-slate-50";
const activeItem = "bg-emerald-50 text-emerald-700";

function IconBubble({ icon, active }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base ${
        active ? "bg-white shadow-sm" : "bg-slate-100"
      }`}
    >
      {icon}
    </span>
  );
}

function Navbar() {
  // Hooks hamesha component ke ANDAR hote hain (pehle ye bahar the, isliye crash hota tha)
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const isVolunteer = user?.role === "volunteer";

  // Volunteer ke Account section mein "My Directory Profile" bhi dikhe
  //  const isVolunteer = user?.role === "volunteer";
  const menu = isVolunteer ? volunteerSections : sections;
  const drawerRef = useRef(null);
  const noBtnRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Link click hote hi sidebar band ho jaye (mobile pe zaroori)
  const closeDrawer = () => {
    if (drawerRef.current) drawerRef.current.checked = false;
  };

  // Logout confirm popup: Escape se band, focus safe option ("Nahi") par
  useEffect(() => {
    if (!confirmOpen) return;
    noBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && !loggingOut) setConfirmOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, loggingOut]);

  const askLogout = () => {
    closeDrawer();
    setLogoutError("");
    setConfirmOpen(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setConfirmOpen(false);
      navigate("/login", { replace: true });
    } catch (err) {
      setLogoutError(
        err?.response?.data?.message || "Logout nahi ho paya, dobara try karo",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div>
      <div className="drawer">
        <input
          id="my-drawer-1"
          type="checkbox"
          className="drawer-toggle"
          ref={drawerRef}
        />
        <div className="drawer-content"></div>

        <div className="z-50 drawer-side">
          <label
            htmlFor="my-drawer-1"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <aside className="flex flex-col bg-white shadow-xl w-72 max-w-[85vw] min-h-full">
            {/* Header */}
            <div className="flex items-center gap-3 bg-emerald-600 px-4 py-5">
              <img
                src="/MyCommunity%20Logo.png"
                alt="MyCommunity Logo"
                className="bg-white p-1 border-2 border-white rounded-full w-11 h-11 object-contain shrink-0"
              />
              <Link
                to="/"
                onClick={closeDrawer}
                className="flex-1 min-w-0 text-white"
              >
                <p className="font-bold text-base truncate leading-tight">
                  MyCommunity
                </p>
                <p className="text-emerald-100 text-xs truncate">
                  Our neighbourhood, together
                </p>
              </Link>
              <label
                htmlFor="my-drawer-1"
                aria-label="Close sidebar"
                className="flex justify-center items-center bg-white/20 rounded-full w-8 h-8 text-white text-sm cursor-pointer shrink-0"
              >
                ✕
              </label>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              {menu.map((section) => (
                <div key={section.label} className="mb-5 last:mb-0">
                  <p className="mb-2 px-3 font-semibold text-slate-400 text-xs">
                    {section.label}
                  </p>

                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.text}>
                        {item.to && item.noActive ? (
                          <Link
                            to={item.to}
                            onClick={closeDrawer}
                            className={`${baseItem} ${idleItem}`}
                          >
                            <IconBubble icon={item.icon} />
                            {item.text}
                          </Link>
                        ) : item.to ? (
                          <NavLink
                            to={item.to}
                            end={item.end}
                            onClick={closeDrawer}
                            className={({ isActive }) =>
                              `${baseItem} ${isActive ? activeItem : idleItem}`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <IconBubble
                                  icon={item.icon}
                                  active={isActive}
                                />
                                {item.text}
                              </>
                            )}
                          </NavLink>
                        ) : (
                          <button
                            type="button"
                            onClick={closeDrawer}
                            className={`${baseItem} ${idleItem}`}
                          >
                            <IconBubble icon={item.icon} />
                            {item.text}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Footer: Logout (login hone par) ya Login / Sign up */}
            {/* <div1 className="p-3 border-slate-100 border-t">
              
               
             
                <div className="gap-2 grid grid-cols-2">
                  <Link
                    to="/login"
                    onClick={closeDrawer}
                    className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2.5 rounded-xl font-semibold text-white text-sm text-center transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeDrawer}
                    className="hover:bg-emerald-50 px-3 py-2.5 border border-emerald-200 rounded-xl font-semibold text-emerald-700 text-sm text-center transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
            
            </div1> */}
          </aside>
        </div>
      </div>

      {/* Top navbar */}
      <div
        className="bg-base-100 shadow-sm navbar"
        style={{ backgroundColor: "mediumseagreen" }}
      >
        <div className="navbar-start">
          <label htmlFor="my-drawer-1" className="inline-block cursor-pointer">
            <img
              src="/MyCommunity%20Logo.png"
              alt="MyCommunity Logo"
              className="bg-white shadow-md p-1 border-4 border-white rounded-full w-10 md:w-20 h-7 md:h-16 object-contain transition-transform duration-200"
            />
          </label>
        </div>
        <div className="navbar-center"></div>
        <div className="items-center gap-1 navbar-end">
          <NotificationBell />

          {!loading &&
            (user ? (
              <Link
                to="/Profile"
                className="gap-2 btn btn-ghost"
                aria-label="Meri profile"
              >
                <span className="hidden sm:inline max-w-[140px] font-medium text-white truncate">
                  Hi, {user.name}
                  {isVolunteer ? " 🤝" : ""}
                </span>
                <span aria-hidden="true">👤</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex btn btn-ghost"
                >
                  Sign up
                </Link>
              </>
            ))}
        </div>
      </div>

      {/* Logout confirm (Yes / No) */}
      {confirmOpen && (
        <div
          onClick={() => !loggingOut && setConfirmOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            background: "rgba(15,23,42,.5)",
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="nav-logout-title"
            aria-describedby="nav-logout-desc"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 380,
              padding: "32px 28px 28px",
              borderRadius: 24,
              background: "#fff",
              textAlign: "center",
              boxShadow: "0 24px 60px -20px rgba(15,23,42,.5)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 56,
                height: 56,
                margin: "0 auto",
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                background: "#fef3c7",
                fontSize: 26,
              }}
            >
              ⚠️
            </div>
            <h3
              id="nav-logout-title"
              style={{
                margin: "18px 0 0",
                fontSize: 19,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Kya aap logout karna chahte hain?
            </h3>
            <p
              id="nav-logout-desc"
              style={{ margin: "8px 0 0", fontSize: 14, color: "#64748b" }}
            >
              Logout karne ke baad dobara login karna padega.
            </p>

            {logoutError && (
              <p
                role="alert"
                style={{ margin: "12px 0 0", fontSize: 13, color: "#b91c1c" }}
              >
                {logoutError}
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 24,
              }}
            >
              <button
                ref={noBtnRef}
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={loggingOut}
                style={{
                  padding: "12px 10px",
                  borderRadius: 14,
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#334155",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loggingOut ? "not-allowed" : "pointer",
                  opacity: loggingOut ? 0.6 : 1,
                }}
              >
                Nahi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  padding: "12px 10px",
                  borderRadius: 14,
                  border: "1px solid #dc2626",
                  background: "#dc2626",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: loggingOut ? "not-allowed" : "pointer",
                  opacity: loggingOut ? 0.6 : 1,
                }}
              >
                {loggingOut ? "Ho raha hai..." : "Haan, logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
