import { useEffect, useMemo, useRef, useState } from "react";

// Aapke Server.js ka port 3000 hai
const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Backend (routes/Plans.js) ki lists se bilkul same
const COMMUNITY_TYPES = ["Housing society", "Mohalla / colony", "Gaon", "College campus", "Apartment tower", "Other"];
const RISKS = ["Baarish / baadh", "Aag", "Bhukamp", "Heatwave / loo", "Cold wave", "Bijli / paani outage", "Medical emergency", "Gas leak", "Chori / security", "Building / structure damage"];
const VULNERABLE = ["Bujurg", "Chhote bachche", "Divyang", "Garbhwati mahilayein", "Lambi bimari wale"];
const RESOURCES = ["Generator", "First-aid kit", "Fire extinguisher", "CCTV", "Security guard", "WhatsApp group", "Community hall", "Paani ki tanki", "Ambulance access"];

const EMERGENCY = [
  { n: "112", l: "Sabhi emergency", c: "#0b1f66" },
  { n: "100", l: "Police", c: "#2563eb" },
  { n: "101", l: "Fire", c: "#ea580c" },
  { n: "108", l: "Ambulance", c: "#16a34a" },
];

const LEVEL = {
  low: { label: "Kam" },
  medium: { label: "Madhyam" },
  high: { label: "Zyada" },
};

