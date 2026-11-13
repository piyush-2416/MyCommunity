import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import Navbar from "./Navbar";

const ROLE_LABEL = {
  user: "🏠 Resident",
  volunteer: "🤝 Volunteer",
  admin: "🛡️ Admin",
};

// Khali value ke liye dash dikhao
const show = (v) => (v === undefined || v === null || String(v).trim() === "" ? "—" : v);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500";

function Field({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl">
      <p className="font-semibold text-gray-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-semibold text-gray-800 text-sm break-words">{value}</p>
    </div>
  );
}

export default function Profile() {
  const { user, loading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [dir, setDir] = useState(null); // volunteer ki Directory profile
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const noBtnRef = useRef(null);

  const isVolunteer = user?.role === "volunteer";

  // Volunteer ho to Directory wali details lao
  useEffect(() => {
    if (!isVolunteer) return;
    client
      .get("/volunteer/profile")
      .then((res) => setDir(res.data))
      .catch(() => setDir(null));
  }, [isVolunteer]);

  // Logout popup: Escape se band, focus safe option ("Nahi") par
  useEffect(() => {
    if (!confirmOpen) return;
    noBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && !loggingOut) setConfirmOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, loggingOut]);

  // ----- Saare hooks upar ho chuke, ab guards -----
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const initial = (user.name || "?").trim().charAt(0).toUpperCase();

  const startEdit = () => {
    setError("");
    setSaved(false);
    setForm({ name: user.name || "", phone: user.phone || "" });
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), phone: form.phone });
      setEditing(false);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi ho paya, dobara try karo");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Logout nahi ho paya, dobara try karo");
      setLoggingOut(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="space-y-6 mx-auto px-4 py-8 max-w-3xl">
          {/* ---------- Header ---------- */}
          <section className="bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-28" />
            <div className="flex sm:flex-row flex-col sm:items-end gap-4 -mt-12 px-6 pb-6">
              <div
                aria-hidden="true"
                className="flex justify-center items-center bg-emerald-600 shadow-lg border-4 border-white rounded-full w-24 h-24 font-bold text-white text-4xl shrink-0"
              >
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-extrabold text-2xl break-words">{show(user.name)}</h1>
                  <span className="bg-emerald-50 px-3 py-1 border border-emerald-200 rounded-full font-bold text-emerald-700 text-xs">
                    {ROLE_LABEL[user.role] || "🏠 Resident"}
                  </span>
                </div>
                <p className="mt-1 text-gray-500 text-sm break-all">📧 {show(user.email)}</p>
              </div>
            </div>
          </section>

          {saved && (
            <p role="status" className="bg-green-50 p-3 border border-green-200 rounded-xl text-green-700 text-sm">
              ✅ Profile save ho gayi
            </p>
          )}
          {error && !editing && (
            <p role="alert" className="bg-red-50 p-3 border border-red-200 rounded-xl text-red-600 text-sm">
              ⚠️ {error}
            </p>
          )}

          {/* ---------- Account details (edit ho sakti hain) ---------- */}
          <section className="bg-white shadow-md p-6 rounded-2xl">
            <div className="flex justify-between items-center gap-3">
              <h2 className="font-bold text-lg">Account Information</h2>
              {!editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full font-semibold text-white text-sm transition"
                >
                  ✏️ Edit karo
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4 mt-5">
                {error && (
                  <p role="alert" className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">⚠️ {error}</p>
                )}

                <div>
                  <label htmlFor="pf-name" className="block mb-1 font-medium text-sm">Naam</label>
                  <input
                    id="pf-name" name="name" required minLength={2} maxLength={60}
                    value={form.name} onChange={handleChange} className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="pf-phone" className="block mb-1 font-medium text-sm">Mobile number</label>
                  <input
                    id="pf-phone" name="phone" type="tel" inputMode="numeric" maxLength={15}
                    value={form.phone} onChange={handleChange}
                    placeholder="10 digit number" className={inputCls}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-sm">Email</label>
                  <input value={user.email} disabled className={`${inputCls} bg-gray-100 text-gray-500`} />
                  <p className="mt-1 text-gray-400 text-xs">Email badla nahi ja sakta (ye aapki login ID hai)</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit" disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-6 py-2.5 rounded-full font-semibold text-white text-sm transition"
                  >
                    {saving ? "Save ho raha hai..." : "Save karo"}
                  </button>
                  <button
                    type="button" disabled={saving}
                    onClick={() => setEditing(false)}
                    className="hover:bg-gray-50 px-6 py-2.5 border border-gray-300 rounded-full font-semibold text-gray-700 text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="gap-4 grid sm:grid-cols-2 mt-5">
                <Field label="Naam" value={show(user.name)} />
                <Field label="Email" value={show(user.email)} />
                <Field label="Mobile" value={show(user.phone)} />
                <Field label="Role" value={ROLE_LABEL[user.role] || "🏠 Resident"} />
                <Field label="Account banaya" value={fmtDate(user.createdAt)} />
              </div>
            )}
          </section>

          {/* ---------- Volunteer ki Directory details ---------- */}
          {isVolunteer && (
            <section className="bg-white shadow-md p-6 rounded-2xl">
              <h2 className="font-bold text-lg">📇 Directory Profile</h2>

              {dir && !dir.isProfileComplete && (
                <p className="bg-amber-50 mt-4 p-3 border border-amber-200 rounded-lg text-amber-800 text-sm">
                  ⚠️ Profile adhuri hai, aap abhi Community Directory mein nahi dikh rahe.
                </p>
              )}

              <div className="gap-4 grid sm:grid-cols-2 mt-5">
                <Field label="Role / Kaam" value={show(dir?.role)} />
                <Field label="Department" value={show(dir?.department)} />
                <Field label="Directory phone" value={show(dir?.phone)} />
                <Field label="Available timing" value={show(dir?.availableTime)} />
                <Field label="Abhi available" value={dir ? (dir.available ? "🟢 Haan" : "🔴 Nahi") : "—"} />
              </div>

              <Link
                to="/volunteer/profile"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 mt-5 px-6 py-2.5 rounded-full font-semibold text-white text-sm transition"
              >
                ✏️ Directory profile edit karo
              </Link>
            </section>
          )}

          {/* ---------- Logout ---------- */}
          <section className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 bg-white shadow-md p-6 border border-rose-100 rounded-2xl">
            <div>
              <h2 className="font-bold text-lg">Logout</h2>
              <p className="mt-1 text-gray-500 text-sm">Is device se apne account se bahar niklo.</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="bg-rose-50 hover:bg-rose-600 px-8 py-2.5 border border-rose-200 hover:border-rose-600 rounded-full font-bold text-rose-600 hover:text-white text-sm transition"
            >
              🚪 Logout karo
            </button>
          </section>
        </div>
      </div>

      {/* ---------- Logout confirm (Haan / Nahi) ---------- */}
      {confirmOpen && (
        <div
          onClick={() => !loggingOut && setConfirmOpen(false)}
          className="z-[1000] fixed inset-0 flex justify-center items-center bg-slate-900/50 p-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="pf-logout-title"
            aria-describedby="pf-logout-desc"
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-2xl px-7 py-8 rounded-3xl w-full max-w-sm text-center"
          >
            <div
              aria-hidden="true"
              className="flex justify-center items-center bg-amber-100 mx-auto rounded-full w-14 h-14 text-2xl"
            >
              ⚠️
            </div>
            <h3 id="pf-logout-title" className="mt-4 font-extrabold text-slate-900 text-xl">
              Kya aap logout karna chahte hain?
            </h3>
            <p id="pf-logout-desc" className="mt-2 text-slate-500 text-sm">
              Logout karne ke baad dobara login karna padega.
            </p>

            <div className="gap-3 grid grid-cols-2 mt-6">
              <button
                ref={noBtnRef}
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={loggingOut}
                className="hover:bg-slate-50 disabled:opacity-60 py-3 border border-slate-300 rounded-2xl font-bold text-slate-700 text-sm"
              >
                Nahi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 py-3 border border-red-600 rounded-2xl font-bold text-white text-sm"
              >
                {loggingOut ? "Ho raha hai..." : "Haan, logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}