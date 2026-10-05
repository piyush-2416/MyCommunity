import { useState, useEffect, useMemo } from "react";

const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };

const CATS = [["All", "✨"], ["Residential", "🏘️"], ["Events", "🎉"], ["Volunteering", "🙌"], ["Services", "🛠️"]];
const DATA = [
  { id: 1, name: "Green Society", cat: "Residential", desc: "Eco-friendly living, gardening and waste-free drives.", members: 1200, rating: 4.8, tag: "Environment" },
  { id: 2, name: "Health & Wellness", cat: "Services", desc: "Free checkups, yoga mornings and fitness groups.", members: 856, rating: 4.7, tag: "Health" },
  { id: 3, name: "Cultural Club", cat: "Events", desc: "Festivals, music nights and art exhibitions.", members: 432, rating: 4.9, tag: "Art & Culture" },
  { id: 4, name: "Volunteer Hub", cat: "Volunteering", desc: "Join drives for cleanliness, food and education.", members: 310, rating: 4.6, tag: "Social" },
  { id: 5, name: "Royal Residency", cat: "Residential", desc: "Neighbourhood updates, security and notices.", members: 640, rating: 4.5, tag: "Society" },
  { id: 6, name: "Weekend Fun Events", cat: "Events", desc: "Sports days, picnics and kids' activities.", members: 390, rating: 4.7, tag: "Fun" },
  { id: 7, name: "Helping Hands", cat: "Volunteering", desc: "Support for elders and families in need.", members: 275, rating: 4.9, tag: "Care" },
  { id: 8, name: "Fix-It Services", cat: "Services", desc: "Trusted plumbers, electricians and repairs nearby.", members: 520, rating: 4.4, tag: "Local" },
];

const CSS = `
.ex-hero{position:relative;overflow:hidden;border-radius:24px;padding:34px;color:#fff;margin-bottom:22px;background:linear-gradient(120deg,var(--a),var(--a2))}
.ex-hero:before{content:"";position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.16);right:-60px;top:-90px;animation:blob 9s ease-in-out infinite}
.ex-hero h1{color:#fff;margin:0 0 6px;font-size:30px}.ex-hero p{margin:0 0 18px;opacity:.92}
.ex-search{display:flex;align-items:center;gap:10px;background:var(--solid);color:var(--tx);border-radius:16px;padding:6px 8px 6px 16px;max-width:520px;box-shadow:0 12px 30px rgba(0,0,0,.18);transition:.3s}
.ex-search:focus-within{transform:scale(1.02)}.ex-search input{flex:1;border:0;outline:0;background:none;color:inherit;font:inherit;padding:10px 0}
.ex-search button{border:0;background:none;color:var(--mut);cursor:pointer;font-size:16px}
.ex-bar{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.ex-cats{display:flex;gap:8px;flex-wrap:wrap}
.ex-cat{display:flex;gap:6px;align-items:center;padding:9px 16px;border-radius:14px;border:1px solid var(--bd);background:var(--card);color:var(--tx);cursor:pointer;font-size:13px;font-weight:600;transition:.25s}
.ex-cat:hover{transform:translateY(-3px);border-color:var(--a)}.ex-cat.on{background:linear-gradient(90deg,var(--a),var(--a2));color:#fff;border-color:transparent;box-shadow:0 8px 20px color-mix(in srgb,var(--a) 35%,transparent)}
.ex-cat small{background:rgba(0,0,0,.12);padding:1px 8px;border-radius:99px;font-size:11px}
.ex-tools{display:flex;gap:8px;align-items:center}
.ex-tools select{padding:9px 12px;border-radius:12px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font:inherit;font-size:13px;outline:0}
.ex-view{display:flex;border:1px solid var(--bd);border-radius:12px;overflow:hidden}.ex-view button{border:0;background:var(--card);color:var(--mut);padding:9px 12px;cursor:pointer;transition:.2s}.ex-view .on{background:var(--a);color:#fff}
.ex-trend{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 14px;scroll-snap-type:x mandatory;margin-bottom:8px}
.ex-tcard{position:relative;flex:none;width:250px;height:150px;border-radius:18px;overflow:hidden;scroll-snap-align:start;cursor:pointer;color:#fff}
.ex-tcard img{width:100%;height:100%;object-fit:cover;transition:.6s}.ex-tcard:hover img{transform:scale(1.12)}
.ex-tcard div{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(transparent 30%,rgba(0,0,0,.75))}
.ex-tcard span{position:absolute;top:10px;left:10px;background:#f59e0b;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px}
.ex-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.ex-grid.list{grid-template-columns:1fr}
.ex-card{padding:0;overflow:hidden;display:flex;flex-direction:column}
.list .ex-card{flex-direction:row}.list .ex-img{width:220px;height:auto;flex:none}
.ex-img{position:relative;height:160px;overflow:hidden}.ex-img img{width:100%;height:100%;object-fit:cover;transition:.6s cubic-bezier(.2,.8,.2,1)}
.ex-card:hover .ex-img img{transform:scale(1.1) rotate(1deg)}
.ex-img .tag{position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);color:#fff;font-size:11px;padding:4px 10px;border-radius:99px}
.ex-img .save{position:absolute;right:10px;top:10px;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.9);cursor:pointer;font-size:16px;transition:.25s}
.ex-img .save:hover{transform:scale(1.15)}.ex-img .save.on{animation:pop .4s}
.ex-body{padding:16px;display:flex;flex-direction:column;flex:1}.ex-body p{color:var(--mut);font-size:13px;margin:6px 0 14px;flex:1}
.ex-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--mut);margin-bottom:12px}
.ex-join{width:100%;position:relative;overflow:hidden}.ex-join.on{background:none;color:var(--a);border:2px solid var(--a)}
.ex-join:after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.4),transparent 70%);transform:translateX(-100%);transition:.6s}.ex-join:hover:after{transform:translateX(100%)}
.ex-skel{height:330px;border-radius:18px;background:linear-gradient(100deg,var(--bd) 30%,rgba(255,255,255,.25) 50%,var(--bd) 70%);background-size:200% 100%;animation:shim 1.2s infinite}
@keyframes shim{to{background-position:-200% 0}}
.ex-empty{text-align:center;padding:60px 0;color:var(--mut)}.ex-empty b{display:block;font-size:44px;animation:float 3s infinite}
@media(max-width:620px){.list .ex-card{flex-direction:column}.list .ex-img{width:100%;height:160px}.ex-hero{padding:24px}}
`;