async function api(path, opts = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json" }, ...opts });
  } catch {
    throw new Error("Backend se connect nahi ho paya. Server (port 3000) chal raha hai?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Server error");
  return data;
}

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ---------------- Styles (self-contained, Tailwind pe depend nahi) ---------------- */
const css = `
.sp{--navy:#0b1f66;--green:#16a34a;--green-d:#15803d;--brand:#3cb371;--ink:#0f172a;--muted:#64748b;--line:#dbe7ef;
  min-height:100vh;text-align:left;color:var(--ink);font-family:inherit;line-height:1.5;
  background:linear-gradient(180deg,#e6f3fb 0%,#f4faff 380px,#fbfdff 100%)}
.sp *,.sp *::before,.sp *::after{box-sizing:border-box}
.sp h1,.sp h2,.sp h3,.sp h4,.sp p,.sp ul,.sp ol{margin:0;padding:0}
.sp ul,.sp ol{list-style:none}
.sp button:focus:not(:focus-visible){outline:none}
.sp button:focus-visible,.sp a:focus-visible,.sp input:focus-visible,.sp textarea:focus-visible{outline:3px solid rgba(60,179,113,.55);outline-offset:2px}

/* hero */
.sp-hero{position:relative;overflow:hidden;padding:80px 20px 88px;min-height:440px;
  background:linear-gradient(90deg,rgba(244,250,255,.9) 0%,rgba(244,250,255,.72) 32%,rgba(244,250,255,.18) 68%,rgba(244,250,255,0) 100%),
  url("https://blog.edcafe.ai/wp-content/uploads/2026/06/AI-Chatbot-safety-scaled.png") center/cover no-repeat}
.sp-hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(180deg,rgba(244,250,255,0),#f4faff);pointer-events:none}
.sp-hero .sp-wrap{z-index:1}
.sp-blob1,.sp-blob2{opacity:.45}
.sp-title,.sp-sub{text-shadow:0 1px 14px rgba(255,255,255,.85)}
.sp-blob1{position:absolute;top:-100px;right:-70px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(60,179,113,.35),transparent 70%);pointer-events:none}
.sp-blob2{position:absolute;bottom:-130px;left:18%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(56,150,230,.28),transparent 70%);pointer-events:none}
.sp-dots{position:absolute;top:16px;left:16px;width:130px;height:70px;background-image:radial-gradient(#3b82f6 2px,transparent 2px);background-size:22px 22px;opacity:.3;pointer-events:none}
.sp-wrap{position:relative;max-width:960px;margin:0 auto}
.sp-hero-row{display:flex;align-items:center;justify-content:space-between;gap:28px}
.sp-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;background:#fff;border:1px solid var(--line);color:var(--green-d);font-size:.85rem;font-weight:700;box-shadow:0 4px 12px -6px rgba(11,31,102,.2)}
.sp-pulse{width:9px;height:9px;border-radius:50%;background:var(--brand);animation:sp-pulse 1.6s ease-in-out infinite}
.sp-title{margin-top:18px;font-size:clamp(2.4rem,6vw,3.9rem);line-height:1.05;font-weight:800;letter-spacing:-.02em;color:var(--navy)}
.sp-title span{color:var(--green)}
.sp-swoosh{display:block;margin-top:8px;width:240px;max-width:60%}
.sp-sub{margin-top:14px;max-width:540px;font-size:1.08rem;line-height:1.65;color:#334e68}
.sp-sos{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:24px}
.sp-sos-label{font-size:.85rem;font-weight:700;color:#334e68;margin-right:4px}
.sp-sos a{display:inline-flex;align-items:center;gap:8px;padding:5px 14px 5px 5px;border-radius:999px;background:#fff;border:1px solid var(--line);color:var(--navy);font-size:.85rem;font-weight:600;text-decoration:none;box-shadow:0 4px 12px -6px rgba(11,31,102,.25);transition:transform .15s,box-shadow .15s}
.sp-sos a:hover{transform:translateY(-2px);box-shadow:0 10px 18px -8px rgba(11,31,102,.3);color:var(--navy)}
.sp-sos a b{display:inline-grid;place-items:center;min-width:40px;height:26px;padding:0 8px;border-radius:999px;color:#fff;font-size:.8rem}
.sp-art{flex:none;width:150px;filter:drop-shadow(0 14px 18px rgba(11,31,102,.18))}

/* layout */
.sp-main{max-width:960px;margin:0 auto;padding:0 20px 80px}
.sp-card{background:#fff;border-radius:24px;padding:24px;border:1px solid #e3edf4;box-shadow:0 10px 28px -14px rgba(11,31,102,.2)}
.sp-form{padding:28px;display:flex;flex-direction:column;gap:28px;box-shadow:0 20px 44px -20px rgba(11,31,102,.28)}
.sp-grid2{display:grid;gap:16px;grid-template-columns:1fr 1fr}
.sp-span2{grid-column:1/-1}
.sp-stack{display:flex;flex-direction:column;gap:20px;margin-top:28px;scroll-margin-top:24px}

/* form */
.sp-step{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;margin-bottom:12px}
.sp-step i{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--green);color:#fff;font-style:normal;font-weight:800;font-size:.8rem}
.sp-step span{font-weight:800;color:var(--navy);font-size:1rem}
.sp-step small{font-weight:500;color:var(--muted);font-size:.8rem}
.sp-chips{display:flex;flex-wrap:wrap;gap:8px}
.sp-label{display:flex;flex-direction:column;gap:6px;font-size:.85rem;font-weight:700;color:#334155}
.sp-field{width:100%;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line);background:#f7fbfe;color:var(--ink);font:inherit;font-size:.95rem;font-weight:500;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
.sp-field::placeholder{color:#94a3b8}
.sp-field:focus{border-color:var(--brand);background:#fff;box-shadow:0 0 0 4px rgba(60,179,113,.18)}
.sp-count-txt{align-self:flex-end;font-size:.75rem;font-weight:500;color:#94a3b8}

/* chips (selected = solid green, white text) */
.sp button.sp-chip{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:#334155;font:inherit;font-size:.875rem;font-weight:600;cursor:pointer;transition:all .15s}
.sp button.sp-chip:hover{border-color:var(--brand);background:#f0fdf4;color:var(--green-d)}
.sp button.sp-chip.on{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 6px 14px -6px rgba(22,163,74,.6)}
.sp button.sp-chip.on:hover{background:var(--green-d);border-color:var(--green-d);color:#fff}
.sp button.sp-chip.on::before{content:"\\2713";font-weight:800}

/* buttons */
.sp button.sp-cta{width:100%;display:flex;justify-content:center;align-items:center;gap:8px;padding:15px;border:0;border-radius:999px;background:linear-gradient(90deg,#16a34a,#3cb371);color:#fff;font:inherit;font-size:1.02rem;font-weight:800;cursor:pointer;box-shadow:0 14px 26px -12px rgba(22,163,74,.7);transition:transform .15s,filter .15s}
.sp button.sp-cta:hover{filter:brightness(.95);transform:translateY(-1px);color:#fff}
.sp button.sp-cta:disabled{opacity:.7;cursor:not-allowed;transform:none}
.sp button.sp-btn{padding:8px 18px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--navy);font:inherit;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .15s}
.sp button.sp-btn:hover{border-color:var(--brand);background:#f0fdf4;color:var(--green-d)}
.sp button.sp-btn.solid{background:var(--green);border-color:var(--green);color:#fff}
.sp button.sp-btn.solid:hover{background:var(--green-d);border-color:var(--green-d);color:#fff}
.sp button.sp-btn.danger:hover{border-color:#fda4af;background:#fff1f2;color:#be123c}
.sp-spin{width:20px;height:20px;animation:sp-spin .8s linear infinite}

/* alerts + skeleton */
.sp-alert{margin-top:20px;padding:14px 18px;border-radius:16px;background:#fff1f2;border:1px solid #fecdd3;color:#be123c;font-size:.9rem;font-weight:500}
.sp-warn{padding:14px 18px;border-radius:16px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;font-size:.9rem;font-weight:500}
.sp-skel{display:flex;flex-direction:column;gap:12px}
.sp-skel div{border-radius:99px;background:#e2edf5;height:12px;animation:sp-pulse 1.4s ease-in-out infinite}

/* result */
.sp-ov-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:12px}
.sp-title2{font-size:1.75rem;font-weight:800;color:var(--navy);line-height:1.2}
.sp-meta{margin-top:4px;color:var(--muted);font-size:.88rem}
.sp-actions{display:flex;gap:8px}
.sp-text{margin-top:14px;color:#475569;line-height:1.75}
.sp-h3{display:flex;align-items:center;gap:10px;font-size:1.2rem;font-weight:800;color:var(--navy)}
.sp-h3::before{content:"";width:6px;height:22px;border-radius:4px;background:linear-gradient(var(--green),var(--brand))}
.sp-grid-r{display:grid;gap:16px;grid-template-columns:1fr 1fr;margin-top:16px}
.sp-mini{padding:16px;border:1px solid var(--line);border-radius:18px;background:#fcfeff}
.sp-mini-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.sp-mini-top b{color:var(--ink)}
.sp-mini-text{margin-top:8px;color:#475569;font-size:.9rem}
.sp-pill{padding:3px 12px;border-radius:999px;font-size:.75rem;font-weight:800;white-space:nowrap}
.lv-low{background:#dcfce7;color:#166534}
.lv-medium{background:#fef3c7;color:#92400e}
.lv-high{background:#ffe4e6;color:#9f1239}
.pill-sky{background:#e0f0ff;color:#1d4ed8}
.pill-green{background:#dcfce7;color:#166534}
.sp-list{display:flex;flex-direction:column;gap:7px;margin-top:10px;color:#475569;font-size:.9rem}
.sp-list li{position:relative;padding-left:18px}
.sp-list li::before{content:"";position:absolute;left:2px;top:.55em;width:7px;height:7px;border-radius:50%;background:var(--brand)}
.sp-steps{display:flex;flex-direction:column;gap:10px;margin-top:14px;counter-reset:s;color:#475569;font-size:.9rem}
.sp-steps li{position:relative;padding-left:36px;counter-increment:s;min-height:24px}
.sp-steps li::before{content:counter(s);position:absolute;left:0;top:-1px;width:24px;height:24px;border-radius:50%;background:#e8f7ee;color:var(--green-d);font-weight:800;font-size:.78rem;display:grid;place-items:center}
.sp-assembly{margin-top:12px;padding:10px 14px;border-radius:14px;background:#e8f7ee;color:#14532d;font-size:.9rem}

/* checklist */
.sp-ck-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px}
.sp-bar{height:10px;border-radius:99px;background:#e6f2ea;overflow:hidden;margin-top:16px}
.sp-bar>div{height:100%;border-radius:99px;background:linear-gradient(90deg,#16a34a,#3cb371,#38bdf8);transition:width .3s}
.sp-cat{margin:18px 0 4px;font-weight:800;color:var(--green-d);font-size:.95rem}
.sp-check{display:flex;gap:12px;align-items:flex-start;padding:10px 8px;cursor:pointer;border-radius:12px;border-bottom:1px solid #eef3f7;transition:background .15s}
.sp-check:hover{background:#f4fbf7}
.sp-check input{width:19px;height:19px;margin-top:2px;accent-color:#16a34a;flex:none;cursor:pointer}
.sp-check span{font-size:.9rem;color:#334155;line-height:1.5}
.sp-check.on span{color:#94a3b8;text-decoration:line-through}

/* roles */
.sp-role{display:grid;grid-template-columns:200px 1fr;gap:16px;padding:14px 0;border-bottom:1px solid #eef3f7}
.sp-role:last-child{border-bottom:0}
.sp-role b{color:var(--navy)}
.sp-role span{color:#475569;font-size:.9rem}

/* special cards */
.sp-dark{background:linear-gradient(135deg,#0b1f66,#14418f 60%,#1b6aa8);color:#fff;border-radius:24px;padding:24px;box-shadow:0 16px 30px -16px rgba(11,31,102,.6)}
.sp-dark h3{font-size:1.15rem;font-weight:800}
.sp-dark p{margin-top:10px;color:#dbeafe;line-height:1.7}
.sp-amber{background:#fffbeb;border:1px solid #fde68a;border-radius:24px;padding:24px}
.sp-amber h3{font-size:1.15rem;font-weight:800;color:#78350f}
.sp-amber .sp-list{color:#78350f}
.sp-amber .sp-list li::before{background:#f59e0b}
.sp-note{font-size:.82rem;color:#94a3b8;line-height:1.6}

/* saved */
.sp-saved-title{margin-top:48px;font-size:1.3rem;font-weight:800;color:var(--navy)}
.sp-saved{background:#fff;border:1.5px solid var(--line);border-radius:18px;padding:16px;box-shadow:0 6px 16px -10px rgba(11,31,102,.2);transition:border-color .15s,box-shadow .15s}
.sp-saved.sel{border-color:var(--brand);box-shadow:0 0 0 4px rgba(60,179,113,.15)}
.sp-saved-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.sp-trunc{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-saved b{display:block;color:var(--navy)}
.sp-saved small{display:block;color:var(--muted);font-size:.78rem}
.sp-saved-risks{margin-top:8px;color:var(--muted);font-size:.78rem}
.sp-saved-btns{display:flex;gap:8px;margin-top:12px}

@keyframes sp-spin{to{transform:rotate(360deg)}}
@keyframes sp-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.sp-pulse,.sp-skel div,.sp-spin{animation:none}}

@media (max-width:720px){
  .sp-art{display:none}
  .sp-grid2,.sp-grid-r{grid-template-columns:1fr}
  .sp-role{grid-template-columns:1fr;gap:4px}
  .sp-form{padding:20px}
}
@media print{
  .no-print{display:none!important}
  .sp{background:#fff}
  .sp-card{box-shadow:none}
    .sp-hero{padding:32px 16px 44px;
    background:linear-gradient(180deg,rgba(244,250,255,.93) 0%,rgba(244,250,255,.85) 100%),
    url("https://blog.edcafe.ai/wp-content/uploads/2026/06/AI-Chatbot-safety-scaled.png") 65% center/cover no-repeat}
  .sp-main{padding:0 14px 60px}
  .sp-sub{font-size:1rem}
  .sp-sos-label{width:100%}
  .sp-sos a{font-size:.8rem}
  .sp-title2{font-size:1.45rem}
  .sp-card{padding:18px}
  .sp-dark{background:#fff!important;color:#000!important;border:1px solid #cbd5e1;box-shadow:none}
  .sp-dark p{color:#334155!important}
  .sp-main{max-width:none;padding:0}

}
`;

