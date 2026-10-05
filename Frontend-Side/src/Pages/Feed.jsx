import { useState, useEffect, useRef } from "react";

const applyPrefs = () => { const d = document.documentElement; d.dataset.theme = localStorage.getItem("theme") || "light"; d.dataset.accent = localStorage.getItem("accent") || "teal"; };
const REACTS = ["👍", "❤️", "😂", "😮", "🙏"];
const STORIES = ["Anjali", "Rohit", "Neha", "Amit", "Priya", "Vikash"];
const TOPICS = [["#TreePlantation", 128], ["#HealthCamp", 94], ["#CulturalFest", 71], ["#CleanColony", 55]];
const SEED = [
  { id: 1, name: "Anjali Sharma", tag: "Events", time: "3h ago", body: "Today's tree plantation drive was a huge success! 🌱 Thanks to all the volunteers who joined.", img: "https://picsum.photos/seed/feed1/800/420", react: { "❤️": 18, "👍": 6 }, comments: [{ n: "Rohit", t: "Great work everyone! 👏" }] },
  { id: 2, name: "Rohit Verma", tag: "Health", time: "4h ago", body: "Free health checkup camp this Sunday at the community hall. Don't miss it!", react: { "👍": 12 }, comments: [] },
  { id: 3, name: "Neha Singh", tag: "Polls", time: "6h ago", body: "Which day works best for the next Cultural Fest?", poll: [["Saturday", 24], ["Sunday", 31], ["Friday evening", 9]], react: { "🙏": 4 }, comments: [] },
];

