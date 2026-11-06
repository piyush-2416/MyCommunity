import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const POSTS_KEY = "mycommunity_feed_posts";
const meKey = (uid) => `mycommunity_feed_me_${uid}`;

const REACTS = ["👍", "❤️", "😂", "😮", "🙏"];
const TABS = ["All", "Events", "Health", "Polls", "Saved"];
const CATEGORIES = ["Events", "Health", "General"];

const CSS = `
.fd-page{--navy:#0b1f66;--green:#16a34a;--green-d:#15803d;--brand:#3cb371;--teal:#0d9488;--ink:#0f172a;--muted:#64748b;--line:#e1ede6;--soft:#f0fdf4;
  min-height:100vh;width:100%;text-align:left;color:var(--ink);font-family:inherit;line-height:1.5;
  background:linear-gradient(180deg,#e6f6ee 0%,#f1faf6 340px,#f8fcfa 100%);padding:0 20px 80px}
.fd-page *,.fd-page *::before,.fd-page *::after{box-sizing:border-box}
.fd-page h1,.fd-page h2,.fd-page h3,.fd-page p{margin:0;padding:0}
.fd-page button:focus-visible,.fd-page input:focus-visible,.fd-page textarea:focus-visible,.fd-page a:focus-visible{outline:3px solid rgba(60,179,113,.5);outline-offset:2px}

.fd-wrap{max-width:1060px;margin:0 auto}

/* hero */
.fd-hero{padding:40px 0 28px}
.fd-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;background:#fff;border:1px solid var(--line);color:var(--green-d);font-size:.85rem;font-weight:700}
.fd-badge i{width:8px;height:8px;border-radius:50%;background:var(--brand)}
.fd-title{margin-top:16px;font-size:clamp(2rem,5vw,3rem);line-height:1.1;font-weight:800;letter-spacing:-.02em;color:var(--navy)}
.fd-title span{color:var(--green)}
.fd-line{display:block;margin-top:10px;width:150px;height:5px;border-radius:99px;background:linear-gradient(90deg,var(--green),var(--brand))}
.fd-sub{margin-top:14px;max-width:520px;font-size:1.02rem;line-height:1.65;color:#475569}

/* layout */
.fd{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;align-items:start}
.fd-main{display:flex;flex-direction:column;gap:22px;min-width:0}
.fd-card{background:#fff;border:1px solid var(--line);border-radius:22px;padding:22px;box-shadow:0 10px 28px -18px rgba(11,31,102,.2)}
.fd-av{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none;border:2px solid #fff;box-shadow:0 0 0 2px var(--line)}
.fd-av.sm{width:34px;height:34px}
.fd-muted{color:var(--muted);font-size:.88rem}

/* happening now */
.fd-ph{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.fd-ph h3{font-size:1.05rem;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:10px}
.fd-ph h3::before{content:"";width:5px;height:20px;border-radius:4px;background:linear-gradient(var(--green),var(--brand))}
.fd-sos{display:flex;align-items:center;gap:14px;margin-top:16px;padding:14px 16px;border-radius:16px;background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}
.fd-sos-ico{width:40px;height:40px;border-radius:12px;background:#fee2e2;display:grid;place-items:center;font-size:1.2rem;flex:none}
.fd-sos-t{flex:1;min-width:0}
.fd-sos-t b{display:block;font-size:.92rem}
.fd-sos-t small{display:block;margin-top:2px;font-size:.8rem;color:#b91c1c;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fd-sos a{padding:8px 16px;border-radius:999px;background:#dc2626;color:#fff;font-size:.8rem;font-weight:800;text-decoration:none;white-space:nowrap}
.fd-sos a:hover{background:#b91c1c}
.fd-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
.fd-col h4{margin:0 0 8px;font-size:.74rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.fd-item{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;margin-top:8px;border:1px solid var(--line);border-radius:14px;background:#fbfefc;color:inherit;text-decoration:none;transition:border-color .15s,background .15s}
.fd-item:hover{border-color:var(--brand);background:var(--soft)}
.fd-item-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:1rem;flex:none;background:var(--soft)}
.fd-item b{display:block;font-size:.88rem;color:var(--navy);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.fd-item small{display:block;margin-top:3px;font-size:.75rem;color:var(--muted)}
.fd-nil{margin-top:8px;padding:12px;border:1.5px dashed var(--line);border-radius:14px;font-size:.82rem;color:var(--muted);text-align:center}

/* composer */
.fd-comp textarea{width:100%;border:0;outline:0;background:none;color:var(--ink);font:inherit;font-size:.98rem;resize:none;min-height:48px;padding:10px 0}
.fd-comp.open textarea{min-height:96px}
.fd-comp-row{display:flex;gap:14px;align-items:flex-start}
.fd-tools{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:14px;border-top:1px solid var(--line);flex-wrap:wrap;gap:10px}
.fd-tools .l{display:flex;gap:6px;flex-wrap:wrap}
.fd-tool{background:#f6faf8;border:1px solid var(--line);padding:8px 14px;border-radius:999px;color:#475569;cursor:pointer;font:inherit;font-size:.85rem;font-weight:600;transition:all .15s}
.fd-tool:hover,.fd-tool.on{background:var(--soft);border-color:var(--brand);color:var(--green-d)}
select.fd-tool{appearance:auto}
.fd-prev{position:relative;margin-top:10px}
.fd-prev img{width:100%;max-height:240px;object-fit:cover;border-radius:16px;display:block}
.fd-prev button{position:absolute;top:10px;right:10px;border:0;border-radius:50%;width:30px;height:30px;background:rgba(15,23,42,.65);color:#fff;cursor:pointer}
.fd-pollin{margin-top:10px}
.fd-pollin input{width:100%;margin-top:8px;padding:11px 14px;border-radius:12px;border:1.5px solid var(--line);background:#f7fbf9;color:var(--ink);outline:0;font:inherit;font-size:.9rem}
.fd-pollin input:focus{border-color:var(--brand);background:#fff}

/* buttons */
.fd-btn{padding:10px 26px;border:0;border-radius:999px;background:linear-gradient(90deg,#16a34a,#3cb371);color:#fff;font:inherit;font-size:.92rem;font-weight:800;cursor:pointer;box-shadow:0 10px 20px -12px rgba(22,163,74,.7);transition:filter .15s}
.fd-btn:hover{filter:brightness(.95)}
.fd-chip{padding:7px 16px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--green-d);font:inherit;font-size:.82rem;font-weight:700;cursor:pointer}
.fd-chip:hover{border-color:var(--brand);background:var(--soft)}

/* tabs */
.fd-tabs{display:flex;gap:8px;flex-wrap:wrap}
.fd-tabs button{padding:9px 20px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:#475569;font:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:all .15s}
.fd-tabs button:hover{border-color:var(--brand);color:var(--green-d)}
.fd-tabs button.on{background:var(--green);border-color:var(--green);color:#fff}

/* post */
.fd-post{display:flex;flex-direction:column}
.fd-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
.fd-head .u{display:flex;gap:12px;align-items:center;min-width:0}
.fd-head b{color:var(--navy)}
.fd-head small{color:var(--muted);font-size:.78rem}
.fd-pill{padding:4px 12px;border-radius:999px;background:var(--soft);border:1px solid #bbf7d0;color:var(--green-d);font-size:.75rem;font-weight:700;white-space:nowrap}
.fd-menu{position:relative}
.fd-menu>button{background:none;border:0;font-size:20px;color:var(--muted);cursor:pointer;border-radius:8px;padding:0 8px}
.fd-menu>button:hover{background:var(--soft)}
.fd-drop{position:absolute;right:0;top:32px;background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 14px 30px -14px rgba(11,31,102,.3);padding:6px;z-index:5;min-width:150px}
.fd-drop button{display:block;width:100%;text-align:left;background:none;border:0;padding:9px 12px;border-radius:8px;color:var(--ink);cursor:pointer;font:inherit;font-size:.85rem}
.fd-drop button:hover{background:var(--soft)}
.fd-body{margin:16px 0 10px;line-height:1.65;color:#334155;white-space:pre-wrap;word-break:break-word}
.fd-imgw{position:relative;border-radius:18px;overflow:hidden;margin-top:6px;cursor:pointer}
.fd-imgw img{width:100%;max-height:360px;object-fit:cover;display:block}
.fd-heart{position:absolute;left:50%;top:50%;font-size:80px;transform:translate(-50%,-50%);pointer-events:none;animation:fd-fade .8s both}
@keyframes fd-fade{0%{opacity:0}30%{opacity:1}100%{opacity:0}}

/* poll */
.fd-poll{margin-top:6px}
.fd-poll button{position:relative;display:block;width:100%;text-align:left;padding:12px 16px;margin-top:10px;border-radius:14px;border:1.5px solid var(--line);background:#fbfefc;color:var(--ink);cursor:pointer;overflow:hidden;font:inherit;font-size:.9rem}
.fd-poll button:hover{border-color:var(--brand)}
.fd-poll i{position:absolute;inset:0 auto 0 0;background:#bbf7d0;opacity:.7;transition:width .4s}
.fd-poll span{position:relative;display:flex;justify-content:space-between}

/* actions */
.fd-sum{display:flex;justify-content:space-between;font-size:.85rem;color:var(--muted);margin-top:14px}
.fd-sum .em span{margin-right:2px}
.fd-acts{display:flex;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
.fd-acts>button,.fd-rw>button{flex:1;background:none;border:0;padding:10px;border-radius:12px;color:var(--muted);cursor:pointer;font:inherit;font-size:.85rem;font-weight:700;transition:background .15s,color .15s}
.fd-acts>button:hover,.fd-rw>button:hover{background:var(--soft);color:var(--green-d)}
.fd-acts .on{color:var(--green-d)}
.fd-rw{position:relative;flex:1;display:flex}
.fd-pick{position:absolute;bottom:48px;left:0;display:flex;gap:2px;background:#fff;border:1px solid var(--line);border-radius:99px;padding:6px 10px;box-shadow:0 14px 30px -14px rgba(11,31,102,.3);opacity:0;pointer-events:none;transition:opacity .15s;z-index:4}
.fd-rw:hover .fd-pick{opacity:1;pointer-events:auto}
.fd-pick button{background:none;border:0;font-size:22px;cursor:pointer;padding:2px 5px;transition:transform .15s}
.fd-pick button:hover{transform:scale(1.25)}

/* comments */
.fd-c{display:flex;gap:10px;margin-top:12px}
.fd-c .b{background:#f4faf7;border:1px solid var(--line);padding:9px 14px;border-radius:16px;font-size:.85rem}
.fd-c .b b{color:var(--navy)}
.fd-cin{display:flex;gap:10px;margin-top:14px}
.fd-cin input{flex:1;padding:11px 16px;border-radius:999px;border:1.5px solid var(--line);background:#f7fbf9;color:var(--ink);outline:0;font:inherit;font-size:.88rem}
.fd-cin input:focus{border-color:var(--brand);background:#fff}

/* sidebar */
.fd-side{position:sticky;top:20px;display:flex;flex-direction:column;gap:20px}
.fd-side h3{font-size:1.02rem;font-weight:800;color:var(--navy);display:flex;align-items:center;gap:10px}
.fd-side h3::before{content:"";width:5px;height:20px;border-radius:4px;background:linear-gradient(var(--green),var(--brand))}
.fd-tp{display:flex;justify-content:space-between;width:100%;padding:12px 0;border:0;border-bottom:1px solid var(--line);background:none;font:inherit;font-size:.9rem;color:var(--ink);cursor:pointer;text-align:left;transition:color .15s}
.fd-tp:last-child{border-bottom:0}
.fd-tp:hover{color:var(--green-d)}
.fd-tp small{color:var(--muted)}
.fd-mem{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px}
.fd-mem .n{display:flex;align-items:center;gap:10px;font-size:.9rem;font-weight:600;min-width:0}
.fd-mem .n span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* states */
.fd-skel{height:200px;border-radius:22px;background:linear-gradient(100deg,#e4f1ea 30%,#f3faf6 50%,#e4f1ea 70%);background-size:200% 100%;animation:fd-shim 1.4s infinite}
@keyframes fd-shim{to{background-position:-200% 0}}
.fd-empty{text-align:center;padding:48px 24px}
.fd-empty div{font-size:44px}
.fd-empty p{margin-top:10px;color:var(--muted)}
.fd-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:var(--navy);color:#fff;padding:12px 22px;border-radius:999px;font-size:.9rem;font-weight:600;box-shadow:0 14px 30px -12px rgba(11,31,102,.5);z-index:50}

@media (prefers-reduced-motion:reduce){.fd-skel,.fd-heart{animation:none}}
@media(max-width:980px){.fd{grid-template-columns:1fr}.fd-side{display:none}}
@media(max-width:700px){.fd-cols{grid-template-columns:1fr}}
@media(max-width:600px){
  .fd-page{padding:0 14px 64px}
  .fd-hero{padding:28px 0 20px}
  .fd-card{padding:18px;border-radius:18px}
  .fd-acts>button,.fd-rw>button{padding:9px 4px;font-size:.78rem}
  .fd-sos{flex-wrap:wrap}
}
`;