/* Chhota helper: chips (single ya multi select) */
function Chips({ n, label, hint, options, value, onChange, single = false }) {
  const toggle = (o) => {
    if (single) return onChange(o);
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  };
  const isOn = (o) => (single ? value === o : value.includes(o));
  return (
    <div>
      <div className="sp-step">
        <i>{n}</i>
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      <div className="sp-chips" role={single ? "radiogroup" : "group"} aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role={single ? "radio" : undefined}
            aria-checked={single ? isOn(o) : undefined}
            aria-pressed={single ? undefined : isOn(o)}
            onClick={() => toggle(o)}
            className={`sp-chip ${isOn(o) ? "on" : ""}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SafetyPlanner() {
  // form
  const [name, setName] = useState("");
  const [kind, setKind] = useState("Housing society");
  const [households, setHouseholds] = useState("");
  const [location, setLocation] = useState("");
  const [risks, setRisks] = useState([]);
  const [vulnerable, setVulnerable] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState("");
  // data
  const [doc, setDoc] = useState(null); // poora saved plan document
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const plan = doc?.plan;
  const done = doc?.done ?? [];

  const loadSaved = async () => {
    try {
      setSaved(await api("/plans"));
    } catch {
      /* list na aaye to bhi page chale */
    }
  };
  useEffect(() => {
    loadSaved();
  }, []);

  const scrollToResult = () =>
    setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 50);

  const generate = async () => {
    setError("");
    if (!name.trim()) return setError("Community ka naam likho.");
    if (!Number(households) || Number(households) < 1) return setError("Gharon ki sankhya likho.");
    if (risks.length === 0) return setError("Kam se kam ek risk chuno.");

    setLoading(true);
    setDoc(null);
    try {
      // Backend route: POST /api/plans/generate
      const created = await api("/plans/generate", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          kind,
          households: Number(households),
          location: location.trim(),
          risks,
          vulnerable,
          resources,
          notes: notes.trim(),
        }),
      });
      setDoc(created);
      loadSaved();
      scrollToResult();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPlan = async (id) => {
    setError("");
    try {
      setDoc(await api(`/plans/${id}`));
      scrollToResult();
    } catch (err) {
      setError(err.message);
    }
  };

  const removePlan = async (id) => {
    if (!window.confirm("Ye plan delete kar dein?")) return;
    try {
      await api(`/plans/${id}`, { method: "DELETE" });
      if (doc?._id === id) setDoc(null);
      loadSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  // Checklist tick: turant dikhao, phir server par save
  const toggleItem = async (itemId) => {
    const old = done;
    const next = old.includes(itemId) ? old.filter((x) => x !== itemId) : [...old, itemId];
    setDoc((d) => ({ ...d, done: next }));
    try {
      await api(`/plans/${doc._id}/progress`, { method: "PATCH", body: JSON.stringify({ done: next }) });
    } catch {
      setDoc((d) => ({ ...d, done: old }));
      setError("Progress save nahi ho paya.");
    }
  };

  const totalItems = useMemo(
    () => (plan ? (plan.checklist ?? []).reduce((n, c) => n + c.items.length, 0) : 0),
    [plan]
  );
  const pct = totalItems ? Math.round((done.length / totalItems) * 100) : 0;

  return (
    <div className="sp">
      <style>{css}</style>

      {/* ================= HERO ================= */}
      <header className="sp-hero no-print">
        <div className="sp-blob1" />
        <div className="sp-blob2" />
        <div className="sp-dots" />
        <div className="sp-wrap">
          <div className="sp-hero-row">
            <div>
              <span className="sp-badge">
                <span className="sp-pulse" />
                AI Powered · Hinglish mein plan
              </span>
              <h1 className="sp-title">
                Community Safety <span>Planner</span>
              </h1>
              <svg className="sp-swoosh" viewBox="0 0 240 16" fill="none" aria-hidden="true">
                <path d="M4 10 C60 3, 130 3, 214 8" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
                <circle cx="230" cy="8" r="4.5" fill="#16a34a" />
              </svg>
              <p className="sp-sub">
                Apni community ke risks batao, AI poora preparedness plan banayega: checklist, roles, evacuation aur drills.
              </p>

              <div className="sp-sos">
                <span className="sp-sos-label">Emergency mein turant call:</span>
                {EMERGENCY.map((e) => (
                  <a key={e.n} href={`tel:${e.n}`}>
                    <b style={{ background: e.c }}>{e.n}</b>
                    {e.l}
                  </a>
                ))}
              </div>
            </div>

            <svg className="sp-art" viewBox="0 0 160 160" fill="none" aria-hidden="true">
              <path d="M80 10 L138 32 V80 C138 116 113 140 80 152 C47 140 22 116 22 80 V32 Z" fill="#fff" stroke="#3cb371" strokeWidth="5" />
              <circle cx="80" cy="58" r="12" fill="#2563eb" />
              <path d="M56 94 a24 24 0 0 1 48 0 z" fill="#2563eb" />
              <circle cx="52" cy="68" r="8" fill="#14b8a6" />
              <path d="M38 94 a14 14 0 0 1 22 -10 v10 z" fill="#14b8a6" />
              <circle cx="108" cy="68" r="8" fill="#14b8a6" />
              <path d="M122 94 a14 14 0 0 0 -22 -10 v10 z" fill="#14b8a6" />
              <path d="M80 130 C68 121 60 115 60 107 a10 10 0 0 1 20 -4 a10 10 0 0 1 20 4 c0 8 -8 14 -20 23z" fill="#16a34a" />
            </svg>
          </div>
        </div>
      </header>

      <main className="sp-main">
        {/* ================= FORM ================= */}
        <div className="sp-card sp-form no-print">
          <div>
            <div className="sp-step">
              <i>1</i>
              <span>Community ki jaankari</span>
            </div>
            <div className="sp-grid2">
              <label className="sp-label">
                Community ka naam
                <input className="sp-field" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Jaise: Shanti Nagar Society" />
              </label>
              <label className="sp-label">
                Kitne ghar / parivaar?
                <input className="sp-field" type="number" min="1" inputMode="numeric" value={households} onChange={(e) => setHouseholds(e.target.value)} placeholder="Jaise: 120" />
              </label>
              <label className="sp-label sp-span2">
                Jagah (optional)
                <input className="sp-field" value={location} maxLength={100} onChange={(e) => setLocation(e.target.value)} placeholder="Jaise: Ghaziabad, Uttar Pradesh" />
              </label>
            </div>
          </div>

          <Chips n="2" label="Community ka type" options={COMMUNITY_TYPES} value={kind} onChange={setKind} single />
          <Chips n="3" label="Kin risks ki taiyari chahiye?" hint="ek ya zyada chuno" options={RISKS} value={risks} onChange={setRisks} />
          <Chips n="4" label="Community mein kaun-kaun hai?" hint="optional" options={VULNERABLE} value={vulnerable} onChange={setVulnerable} />
          <Chips n="5" label="Abhi aapke paas kya hai?" hint="optional" options={RESOURCES} value={resources} onChange={setResources} />

          <label className="sp-label">
            Koi aur baat? (optional)
            <textarea
              className="sp-field"
              style={{ resize: "none" }}
              rows={3}
              maxLength={300}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jaise: nadi paas hai, pichhli baarish mein ground floor mein paani bhar gaya tha..."
            />
            <small className="sp-count-txt">{notes.length}/300</small>
          </label>

          <button type="button" className="sp-cta" onClick={generate} disabled={loading} aria-busy={loading}>
            {loading ? (
              <>
                <svg className="sp-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Plan ban raha hai...
              </>
            ) : (
              <>Safety plan banao <span aria-hidden="true">→</span></>
            )}
          </button>
        </div>

        {error && (
          <div role="alert" className="sp-alert no-print">
            {error}
          </div>
        )}

        {loading && (
          <div className="sp-stack no-print" aria-hidden="true">
            {[0, 1].map((n) => (
              <div key={n} className="sp-card sp-skel">
                <div style={{ width: "33%", height: 18 }} />
                <div style={{ width: "100%" }} />
                <div style={{ width: "80%" }} />
              </div>
            ))}
          </div>
        )}

        {/* ================= RESULT ================= */}
        {doc && plan && (
          <div ref={resultRef} className="sp-stack" aria-live="polite">
            {doc.fallback && (
              <div className="sp-warn">
                AI abhi available nahi hai, isliye ye general plan hai. Thodi der baad naya plan banake dekho.
              </div>
            )}

            {/* Overview */}
            <section className="sp-card">
              <div className="sp-ov-head">
                <div>
                  <h2 className="sp-title2">{doc.community.name}</h2>
                  <p className="sp-meta">
                    {doc.community.kind} · {doc.community.households} ghar
                    {doc.community.location && ` · ${doc.community.location}`} · {fmtDate(doc.createdAt)}
                  </p>
                </div>
                <div className="sp-actions no-print">
                  <button type="button" className="sp-btn" onClick={() => window.print()}>
                    Print karo
                  </button>
                  <button
                    type="button"
                    className="sp-btn solid"
                    onClick={() => {
                      setDoc(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Naya plan
                  </button>
                </div>
              </div>
              <p className="sp-text">{plan.overview}</p>
            </section>

            {/* Risks */}
            {(plan.risks ?? []).length > 0 && (
              <section className="sp-card">
                <h3 className="sp-h3">Risk assessment</h3>
                <div className="sp-grid-r">
                  {plan.risks.map((r) => {
                    const lv = LEVEL[r.level] ? r.level : "medium";
                    return (
                      <div key={r.name} className="sp-mini">
                        <div className="sp-mini-top">
                          <b>{r.name}</b>
                          <span className={`sp-pill lv-${lv}`}>{LEVEL[lv].label}</span>
                        </div>
                        {r.why && <p className="sp-mini-text">{r.why}</p>}
                        {(r.prepare ?? []).length > 0 && (
                          <ul className="sp-list">
                            {r.prepare.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Checklist */}
            {(plan.checklist ?? []).length > 0 && (
              <section className="sp-card">
                <div className="sp-ck-head">
                  <h3 className="sp-h3">Taiyari checklist</h3>
                  <span className="sp-pill pill-green">
                    {done.length}/{totalItems} ho gaye
                  </span>
                </div>
                <div className="sp-bar">
                  <div style={{ width: `${pct}%` }} />
                </div>

                <div className="sp-grid-r" style={{ gap: 24 }}>
                  {plan.checklist.map((c) => (
                    <div key={c.category}>
                      <h4 className="sp-cat">{c.category}</h4>
                      <ul>
                        {c.items.map((it) => {
                          const on = done.includes(it.id);
                          return (
                            <li key={it.id}>
                              <label className={`sp-check ${on ? "on" : ""}`}>
                                <input type="checkbox" checked={on} onChange={() => toggleItem(it.id)} />
                                <span>{it.text}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roles */}
            {(plan.roles ?? []).length > 0 && (
              <section className="sp-card">
                <h3 className="sp-h3">Kaun kya karega</h3>
                <div style={{ marginTop: 8 }}>
                  {plan.roles.map((r) => (
                    <div key={r.role} className="sp-role">
                      <b>{r.role}</b>
                      <span>{r.responsibility}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Communication + Evacuation */}
            <div className="sp-grid2" style={{ alignItems: "start" }}>
              {plan.communicationPlan && (
                <section className="sp-dark">
                  <h3>Alert aur communication</h3>
                  <p>{plan.communicationPlan}</p>
                </section>
              )}
              {(plan.evacuation?.assemblyPoint || (plan.evacuation?.steps ?? []).length > 0) && (
                <section className="sp-card">
                  <h3 className="sp-h3">Evacuation plan</h3>
                  {plan.evacuation.assemblyPoint && (
                    <p className="sp-assembly">
                      <b>Assembly point:</b> {plan.evacuation.assemblyPoint}
                    </p>
                  )}
                  <ol className="sp-steps">
                    {(plan.evacuation.steps ?? []).map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </section>
              )}
            </div>

            {/* Drills */}
            {(plan.drills ?? []).length > 0 && (
              <section className="sp-card">
                <h3 className="sp-h3">Mock drills</h3>
                <div className="sp-grid-r">
                  {plan.drills.map((d) => (
                    <div key={d.name} className="sp-mini">
                      <div className="sp-mini-top">
                        <b>{d.name}</b>
                        {d.frequency && <span className="sp-pill pill-sky">{d.frequency}</span>}
                      </div>
                      {d.how && <p className="sp-mini-text">{d.how}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vulnerable + contacts */}
            {((plan.vulnerableSupport ?? []).length > 0 || (plan.contactsToCollect ?? []).length > 0) && (
              <div className="sp-grid2" style={{ alignItems: "start" }}>
                {(plan.vulnerableSupport ?? []).length > 0 && (
                  <section className="sp-amber">
                    <h3>Khaas madad chahiye unko</h3>
                    <ul className="sp-list">
                      {plan.vulnerableSupport.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}
                {(plan.contactsToCollect ?? []).length > 0 && (
                  <section className="sp-card">
                    <h3 className="sp-h3">Ye contacts jama karo</h3>
                    <ul className="sp-list">
                      {plan.contactsToCollect.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}
              </div>
            )}

            <p className="sp-note">
              Ye AI ke sujhav hain, professional safety advice nahi. Kisi bhi emergency mein 112 / 108 / 101 par call karo, aur apne local disaster management office se plan confirm karo.
            </p>
          </div>
        )}

        {/* ================= SAVED PLANS ================= */}
        {saved.length > 0 && (
          <section className="no-print">
            <h2 className="sp-saved-title">Aapke saved plans</h2>
            <div className="sp-grid2" style={{ marginTop: 16 }}>
              {saved.map((s) => (
                <div key={s._id} className={`sp-saved ${doc?._id === s._id ? "sel" : ""}`}>
                  <div className="sp-saved-top">
                    <div style={{ minWidth: 0 }}>
                      <b className="sp-trunc">{s.community.name}</b>
                      <small>{s.community.kind} · {fmtDate(s.createdAt)}</small>
                    </div>
                    {s.fallback && <span className="sp-pill lv-medium">General</span>}
                  </div>
                  <p className="sp-saved-risks sp-trunc">{(s.risks ?? []).join(" · ")}</p>
                  <div className="sp-saved-btns">
                    <button type="button" className="sp-btn solid" onClick={() => openPlan(s._id)}>
                      Kholo
                    </button>
                    <button type="button" className="sp-btn danger" onClick={() => removePlan(s._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
