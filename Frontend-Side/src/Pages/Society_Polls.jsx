import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

// Har browser ke liye ek pseudo voter id (real app me logged-in user id use karna)
function getVoterId() {
  let id = localStorage.getItem("society_voter_id");
  if (!id) {
    id = "voter_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("society_voter_id", id);
  }
  return id;
}

const extractList = (p) => (Array.isArray(p) ? p : Array.isArray(p?.data) ? p.data : null);
const errMsg = (e, fb) =>
  e.response
    ? e.response.data?.error || `Server error (${e.response.status})`
    : e.request
    ? "Server se connection nahi ho paya. Backend (localhost:3000) chal raha hai?"
    : e.message || fb;

const css = `
.sp-page{min-height:100vh;background:radial-gradient(circle at 1px 1px,rgba(46,139,87,.16) 1.5px,transparent 0) 0 0/22px 22px,linear-gradient(180deg,#dff3e7 0%,#e6f1f6 55%,#f2f8f4 100%)}
.sp{--ink:#173528;--mut:#587064;--line:#d3e6db;--green:#2e8b57;--teal:#0f766e;width:min(1100px,100%);margin:0 auto;padding:18px clamp(12px,3vw,32px) 48px;color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif;text-align:left}
.sp *{box-sizing:border-box}
.sp-head{display:flex;align-items:center;gap:14px;margin-bottom:18px;padding:18px;border-radius:22px;color:#fff;background:linear-gradient(120deg,#2f9e62,#0f766e 70%,#22b8a6);box-shadow:0 12px 28px rgba(15,118,110,.25)}
.sp-logo{width:64px;height:64px;flex:none;border-radius:50%;border:3px solid #fff;background:#fff;object-fit:contain;padding:3px;box-shadow:0 4px 10px rgba(0,0,0,.18)}
.sp-pill{display:inline-block;font-size:.8rem;font-weight:600;background:rgba(255,255,255,.2);padding:5px 12px;border-radius:999px;margin-bottom:8px}
.sp h1{margin:0;color:#fff;font-size:clamp(1.6rem,5.5vw,2.1rem);line-height:1.1;letter-spacing:-.02em}
.sp-sub{margin:6px 0 0;color:rgba(255,255,255,.9);font-size:.95rem}
.sp-chips{display:flex;gap:8px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
.sp-chip{flex:none;min-height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--mut);font-weight:600;cursor:pointer;transition:all .2s}
.sp-chip b{margin-left:6px;font-size:.8rem}
.sp-chip.on{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 4px 12px rgba(46,139,87,.3)}
.sp-chip:focus-visible,.sp-btn:focus-visible,.sp-opt:focus-within{outline:3px solid #8fd3b4;outline-offset:2px}
.sp-grid{display:grid;grid-template-columns:1fr;gap:14px;align-items:start}
.sp-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 2px 10px rgba(20,40,35,.06);animation:sp-in .5s cubic-bezier(.2,.8,.2,1) both;transition:transform .2s,box-shadow .2s}
.sp-card.closed{background:#f5f9f6}
.sp-top{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
.sp-tag{font-size:.7rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:4px 10px;border-radius:999px;color:#fff;background:var(--green)}
.sp-tag.off{background:#8ea599}
.sp-votes{font-size:.82rem;color:var(--mut);font-weight:600}
.sp-card h3{margin:0 0 4px;font-size:1.1rem;line-height:1.35}
.sp-desc{margin:0 0 14px;color:var(--mut);font-size:.92rem;line-height:1.5}
.sp-opt{position:relative;display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 14px;margin-bottom:8px;border:1.5px solid var(--line);border-radius:12px;cursor:pointer;background:#fff;transition:border-color .2s,background .2s,transform .15s}
.sp-opt:active{transform:scale(.99)}
.sp-opt input{position:absolute;opacity:0;pointer-events:none}
.sp-dot{width:20px;height:20px;flex:none;border-radius:50%;border:2px solid #b7cdc1;display:grid;place-items:center;transition:all .2s}
.sp-dot::after{content:"";width:10px;height:10px;border-radius:50%;background:#fff;transform:scale(0);transition:transform .2s}
.sp-opt.sel{border-color:var(--green);background:#eaf7ef}
.sp-opt.sel .sp-dot{background:var(--green);border-color:var(--green)}
.sp-opt.sel .sp-dot::after{transform:scale(1)}
.sp-res{position:relative;overflow:hidden;min-height:48px;margin-bottom:8px;border-radius:12px;background:#eef5f1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px}
.sp-bar{position:absolute;inset:0 auto 0 0;width:var(--w);background:linear-gradient(90deg,#bfe6cf,#8fd3b4);border-radius:12px;animation:sp-fill .9s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d)}
.sp-res.lead .sp-bar{background:linear-gradient(90deg,#5fc08b,#2e8b57)}
.sp-res.lead{color:#06331f;font-weight:700}
.sp-res span{position:relative;z-index:1}
.sp-pct{font-weight:700;font-size:.9rem;white-space:nowrap}
.sp-pct small{font-weight:500;color:inherit;opacity:.75;margin-left:4px}
.sp-btn{width:100%;min-height:46px;margin-top:6px;border:0;border-radius:12px;background:var(--teal);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;box-shadow:0 6px 14px rgba(15,118,110,.25);transition:transform .15s,background .2s}
.sp-btn:hover{background:#0b625b}.sp-btn:active{transform:scale(.98)}
.sp-btn:disabled{background:#a9c4bb;box-shadow:none;cursor:default}
.sp-err{color:#b3261e;font-size:.85rem;margin:8px 0 0}
.sp-ok{color:var(--green);font-size:.85rem;font-weight:600;margin:10px 0 0;animation:sp-pop .4s both}
.sp-box{background:#fff0f0;border:1px solid #efc2c2;border-radius:14px;padding:14px;margin-bottom:14px}
.sp-empty{grid-column:1/-1;background:rgba(255,255,255,.6);text-align:center;color:var(--mut);padding:40px 12px;border:2px dashed var(--line);border-radius:16px}
.sp-sk{height:230px;border-radius:18px;background:linear-gradient(90deg,#d9ecdf 25%,#eef8f2 50%,#d9ecdf 75%);background-size:200% 100%;animation:sp-sh 1.3s infinite}
@media(min-width:640px){.sp-head{padding:24px 28px}.sp-logo{width:78px;height:78px}}
@media(min-width:900px){.sp-grid{grid-template-columns:1fr 1fr;gap:18px}}
@media(hover:hover){.sp-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(20,40,35,.12)}.sp-opt:hover{border-color:var(--green)}.sp-chip:hover{border-color:var(--green)}}
@keyframes sp-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes sp-fill{from{width:0}to{width:var(--w)}}
@keyframes sp-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes sp-sh{to{background-position:-200% 0}}
@media(prefers-reduced-motion:reduce){.sp *{animation:none!important;transition:none!important}}
`;

