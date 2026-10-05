import React, { useEffect, useState } from "react";
import { productApi } from "../api/productApi.js";

// Complaint data format (server generates complaintId, createdAt, updatedAt)
const EMPTY_FORM = {
  title: "",
  type: "",
  status: "Pending",
  raiseBy: "",
  raisedBytitle: "",
  description: "",
  photo: "",
  location: "",
};

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];
const STATUS_COLORS = {
  Pending: "#e0a030",
  "In Progress": "#808080",
  Resolved: "#1f8a4c",
};

const css = `
.cx-page { min-height: 100vh; background: #fff; font-family: "Segoe UI", Arial, sans-serif; color: #333; }

.cx-header {
  background: #3cb371;
  padding: 22px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cx-brand {
  background: #fff;
  color: #3cb371;
  font-weight: 700;
  font-size: 24px;
  padding: 20px 30px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.cx-add {
  background: none;
  border: none;
  color: #7c4dcc;
  font-size: 44px;
  line-height: 1;
  cursor: pointer;
  padding: 0 14px;
}

.cx-title { text-align: center; font-size: 30px; font-weight: 400; margin: 40px 0 30px; }

.cx-search-wrap { display: flex; justify-content: center; margin-bottom: 24px; }
.cx-search {
  width: 100%; max-width: 420px; padding: 10px 16px;
  border: 1px solid #ddd; border-radius: 20px; font-size: 15px; outline: none;
}
.cx-search:focus { border-color: #3cb371; }

.cx-list { padding: 0 40px 40px; display: flex; flex-direction: column; gap: 26px; }

.cx-card {
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #e3e3e3;
  border-left: 5px solid #d9534f;
  border-radius: 14px;
  padding: 30px 24px;
  background: #fff;
}
.cx-img-box { width: 120px; height: 120px; flex-shrink: 0; }
.cx-img { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; display: block; }
.cx-img-fallback {
  width: 120px; height: 120px; border-radius: 8px; background: #eef3f0;
  display: flex; align-items: center; justify-content: center; font-size: 40px;
}

.cx-body { flex: 1; min-width: 0; }
.cx-head { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.cx-Title{ margin: 0; font-size: 30px; font-weight: 400; color: #14919b; }
.cx-type { font-size: 20px; color: #7ec8e3; }
.cx-desc { margin: 14px 0 14px; font-size: 20px; color: #444; text-align: center; }
.cx-loc { font-size: 18px; color: #666; }
.cx-meta { margin-top: 6px; font-size: 13px; color: #999; }

.cx-side { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.cx-pill {
  color: #fff; font-weight: 700; font-size: 20px;
  padding: 14px 24px; border-radius: 30px; white-space: nowrap;
}
.cx-actions { display: flex; gap: 8px; }
.cx-icon-btn {
  background: none; border: 1px solid #ddd; border-radius: 8px;
  padding: 4px 10px; font-size: 16px; cursor: pointer;
}
.cx-icon-btn:hover { background: #f5f5f5; }

.cx-empty { text-align: center; color: #888; padding: 60px 0; font-size: 18px; }

/* Modal */
.cx-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.cx-modal {
  background: #fff; border-radius: 14px; padding: 28px; width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto; border-top: 6px solid #3cb371;
}
.cx-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.cx-modal-head h2 { margin: 0; font-size: 22px; font-weight: 500; color: #14919b; }
.cx-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #888; }
.cx-field { margin-bottom: 14px; }
.cx-field label { display: block; margin-bottom: 5px; font-size: 14px; color: #555; }
.cx-field input, .cx-field select, .cx-field textarea {
  width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 8px;
  font-size: 15px; box-sizing: border-box; font-family: inherit;
}
.cx-field input:focus, .cx-field select:focus, .cx-field textarea:focus { outline: none; border-color: #3cb371; }
.cx-modal-foot { display: flex; gap: 12px; margin-top: 20px; }
.cx-btn { padding: 12px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; }
.cx-btn-cancel { flex: 1; background: #fff; border: 1px solid #ccc; color: #555; }
.cx-btn-save { flex: 2; background: #3cb371; border: none; color: #fff; }
.cx-btn-save:disabled { background: #9ad3b4; cursor: not-allowed; }

.cx-toast {
  position: fixed; top: 20px; right: 20px; z-index: 9999; color: #fff;
  padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

@media (max-width: 720px) {
  .cx-list { padding: 0 14px 30px; }
  .cx-card { flex-direction: column; align-items: flex-start; padding: 20px 16px; }
  .cx-desc { text-align: left; font-size: 17px; }
  .cx-Title{ font-size: 24px; }
  .cx-side { flex-direction: row; align-items: center; }
  .cx-pill { font-size: 16px; padding: 10px 18px; }
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
    <div className="cx-toast" style={{ background: colors[type] || colors.info }}>
      {msg}
    </div>
  );
}

// ─── Modal Form (Create / Edit) ───────────────────────────────
function ComplaintModal({ complaint, onSave, onClose }) {
  const [form, setForm] = useState(complaint ? { ...EMPTY_FORM, ...complaint } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  // input ke `name` attribute se state update hoti hai
  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.type || !form.location) {
      alert("Title, type aur location required hai!");
      return;
    }
    // sirf editable fields bhejo (complaintId, createdAt, updatedAt server handle karega)
    const payload = {};
    Object.keys(EMPTY_FORM).forEach((k) => (payload[k] = form[k]));
    setLoading(true);
    await onSave(payload);
    setLoading(false);
  };

  const fields = [
    { label: "Title *", name: "title", placeholder: "e.g. Street Light Not Working" },
    { label: "Type *", name: "type", placeholder: "e.g. Electricity" },
    { label: "Location *", name: "location", placeholder: "e.g. Street - 12, Green Park" },
    { label: "Raised by", name: "raiseBy", placeholder: "Resident Title/ ID" },
    { label: "Raised by title", name: "raisedBytitle", placeholder: "e.g. Resident" },
    { label: "Photo URL", name: "photo", placeholder: "https://..." },
  ];

  return (
    <div className="cx-overlay">
      <div className="cx-modal">
        <div className="cx-modal-head">
          <h2>{complaint ? "✏️ Edit Complaint" : "➕ New Complaint"}</h2>
          <button className="cx-close" onClick={onClose}>✕</button>
        </div>

        {fields.map(({ label, name, placeholder }) => (
          <div className="cx-field" key={name}>
            <label>{label}</label>
            <input
              name={name}
              value={form[name] ?? ""}
              onChange={handle}
              placeholder={placeholder}
            />
          </div>
        ))}

        <div className="cx-field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handle}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="cx-field">
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description ?? ""}
            onChange={handle}
            placeholder="Problem ke baare mein likho..."
          />
        </div>

        <div className="cx-modal-foot">
          <button className="cx-btn cx-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="cx-btn cx-btn-save" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : complaint ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Complaint Card ───────────────────────────────────────────
function ComplaintCard({ complaint, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`"${complaint.title}" delete karna chahte ho?`)) return;
    setDeleting(true);
    await onDelete(complaint._id);
    setDeleting(false);
  };

  return (
    <div className="cx-card">
      <div className="cx-img-box">
        {complaint.photo && !imgFailed ? (
          <img
            className="cx-img"
            src={complaint.photo}
            alt={complaint.title}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="cx-img-fallback">📷</div>
        )}
      </div>

      <div className="cx-body">
        <div className="cx-head">
          <h3 className="cx-name">{complaint.title}</h3>
          <span className="cx-type">{complaint.type}</span>
        </div>

        {complaint.description && <p className="cx-desc">{complaint.description}</p>}

        <div className="cx-loc">📍 {complaint.location}</div>

        {(complaint.raiseBy || complaint.complaintId) && (
          <div className="cx-meta">
            {complaint.complaintId && <>ID: {complaint.complaintId}</>}
            {complaint.complaintId && complaint.raiseBy && "  |  "}
            {complaint.raiseBy && (
              <>
                By: {complaint.raiseBy}
                {complaint.raisedBytitle ? ` (${complaint.raisedBytitle})` : ""}
              </>
            )}
          </div>
        )}
      </div>

      <div className="cx-side">
        <span
          className="cx-pill"
          style={{ background: STATUS_COLORS[complaint.status] || "#808080" }}
        >
          {complaint.status || "Pending"}
        </span>
        <div className="cx-actions">
          <button className="cx-icon-btn" onClick={() => onEdit(complaint)} title="Edit">✏️</button>
          <button className="cx-icon-btn" onClick={handleDelete} disabled={deleting} title="Delete">
            {deleting ? "⏳" : "🗑️"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────
export default function ComplaintsCrud() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "create" | complaint-obj
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll();
      if (res.success) setComplaints(res.data);
      else showToast(res.error || "Load fail!", "error");
    } catch {
      showToast("Server se connect nahi ho pa raha! (backend chal raha hai?)", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreate = async (form) => {
    try {
      const res = await productApi.create(form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadComplaints();
      } else {
        showToast(res.error || "Create fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Create fail!", "error");
    }
  };

  const handleUpdate = async (form) => {
    try {
      const res = await productApi.update(modal._id, form);
      if (res.success) {
        showToast(res.message, "success");
        setModal(null);
        loadComplaints();
      } else {
        showToast(res.error || "Update fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Update fail!", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await productApi.remove(id);
      if (res.success) {
        showToast(res.message, "success");
        loadComplaints();
      } else {
        showToast(res.error || "Delete fail!", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.error || "Delete fail!", "error");
    }
  };

  const q = search.toLowerCase();
  const filtered = complaints.filter(
    (c) =>
      c.title?.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q)
  );

  return (
    <div className="cx-page">
      <style>{css}</style>

      <header className="cx-header">
        <div className="cx-brand">Mycommunity</div>
        <button className="cx-add" onClick={() => setModal("create")} title="New complaint">
          ✚
        </button>
      </header>

      <h2 className="cx-title">📋 Complaints</h2>

      <div className="cx-search-wrap">
        <input
          className="cx-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Title, type ya location search karo..."
        />
      </div>

      <main className="cx-list">
        {loading ? (
          <p className="cx-empty">Complaints load ho rahi hain...</p>
        ) : filtered.length === 0 ? (
          <p className="cx-empty">
            {search ? "Koi complaint nahi mili." : "Abhi koi complaint nahi hai. ✚ dabakar pehli add karo."}
          </p>
        ) : (
          filtered.map((c) => (
            <ComplaintCard key={c._id} complaint={c} onEdit={setModal} onDelete={handleDelete} />
          ))
        )}
      </main>

      {modal && (
        <ComplaintModal
          complaint={modal === "create" ? null : modal}
          onSave={modal === "create" ? handleCreate : handleUpdate}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
