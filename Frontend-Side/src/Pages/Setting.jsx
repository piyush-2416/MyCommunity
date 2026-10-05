import { useState, useEffect } from "react";
const accents = { teal: "#0f766e", indigo: "#4f46e5", rose: "#e11d48", amber: "#d97706" };
const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };
const Toggle = ({ on, onChange }) => <button type="button" className={"sw" + (on ? " on" : "")} onClick={() => onChange(!on)} aria-pressed={on} />;
function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(""), 2200); return () => clearTimeout(t); }, [msg]);
  return [msg ? <div className="toast">{msg}</div> : null, setMsg];
}

export default function Settings() {
  useEffect(applyPrefs, []);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [accent, setAccent] = useState(localStorage.getItem("accent") || "teal");
  const [n, setN] = useState({ Email: true, Push: true, "Event reminders": false, "Weekly digest": true });
  const [p, setP] = useState({ "Show profile to members": true, "Show my activity": false });
  const [toast, say] = useToast();
  const pick = (k, v, set) => { set(v); localStorage.setItem(k, v); document.documentElement.dataset[k] = v; say("Preference saved ✓"); };
  const Sec = ({ t, i, children }) => <div className="card form fade" style={{ "--i": i, marginBottom: 16 }}><h3 style={{ margin: "0 0 6px" }}>{t}</h3>{children}</div>;
  return (<div style={{ maxWidth: 680 }}>
    <h1 className="fade">Settings</h1><p className="sub fade">Manage your account and preferences</p>
    <Sec t="👤 Account" i={1}>
      <label>Name</label><input defaultValue="Piyush Verma" /><label>Email</label><input defaultValue="piyushverma@gmail.com" /><label>Change password</label><input type="password" placeholder="New password" />
      <button className="btn" style={{ marginTop: 16 }} onClick={() => say("Account updated ✓")}>Save Changes</button></Sec>
    <Sec t="🎨 Appearance" i={2}>
      <label>Mode</label><div className="tabs">{["light", "dark"].map(t => <button key={t} className={"tab" + (theme === t ? " on" : "")} onClick={() => pick("theme", t, setTheme)}>{t === "light" ? "☀️ Light" : "🌙 Dark"}</button>)}</div>
      <label>Accent colour</label><div className="dots">{Object.entries(accents).map(([k, c]) => <button key={k} title={k} className={accent === k ? "on" : ""} style={{ background: c }} onClick={() => pick("accent", k, setAccent)} />)}</div></Sec>
    <Sec t="🔔 Notifications" i={3}>{Object.keys(n).map(k => <div key={k} className="line"><span>{k}</span><Toggle on={n[k]} onChange={v => setN({ ...n, [k]: v })} /></div>)}</Sec>
    <Sec t="🔒 Privacy" i={4}>{Object.keys(p).map(k => <div key={k} className="line"><span>{k}</span><Toggle on={p[k]} onChange={v => setP({ ...p, [k]: v })} /></div>)}</Sec>
    {toast}
  </div>);
}