const CSS = `
.fd{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:22px;align-items:start;max-width:1040px}
.fd-stories{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 14px}
.fd-story{flex:none;text-align:center;font-size:12px;cursor:pointer;color:var(--mut);transition:.25s}.fd-story:hover{transform:translateY(-4px)}
.fd-ring{width:62px;height:62px;border-radius:50%;padding:3px;background:conic-gradient(var(--a),var(--a2),#f59e0b,var(--a));animation:spin 6s linear infinite;margin:0 auto 5px}
.fd-ring img{width:100%;height:100%;border-radius:50%;border:3px solid var(--bg);object-fit:cover;animation:spin 6s linear infinite reverse}
.fd-story.add .fd-ring{background:var(--bd);animation:none}.fd-story.add .fd-ring div{width:100%;height:100%;border-radius:50%;background:var(--solid);display:grid;place-items:center;font-size:24px;color:var(--a)}
@keyframes spin{to{transform:rotate(360deg)}}
.fd-comp{transition:.3s}.fd-comp textarea{width:100%;border:0;outline:0;background:none;color:var(--tx);font:inherit;resize:none;min-height:44px;transition:min-height .3s}
.fd-comp.open textarea{min-height:90px}
.fd-tools{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:10px;border-top:1px solid var(--bd);flex-wrap:wrap;gap:8px}
.fd-tools .l{display:flex;gap:4px}.fd-tools .l button,.fd-tools .l label{background:none;border:0;padding:7px 11px;border-radius:10px;color:var(--mut);cursor:pointer;font-size:13px;transition:.2s}
.fd-tools .l button:hover,.fd-tools .l label:hover{background:color-mix(in srgb,var(--a) 12%,transparent);color:var(--a)}
.fd-prev{position:relative;margin-top:8px}.fd-prev img{width:100%;max-height:220px;object-fit:cover;border-radius:14px}.fd-prev button{position:absolute;top:8px;right:8px;border:0;border-radius:50%;width:28px;height:28px;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
.fd-pollin input{width:100%;margin-top:8px;padding:9px 12px;border-radius:10px;border:1px solid var(--bd);background:var(--solid);color:var(--tx);outline:0;font:inherit}
.fd-tabs{display:flex;gap:4px;margin:6px 0 16px;border-bottom:1px solid var(--bd);position:relative}
.fd-tabs button{background:none;border:0;padding:11px 16px;color:var(--mut);cursor:pointer;font-weight:600;font-size:14px;position:relative;transition:.2s}
.fd-tabs button.on{color:var(--a)}.fd-tabs button.on:after{content:"";position:absolute;left:10%;right:10%;bottom:-1px;height:3px;border-radius:3px;background:linear-gradient(90deg,var(--a),var(--a2));animation:grow2 .35s both}
@keyframes grow2{from{transform:scaleX(0)}}
.fd-post{margin-bottom:18px;animation:slideIn .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*80ms)}
.fd-post.new{animation:drop .6s cubic-bezier(.2,.9,.3,1.2) both}
@keyframes slideIn{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:none}}
@keyframes drop{from{opacity:0;transform:translateY(-30px) scale(.9);box-shadow:0 0 0 6px var(--a2)}}
.fd-head{display:flex;justify-content:space-between;align-items:center}.fd-head .u{display:flex;gap:10px;align-items:center}
.fd-menu{position:relative}.fd-menu>button{background:none;border:0;font-size:20px;color:var(--mut);cursor:pointer;border-radius:8px;padding:0 8px}.fd-menu>button:hover{background:var(--bd)}
.fd-drop{position:absolute;right:0;top:30px;background:var(--solid);border:1px solid var(--bd);border-radius:12px;box-shadow:var(--sh);padding:6px;z-index:5;animation:up .25s both;min-width:130px}
.fd-drop button{display:block;width:100%;text-align:left;background:none;border:0;padding:8px 12px;border-radius:8px;color:var(--tx);cursor:pointer;font-size:13px}.fd-drop button:hover{background:var(--bd)}
.fd-imgw{position:relative;border-radius:16px;overflow:hidden;margin-top:6px;cursor:pointer}.fd-imgw img{width:100%;max-height:340px;object-fit:cover;display:block;transition:.6s}.fd-imgw:hover img{transform:scale(1.04)}
.fd-heart{position:absolute;left:50%;top:50%;font-size:90px;transform:translate(-50%,-50%);pointer-events:none;animation:burst .8s both}
@keyframes burst{0%{transform:translate(-50%,-50%) scale(0);opacity:1}50%{transform:translate(-50%,-50%) scale(1.3)}100%{transform:translate(-50%,-90%) scale(1);opacity:0}}
.fd-poll button{position:relative;display:block;width:100%;text-align:left;padding:11px 14px;margin-top:8px;border-radius:12px;border:1px solid var(--bd);background:var(--solid);color:var(--tx);cursor:pointer;overflow:hidden;font:inherit;font-size:14px}
.fd-poll i{position:absolute;inset:0 auto 0 0;background:color-mix(in srgb,var(--a2) 35%,transparent);transition:width .9s cubic-bezier(.2,.8,.2,1)}.fd-poll span{position:relative;display:flex;justify-content:space-between}
.fd-sum{display:flex;justify-content:space-between;font-size:13px;color:var(--mut);margin-top:12px}
.fd-sum .em span{display:inline-block;margin-right:-4px;background:var(--solid);border-radius:50%;padding:2px;animation:pop .5s}
.fd-acts{display:flex;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid var(--bd)}
.fd-acts>button,.fd-rw>button{flex:1;background:none;border:0;padding:9px;border-radius:10px;color:var(--mut);cursor:pointer;font-size:13px;font-weight:600;transition:.2s}
.fd-acts>button:hover,.fd-rw>button:hover{background:color-mix(in srgb,var(--a) 10%,transparent);color:var(--a)}.fd-acts .on{color:var(--a)}
.fd-rw{position:relative;flex:1;display:flex}.fd-pick{position:absolute;bottom:46px;left:0;display:flex;gap:2px;background:var(--solid);border:1px solid var(--bd);border-radius:99px;padding:6px 10px;box-shadow:var(--sh);opacity:0;pointer-events:none;transform:translateY(10px) scale(.8);transition:.25s;z-index:4}
.fd-rw:hover .fd-pick{opacity:1;pointer-events:auto;transform:none}.fd-pick button{background:none;border:0;font-size:24px;cursor:pointer;transition:.2s;padding:2px 4px}.fd-pick button:hover{transform:scale(1.5) translateY(-6px)}
.fd-cm{animation:up .4s both}.fd-c{display:flex;gap:10px;margin-top:10px}.fd-c .b{background:var(--solid);padding:8px 12px;border-radius:14px;font-size:13px}
.fd-cin{display:flex;gap:8px;margin-top:12px}.fd-cin input{flex:1;padding:10px 14px;border-radius:99px;border:1px solid var(--bd);background:var(--solid);color:var(--tx);outline:0;font:inherit;font-size:13px}
.fd-side{position:sticky;top:20px;display:flex;flex-direction:column;gap:16px}
.fd-tp{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bd);font-size:14px;cursor:pointer;transition:.2s}.fd-tp:hover{padding-left:6px;color:var(--a)}.fd-tp small{color:var(--mut)}
.fd-skel{height:200px;border-radius:18px;margin-bottom:18px;background:linear-gradient(100deg,var(--bd) 30%,rgba(255,255,255,.25) 50%,var(--bd) 70%);background-size:200% 100%;animation:shim 1.2s infinite}
@keyframes shim{to{background-position:-200% 0}}
@media(max-width:980px){.fd{grid-template-columns:1fr}.fd-side{display:none}}
`;

const total = r => Object.values(r).reduce((a, b) => a + b, 0);