function PollCard({ poll, voterId, index, onVoted }) {
  const [selected, setSelected] = useState(null);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  const options = poll.options || [];
  const total = options.reduce((s, o) => s + (o.votes || 0), 0);
  const topVotes = Math.max(0, ...options.map((o) => o.votes || 0));
  const alreadyVoted = Array.isArray(poll.Votedby) && poll.Votedby.includes(voterId);
  const closed = (poll.status || "").toLowerCase() === "closed";
  const showResults = alreadyVoted || closed;

  const submit = async () => {
    if (selected === null) return setError("Pehle ek option chuno");
    setVoting(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/api/polls/${poll._id}/vote`, { optionIndex: selected, voterId });
      onVoted(res.data);
    } catch (err) {
      console.log(err);
      setError(errMsg(err, "Vote submit nahi hua, try again"));
    } finally {
      setVoting(false);
    }
  };

  return (
    <article className={`sp-card ${closed ? "closed" : ""}`} style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}>
      <div className="sp-top">
        <span className={`sp-tag ${closed ? "off" : ""}`}>{closed ? "Closed" : "Active"}</span>
        <span className="sp-votes">🗳️ {total} votes</span>
      </div>
      <h3>{poll.question}</h3>
      {poll.description && <p className="sp-desc">{poll.description}</p>}

      {options.map((opt, i) => {
        const votes = opt.votes || 0;
        const pct = total > 0 ? Math.round((votes / total) * 100) : 0;

        return showResults ? (
          <div key={i} className={`sp-res ${votes === topVotes && votes > 0 ? "lead" : ""}`}>
            <i className="sp-bar" style={{ "--w": `${pct}%`, "--d": `${i * 120}ms` }} />
            <span>{votes === topVotes && votes > 0 ? "🏆 " : ""}{opt.text}</span>
            <span className="sp-pct">{pct}%<small>({votes})</small></span>
          </div>
        ) : (
          <label key={i} className={`sp-opt ${selected === i ? "sel" : ""}`}>
            <input type="radio" name={`poll-${poll._id}`} checked={selected === i} onChange={() => setSelected(i)} />
            <i className="sp-dot" />
            {opt.text}
          </label>
        );
      })}

      {!showResults && (
        <button className="sp-btn" onClick={submit} disabled={voting}>
          {voting ? "Submitting..." : "Vote karo"}
        </button>
      )}
      {error && <p className="sp-err">{error}</p>}
      {alreadyVoted && !closed && <p className="sp-ok">✅ Aapka vote record ho gaya hai</p>}
    </article>
  );
}

function Society_Polls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("all");
  const voterId = getVoterId();

  const load = () => {
    setLoading(true);
    setLoadError("");
    axios
      .get(`${API_BASE}/api/Society_Polls`)
      .then((res) => {
        const data = extractList(res.data);
        if (!data) throw new Error("Server ne unexpected response bheja (array nahi mila)");
        setPolls(data);
      })
      .catch((err) => {
        console.log(err);
        setLoadError(errMsg(err, "Polls load nahi ho paye"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const isClosed = (p) => (p.status || "").toLowerCase() === "closed";
  const activeCount = polls.filter((p) => !isClosed(p)).length;
  const counts = { all: polls.length, active: activeCount, closed: polls.length - activeCount };
  const shown = polls.filter((p) => filter === "all" || (filter === "closed") === isClosed(p));

  return (
    <div className="sp-page">
      <div className="sp">
        <style>{css}</style>

        <div className="sp-head">
          <img className="sp-logo" src="/MyCommunity%20Logo.png" alt="MyCommunity" onError={(e) => (e.currentTarget.style.display = "none")} />
          <div>
            <span className="sp-pill">🗳️ {activeCount} poll chal rahe hain</span>
            <h1>Society Polls</h1>
            <p className="sp-sub">Apni raay do, society ke faisle milkar lo.</p>
          </div>
        </div>

        <div className="sp-chips">
          {["all", "active", "closed"].map((f) => (
            <button key={f} className={`sp-chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)}<b>{counts[f]}</b>
            </button>
          ))}
        </div>

        {loading && (
          <div className="sp-grid">
            {[0, 1, 2, 3].map((n) => <div key={n} className="sp-sk" />)}
          </div>
        )}

        {!loading && loadError && (
          <div className="sp-box">
            <p className="sp-err" style={{ marginTop: 0 }}>{loadError}</p>
            <button className="sp-btn" style={{ width: "auto", padding: "0 20px", background: "#c62828" }} onClick={load}>Retry</button>
          </div>
        )}

        {!loading && !loadError && shown.length === 0 && (
          <div className="sp-grid"><div className="sp-empty">Abhi koi poll nahi hai 🗳️</div></div>
        )}

        {!loading && shown.length > 0 && (
          <div className="sp-grid">
            {shown.map((poll, i) => (
              <PollCard
                key={poll._id}
                poll={poll}
                voterId={voterId}
                index={i}
                onVoted={(u) => setPolls((p) => p.map((x) => (x._id === u._id ? u : x)))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Society_Polls;
