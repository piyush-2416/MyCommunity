import React, { useEffect, useState } from "react";
// import { emergencyApi } from "../api/EmergencyApi.js";
import { emergencyApi } from "../api/Emergencyapi";

// Emergency data format (server generates _id, status="active", respondedBy, createdAt, updatedAt)
const EMPTY_FORM = {
  name: "",
  phone: "",
  emergencyType: "",
  title: "",
  description: "",
  bloodGroup: "",
  peopleRequired: 1,
  location: "",
  urgency: "medium",
  status: "active",
};

const TYPES = ["Fire", "Medical", "Blood", "Security", "Accident", "Lost Person", "Elderly Help", "Other"];
const URGENCY_OPTIONS = ["low", "medium", "high", "critical"];
const STATUS_OPTIONS = ["active", "resolved"];
const URGENCY_COLORS = { low: "#d9a400", medium: "#ef7c00", high: "#d32f2f", critical: "#8b0000" };
const STATUS_COLORS = { active: "#d9534f", resolved: "#1f8a4c" };
const ICONS = {
  fire: "🔥",
  medical: "🩺",
  blood: "🩸",
  security: "🛡️",
  accident: "🚧",
  "lost person": "🔍",
  "elderly help": "🧓",
  other: "❗",
};

// ─── Helpers ──────────────────────────────────────────────────
const fmtLoc = (l) =>
  !l ? "" : typeof l === "object" ? Object.values(l).filter(Boolean).join(", ") : String(l);
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// Edit ke liye existing doc ko form shape me badalta hai
const toForm = (c) => ({
  ...EMPTY_FORM,
  name: c.name || "",
  phone: c.phone || "",
  emergencyType: c.emergencyType || "",
  title: c.title || "",
  description: c.description || "",
  bloodGroup: c.bloodGroup || c.bloodgroup || "",
  peopleRequired: c.peopleRequired || 1,
  location: fmtLoc(c.location),
  urgency: (c.urgency || "medium").toLowerCase(),
  status: (c.status || "active").toLowerCase(),
});

const css = `
.ec-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Arial, sans-serif; color: #333; }

.ec-header {
  background: #3cb371;
  padding: 22px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ec-brand {
  background: #fff;
  color: #3cb371;
  font-weight: 700;
  font-size: 24px;
  padding: 20px 30px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.ec-add {
  background: none;
  border: none;
  color: #7c4dcc;
  font-size: 44px;
  line-height: 1;
  cursor: pointer;
  padding: 0 14px;
}

.ec-title { text-align: center; font-size: 30px; font-weight: 400; margin: 40px 0 30px; }

.ec-search-wrap { display: flex; justify-content: center; margin-bottom: 24px; }
.ec-search {
  width: 100%; max-width: 420px; padding: 10px 16px;
  border: 1px solid #ddd; border-radius: 20px; font-size: 15px; outline: none;
}
.ec-search:focus { border-color: #3cb371; }

.ec-list { padding: 0 40px 40px; display: flex; flex-direction: column; gap: 26px; }

.ec-card {
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #e3e3e3;
  border-left: 5px solid var(--u, #d9534f);
  border-radius: 14px;
  padding: 30px 24px;
  background: #fff;
}
.ec-card.off { background: #f6f9f7; opacity: .85; }
.ec-icon-box {
  width: 120px; height: 120px; flex-shrink: 0; border-radius: 8px; background: #eef3f0;
  display: flex; align-items: center; justify-content: center; font-size: 52px;
}

.ec-body { flex: 1; min-width: 0; }
.ec-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.ec-name { margin: 0; font-size: 30px; font-weight: 400; color: #14919b; }
.ec-type { font-size: 20px; color: #7ec8e3; }
.ec-desc { margin: 14px 0 14px; font-size: 20px; color: #444; text-align: center; }
.ec-loc { font-size: 18px; color: #666; }
.ec-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.ec-chips span { background: #e6f5ec; border-radius: 999px; padding: 5px 12px; font-size: 14px; color: #2c5043; }
.ec-meta { margin-top: 8px; font-size: 13px; color: #999; }

.ec-side { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ec-pill {
  color: #fff; font-weight: 700; font-size: 20px;
  padding: 14px 24px; border-radius: 30px; white-space: nowrap;
}
.ec-pill.small { font-size: 14px; padding: 6px 14px; }
.ec-actions { display: flex; gap: 8px; }
.ec-icon-btn {
  background: none; border: 1px solid #ddd; border-radius: 8px;
  padding: 4px 10px; font-size: 16px; cursor: pointer;
}
.ec-icon-btn:hover { background: #f5f5f5; }

.ec-empty { text-align: center; color: #888; padding: 60px 0; font-size: 18px; }

/* Modal */
.ec-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.ec-modal {
  background: #fff; border-radius: 14px; padding: 28px; width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto; border-top: 6px solid #3cb371;
}
.ec-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ec-modal-head h2 { margin: 0; font-size: 22px; font-weight: 500; color: #14919b; }
.ec-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #888; }
.ec-field { margin-bottom: 14px; }
.ec-field label { display: block; margin-bottom: 5px; font-size: 14px; color: #555; }
.ec-field input, .ec-field select, .ec-field textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px;
  font-size: 15px; box-sizing: border-box; font-family: inherit;
}
.ec-field input:focus, .ec-field select:focus, .ec-field textarea:focus { outline: none; border-color: #3cb371; }
.ec-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ec-modal-foot { display: flex; gap: 12px; margin-top: 20px; }
.ec-btn { padding: 12px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; }
.ec-btn-cancel { flex: 1; background: #fff; border: 1px solid #ccc; color: #555; }
.ec-btn-save { flex: 2; background: #3cb371; border: none; color: #fff; }
.ec-btn-save:disabled { background: #9ad3b4; cursor: not-allowed; }

.ec-toast {
  position: fixed; top: 20px; right: 20px; z-index: 9999; color: #fff;
  padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

@media (max-width: 720px) {
  .ec-list { padding: 0 14px 30px; }
  .ec-card { flex-direction: column; align-items: flex-start; padding: 20px 16px; }
  .ec-desc { text-align: left; font-size: 17px; }
  .ec-name { font-size: 24px; }
  .ec-side { flex-direction: row; align-items: center; flex-wrap: wrap; }
  .ec-pill { font-size: 16px; padding: 10px 18px; }
  .ec-row { grid-template-columns: 1fr; }
}
`;