export default function Feed() {
  const [posts, setPosts] = useState(SEED.map(p => ({ ...p, mine: null, saved: false, open: false, voted: null })));
  const [text, setText] = useState(""), [focus, setFocus] = useState(false), [img, setImg] = useState(null), [pollOn, setPollOn] = useState(false), [opts, setOpts] = useState(["", ""]);
  const [tab, setTab] = useState("All"), [c, setC] = useState({}), [menu, setMenu] = useState(null), [burst, setBurst] = useState(null), [loading, setLoading] = useState(true), [toast, setToast] = useState(""), [newId, setNewId] = useState(null);
  const file = useRef();
  useEffect(applyPrefs, []);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, [tab]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2000); return () => clearTimeout(t); }, [toast]);

  const upd = (id, f) => setPosts(p => p.map(x => x.id === id ? { ...x, ...f(x) } : x));
  const react = (id, e) => upd(id, x => { const r = { ...x.react }; if (x.mine) { r[x.mine]--; if (!r[x.mine]) delete r[x.mine]; } if (x.mine !== e) r[e] = (r[e] || 0) + 1; return { react: r, mine: x.mine === e ? null : e }; });
  const dbl = p => { if (p.mine !== "❤️") react(p.id, "❤️"); setBurst(p.id); setTimeout(() => setBurst(null), 800); };
  const vote = (id, i) => upd(id, x => x.voted !== null ? {} : { voted: i, poll: x.poll.map(([l, v], k) => [l, k === i ? v + 1 : v]) });
  const comment = id => { if (!c[id]?.trim()) return; upd(id, x => ({ comments: [...x.comments, { n: "You", t: c[id] }] })); setC({ ...c, [id]: "" }); };
  const pick = e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)); };
  const post = () => {
    const valid = opts.filter(o => o.trim());
    if (!text.trim() && !img) return setToast("Write something first ✍️");
    const id = Date.now();
    setPosts([{ id, name: "You", tag: pollOn ? "Polls" : "Events", time: "Just now", body: text, img, poll: pollOn && valid.length > 1 ? valid.map(o => [o, 0]) : null, react: {}, comments: [], mine: null, saved: false, open: false, voted: null }, ...posts]);
    setNewId(id); setText(""); setImg(null); setPollOn(false); setOpts(["", ""]); setFocus(false); setToast("Posted 🎉");
  };
  const share = () => { navigator.clipboard?.writeText(location.href); setToast("Link copied 🔗"); };
  const shown = posts.filter(p => tab === "All" || (tab === "Saved" ? p.saved : p.tag === tab));

  return (<div className="fd" onClick={() => setMenu(null)}>
    <style>{CSS}</style>
    <div>
      <h1 className="fade">Community Feed</h1><p className="sub fade">See what your neighbours are up to</p>
      <div className="fd-stories fade" style={{ "--i": 1 }}>
        <div className="fd-story add"><div className="fd-ring"><div>＋</div></div>Your story</div>
        {STORIES.map(n => <div key={n} className="fd-story"><div className="fd-ring"><img src={`https://i.pravatar.cc/100?u=${n}`} alt="" /></div>{n}</div>)}
      </div>

      <div className={"card fd-comp fade" + (focus || text ? " open" : "")} style={{ "--i": 2 }}>
        <div style={{ display: "flex", gap: 12 }}><img className="av" src="https://i.pravatar.cc/80?u=Piyush" alt="" />
          <textarea placeholder="Share something with your community..." value={text} onFocus={() => setFocus(true)} onChange={e => setText(e.target.value)} /></div>
        {img && <div className="fd-prev fade"><img src={img} alt="" /><button onClick={() => setImg(null)}>✕</button></div>}
        {pollOn && <div className="fd-pollin fade">{opts.map((o, i) => <input key={i} placeholder={`Option ${i + 1}`} value={o} onChange={e => setOpts(opts.map((x, k) => k === i ? e.target.value : x))} />)}
          {opts.length < 4 && <button className="chip" style={{ marginTop: 8 }} onClick={() => setOpts([...opts, ""])}>+ Add option</button>}</div>}
        <div className="fd-tools"><div className="l"><label onClick={() => file.current.click()}>📷 Photo</label><button onClick={() => setPollOn(!pollOn)}>📊 Poll</button><button>📅 Event</button></div>
          <input ref={file} type="file" accept="image/*" hidden onChange={pick} /><button className="btn" onClick={post}>Post</button></div>
      </div>

      <div className="fd-tabs fade" style={{ "--i": 3 }}>{["All", "Events", "Health", "Polls", "Saved"].map(t => <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>)}</div>

      {loading ? [0, 1].map(i => <div key={i} className="fd-skel" />)
        : shown.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 44 }}>🌱</div><p className="sub">Nothing here yet — be the first to post!</p></div>
        : shown.map((p, i) => (
        <div key={p.id} className={"card fd-post" + (p.id === newId ? " new" : "")} style={{ "--i": i }}>
          <div className="fd-head"><div className="u"><img className="av" src={`https://i.pravatar.cc/80?u=${p.name === "You" ? "Piyush" : p.name}`} alt="" /><div><b>{p.name}</b><br /><small className="sub">{p.time}</small></div></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span className="pill">{p.tag}</span>
              <div className="fd-menu" onClick={e => e.stopPropagation()}><button onClick={() => setMenu(menu === p.id ? null : p.id)}>⋯</button>
                {menu === p.id && <div className="fd-drop"><button onClick={() => { upd(p.id, x => ({ saved: !x.saved })); setMenu(null); }}>{p.saved ? "Unsave" : "Save post"}</button><button onClick={() => { share(); setMenu(null); }}>Copy link</button>{p.name === "You" && <button onClick={() => { setPosts(posts.filter(x => x.id !== p.id)); setToast("Post deleted"); }}>🗑 Delete</button>}</div>}</div></div></div>
          <p style={{ margin: "12px 0 8px", lineHeight: 1.55 }}>{p.body}</p>
          {p.img && <div className="fd-imgw" onDoubleClick={() => dbl(p)}><img src={p.img} alt="" />{burst === p.id && <span className="fd-heart">❤️</span>}</div>}
          {p.poll && <div className="fd-poll">{p.poll.map(([l, v], k) => { const s = p.poll.reduce((a, b) => a + b[1], 0) || 1; return (
            <button key={l} onClick={() => vote(p.id, k)}>{p.voted !== null && <i style={{ width: (v / s) * 100 + "%" }} />}<span><b style={{ fontWeight: p.voted === k ? 700 : 500 }}>{p.voted === k ? "✓ " : ""}{l}</b>{p.voted !== null && <em>{Math.round((v / s) * 100)}%</em>}</span></button>); })}</div>}
          <div className="fd-sum"><span className="em">{Object.keys(p.react).map(e => <span key={e}>{e}</span>)} {total(p.react) > 0 && total(p.react)}</span><span style={{ cursor: "pointer" }} onClick={() => upd(p.id, x => ({ open: !x.open }))}>{p.comments.length} comments</span></div>
          <div className="fd-acts">
            <div className="fd-rw"><div className="fd-pick">{REACTS.map(e => <button key={e} onClick={() => react(p.id, e)}>{e}</button>)}</div>
              <button className={p.mine ? "on" : ""} onClick={() => react(p.id, p.mine || "👍")}>{p.mine || "👍"} {p.mine ? "Reacted" : "Like"}</button></div>
            <button onClick={() => upd(p.id, x => ({ open: !x.open }))}>💬 Comment</button><button onClick={share}>↗ Share</button>
            <button className={p.saved ? "on" : ""} onClick={() => upd(p.id, x => ({ saved: !x.saved }))}>{p.saved ? "🔖" : "🏷️"}</button></div>
          {p.open && <div className="fd-cm">{p.comments.map((m, k) => <div key={k} className="fd-c"><img className="av" style={{ width: 30, height: 30 }} src={`https://i.pravatar.cc/60?u=${m.n === "You" ? "Piyush" : m.n}`} alt="" /><div className="b"><b>{m.n}</b><br />{m.t}</div></div>)}
            <div className="fd-cin"><input placeholder="Write a comment..." value={c[p.id] || ""} onChange={e => setC({ ...c, [p.id]: e.target.value })} onKeyDown={e => e.key === "Enter" && comment(p.id)} /><button className="btn" onClick={() => comment(p.id)}>Send</button></div></div>}
        </div>))}
    </div>

    <aside className="fd-side">
      <div className="card fade" style={{ "--i": 3 }}><b>🔥 Trending topics</b>{TOPICS.map(([t, n]) => <div key={t} className="fd-tp"><span>{t}</span><small>{n} posts</small></div>)}</div>
      <div className="card fade" style={{ "--i": 4 }}><b>🌟 Active members</b>
        {["Anjali Sharma", "Rohit Verma", "Neha Singh"].map(n => <div key={n} className="row" style={{ marginTop: 12 }}><div className="row"><img className="av" src={`https://i.pravatar.cc/80?u=${n}`} alt="" /><span style={{ fontSize: 14 }}>{n}</span></div><span className="pill">Follow</span></div>)}</div>
    </aside>
    {toast && <div className="toast">{toast}</div>}
  </div>);
}
