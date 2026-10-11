import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import axios from "axios";

// Phone pe "localhost" phone ko hi point karta hai, isliye .env se URL lo.
// .env mein:  VITE_API_URL=http://192.168.x.x:3000   (apne PC ka IP)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function timeAgo(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const wrapperRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // fetch notices from backend and map them into notification shape
  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_URL}/api/Notice`)
      .then((res) => {
        if (cancelled) return;

        const mapped = res.data.map((n) => ({
          id: n._id,
          title: n.title,
          message: n.description || "No description provided.",
          rawDate: n.date || n.createdAt, // sorting ke liye asli date
          time: timeAgo(n.date || n.createdAt),
          unread: true, // sabhi naye notices default unread
          isImportant: n.isimportant === true || n.isimportant === "true",
        }));

        // sabse naya notice sabse upar
        // (pehle "2 hr ago" string ko Date bana rahe the, isliye sort galat tha)
        mapped.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        setNotifications(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // bahar tap/click ya Escape dabane par dropdown band
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* bell button (mobile pe 44px tap target) */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex justify-center items-center hover:bg-white/15 rounded-full w-11 sm:w-9 h-11 sm:h-9 text-white transition-colors"
      >
        <Bell className="w-5 h-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="top-0.5 sm:-top-0.5 right-0.5 sm:-right-0.5 absolute flex justify-center items-center bg-red-500 px-1 rounded-full min-w-4 h-4 font-semibold text-[10px] text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* dropdown
          Mobile: poori width ka panel navbar ke neeche (screen se bahar nahi jata)
          sm+   : bell ke neeche 320px ka dropdown */}
      {open && (
        <div
          className="top-16 sm:top-auto sm:right-0 z-50 fixed sm:absolute inset-x-3 sm:inset-x-auto bg-white shadow-lg sm:mt-2 border border-gray-100 rounded-xl sm:w-80 overflow-hidden"
        >
          <div className="flex justify-between items-center gap-3 px-4 py-3 border-gray-100 border-b">
            <h4 className="font-semibold text-gray-800 text-sm">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="py-1 font-medium text-emerald-600 hover:text-emerald-700 text-xs"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-100 max-h-[60vh] sm:max-h-80 overflow-y-auto overscroll-contain">
            {loading ? (
              <p className="px-4 py-6 text-gray-400 text-sm text-center">
                Loading...
              </p>
            ) : error ? (
              <p className="px-4 py-6 text-gray-400 text-sm text-center">
                Notifications load nahi ho paye. Thodi der baad try karo.
              </p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-gray-400 text-sm text-center">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    n.unread ? "bg-emerald-50/60" : ""
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      n.unread ? "bg-emerald-500" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="min-w-0 font-medium text-gray-800 text-sm truncate">
                        {n.title}
                      </p>
                      {n.isImportant && (
                        <span className="bg-red-500 px-1.5 py-0.5 rounded-full font-semibold text-[9px] text-white shrink-0">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-gray-500 text-xs break-words line-clamp-2">
                      {n.message}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 border-gray-100 border-t text-center">
            <button className="py-1 font-medium text-emerald-600 hover:text-emerald-700 text-xs">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