// ─── Toast ────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: "#1f8a4c", error: "#d9534f", info: "#14919b" };
  return (
    <div className="ec-toast" style={{ background: colors[type] || colors.info }}>
      {msg}
    </div>
  );
}

// ─── Modal Form (Create / Edit) ───────────────────────────────
function EmergencyModal({ emergency, onSave, onClose }) {
  const [form, setForm] = useState(emergency ? toForm(emergency) : EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  // input ke `name` attribute se state update hoti hai
  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "peopleRequired" ? Number(value) : value }));
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.emergencyType || !form.title || !form.location) {
      alert("Name, phone, emergency type, title aur location required hai!");
      return;
    }
    // sirf editable fields bhejo (_id, respondedBy, createdAt, updatedAt server handle karega)
    const payload = {};
    Object.keys(EMPTY_FORM).forEach((k) => (payload[k] = form[k]));
    setLoading(true);
    await onSave(payload);
    setLoading(false);
  };

  const textFields = [
    { label: "Name *", name: "name", placeholder: "e.g. Rahul Sharma" },
    { label: "Phone *", name: "phone", placeholder: "e.g. 9876543210", type: "tel" },
    { label: "Title *", name: "title", placeholder: "e.g. Fire in Block B" },
    { label: "Location *", name: "location", placeholder: "e.g. Block B, 3rd floor" },
  ];

  const showBlood = form.emergencyType === "Blood" || form.emergencyType === "Medical";

  return (
    <div className="ec-overlay">
      <div className="ec-modal">
        <div className="ec-modal-head">
          <h2>{emergency ? "✏️ Edit Emergency" : "🚨 New Emergency"}</h2>
          <button className="ec-close" onClick={onClose}>✕</button>
        </div>

        {textFields.map(({ label, name, placeholder, type }) => (
          <div className="ec-field" key={name}>
            <label>{label}</label>
            <input
              name={name}
              type={type || "text"}
              value={form[name] ?? ""}
              onChange={handle}
              placeholder={placeholder}
            />
          </div>
        ))}

        <div className="ec-field">
          <label>Emergency type *</label>
          <select name="emergencyType" value={form.emergencyType} onChange={handle}>
            <option value="">Select type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {showBlood && (
          <div className="ec-row">
            <div className="ec-field">
              <label>Blood group</label>
              <input name="bloodGroup" value={form.bloodGroup} onChange={handle} placeholder="O+" />
            </div>
            <div className="ec-field">
              <label>People needed</label>
              <input name="peopleRequired" type="number" min="1" value={form.peopleRequired} onChange={handle} />
            </div>
          </div>
        )}

        <div className="ec-row">
          <div className="ec-field">
            <label>Urgency</label>
            <select name="urgency" value={form.urgency} onChange={handle}>
              {URGENCY_OPTIONS.map((u) => (
                <option key={u} value={u}>{cap(u)}</option>
              ))}
            </select>
          </div>
          <div className="ec-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handle}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{cap(s)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ec-field">
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description ?? ""}
            onChange={handle}
            placeholder="Emergency ke baare mein likho..."
          />
        </div>

        <div className="ec-modal-foot">
          <button className="ec-btn ec-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ec-btn ec-btn-save" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : emergency ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Emergency Card ───────────────────────────────────────────
