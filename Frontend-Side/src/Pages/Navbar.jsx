import React, { useRef } from "react";
import NotificationBell from "./NotificationBell ";
import { Link, NavLink } from "react-router-dom";
// import SafetyPlanner from "./SafetyPlanner";

/* Sidebar ka poora menu yahin se banta hai.
   Naya item chahiye to bas yahan ek line add kar do. */
const sections = [
  {
    label: "Community",
    items: [
      { icon: "🏠", text: "Dashboard", to: "/Dashboard" },
      { icon: "👥", text: "About", to: "/About" },
      { icon: "🤝", text: "Volunteers", to: "/Directory", noActive: true },
      { icon: "🗳️", text: "Polls & Voting", to: "/Society_Polls" },
    ],
  },
  {
    label: "Ai Features",
    items: [
      { icon: "🤖", text: "Ai Safety-Planner", to: "/SafetyPlanner" },
      { icon: "🆘", text: "Ai Self-Safety", to: "/SafetyCheck" },
    ],
  },
  {
    label: "Discover",
    items: [
      { icon: "🔍", text: "Explore", to: "/Explore" },
      { icon: "📰", text: "Community Feed", to: "/Feed" },
      { icon: "📸", text: "Memories", to: "/Gallery" },
      { icon: "🏆", text: "Achievements", to: "/Achievements" },
      { icon: "💬", text: "Feedback", to: "/Feedback" },
    ],
  },

  {
    label: "Account",
    items: [
      { icon: "👤", text: "My Profile" }, // abhi route nahi hai

      { icon: "⚙️", text: "Settings", to: "/Setting" },
    ],
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
  const drawerRef = useRef(null);

  // Link click hote hi sidebar band ho jaye (mobile pe zaroori)
  const closeDrawer = () => {
    if (drawerRef.current) drawerRef.current.checked = false;
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
              {sections.map((section) => (
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

            {/* Footer: Logout */}
            <div className="p-3 border-slate-100 border-t">
              <button
                type="button"
                onClick={closeDrawer}
                className="flex justify-center items-center gap-2 bg-rose-50 px-3 py-2.5 border border-rose-200 rounded-xl w-full font-semibold text-rose-600 text-sm"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Top navbar (pehle jaisa) */}
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
        <div className="navbar-end">
          <NotificationBell />

          <button className="btn btn-ghost btn-circle">👤</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
