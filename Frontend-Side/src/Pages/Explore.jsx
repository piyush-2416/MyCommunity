import { useState, useEffect, useMemo } from "react";
import { Search, X, Users, Star, Heart, LayoutGrid, List, Check, SearchX, Flame } from "lucide-react";

const applyPrefs = () => {
  const d = document.documentElement;
  d.dataset.theme = localStorage.getItem("theme") || "light";
  d.dataset.accent = localStorage.getItem("accent") || "teal";
};

const CATS = ["All", "Residential", "Events", "Volunteering", "Services"];

// img me apni real photo ka URL daal sakte ho, abhi placeholder photos hain
const DATA = [
  { id: 1, name: "Green Society", cat: "Residential", desc: "Eco-friendly living, gardening and waste-free drives.", members: 1200, rating: 4.8, tag: "Environment", img: "https://picsum.photos/seed/cm1/600/400" },
  { id: 2, name: "Health & Wellness", cat: "Services", desc: "Free checkups, yoga mornings and fitness groups.", members: 856, rating: 4.7, tag: "Health", img: "https://picsum.photos/seed/cm2/600/400" },
  { id: 3, name: "Cultural Club", cat: "Events", desc: "Festivals, music nights and art exhibitions.", members: 432, rating: 4.9, tag: "Art & Culture", img: "https://picsum.photos/seed/cm3/600/400" },
  { id: 4, name: "Volunteer Hub", cat: "Volunteering", desc: "Join drives for cleanliness, food and education.", members: 310, rating: 4.6, tag: "Social", img: "https://picsum.photos/seed/cm4/600/400" },
  { id: 5, name: "Royal Residency", cat: "Residential", desc: "Neighbourhood updates, security and notices.", members: 640, rating: 4.5, tag: "Society", img: "https://picsum.photos/seed/cm5/600/400" },
  { id: 6, name: "Weekend Fun Events", cat: "Events", desc: "Sports days, picnics and kids' activities.", members: 390, rating: 4.7, tag: "Fun", img: "https://picsum.photos/seed/cm6/600/400" },
  { id: 7, name: "Helping Hands", cat: "Volunteering", desc: "Support for elders and families in need.", members: 275, rating: 4.9, tag: "Care", img: "https://picsum.photos/seed/cm7/600/400" },
  { id: 8, name: "Fix-It Services", cat: "Services", desc: "Trusted plumbers, electricians and repairs nearby.", members: 520, rating: 4.4, tag: "Local", img: "https://picsum.photos/seed/cm8/600/400" },
];

