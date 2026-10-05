import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";
const TYPES = ["Fire", "Medical", "Blood", "Security", "Accident", "Lost Person", "Elderly Help", "Other"];
const URGENCY = ["low", "medium", "high", "critical"];
const COLORS = { low: "#d9a400", medium: "#ef7c00", high: "#d32f2f", critical: "#8b0000" };
const ICONS = { fire: "🔥", medical: "🩺", blood: "🩸", security: "🛡️", accident: "🚧", "lost person": "🔍", "elderly help": "🧓", other: "❗" };

// ─── API ─────────────────────────────────────────────────────
// Server body return karta hai: { success, message, data }
const emergencyApi = {
  getAll: () => axios.get(`${API_BASE}/api/Emergency`).then((r) => r.data),
  create: (d) => axios.post(`${API_BASE}/api/Emergency`, d).then((r) => r.data),
  resolve: (id) => axios.patch(`${API_BASE}/api/Emergency/${id}/status`, { status: "resolved" }).then((r) => r.data),
  respond: (id, responderName) => axios.post(`${API_BASE}/api/Emergency/${id}/respond`, { responderName }).then((r) => r.data),
};

// ─── Helpers ─────────────────────────────────────────────────
const isActiveItem = (i) => (i.status || "active").toLowerCase() === "active";
const sortList = (l) => [...l].sort((a, b) => isActiveItem(b) - isActiveItem(a));
const fmtLoc = (l) => (!l ? "" : typeof l === "object" ? Object.values(l).filter(Boolean).join(", ") : String(l));
const extractList = (p) => (Array.isArray(p) ? p : Array.isArray(p?.data) ? p.data : null);
const errMsg = (e, fb) =>
  e.response
    ? e.response.data?.error ||
      (e.response.status === 404
        ? "Server par ye route nahi mila (404). Naya server.js lagakar backend restart karo."
        : `Server error (${e.response.status})`)
    : e.request
    ? "Server se connection nahi ho paya. Backend (localhost:3000) chal raha hai?"
    : e.message || fb;

function getMyName() {
  let n = localStorage.getItem("society_user_name");
  if (!n) {
    n = prompt("Aapka naam?") || "Anonymous";
    localStorage.setItem("society_user_name", n);
  }
  return n;
}

const emptyForm = { name: "", phone: "", emergencyType: "", title: "", description: "", bloodGroup: "", peopleRequired: 1, location: "", urgency: "medium" };

