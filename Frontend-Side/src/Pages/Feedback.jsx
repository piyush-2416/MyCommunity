import { useState, useEffect } from "react";
const faces = ["😡", "😕", "😐", "🙂", "😍"], cats = ["General", "Events", "Cleanliness", "Security", "App"];
const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };
function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(""), 2200); return () => clearTimeout(t); }, [msg]);
  return [msg ? <div className="toast">{msg}</div> : null, setMsg];
}

export default function Feedback() {
  useEffect(applyPrefs, []);
  const [r, setR] = useState(0), [cat, setCat] = useState("General"), [msg, setMsg] = useState("");
  const [list, setList] = useState([{ n: "Riya Sharma", m: "Great community and helpful people!", r: 5, c: "General" }, { n: "Amit Patel", m: "Events are well organized. Keep it up!", r: 4, c: "Events" }, { n: "Vikash Kumar", m: "Need more waste management services.", r: 3, c: "Cleanliness" }]);
  const [toast, say] = useToast();
  const avg = (list.reduce((a, b) => a + b.r, 0) / list.length).toFixed(1);
  const submit = e => { e.preventDefault(); if (!r || !msg.trim()) return say("Please pick a rating and write feedback"); setList([{ n: "You", m: msg, r, c: cat }, ...list]); setMsg(""); setR(0); say("Thanks for your feedback! 💚"); };
  return (<>
    <h1 className="fade">Feedback</h1><p className="sub fade">Your opinion helps us improve</p>
    <div className="two">
      <form className="card form fade" style={{ "--i": 1 }} onSubmit={submit}>
        <b>How was your experience?</b>
        <div className="emojis">{faces.map((f, i) => <button type="button" key={f} className={r === i + 1 ? "on" : ""} onClick={() => setR(i + 1)}>{f}</button>)}</div>
        <label>Category</label><div className="tabs">{cats.map(c => <button type="button" key={c} className={"chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>)}</div>
        <label>Your feedback</label><textarea rows={4} placeholder="Tell us more..." value={msg} onChange={e => setMsg(e.target.value)} />
        <button className="btn" style={{ marginTop: 16 }}>Submit Feedback</button></form>
      <div className="card fade" style={{ "--i": 2, textAlign: "center" }}><div style={{ fontSize: 46, fontWeight: 800 }}>{avg}<small style={{ fontSize: 16 }}> / 5</small></div><p className="sub">{list.length} reviews</p>
        {[5, 4, 3, 2, 1].map(s => <div key={s} className="row" style={{ marginBottom: 6, fontSize: 12 }}>{s}★<div className="xp" style={{ flex: 1, height: 7 }}><i style={{ width: (list.filter(x => x.r === s).length / list.length) * 100 + "%" }} /></div></div>)}</div>
    </div>
    <h3>Recent feedback</h3>
    {list.map((f, i) => <div key={f.n + i} className="card lift fade" style={{ "--i": i, marginBottom: 12 }}><div className="row"><div className="row"><img className="av" src={`https://i.pravatar.cc/80?u=${f.n}`} alt="" /><b>{f.n}</b></div><span>{faces[f.r - 1]} <span className="pill">{f.c}</span></span></div><p className="sub" style={{ margin: "10px 0 0" }}>{f.m}</p></div>)}
    {toast}
  </>);
}