const CSS = `
.ex-page{
  /* emerald-500 = #10b981 (base color) */
  --em:#10b981;      /* emerald-500: hero, trending rank, focus */
  --g:#059669;       /* emerald-600: buttons, active chips, links */
  --gd:#047857;      /* emerald-700: hover */
  --soft:#d1fae5;    /* emerald-100 */
  --soft2:#ecfdf5;   /* emerald-50 */
  --bg:#ecfdf5;--card:#ffffff;--bd:#c6efdc;
  --tx:#16332a;--mut:#4f7266;
  background:var(--bg);border-radius:16px;padding:28px 24px 48px;color:var(--tx)
}
[data-theme="dark"] .ex-page{
  --em:#047857;--g:#34d399;--gd:#6ee7b7;
  --soft:#1b3a2f;--soft2:#17302a;
  --bg:#0f1f19;--card:#16291f;--bd:#26463a;
  --tx:#e6f5ee;--mut:#9dbcae
}
.ex-page *{box-sizing:border-box}
.ex{max-width:1120px;margin:0 auto}

/* hero (emerald-500) */
.ex-hero{border-radius:14px;padding:36px 32px;margin-bottom:32px;background:var(--em);color:#fff}
.ex-hero h1{margin:0 0 6px;font-size:28px;font-weight:700;color:#fff}
.ex-hero p{margin:0 0 22px;font-size:15px;color:rgba(255,255,255,.92)}
.ex-search{display:flex;align-items:center;gap:10px;max-width:520px;height:46px;padding:0 14px;border-radius:10px;background:#fff;color:#4f7266}
.ex-search input{flex:1;border:0;outline:0;background:none;font:inherit;font-size:14px;color:#16332a}
.ex-search input::placeholder{color:#6b8a7d}
.ex-clear{border:0;background:none;color:#4f7266;cursor:pointer;display:flex;padding:2px}

/* section heading */
.ex-sec{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.ex-sec h2{margin:0;display:flex;align-items:center;gap:8px;font-size:17px;font-weight:600;color:var(--tx)}
.ex-sec h2 svg{color:var(--g)}
.ex-sec span{padding:3px 12px;border-radius:99px;font-size:13px;font-weight:500;color:var(--gd);background:var(--soft)}
[data-theme="dark"] .ex-sec span{color:var(--g)}

/* trending */
.ex-trend{display:flex;gap:16px;overflow-x:auto;padding-bottom:12px;margin-bottom:32px}
.ex-tcard{position:relative;flex:none;width:240px;height:140px;border-radius:12px;overflow:hidden;cursor:pointer;color:#fff}
.ex-tcard img{width:100%;height:100%;object-fit:cover;display:block}
.ex-tcard .ov{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(transparent 30%,rgba(4,60,44,.85))}
.ex-tcard b{font-size:15px;font-weight:600}
.ex-tcard small{font-size:12px;opacity:.9;margin-top:2px}
.ex-rank{position:absolute;top:10px;left:10px;width:26px;height:26px;border-radius:6px;background:var(--em);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center}

/* filter bar */
.ex-bar{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:24px}
.ex-cats{display:flex;gap:8px;flex-wrap:wrap}
.ex-cat{padding:8px 16px;border:1px solid var(--bd);border-radius:99px;background:var(--card);color:var(--tx);font:inherit;font-size:13px;font-weight:500;cursor:pointer;transition:border-color .2s}
.ex-cat:hover{border-color:var(--em)}
.ex-cat.on{background:var(--g);border-color:var(--g);color:#fff}
.ex-cat small{margin-left:6px;font-size:12px;opacity:.75}
.ex-tools{display:flex;gap:10px;align-items:center}
.ex-select{height:38px;padding:0 12px;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--tx);font:inherit;font-size:13px;outline:0;cursor:pointer}
.ex-select:focus{border-color:var(--em)}
.ex-view{display:flex;border:1px solid var(--bd);border-radius:8px;overflow:hidden;background:var(--card)}
.ex-view button{width:38px;height:36px;border:0;background:none;color:var(--mut);cursor:pointer;display:flex;align-items:center;justify-content:center}
.ex-view button.on{background:var(--g);color:#fff}
[data-theme="dark"] .ex-cat.on,[data-theme="dark"] .ex-view button.on,[data-theme="dark"] .ex-btn{color:#06281d}

/* cards */
.ex-grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.ex-grid.list{grid-template-columns:1fr}
.ex-card{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--bd);border-radius:12px;background:var(--card);transition:box-shadow .2s,border-color .2s}
.ex-card:hover{border-color:var(--em);box-shadow:0 6px 18px rgba(16,185,129,.15)}
.ex-img{position:relative;height:160px;overflow:hidden;flex:none}
.ex-img img{width:100%;height:100%;object-fit:cover;display:block}
.ex-tag{position:absolute;left:12px;bottom:12px;padding:3px 10px;border-radius:6px;background:rgba(4,60,44,.78);color:#fff;font-size:12px}
.ex-save{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:8px;border:0;background:rgba(255,255,255,.92);color:#4f7266;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ex-save.on{color:#e11d48}
.ex-save.on svg{fill:#e11d48}
.ex-body{display:flex;flex-direction:column;flex:1;padding:18px}
.ex-row{display:flex;justify-content:space-between;align-items:center;gap:10px}
.ex-row b{font-size:16px;font-weight:600;color:var(--tx)}
.ex-pill{flex:none;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:500;color:var(--gd);background:var(--soft)}
[data-theme="dark"] .ex-pill{color:var(--g)}
.ex-body p{margin:10px 0 16px;font-size:14px;line-height:1.55;color:var(--mut);flex:1}
.ex-meta{display:flex;gap:18px;margin-bottom:16px;font-size:13px;color:var(--mut)}
.ex-meta span{display:flex;align-items:center;gap:6px}
.ex-meta svg{color:var(--em)}
.ex-btn{height:40px;border-radius:8px;border:1px solid var(--g);background:var(--g);color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:background .2s}
.ex-btn:hover{background:var(--gd);border-color:var(--gd)}
.ex-btn.on{background:transparent;color:var(--g)}
.ex-btn.on:hover{background:var(--soft)}
[data-theme="dark"] .ex-btn.on{color:var(--g)}

/* list view */
.ex-grid.list .ex-card{flex-direction:row}
.ex-grid.list .ex-img{width:220px;height:auto}

/* empty + toast */
.ex-empty{text-align:center;padding:64px 16px;color:var(--mut)}
.ex-empty svg{margin-bottom:12px;opacity:.6}
.ex-empty p{margin:0 0 16px;font-size:15px}
.ex-empty button{padding:9px 18px;border-radius:8px;border:1px solid var(--g);background:none;color:var(--g);font:inherit;font-size:14px;font-weight:600;cursor:pointer}
.ex-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 20px;border-radius:8px;background:#064e3b;color:#fff;font-size:14px;z-index:50}

@media(max-width:700px){
  .ex-page{padding:20px 14px 40px}
  .ex-hero{padding:26px 20px}
  .ex-grid.list .ex-card{flex-direction:column}
  .ex-grid.list .ex-img{width:100%;height:160px}
}
`;