export default function Explore() {
  const [q, setQ] = useState(""), [cat, setCat] = useState("All"), [sort, setSort] = useState("popular"), [view, setView] = useState("grid");
  const [joined, setJoined] = useState([2]), [saved, setSaved] = useState([]), [loading, setLoading] = useState(true), [toast, setToast] = useState("");
  useEffect(applyPrefs, []);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, [q, cat, sort]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2000); return () => clearTimeout(t); }, [toast]);

  const list = useMemo(() => DATA
    .filter(d => (cat === "All" || d.cat === cat) && (d.name + d.desc + d.tag).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === "popular" ? b.members - a.members : sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name)), [q, cat, sort]);
  const count = c => c === "All" ? DATA.length : DATA.filter(d => d.cat === c).length;
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;
  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  const join = d => { toggle(joined, setJoined, d.id); setToast(joined.includes(d.id) ? `Left ${d.name}` : `Welcome to ${d.name} 🎉`); };

  return (<div>
    <style>{CSS}</style>
    <div className="ex-hero fade">
      <h1>Explore Communities</h1><p>Discover new communities, events and opportunities near you</p>
      <div className="ex-search"><span>🔍</span><input placeholder="Search communities, events, services..." value={q} onChange={e => setQ(e.target.value)} />{q && <button onClick={() => setQ("")}>✕</button>}</div>
    </div>

    <div className="row" style={{ marginBottom: 6 }}><b>🔥 Trending now</b><span className="pill">{joined.length} joined</span></div>
    <div className="ex-trend fade" style={{ "--i": 1 }}>
      {[...DATA].sort((a, b) => b.members - a.members).slice(0, 5).map(d => (
        <div key={d.id} className="ex-tcard" onClick={() => setQ(d.name)}><img src={`https://picsum.photos/seed/cm${d.id}/500/300`} alt="" /><span>#Trending</span><div><b>{d.name}</b><small>{fmt(d.members)} members · ⭐ {d.rating}</small></div></div>))}
    </div>

    <div className="ex-bar fade" style={{ "--i": 2 }}>
      <div className="ex-cats">{CATS.map(([c, ic]) => <button key={c} className={"ex-cat" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{ic} {c} <small>{count(c)}</small></button>)}</div>
      <div className="ex-tools">
        <select value={sort} onChange={e => setSort(e.target.value)}><option value="popular">Most popular</option><option value="rating">Top rated</option><option value="name">A – Z</option></select>
        <div className="ex-view"><button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>▦</button><button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>☰</button></div>
      </div>
    </div>

    {loading ? <div className="ex-grid">{[0, 1, 2, 3].map(i => <div key={i} className="ex-skel" />)}</div>
      : list.length === 0 ? <div className="ex-empty fade"><b>🔎</b>No communities found for “{q}”<br /><button className="btn" style={{ marginTop: 14 }} onClick={() => { setQ(""); setCat("All"); }}>Clear filters</button></div>
      : <div className={"ex-grid " + view}>{list.map((d, i) => { const j = joined.includes(d.id), s = saved.includes(d.id); return (
        <div key={d.id} className="card ex-card lift fade" style={{ "--i": i }}>
          <div className="ex-img"><img src={`https://picsum.photos/seed/cm${d.id}/600/400`} alt={d.name} /><span className="tag">{d.tag}</span>
            <button className={"save" + (s ? " on" : "")} onClick={() => toggle(saved, setSaved, d.id)}>{s ? "❤️" : "🤍"}</button></div>
          <div className="ex-body"><div className="row"><b>{d.name}</b><span className="pill">{d.cat}</span></div>
            <p>{d.desc}</p>
            <div className="ex-meta"><span>👥 {fmt(d.members + (j ? 1 : 0))} members</span><span>⭐ {d.rating}</span></div>
            <button className={"btn ex-join" + (j ? " on" : "")} onClick={() => join(d)}>{j ? "Joined ✓" : "Join Community"}</button></div>
        </div>); })}</div>}
    {toast && <div className="toast">{toast}</div>}
  </div>);
}