/* ---------- helpers ---------- */
const total = (r) => Object.values(r || {}).reduce((a, b) => a + b, 0);
const avatar = (name, size = 80) => `https://i.pravatar.cc/${size}?u=${encodeURIComponent(name || "guest")}`;

const readJSON = (k, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch {
    return false; // storage full
  }
};

const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const toList = (d) => (Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
const dateOf = (x) => {
  const v = x?.date ?? x?.eventDate ?? x?.startDate ?? x?.createdAt;
  const t = v ? new Date(v) : null;
  return t && !isNaN(t) ? t : null;
};
const prettyDate = (d) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";
const titleOf = (x) => String(x?.title ?? x?.heading ?? x?.name ?? x?.eventName ?? "").trim();

// Photo ko chhota karke data URL banao (localStorage me fit ho)
const compressImage = (file, max = 800) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

// Resident ke alag-alag field naam handle karo
const normalizeResident = (r) => ({
  id: String(r._id ?? r.id ?? r.name ?? r.fullName),
  name: String(r.name ?? r.fullName ?? r.residentName ?? "").trim(),
  photo: r.photo || r.image || r.avatar || "",
});

export default function Feed() {
  const { user } = useAuth() || {};
  const myId = String(user?.id ?? user?._id ?? "guest");
  const myName = user?.name || "Resident";

  // residents (DB se)
  const [residents, setResidents] = useState([]);
  const [resState, setResState] = useState("loading"); // loading | ok | error

  // "Happening now" (DB se)
  const [now, setNow] = useState({ status: "loading", sos: [], notices: [], events: [] });

  // posts (localStorage, sabke liye shared)
  const [posts, setPosts] = useState(() => readJSON(POSTS_KEY, []));
  // is user ki apni cheezein: reaction, saved, vote
  const [me, setMe] = useState(() => readJSON(meKey(myId), { mine: {}, saved: [], voted: {} }));
  const [openIds, setOpenIds] = useState([]);

  // form
  const [text, setText] = useState("");
  const [focus, setFocus] = useState(false);
  const [img, setImg] = useState(null);
  const [pollOn, setPollOn] = useState(false);
  const [opts, setOpts] = useState(["", ""]);
  const [category, setCategory] = useState("Events");

  const [tab, setTab] = useState("All");
  const [c, setC] = useState({});
  const [menu, setMenu] = useState(null);
  const [burst, setBurst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const file = useRef();
  const composerRef = useRef();

  /* ---------- residents load ---------- */
  useEffect(() => {
    let alive = true;
    fetch(`${API}/residents`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!alive) return;
        const list = toList(data).map(normalizeResident).filter((r) => r.name);
        setResidents(list);
        setResState("ok");
      })
      .catch(() => alive && setResState("error"));
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- happening now load ---------- */
  useEffect(() => {
    let alive = true;
    const get = (path) =>
      fetch(`${API}${path}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(toList);

    Promise.allSettled([get("/Emergency"), get("/Notice"), get("/community-events")]).then(
      ([em, no, ev]) => {
        if (!alive) return;
        const sos = (em.value || [])
          .filter((e) => String(e.status).toLowerCase() === "active")
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 2);

        const notices = (no.value || [])
          .filter((n) => titleOf(n))
          .sort((a, b) => (dateOf(b) || 0) - (dateOf(a) || 0))
          .slice(0, 2);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const evAll = (ev.value || []).filter((e) => titleOf(e));
        const upcoming = evAll
          .filter((e) => dateOf(e) && dateOf(e) >= today)
          .sort((a, b) => dateOf(a) - dateOf(b));
        const events = (upcoming.length ? upcoming : evAll.filter((e) => !dateOf(e))).slice(0, 2);

        const allFailed = [em, no, ev].every((x) => x.status === "rejected");
        setNow({ status: allFailed ? "error" : "ok", sos, notices, events });
      }
    );
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- storage sync ---------- */
  useEffect(() => {
    writeJSON(POSTS_KEY, posts);
  }, [posts]);

  useEffect(() => {
    writeJSON(meKey(myId), me);
  }, [me, myId]);

  // login badle to us user ka data load karo
  useEffect(() => {
    setMe(readJSON(meKey(myId), { mine: {}, saved: [], voted: {} }));
  }, [myId]);

  // dusre tab me post aaye to yahan bhi dikhe
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === POSTS_KEY) setPosts(readJSON(POSTS_KEY, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------- actions ---------- */
  const updPost = (id, f) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...f(x) } : x)));

  const react = (id, e) => {
    const prev = me.mine[id];
    updPost(id, (x) => {
      const r = { ...(x.react || {}) };
      if (prev) {
        r[prev] = (r[prev] || 1) - 1;
        if (!r[prev]) delete r[prev];
      }
      if (prev !== e) r[e] = (r[e] || 0) + 1;
      return { react: r };
    });
    setMe((m) => {
      const mine = { ...m.mine };
      if (prev === e) delete mine[id];
      else mine[id] = e;
      return { ...m, mine };
    });
  };

  const dbl = (p) => {
    if (me.mine[p.id] !== "❤️") react(p.id, "❤️");
    setBurst(p.id);
    setTimeout(() => setBurst(null), 800);
  };

  const vote = (id, i) => {
    if (me.voted[id] !== undefined) return;
    updPost(id, (x) => ({ poll: x.poll.map(([l, v], k) => [l, k === i ? v + 1 : v]) }));
    setMe((m) => ({ ...m, voted: { ...m.voted, [id]: i } }));
  };

  const toggleSave = (id) =>
    setMe((m) => ({
      ...m,
      saved: m.saved.includes(id) ? m.saved.filter((x) => x !== id) : [...m.saved, id],
    }));

  const toggleOpen = (id) =>
    setOpenIds((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  const comment = (id) => {
    const t = c[id]?.trim();
    if (!t) return;
    updPost(id, (x) => ({ comments: [...(x.comments || []), { n: myName, t }] }));
    setC({ ...c, [id]: "" });
  };

  const pick = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    try {
      setImg(await compressImage(f));
    } catch {
      setToast("Photo load nahi hui");
    }
  };

  const post = () => {
    const valid = opts.map((o) => o.trim()).filter(Boolean);
    if (!text.trim() && !img) return setToast("Write something first ✍️");

    const newPost = {
      id: String(Date.now()),
      authorId: myId,
      name: myName,
      tag: pollOn && valid.length > 1 ? "Polls" : category,
      createdAt: Date.now(),
      body: text.trim(),
      img,
      poll: pollOn && valid.length > 1 ? valid.map((o) => [o, 0]) : null,
      react: {},
      comments: [],
    };

    const next = [newPost, ...posts];
    if (!writeJSON(POSTS_KEY, next)) {
      return setToast("Storage full hai, photo hatao ya purani post delete karo");
    }
    setPosts(next);
    setText("");
    setImg(null);
    setPollOn(false);
    setOpts(["", ""]);
    setFocus(false);
    setToast("Posted 🎉");
  };

  const deletePost = (id) => {
    setPosts((p) => p.filter((x) => x.id !== id));
    setToast("Post deleted");
    setMenu(null);
  };

  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    setToast("Link copied 🔗");
  };

  // Hashtag par click: composer me hashtag daal do
  const useTag = (tag) => {
    setText((t) => (t.includes(tag) ? t : (t ? t + " " : "") + tag + " "));
    setFocus(true);
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  /* ---------- derived ---------- */
  const shown = useMemo(
    () => posts.filter((p) => tab === "All" || (tab === "Saved" ? me.saved.includes(p.id) : p.tag === tab)),
    [posts, tab, me.saved]
  );

  const photoFor = (name) => residents.find((r) => r.name === name)?.photo || avatar(name);
  const members = residents.filter((r) => r.name !== myName).slice(0, 3);

  // Trending: posts ke real hashtags
  const trending = useMemo(() => {
    const counts = {};
    posts.forEach((p) => {
      const tags = new Set((p.body || "").match(/#[\p{L}\p{N}_]+/gu) || []);
      tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [posts]);

  return (
    <>
      <Navbar />
      <div className="fd-page" onClick={() => setMenu(null)}>
        <style>{CSS}</style>

        <div className="fd-wrap">
          {/* ================= HERO ================= */}
          <header className="fd-hero">
            <span className="fd-badge"><i /> Your neighbourhood, together</span>
            <h1 className="fd-title">Community <span>Feed</span></h1>
            <span className="fd-line" />
            <p className="fd-sub">See what your neighbours are up to, share updates, join polls and stay connected.</p>
          </header>

          <div className="fd">
            {/* ================= MAIN ================= */}
            <div className="fd-main">
              {/* Happening now */}
              <div className="fd-card">
                <div className="fd-ph">
                  <h3>Happening now</h3>
                  <span className="fd-muted">Community ke taaza updates</span>
                </div>

                {now.status === "loading" && <p className="fd-muted" style={{ marginTop: 14 }}>Loading updates...</p>}
                {now.status === "error" && (
                  <p className="fd-muted" style={{ marginTop: 14 }}>Updates load nahi ho paye. Backend chal raha hai?</p>
                )}

                {now.status === "ok" && (
                  <>
                    {now.sos.map((e) => (
                      <div key={e._id} className="fd-sos" role="alert">
                        <span className="fd-sos-ico" aria-hidden="true">🚨</span>
                        <span className="fd-sos-t">
                          <b>{e.title || "Emergency"}{e.emergencyType ? ` · ${e.emergencyType}` : ""}</b>
                          <small>
                            {[e.location, e.urgency && `${e.urgency} urgency`].filter(Boolean).join(" · ") || "Madad chahiye"}
                          </small>
                        </span>
                        <Link to="/Emergency">Help karo</Link>
                      </div>
                    ))}

                    <div className="fd-cols">
                      <div className="fd-col">
                        <h4>Latest notices</h4>
                        {now.notices.length === 0 && <div className="fd-nil">Koi naya notice nahi</div>}
                        {now.notices.map((n) => (
                          <Link key={n._id ?? titleOf(n)} to="/Notice" className="fd-item">
                            <span className="fd-item-ico" aria-hidden="true">📢</span>
                            <span>
                              <b>{titleOf(n)}</b>
                              {dateOf(n) && <small>{prettyDate(dateOf(n))}</small>}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="fd-col">
                        <h4>Upcoming events</h4>
                        {now.events.length === 0 && <div className="fd-nil">Koi event scheduled nahi</div>}
                        {now.events.map((ev) => (
                          <Link key={ev._id ?? titleOf(ev)} to="/Events" className="fd-item">
                            <span className="fd-item-ico" aria-hidden="true">🎉</span>
                            <span>
                              <b>{titleOf(ev)}</b>
                              <small>{[prettyDate(dateOf(ev)), ev.location].filter(Boolean).join(" · ")}</small>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Composer */}
              <div ref={composerRef} className={"fd-card fd-comp" + (focus || text ? " open" : "")}>
                <div className="fd-comp-row">
                  <img className="fd-av" src={photoFor(myName)} alt="" />
                  <textarea
                    placeholder={`${myName}, share something with your community...`}
                    value={text}
                    maxLength={1000}
                    onFocus={() => setFocus(true)}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                {img && (
                  <div className="fd-prev">
                    <img src={img} alt="" />
                    <button type="button" onClick={() => setImg(null)}>✕</button>
                  </div>
                )}

                {pollOn && (
                  <div className="fd-pollin">
                    {opts.map((o, i) => (
                      <input
                        key={i}
                        placeholder={`Option ${i + 1}`}
                        value={o}
                        maxLength={60}
                        onChange={(e) => setOpts(opts.map((x, k) => (k === i ? e.target.value : x)))}
                      />
                    ))}
                    {opts.length < 4 && (
                      <button type="button" className="fd-chip" style={{ marginTop: 10 }} onClick={() => setOpts([...opts, ""])}>
                        + Add option
                      </button>
                    )}
                  </div>
                )}

                <div className="fd-tools">
                  <div className="l">
                    <button type="button" className="fd-tool" onClick={() => file.current.click()}>📷 Photo</button>
                    <button type="button" className={"fd-tool" + (pollOn ? " on" : "")} onClick={() => setPollOn(!pollOn)}>📊 Poll</button>
                    <select className="fd-tool" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
                      {CATEGORIES.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
                  <button type="button" className="fd-btn" onClick={post}>Post</button>
                </div>
              </div>

              {/* Tabs */}
              <div className="fd-tabs">
                {TABS.map((t) => (
                  <button key={t} type="button" className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>
                ))}
              </div>

              {/* Posts */}
              {loading ? (
                [0, 1].map((i) => <div key={i} className="fd-skel" />)
              ) : shown.length === 0 ? (
                <div className="fd-card fd-empty">
                  <div>🌱</div>
                  <p>Nothing here yet. Be the first to post!</p>
                </div>
              ) : (
                shown.map((p) => {
                  const mine = me.mine[p.id];
                  const saved = me.saved.includes(p.id);
                  const voted = me.voted[p.id];
                  const open = openIds.includes(p.id);
                  const comments = p.comments || [];
                  return (
                    <div key={p.id} className="fd-card fd-post">
                      <div className="fd-head">
                        <div className="u">
                          <img className="fd-av" src={photoFor(p.name)} alt="" />
                          <div>
                            <b>{p.name}</b><br />
                            <small>{timeAgo(p.createdAt)}</small>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span className="fd-pill">{p.tag}</span>
                          <div className="fd-menu" onClick={(e) => e.stopPropagation()}>
                            <button type="button" aria-label="Menu" onClick={() => setMenu(menu === p.id ? null : p.id)}>⋯</button>
                            {menu === p.id && (
                              <div className="fd-drop">
                                <button type="button" onClick={() => { toggleSave(p.id); setMenu(null); }}>
                                  {saved ? "Unsave" : "Save post"}
                                </button>
                                <button type="button" onClick={() => { share(); setMenu(null); }}>Copy link</button>
                                {p.authorId === myId && (
                                  <button type="button" onClick={() => deletePost(p.id)}>🗑 Delete</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {p.body && <p className="fd-body">{p.body}</p>}

                      {p.img && (
                        <div className="fd-imgw" onDoubleClick={() => dbl(p)}>
                          <img src={p.img} alt="" />
                          {burst === p.id && <span className="fd-heart">❤️</span>}
                        </div>
                      )}

                      {p.poll && (
                        <div className="fd-poll">
                          {p.poll.map(([l, v], k) => {
                            const s = p.poll.reduce((a, b) => a + b[1], 0) || 1;
                            return (
                              <button key={l + k} type="button" onClick={() => vote(p.id, k)}>
                                {voted !== undefined && <i style={{ width: (v / s) * 100 + "%" }} />}
                                <span>
                                  <b style={{ fontWeight: voted === k ? 700 : 500 }}>{voted === k ? "✓ " : ""}{l}</b>
                                  {voted !== undefined && <em>{Math.round((v / s) * 100)}%</em>}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="fd-sum">
                        <span className="em">
                          {Object.keys(p.react || {}).map((e) => <span key={e}>{e}</span>)} {total(p.react) > 0 && total(p.react)}
                        </span>
                        <span style={{ cursor: "pointer" }} onClick={() => toggleOpen(p.id)}>
                          {comments.length} comments
                        </span>
                      </div>

                      <div className="fd-acts">
                        <div className="fd-rw">
                          <div className="fd-pick">
                            {REACTS.map((e) => (
                              <button key={e} type="button" onClick={() => react(p.id, e)}>{e}</button>
                            ))}
                          </div>
                          <button type="button" className={mine ? "on" : ""} onClick={() => react(p.id, mine || "👍")}>
                            {mine || "👍"} {mine ? "Reacted" : "Like"}
                          </button>
                        </div>
                        <button type="button" onClick={() => toggleOpen(p.id)}>💬 Comment</button>
                        <button type="button" onClick={share}>↗ Share</button>
                        <button type="button" className={saved ? "on" : ""} onClick={() => toggleSave(p.id)}>
                          {saved ? "🔖" : "🏷️"}
                        </button>
                      </div>

                      {open && (
                        <div>
                          {comments.map((m, k) => (
                            <div key={k} className="fd-c">
                              <img className="fd-av sm" src={photoFor(m.n)} alt="" />
                              <div className="b"><b>{m.n}</b><br />{m.t}</div>
                            </div>
                          ))}
                          <div className="fd-cin">
                            <input
                              placeholder="Write a comment..."
                              value={c[p.id] || ""}
                              maxLength={300}
                              onChange={(e) => setC({ ...c, [p.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && comment(p.id)}
                            />
                            <button type="button" className="fd-btn" onClick={() => comment(p.id)}>Send</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* ================= SIDEBAR ================= */}
            <aside className="fd-side">
              <div className="fd-card">
                <h3>🔥 Trending topics</h3>
                <div style={{ marginTop: 6 }}>
                  {trending.length === 0 && (
                    <p className="fd-muted" style={{ marginTop: 10 }}>
                      Abhi koi hashtag nahi. Post me <b>#TreePlantation</b> jaisa tag lagao, wo yahan dikhega.
                    </p>
                  )}
                  {trending.map(([t, n]) => (
                    <button key={t} type="button" className="fd-tp" onClick={() => useTag(t)}>
                      <span>{t}</span>
                      <small>{n} {n === 1 ? "post" : "posts"}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="fd-card">
                <h3>🌟 Residents</h3>
                {resState === "loading" && <p className="fd-muted" style={{ marginTop: 12 }}>Loading residents...</p>}
                {resState === "error" && (
                  <p className="fd-muted" style={{ marginTop: 12 }}>
                    Residents load nahi ho paye. Backend me /api/residents route check karo.
                  </p>
                )}
                {resState === "ok" && members.length === 0 && (
                  <p className="fd-muted" style={{ marginTop: 12 }}>Abhi koi resident nahi mila.</p>
                )}
                {members.map((r) => (
                  <div key={r.id} className="fd-mem">
                    <div className="n">
                      <img className="fd-av sm" src={r.photo || avatar(r.name)} alt="" />
                      <span>{r.name}</span>
                    </div>
                    <button type="button" className="fd-chip">Follow</button>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {toast && <div className="fd-toast" role="status">{toast}</div>}
      </div>
    </>
  );
}