export default function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState("grid");
  const [joined, setJoined] = useState([2]);
  const [saved, setSaved] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(applyPrefs, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const list = useMemo(
    () =>
      DATA.filter(
        (d) =>
          (cat === "All" || d.cat === cat) &&
          (d.name + d.desc + d.tag).toLowerCase().includes(q.toLowerCase())
      ).sort((a, b) =>
        sort === "popular"
          ? b.members - a.members
          : sort === "rating"
          ? b.rating - a.rating
          : a.name.localeCompare(b.name)
      ),
    [q, cat, sort]
  );

  const trending = useMemo(() => [...DATA].sort((a, b) => b.members - a.members).slice(0, 5), []);

  const count = (c) => (c === "All" ? DATA.length : DATA.filter((d) => d.cat === c).length);
  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);
  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const join = (d) => {
    const wasJoined = joined.includes(d.id);
    toggle(joined, setJoined, d.id);
    setToast(wasJoined ? `Left ${d.name}` : `You joined ${d.name}`);
  };

  return (
    <div className="ex-page">
      <style>{CSS}</style>

      <div className="ex">
        <div className="ex-hero">
          <h1>Explore Communities</h1>
          <p>Discover new communities, events and opportunities near you</p>
          <div className="ex-search">
            <Search size={18} />
            <input
              placeholder="Search communities, events, services..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button className="ex-clear" onClick={() => setQ("")} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="ex-sec">
          <h2>
            <Flame size={18} /> Trending now
          </h2>
          <span>{joined.length} joined</span>
        </div>
        <div className="ex-trend">
          {trending.map((d, i) => (
            <div key={d.id} className="ex-tcard" onClick={() => setQ(d.name)}>
              <img src={d.img} alt={d.name} />
              <span className="ex-rank">{i + 1}</span>
              <div className="ov">
                <b>{d.name}</b>
                <small>
                  {fmt(d.members)} members · {d.rating} rating
                </small>
              </div>
            </div>
          ))}
        </div>

        <div className="ex-bar">
          <div className="ex-cats">
            {CATS.map((c) => (
              <button key={c} className={"ex-cat" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
                {c}
                <small>{count(c)}</small>
              </button>
            ))}
          </div>
          <div className="ex-tools">
            <select className="ex-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="name">A – Z</option>
            </select>
            <div className="ex-view">
              <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")} aria-label="Grid view">
                <LayoutGrid size={17} />
              </button>
              <button className={view === "list" ? "on" : ""} onClick={() => setView("list")} aria-label="List view">
                <List size={17} />
              </button>
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="ex-empty">
            <SearchX size={40} />
            <p>No communities found{q ? ` for "${q}"` : ""}</p>
            <button
              onClick={() => {
                setQ("");
                setCat("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={"ex-grid " + view}>
            {list.map((d) => {
              const j = joined.includes(d.id);
              const s = saved.includes(d.id);
              return (
                <div key={d.id} className="ex-card">
                  <div className="ex-img">
                    <img src={d.img} alt={d.name} />
                    <span className="ex-tag">{d.tag}</span>
                    <button
                      className={"ex-save" + (s ? " on" : "")}
                      onClick={() => toggle(saved, setSaved, d.id)}
                      aria-label="Save community"
                    >
                      <Heart size={17} />
                    </button>
                  </div>
                  <div className="ex-body">
                    <div className="ex-row">
                      <b>{d.name}</b>
                      <span className="ex-pill">{d.cat}</span>
                    </div>
                    <p>{d.desc}</p>
                    <div className="ex-meta">
                      <span>
                        <Users size={15} /> {fmt(d.members + (j ? 1 : 0))} members
                      </span>
                      <span>
                        <Star size={15} /> {d.rating}
                      </span>
                    </div>
                    <button className={"ex-btn" + (j ? " on" : "")} onClick={() => join(d)}>
                      {j ? (
                        <>
                          <Check size={16} /> Joined
                        </>
                      ) : (
                        "Join Community"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <div className="ex-toast">{toast}</div>}
    </div>
  );
}