// ─── Styles ──────────────────────────────────────────────────
const css = `
.em-page{min-height:100vh;background:radial-gradient(circle at 1px 1px,rgba(46,139,87,.16) 1.5px,transparent 0) 0 0/22px 22px,linear-gradient(180deg,#dff3e7 0%,#e6f1f6 55%,#f2f8f4 100%)}
.em{--ink:#173528;--mut:#587064;--line:#d3e6db;--red:#c62828;--green:#2e8b57;--teal:#0f766e;width:min(1180px,100%);margin:0 auto;padding:18px clamp(12px,3vw,32px) 110px;color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif;text-align:left}
.em *{box-sizing:border-box}
.em-head{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:18px;padding:18px;border-radius:22px;color:#fff;background:linear-gradient(120deg,#2f9e62,#0f766e 70%,#22b8a6);box-shadow:0 12px 28px rgba(15,118,110,.25)}
.em-brand{display:flex;align-items:center;gap:14px}
.em-logo{width:64px;height:64px;flex:none;border-radius:50%;border:3px solid #fff;background:#fff;object-fit:contain;padding:3px;box-shadow:0 4px 10px rgba(0,0,0,.18)}
.em-head .em-red{background:#fff;color:var(--red);box-shadow:0 6px 16px rgba(0,0,0,.15)}
.em-head .em-red:hover{background:#fff5f5}
.em h1{color:#fff;margin:0;font-size:clamp(1.6rem,5.5vw,2.1rem);line-height:1.1;letter-spacing:-.02em}
.em-sub{margin:6px 0 0;color:rgba(255,255,255,.9);font-size:.95rem;max-width:48ch}
.em-live{display:inline-flex;align-items:center;gap:8px;font-size:.8rem;font-weight:600;color:#fff;background:rgba(255,255,255,.2);padding:5px 12px;border-radius:999px;margin-bottom:8px}
.em-dot{width:10px;height:10px;border-radius:50%;background:#ff5a5a;animation:em-ping 1.6s infinite}
.em-btn{min-height:46px;padding:0 20px;border:0;border-radius:12px;font-weight:700;font-size:.95rem;cursor:pointer;transition:transform .15s,box-shadow .2s,background .2s}
.em-btn:active{transform:scale(.97)}
.em-btn:disabled{cursor:not-allowed;opacity:.7}
.em-btn:focus-visible,.em-chip:focus-visible,.em input:focus-visible,.em select:focus-visible,.em textarea:focus-visible{outline:3px solid #8fd3b4;outline-offset:2px}
.em-red{background:var(--red);color:#fff;box-shadow:0 6px 16px rgba(198,40,40,.3)}
.em-red:hover{background:#b01f1f}
.em-ghost{background:#e4f0e9;color:var(--ink)}
.em-desk{display:none}
.em-fab{position:fixed;left:16px;right:16px;bottom:16px;z-index:20;min-height:54px;font-size:1rem}
.em-chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
.em-chip{flex:none;min-height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--mut);font-weight:600;cursor:pointer;transition:all .2s}
.em-chip b{margin-left:6px;font-size:.8rem}
.em-chip.on{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 4px 12px rgba(46,139,87,.3)}
.em-grid{display:grid;grid-template-columns:1fr;gap:14px;align-items:stretch}
.em-card{--u:#c62828;position:relative;display:flex;flex-direction:column;background:#fff;border:1px solid var(--line);border-left:6px solid var(--u);border-radius:16px;padding:16px;margin:0;box-shadow:0 2px 10px rgba(20,40,35,.06);animation:em-in .5s cubic-bezier(.2,.8,.2,1) both;transition:transform .2s,box-shadow .2s}
.em-card.off{--u:#9db3a7;background:#f3f8f5;opacity:.85}
.em-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px}
.em-tag{font-size:.7rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#fff;padding:4px 10px;border-radius:999px;background:var(--u)}
.em-tag.crit{animation:em-pulse 1.8s infinite}
.em-type{font-size:.85rem;font-weight:600;color:var(--mut)}
.em-card h3{margin:0 0 4px;font-size:1.1rem;line-height:1.3}
.em-desc{margin:0 0 10px;color:var(--mut);font-size:.92rem;line-height:1.5}
.em-meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.em-meta span{background:#e6f5ec;border-radius:999px;padding:5px 11px;font-size:.8rem;color:#2c5043}
.em-acts{margin-top:auto;display:flex;gap:8px;flex-wrap:wrap}
.em-acts .em-btn{flex:1 1 120px;min-height:44px;padding:0 12px;font-size:.88rem;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.em-call{background:var(--green);color:#fff}
.em-help{background:var(--teal);color:#fff}
.em-help:disabled{background:#c9d4d0;color:#5d6d6a;cursor:default}
.em-done{background:#1f8a4c;color:#fff}
.em-solved{background:#d9efe1;color:#1f6b3f;cursor:default;pointer-events:none}
.em-err{color:#b3261e;font-size:.85rem;margin:8px 0 0}
.em-who{color:var(--green);font-size:.82rem;margin:10px 0 0;font-weight:600}
.em-box{background:#fff0f0;border:1px solid #efc2c2;border-radius:14px;padding:14px;margin-bottom:14px}
.em-empty{grid-column:1/-1;background:rgba(255,255,255,.6);text-align:center;color:var(--mut);padding:40px 12px;border:2px dashed var(--line);border-radius:16px}
.em-sk{height:170px;border-radius:16px;background:linear-gradient(90deg,#d9ecdf 25%,#eef8f2 50%,#d9ecdf 75%);background-size:200% 100%;animation:em-sh 1.3s infinite}
.em-ov{position:fixed;inset:0;z-index:50;background:rgba(10,25,22,.5);display:flex;align-items:flex-end;justify-content:center;animation:em-fade .2s both}
.em-sheet{width:100%;max-width:520px;max-height:92vh;overflow-y:auto;background:#fff;border-radius:22px 22px 0 0;padding:20px 18px 24px;animation:em-up .35s cubic-bezier(.2,.8,.2,1) both}
.em-sheet h3{margin:0 0 14px;color:var(--red);font-size:1.2rem}
.em-sheet input,.em-sheet select,.em-sheet textarea{width:100%;min-height:46px;padding:11px 12px;margin-bottom:10px;border:1px solid #d3dcd8;border-radius:10px;font:inherit;font-size:16px;background:#fff}
.em-sheet textarea{min-height:84px;resize:vertical}
.em-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.em-fbtns{display:flex;gap:10px;margin-top:6px}
.em-fbtns .em-btn{flex:1}
@media(min-width:640px){
.em{padding-bottom:40px}
.em-head{padding:24px 28px}
.em-logo{width:78px;height:78px}
.em-desk{display:inline-block}.em-fab{display:none}
.em-ov{align-items:center}.em-sheet{border-radius:22px}
}
@media(hover:hover){.em-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(20,40,35,.12)}.em-chip:hover{border-color:var(--green)}}
@media(min-width:900px){.em-grid{grid-template-columns:1fr 1fr;gap:18px}}
@keyframes em-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes em-up{from{transform:translateY(100%)}to{transform:none}}
@keyframes em-fade{from{opacity:0}to{opacity:1}}
@keyframes em-sh{to{background-position:-200% 0}}
@keyframes em-ping{0%{box-shadow:0 0 0 0 rgba(198,40,40,.6)}70%,100%{box-shadow:0 0 0 10px rgba(198,40,40,0)}}
@keyframes em-pulse{0%,100%{box-shadow:0 0 0 0 rgba(139,0,0,.5)}50%{box-shadow:0 0 0 7px rgba(139,0,0,0)}}
@media(prefers-reduced-motion:reduce){.em *{animation:none!important;transition:none!important}}
`;

