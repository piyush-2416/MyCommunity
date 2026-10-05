import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Navbar from "../Pages/Navbar";

const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };

/* ───────── API (backend se call) ─────────
   Route: GET /api/Directory&members
*/
const ROUTE = "http://localhost:3000/api/Directory"; // 👈 route yahan se badlo

async function getDirectory() {
  const res = await axios.get(ROUTE);
  const j = res.data;
  return Array.isArray(j) ? j : j.data || [];   // seedha array ya {success, data} dono chalega
}

const ICON = { "Society Management": "🏛️", Security: "🛡️", Health: "🩺", Maintenance: "🔧", Events: "🎉" };
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const mins = t => { const m = t.match(/(\d+):(\d+)\s*([AP]M)/i); if (!m) return null; let h = +m[1] % 12; if (m[3].toUpperCase() === "PM") h += 12; return h * 60 + +m[2]; };
function isOpen(a = "") { // "Mon - Sat, 10:00 AM - 6:00 PM" se open/closed nikalta hai
  const m = a.match(/(\w{3})\w*\s*-\s*(\w{3})\w*,?\s*(\d+:\d+\s*[AP]M)\s*-\s*(\d+:\d+\s*[AP]M)/i);
  if (!m) return null;
  const s = DAYS.indexOf(m[1].toLowerCase()), e = DAYS.indexOf(m[2].toLowerCase()), now = new Date(), d = now.getDay(), cur = now.getHours() * 60 + now.getMinutes();
  if (s < 0 || e < 0) return null;
  return (s <= e ? d >= s && d <= e : d >= s || d <= e) && cur >= mins(m[3]) && cur <= mins(m[4]);
}
const hue = s => [...(s || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
const initials = n => (n || "?").replace(/^Dr\.\s*/, "").split(" ").map(w => w[0]).slice(0, 2).join("");
const tel = p => (p || "").replace(/[^\d+]/g, "");

const CSS = `
.dr-page{--a:#0f766e;--a2:#2dd4bf;--bg:#eef6f4;--card:rgba(255,255,255,.85);--solid:#fff;--tx:#0f172a;--mut:#64748b;--bd:rgba(148,163,184,.25);--sh:0 8px 30px rgba(15,23,42,.06);min-height:100vh;padding:22px 30px 50px;color:var(--tx);font-family:Inter,system-ui,sans-serif;background:radial-gradient(900px 500px at 90% -10%,color-mix(in srgb,var(--a2) 22%,transparent),transparent),var(--bg);transition:background .3s}
[data-accent=indigo] .dr-page{--a:#4f46e5;--a2:#818cf8}[data-accent=rose] .dr-page{--a:#e11d48;--a2:#fb7185}[data-accent=amber] .dr-page{--a:#d97706;--a2:#fbbf24}
[data-theme=dark] .dr-page{--bg:#0a1413;--card:rgba(20,38,37,.8);--solid:#142625;--tx:#e8f5f2;--mut:#93a8a5;--bd:rgba(148,163,184,.15);--sh:0 8px 30px rgba(0,0,0,.35)}
.dr-page *{box-sizing:border-box}.dr-page h1,.dr-page h2{font-weight:800}.dr-page .sub{color:var(--mut);font-size:14px}
.dr-page .fade{animation:up .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms)}
@keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes blob{50%{transform:translate(30px,-20px) scale(1.15)}}@keyframes float{50%{transform:translateY(-8px)}}@keyframes pop{40%{transform:scale(1.5)}}
.dr-page .card{background:var(--card);backdrop-filter:blur(12px);border:1px solid var(--bd);border-radius:18px;padding:18px;box-shadow:var(--sh);transition:.3s}
.dr-page .lift:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(15,23,42,.14)}
.dr-page .btn{background:linear-gradient(90deg,var(--a),var(--a2));color:#fff;border:0;padding:10px 20px;border-radius:11px;cursor:pointer;font-weight:600;transition:.25s}.dr-page .btn:hover{transform:translateY(-2px)}
.dr-page .pill{font-size:12px;padding:3px 11px;border-radius:99px;background:color-mix(in srgb,var(--a) 15%,transparent);color:var(--a);font-weight:600}
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:12px 22px;border-radius:12px;z-index:99;animation:up .4s both;font-size:14px}
@media(max-width:700px){.dr-page{padding:16px 14px 40px}}
.dr-hero{position:relative;overflow:hidden;border-radius:24px;padding:34px;color:#fff;margin-bottom:22px;background:linear-gradient(120deg,var(--a),var(--a2))}
.dr-hero:before,.dr-hero:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.15);animation:blob 9s ease-in-out infinite}
.dr-hero:before{width:240px;height:240px;right:-50px;top:-80px}.dr-hero:after{width:120px;height:120px;right:220px;bottom:-50px;animation-delay:2s}
.dr-hero h1{color:#fff;margin:0 0 6px;font-size:30px}.dr-hero p{margin:0 0 18px;opacity:.92}
.dr-search{display:flex;align-items:center;gap:10px;background:var(--solid);color:var(--tx);border-radius:16px;padding:6px 8px 6px 16px;max-width:520px;box-shadow:0 12px 30px rgba(0,0,0,.18);transition:.3s;position:relative;z-index:1}
.dr-search:focus-within{transform:scale(1.02)}.dr-search input{flex:1;border:0;outline:0;background:none;color:inherit;font:inherit;padding:10px 0}.dr-search button{border:0;background:none;color:var(--mut);cursor:pointer}
.dr-stats{display:flex;gap:26px;margin-top:20px;position:relative;z-index:1}.dr-stats b{display:block;font-size:24px}.dr-stats span{font-size:12px;opacity:.85}
.dr-bar{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}.dr-chips{display:flex;gap:8px;flex-wrap:wrap}
.dr-chip{padding:9px 15px;border-radius:14px;border:1px solid var(--bd);background:var(--card);color:var(--tx);cursor:pointer;font-size:13px;font-weight:600;transition:.25s}
.dr-chip:hover{transform:translateY(-3px);border-color:var(--a)}.dr-chip.on{background:linear-gradient(90deg,var(--a),var(--a2));color:#fff;border-color:transparent;box-shadow:0 8px 20px color-mix(in srgb,var(--a) 35%,transparent)}
.dr-view{display:flex;border:1px solid var(--bd);border-radius:12px;overflow:hidden;height:38px}.dr-view button{border:0;background:var(--card);color:var(--mut);padding:0 13px;cursor:pointer}.dr-view .on{background:var(--a);color:#fff}
.dr-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(290px,1fr))}.dr-grid.list{grid-template-columns:1fr}
.dr-card{position:relative;overflow:hidden;cursor:pointer}
.dr-card:before{content:"";position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,var(--a),var(--a2));transform:scaleX(0);transform-origin:left;transition:.4s}.dr-card:hover:before{transform:scaleX(1)}
.dr-top{display:flex;gap:14px;align-items:center;padding-right:28px}
.dr-av{position:relative;width:60px;height:60px;border-radius:20px;display:grid;place-items:center;color:#fff;font-weight:800;font-size:20px;flex:none;transition:.4s}
.dr-card:hover .dr-av{transform:rotate(-8deg) scale(1.08);border-radius:50%}
.dr-dot{position:absolute;right:-3px;bottom:-3px;width:16px;height:16px;border-radius:50%;border:3px solid var(--solid);background:#94a3b8}.dr-dot.on{background:#22c55e;animation:ping 2s infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}100%{box-shadow:0 0 0 10px rgba(34,197,94,0)}}
.dr-name{font-weight:700;font-size:16px}.dr-role{color:var(--a);font-size:13px;font-weight:600}
.dr-info{margin:16px 0;display:grid;gap:9px;font-size:13px;color:var(--mut)}.dr-info div{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
.dr-status{font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;background:rgba(148,163,184,.2);color:var(--mut)}.dr-status.on{background:rgba(34,197,94,.15);color:#16a34a}
.dr-acts{display:flex;gap:8px}.dr-acts a,.dr-acts button{flex:1;text-align:center;text-decoration:none;padding:10px;border-radius:12px;border:1px solid var(--bd);background:var(--solid);color:var(--tx);font-size:13px;font-weight:600;cursor:pointer;transition:.25s;font-family:inherit}
.dr-acts a:hover,.dr-acts button:hover{background:var(--a);color:#fff;transform:translateY(-3px);border-color:transparent}.dr-acts .call{background:linear-gradient(90deg,var(--a),var(--a2));color:#fff;border:0}
.dr-fav{position:absolute;right:14px;top:16px;border:0;background:none;font-size:19px;cursor:pointer;transition:.25s;z-index:1}.dr-fav:hover{transform:scale(1.25)}.dr-fav.on{animation:pop .4s}
.dr-ov{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);display:grid;place-items:center;z-index:20;animation:fadeIn .25s both;padding:16px}
.dr-modal{width:100%;max-width:440px;max-height:92vh;overflow-y:auto;background:var(--solid);color:var(--tx);border-radius:24px;animation:modal .45s cubic-bezier(.2,.9,.3,1.2) both}
.dr-mh{padding:26px;text-align:center;color:#fff;background:linear-gradient(120deg,var(--a),var(--a2));position:relative;border-radius:24px 24px 0 0}
.dr-mh .dr-av{margin:0 auto 10px;width:80px;height:80px;font-size:28px;background:rgba(255,255,255,.25)!important;border:3px solid #fff}
.dr-x{position:absolute;right:14px;top:12px;border:0;background:rgba(255,255,255,.25);color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer}
.dr-mb{padding:20px 24px 24px}.dr-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--bd);font-size:14px;gap:10px}.dr-row small{display:block;color:var(--mut);font-size:11px}
.dr-row button{border:0;background:color-mix(in srgb,var(--a) 12%,transparent);color:var(--a);padding:6px 12px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600}
.dr-f input{width:100%;padding:11px 13px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:inherit;outline:0;transition:.25s}
.dr-f input:focus{border-color:var(--a);box-shadow:0 0 0 4px color-mix(in srgb,var(--a) 15%,transparent)}
@keyframes fadeIn{from{opacity:0}}@keyframes modal{from{opacity:0;transform:translateY(40px) scale(.9)}}
.dr-skel{height:240px;border-radius:18px;background:linear-gradient(100deg,var(--bd) 30%,rgba(255,255,255,.25) 50%,var(--bd) 70%);background-size:200% 100%;animation:shim 1.2s infinite}@keyframes shim{to{background-position:-200% 0}}
.dr-empty{text-align:center;padding:60px 0;color:var(--mut)}.dr-empty b{display:block;font-size:44px;animation:float 3s infinite}
`;

export default function Directory() {
  const [data, setData] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [q, setQ] = useState(""), [dep, setDep] = useState("All"), [view, setView] = useState("grid");
  const [favs, setFavs] = useState(() => { try { return JSON.parse(localStorage.getItem("dirFavs")) || []; } catch { return []; } });
  const [sel, setSel] = useState(null), [toast, setToast] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setData(await getDirectory()); }
    catch (e) { setError(e.message || "Server se connect nahi ho pa raha! (backend chal raha hai?)"); }
    setLoading(false);
  };
  useEffect(applyPrefs, []);
  useEffect(() => { load(); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2000); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { try { localStorage.setItem("dirFavs", JSON.stringify(favs)); } catch {} }, [favs]);

  const deps = useMemo(() => ["All", ...new Set(data.map(d => d.department).filter(Boolean))], [data]);
  const list = data.filter(d => (dep === "All" || d.department === dep) && `${d.name} ${d.role} ${d.department} ${d.email}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => favs.includes(b._id) - favs.includes(a._id));
  const fav = id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const copy = (t, l) => { navigator.clipboard?.writeText(t); setToast(`${l} copied 📋`); };
  const openNow = data.filter(d => isOpen(d.availability)).length;

  return (<>
    <Navbar />
    <div className="dr-page">
    <style>{CSS}</style>
    <div className="dr-hero fade">
      <h1>Community Directory</h1><p>Find and contact the right person, quickly</p>
      <div className="dr-search"><span>🔍</span><input placeholder="Search by name, role or department..." value={q} onChange={e => setQ(e.target.value)} />{q && <button onClick={() => setQ("")}>✕</button>}</div>
      <div className="dr-stats"><div><b>{data.length}</b><span>Contacts</span></div><div><b>{deps.length - 1}</b><span>Departments</span></div><div><b>{openNow}</b><span>Available now</span></div></div>
    </div>

    <div className="dr-bar fade" style={{ "--i": 1 }}>
      <div className="dr-chips">{deps.map(d => <button key={d} className={"dr-chip" + (dep === d ? " on" : "")} onClick={() => setDep(d)}>{ICON[d] || "✨"} {d}</button>)}</div>
      <div className="dr-view"><button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>▦</button><button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>☰</button></div>
    </div>

    {loading ? <div className="dr-grid">{[0, 1, 2].map(i => <div key={i} className="dr-skel" />)}</div>
      : error ? <div className="dr-empty fade"><b>🔌</b>{error}<br /><button className="btn" style={{ marginTop: 14 }} onClick={load}>Retry</button></div>
      : list.length === 0 ? <div className="dr-empty fade"><b>📭</b>{data.length ? "No contacts found" : "Abhi directory me koi contact nahi hai."}<br />{data.length > 0 && <button className="btn" style={{ marginTop: 14 }} onClick={() => { setQ(""); setDep("All"); }}>Clear filters</button>}</div>
      : <div className={"dr-grid " + view}>{list.map((d, i) => { const o = isOpen(d.availability), f = favs.includes(d._id); return (
        <div key={d._id} className="card dr-card lift fade" style={{ "--i": i }} onClick={() => setSel(d)}>
          <button className={"dr-fav" + (f ? " on" : "")} onClick={e => { e.stopPropagation(); fav(d._id); }}>{f ? "⭐" : "☆"}</button>
          <div className="dr-top"><div className="dr-av" style={{ background: `linear-gradient(135deg,hsl(${hue(d.name)},70%,50%),hsl(${(hue(d.name) + 40) % 360},75%,60%))` }}>{initials(d.name)}{o !== null && <span className={"dr-dot" + (o ? " on" : "")} />}</div>
            <div><div className="dr-name">{d.name}</div><div className="dr-role">{d.role}</div>{d.department && <span className="pill" style={{ marginTop: 4, display: "inline-block" }}>{ICON[d.department] || "📌"} {d.department}</span>}</div></div>
          <div className="dr-info"><div>📞 {d.phone}</div>{d.email && <div>✉️ {d.email}</div>}{d.availability && <div>🕐 {d.availability}{o !== null && <span className={"dr-status" + (o ? " on" : "")}>{o ? "Open now" : "Closed"}</span>}</div>}</div>
          <div className="dr-acts" onClick={e => e.stopPropagation()}><a className="call" href={`tel:${tel(d.phone)}`}>📞 Call</a>{d.email && <a href={`mailto:${d.email}`}>✉️</a>}<a href={`https://wa.me/${tel(d.phone).replace("+", "")}`} target="_blank" rel="noreferrer">💬</a></div>
        </div>); })}</div>}

    {sel && <div className="dr-ov" onClick={() => setSel(null)}><div className="dr-modal" onClick={e => e.stopPropagation()}>
      <div className="dr-mh"><button className="dr-x" onClick={() => setSel(null)}>✕</button>
        <div className="dr-av" style={{ background: "none" }}>{initials(sel.name)}</div><h2 style={{ margin: 0 }}>{sel.name}</h2><div style={{ opacity: .9 }}>{sel.role}{sel.department && ` · ${sel.department}`}</div></div>
      <div className="dr-mb">
        {[["📞", "Phone", sel.phone], ["✉️", "Email", sel.email], ["🕐", "Availability", sel.availability]].filter(r => r[2]).map(([ic, l, v]) => (
          <div key={l} className="dr-row"><span>{ic} <small>{l}</small>{v}</span><button onClick={() => copy(v, l)}>Copy</button></div>))}
        <div className="dr-acts" style={{ marginTop: 18 }}><a className="call" href={`tel:${tel(sel.phone)}`}>📞 Call now</a>{sel.email && <a href={`mailto:${sel.email}`}>✉️ Send email</a>}</div>
      </div></div></div>}


    {toast && <div className="toast">{toast}</div>}
    </div>
  </>);
}
