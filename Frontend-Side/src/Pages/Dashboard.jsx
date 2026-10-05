import { useState, useEffect } from "react";
const stats = [["👥", "Total Members", 1248], ["🙌", "Active Volunteers", 86], ["📅", "Total Events", 12], ["✅", "Complaints Resolved", 34]];
const week = [["Mon", 45], ["Tue", 70], ["Wed", 55], ["Thu", 90], ["Fri", 65], ["Sat", 100], ["Sun", 40]];
const events = [["Tree Plantation Drive", "25 May · 9:00 AM"], ["Health Checkup Camp", "28 May · 10:00 AM"], ["Cultural Fest", "2 Jun · 4:00 PM"]];
const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };
function CountUp({ to, ms = 1200 }) {
  const [n, set] = useState(0);
  useEffect(() => { let s, r; const f = t => { s ??= t; const p = Math.min((t - s) / ms, 1); set(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) r = requestAnimationFrame(f); }; r = requestAnimationFrame(f); return () => cancelAnimationFrame(r); }, [to, ms]);
  return <>{n.toLocaleString()}</>;
}

export default function Dashboard() {
  useEffect(applyPrefs, []);
  return (<>
    <div className="hero fade"><span className="emoji">🏙️</span><h2>Stronger Community, Better Living</h2><p>Together we build a safer, cleaner and happier community.</p><button className="btn">Join Community</button></div>
    <div className="grid">{stats.map(([ic, l, v], i) => <div key={l} className="card stat lift fade" style={{ "--i": i + 1 }}><div className="ic">{ic}</div><div><b><CountUp to={v} /></b><span>{l}</span></div></div>)}</div>
    <div className="two" style={{ marginTop: 16 }}>
      <div className="card fade" style={{ "--i": 5 }}><div className="row"><b>Community Activity</b><span className="pill">This week</span></div>
        <div className="chart">{week.map(([d, h]) => <div key={d}><i style={{ height: h + "%" }} />{d}</div>)}</div></div>
      <div className="card fade" style={{ "--i": 6 }}><b>Quick Actions</b>
        {["📝 Raise Complaint", "📸 Add Memory", "🎉 Create Event"].map(a => <button key={a} className="tab" style={{ display: "block", width: "100%", textAlign: "left", marginTop: 10, borderRadius: 12 }}>{a}</button>)}</div>
    </div>
    <div className="row" style={{ marginTop: 26 }}><h3 style={{ margin: 0 }}>Upcoming Events</h3><span className="pill">View all</span></div>
    <div className="grid" style={{ marginTop: 14 }}>{events.map(([t, d], i) => <div key={t} className="card ev lift fade" style={{ "--i": i + 7 }}><img src={`https://picsum.photos/seed/ev${i}/400/240`} alt="" /><b>{t}</b><p className="sub" style={{ margin: "4px 0 0" }}>📍 {d}</p></div>)}</div>
  </>);
}