function EmergencyCard({ emergency, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const status = (emergency.status || "active").toLowerCase();
  const urgency = (emergency.urgency || "").toLowerCase();
  const active = status === "active";
  const blood = emergency.bloodGroup || emergency.bloodgroup;
  const icon = ICONS[(emergency.emergencyType || "").toLowerCase()] || "❗";

  const handleDelete = async () => {
    if (!window.confirm(`"${emergency.title}" delete karna chahte ho?`)) return;
    setDeleting(true);
    await onDelete(emergency._id);
    setDeleting(false);
  };

  return (
    <div
      className={`ec-card ${active ? "" : "off"}`}
      style={{ "--u": active ? URGENCY_COLORS[urgency] || "#d9534f" : "#9db3a7" }}
    >
      <div className="ec-icon-box">{icon}</div>

      <div className="ec-body">
        <div className="ec-head">
          <h3 className="ec-name">{emergency.title}</h3>
          <span className="ec-type">{emergency.emergencyType}</span>
        </div>

        {emergency.description && <p className="ec-desc">{emergency.description}</p>}

        <div className="ec-loc">📍 {fmtLoc(emergency.location)}</div>

        <div className="ec-chips">
          {emergency.name && <span>👤 {emergency.name}</span>}
          {emergency.phone && <span>📞 {emergency.phone}</span>}
          {blood && <span>🩸 {blood}</span>}
          {emergency.peopleRequired > 1 && <span>👥 {emergency.peopleRequired} needed</span>}
        </div>

        {(emergency.createdAt || (emergency.respondedBy || []).length > 0) && (
          <div className="ec-meta">
            {emergency.createdAt && <>🕒 {new Date(emergency.createdAt).toLocaleString()}</>}
            {emergency.createdAt && (emergency.respondedBy || []).length > 0 && "  |  "}
            {(emergency.respondedBy || []).length > 0 && <>Helping: {emergency.respondedBy.join(", ")}</>}
          </div>
        )}
      </div>

      <div className="ec-side">
        <span className="ec-pill" style={{ background: STATUS_COLORS[status] || "#808080" }}>
          {cap(status)}
        </span>
        {active && urgency && (
          <span className="ec-pill small" style={{ background: URGENCY_COLORS[urgency] || "#808080" }}>
            {cap(urgency)} urgency
          </span>
        )}
        <div className="ec-actions">
          <button className="ec-icon-btn" onClick={() => onEdit(emergency)} title="Edit">✏️</button>
          <button className="ec-icon-btn" onClick={handleDelete} disabled={deleting} title="Delete">
            {deleting ? "⏳" : "🗑️"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function EmergencyCrud() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | emergency-obj
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadEmergencies = async () => {
    setLoading(true);
    try {
      const res = await emergencyApi.getAll();
      if (res.success) setEmergencies(res.data);
      else showToast(res.error || "Load fail!", "error");
    } catch {
      showToast("Server se connect nahi ho pa raha! (backend chal raha hai?)", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmergencies();
  }, []);

  const handleCreate = async (form) => {
    try {
      const res = await emergencyApi.create(form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadEmergencies();
      } else {
        showToast(res.error || "Create fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Create fail!", "error");
    }
  };

  const handleUpdate = async (form) => {
    try {
      const res = await emergencyApi.update(modal._id, form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadEmergencies();
      } else {
        showToast(res.error || "Update fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Update fail!", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await emergencyApi.remove(id);
      if (res.success) {
        showToast(res.message, "success");
        loadEmergencies();
      } else {
        showToast(res.error || "Delete fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Delete fail!", "error");
    }
  };

  const q = search.toLowerCase();
  const filtered = emergencies.filter(
    (c) =>
      c.title?.toLowerCase().includes(q) ||
      c.emergencyType?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      fmtLoc(c.location).toLowerCase().includes(q)
  );

  return (
    <div className="ec-page">
      <style>{css}</style>

      <header className="ec-header">
        <div className="ec-brand">Mycommunity</div>
        <button className="ec-add" onClick={() => setModal("create")} title="New emergency">
          ✚
        </button>
      </header>

      <h2 className="ec-title">🚨 Emergencies</h2>

      <div className="ec-search-wrap">
        <input
          className="ec-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Title, type, naam ya location search karo..."
        />
      </div>

      <main className="ec-list">
        {loading ? (
          <p className="ec-empty">Emergencies load ho rahi hain...</p>
        ) : filtered.length === 0 ? (
          <p className="ec-empty">
            {search ? "Koi emergency nahi mili." : "Abhi koi emergency nahi hai. ✚ dabakar pehli add karo."}
          </p>
        ) : (
          filtered.map((c) => (
            <EmergencyCard key={c._id} emergency={c} onEdit={setModal} onDelete={handleDelete} />
          ))
        )}
      </main>

      {modal && (
        <EmergencyModal
          emergency={modal === "create" ? null : modal}
          onSave={modal === "create" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