// ─── Raise Emergency Sheet (Create) ──────────────────────────
function RaiseSheet({ onClose, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "peopleRequired" ? Number(value) : value }));
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.emergencyType || !form.title || !form.location) {
      setError("Name, phone, emergency type, title aur location zaroori hai");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await emergencyApi.create(form);
      if (!res.success) throw new Error(res.error || "Submit nahi hua");
      localStorage.setItem("society_user_name", form.name);
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.log(err);
      setError(errMsg(err, "Submit nahi hua, try again"));
    } finally {
      setBusy(false);
    }
  };

  const showBlood = form.emergencyType === "Blood" || form.emergencyType === "Medical";

  return (
    <div className="em-ov" onClick={onClose}>
      <div className="em-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>🚨 Raise Emergency</h3>
        <div className="em-row">
          <input name="name" placeholder="Your name" value={form.name} onChange={change} />
          <input name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={change} />
        </div>
        <select name="emergencyType" value={form.emergencyType} onChange={change}>
          <option value="">Select emergency type</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input name="title" placeholder="Title (short summary)" value={form.title} onChange={change} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={change} />
        {showBlood && (
          <div className="em-row">
            <input name="bloodGroup" placeholder="Blood group (O+)" value={form.bloodGroup} onChange={change} />
            <input name="peopleRequired" type="number" min="1" placeholder="People needed" value={form.peopleRequired} onChange={change} />
          </div>
        )}
        <input name="location" placeholder="Location (e.g. Block B, 3rd floor)" value={form.location} onChange={change} />
        <select name="urgency" value={form.urgency} onChange={change}>
          {URGENCY.map((u) => <option key={u} value={u}>{u[0].toUpperCase() + u.slice(1)} urgency</option>)}
        </select>
        {error && <p className="em-err">{error}</p>}
        <div className="em-fbtns">
          <button className="em-btn em-ghost" onClick={onClose}>Cancel</button>
          <button className="em-btn em-red" onClick={submit} disabled={busy}>{busy ? "Sending..." : "Send Alert"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Emergency Card ──────────────────────────────────────────
function EmergencyCard({ item, index, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = isActiveItem(item);
  const urgency = (item.urgency || "").toLowerCase();
  const blood = item.bloodGroup || item.bloodgroup;
  const me = localStorage.getItem("society_user_name");
  const helping = Array.isArray(item.respondedBy) && me && item.respondedBy.includes(me);

  // "I can help"
  const help = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await emergencyApi.respond(item._id, getMyName());
      if (res?.success === false) throw new Error(res.error || "Action nahi hua");
      onUpdated({ ...item, ...(res?.data || {}) });
    } catch (err) {
      console.log(err);
      setError(errMsg(err, "Action nahi hua"));
    } finally {
      setBusy(false);
    }
  };

  // Active → Resolved
  const resolve = async () => {
    if (!window.confirm("Is emergency ko Solved mark karna hai?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await emergencyApi.resolve(item._id);
      if (res?.success === false) throw new Error(res.error || "Resolve nahi hua");
      // server ka doc + status ko force "resolved" — UI hamesha update hoga
      onUpdated({ ...item, ...(res?.data || {}), status: "resolved" });
    } catch (err) {
      console.log(err);
      setError(errMsg(err, "Resolve nahi hua"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className={`em-card ${active ? "" : "off"}`}
      style={{ "--u": active ? COLORS[urgency] || "#c62828" : undefined, animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="em-top">
        <span className="em-tag">{active ? "Active" : "Solved"}</span>
        {active && urgency && <span className={`em-tag ${urgency === "critical" ? "crit" : ""}`}>{urgency}</span>}
        {item.emergencyType && (
          <span className="em-type">{ICONS[item.emergencyType.toLowerCase()] || "❗"} {item.emergencyType}</span>
        )}
      </div>
      <h3>{item.title}</h3>
      {item.description && <p className="em-desc">{item.description}</p>}
      <div className="em-meta">
        {item.location && <span>📍 {fmtLoc(item.location)}</span>}
        {item.name && <span>👤 {item.name}</span>}
        {blood && <span>🩸 {blood}</span>}
        {item.peopleRequired > 1 && <span>👥 {item.peopleRequired} needed</span>}
        {item.createdAt && <span>🕒 {new Date(item.createdAt).toLocaleString()}</span>}
      </div>
      <div className="em-acts">
        {item.phone && <a className="em-btn em-call" href={`tel:${item.phone}`}>📞 Call</a>}
        {active && (
          <button className="em-btn em-help" onClick={help} disabled={busy || helping}>
            {helping ? "✅ You're helping" : "🙋 I can help"}
          </button>
        )}
        {active && (
          <button className="em-btn em-done" onClick={resolve} disabled={busy}>
            {busy ? "Solving..." : "✔ Mark Solved"}
          </button>
        )}
        {!active && <span className="em-btn em-solved">✅ Solved</span>}
      </div>
      {error && <p className="em-err">{error}</p>}
      {Array.isArray(item.respondedBy) && item.respondedBy.length > 0 && (
        <p className="em-who">Helping: {item.respondedBy.join(", ")}</p>
      )}
    </article>
  );
}

// ─── Emergency Page ──────────────────────────────────────────
function Emergency() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadError("");
    emergencyApi
      .getAll()
      .then((body) => {
        const data = extractList(body);
        if (!data) throw new Error("Server ne unexpected response bheja (array nahi mila)");
        setList(sortList(data));
      })
      .catch((err) => {
        console.log(err);
        setLoadError(errMsg(err, "Emergencies load nahi ho payi"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const activeCount = list.filter(isActiveItem).length;
  const counts = { all: list.length, active: activeCount, resolved: list.length - activeCount };
  const shown = list.filter((i) => filter === "all" || (filter === "active") === isActiveItem(i));

  return (
    <div className="em-page">
    <div className="em">
      <style>{css}</style>

      <div className="em-head">
        <div className="em-brand">
          <img className="em-logo" src="/MyCommunity%20Logo.png" alt="MyCommunity" onError={(e) => (e.currentTarget.style.display = "none")} />
          <div>
          <span className="em-live"><i className="em-dot" /> {activeCount} active abhi</span>
          <h1>Emergency Board</h1>
          <p className="em-sub">Koi emergency raise ho to poori community dekh kar help kar sakti hai.</p>
          </div>
        </div>
        <button className="em-btn em-red em-desk" onClick={() => setOpen(true)}>🚨 Raise Emergency</button>
      </div>

      <div className="em-chips" role="tablist">
        {["all", "active", "resolved"].map((f) => (
          <button key={f} className={`em-chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
            {f === "resolved" ? "Solved" : f[0].toUpperCase() + f.slice(1)}<b>{counts[f]}</b>
          </button>
        ))}
      </div>

      {loading && (
        <div className="em-grid">
          {[0, 1, 2, 3].map((n) => <div key={n} className="em-sk" />)}
        </div>
      )}

      {!loading && loadError && (
        <div className="em-box">
          <p className="em-err" style={{ marginTop: 0 }}>{loadError}</p>
          <button className="em-btn em-red" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !loadError && shown.length === 0 && (
        <div className="em-empty">Abhi koi emergency nahi hai. Sab theek hai 🙌</div>
      )}

      {!loading && shown.length > 0 && (
        <div className="em-grid">
          {shown.map((item, i) => (
            <EmergencyCard
              key={item._id}
              item={item}
              index={i}
              onUpdated={(u) => setList((p) => sortList(p.map((e) => (e._id === u._id ? u : e))))}
            />
          ))}
        </div>
      )}

      <button className="em-btn em-red em-fab" onClick={() => setOpen(true)}>🚨 Raise Emergency</button>

      {open && <RaiseSheet onClose={() => setOpen(false)} onCreated={(n) => setList((p) => sortList([n, ...p]))} />}
    </div>
    </div>
  );
}

export default Emergency;
