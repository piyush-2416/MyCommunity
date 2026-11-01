import { useEffect, useState } from "react";
import client from "../api/client";
import Navbar from "./Navbar";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500";
const labelCls = "block mb-1 font-medium text-sm";

export default function VolunteerProfile() {
  const [form, setForm] = useState({
    role: "", department: "", phone: "", availableTime: "",
    description: "", image: "", available: true,
  });
  const [name, setName] = useState("");
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    client
      .get("/volunteer/profile")
      .then((res) => {
        const d = res.data;
        setName(d.name || "");
        setComplete(!!d.isProfileComplete);
        setForm({
          role: d.role || "",
          department: d.department || "",
          phone: d.phone || "",
          availableTime: d.availableTime || "",
          description: d.description || "",
          image: d.image || "",
          available: d.available !== false,
        });
      })
      .catch((e) => setError(e.response?.data?.message || "Profile load nahi ho paya"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name: n, type, checked, value } = e.target;
    setSaved(false);
    setForm({ ...form, [n]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const res = await client.put("/volunteer/profile", form);
      setComplete(!!res.data.isProfileComplete);
      setSaved(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi ho paya, dobara try karo");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="py-24 text-center">Loading...</p>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto px-4 py-8 max-w-2xl">
          <h1 className="font-bold text-3xl">📇 Meri Directory Profile</h1>
          <p className="mt-1 text-gray-500 text-sm">{name}</p>

          {complete ? (
            <p className="bg-green-50 mt-4 p-3 border border-green-200 rounded-lg text-green-700 text-sm">
              ✅ Profile poori hai. Aap Community Directory mein dikh rahe ho.
            </p>
          ) : (
            <p className="bg-amber-50 mt-4 p-3 border border-amber-200 rounded-lg text-amber-800 text-sm">
              ⚠️ Profile adhuri hai. Role, Department aur Phone bharo, tabhi aap Directory mein dikhoge.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-md mt-6 p-6 rounded-2xl">
            {error && <p role="alert" className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">{error}</p>}
            {saved && <p role="status" className="bg-green-50 p-3 rounded-lg text-green-700 text-sm">✅ Profile save ho gayi</p>}

            <div className="gap-4 grid sm:grid-cols-2">
              <div>
                <label htmlFor="role" className={labelCls}>Role / Kaam</label>
                <input
                  id="role" name="role" required maxLength={60}
                  value={form.role} onChange={handleChange}
                  placeholder="Jaise Plumber, Secretary" className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="department" className={labelCls}>Department</label>
                <input
                  id="department" name="department" required maxLength={60}
                  value={form.department} onChange={handleChange}
                  placeholder="Jaise Maintenance, Security" className={inputCls}
                />
              </div>
            </div>

            <div className="gap-4 grid sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelCls}>Phone</label>
                <input
                  id="phone" name="phone" required inputMode="numeric" maxLength={15}
                  value={form.phone} onChange={handleChange}
                  placeholder="10 digit mobile number" className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="availableTime" className={labelCls}>Available timing (optional)</label>
                <input
                  id="availableTime" name="availableTime" maxLength={80}
                  value={form.availableTime} onChange={handleChange}
                  placeholder="Mon-Sat, 9 AM - 6 PM" className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelCls}>Apne baare mein (optional)</label>
              <textarea
                id="description" name="description" rows={3} maxLength={300}
                value={form.description} onChange={handleChange} className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="image" className={labelCls}>Photo ka link (optional)</label>
              <input
                id="image" name="image" type="url"
                value={form.image} onChange={handleChange}
                placeholder="https://..." className={inputCls}
              />
              {form.image && (
                <img
                  src={form.image} alt="Preview"
                  onError={(e) => (e.target.style.display = "none")}
                  className="mt-3 rounded-lg w-24 h-24 object-cover"
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox" name="available"
                checked={form.available} onChange={handleChange}
                className="accent-emerald-600"
              />
              🟢 Main abhi available hoon
            </label>
  
  
    <button
              type="submit" disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 py-3 rounded-lg w-full font-semibold text-white transition"
            >
              {saving ? "Save ho raha hai..." : "Profile save karo"}
            </button>
       
          </form>
        </div>
      </div>
    </>
  );
}