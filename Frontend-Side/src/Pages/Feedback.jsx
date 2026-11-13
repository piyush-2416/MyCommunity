import { useEffect, useMemo, useState } from "react";
// import Navbar from "../Components/Navbar";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

/* ---------- Settings ---------- */

const HERO_IMAGE =
  "https://cdn2.vectorstock.com/i/1000x1000/01/96/graphic-cartoon-character-feedback-vector-36760196.jpg";

const STORAGE_KEY = "carepoint_feedbacks";
const PAGE_SIZE = 6;
const MAX_MESSAGE = 400;

const CATEGORIES = [
  "Overall",
  "Residents",
  "Directory",
  "Booking",
  "Website",
  "Other",
];

const SORTS = [
  ["new", "Newest"],
  ["high", "Highest rating"],
  ["low", "Lowest rating"],
];

const RATING_TEXT = [
  "",
  "Very bad",
  "Bad",
  "Okay",
  "Good",
  "Excellent",
];

/* ---------- Storage ---------- */

const loadFeedbacks = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveFeedbacks = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    console.error("Unable to save feedback");
  }
};

/* ---------- Helpers ---------- */

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);

const prettyDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const AVATAR_COLORS = [
  "#0d9488",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
];

const colorFor = (name) => {
  let h = 0;

  for (const ch of name) {
    h = (h * 31 + ch.charCodeAt(0)) % 997;
  }

  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

/* ---------- Icons ---------- */

const STAR =
  "M12 3.5l2.6 5.3 5.9.9-4.25 4.15 1 5.85L12 16.9l-5.25 2.8 1-5.85L3.5 9.7l5.9-.9L12 3.5z";

const Star = ({ filled, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "#f59e0b" : "none"}
    stroke={filled ? "#f59e0b" : "#cbd5e1"}
    strokeWidth="1.6"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={STAR} />
  </svg>
);

const Stars = ({ value, size = 16 }) => (
  <span className="fb-stars" aria-label={`${value} stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} filled={n <= Math.round(value)} size={size} />
    ))}
  </span>
);

/* ---------- Styles ---------- */

const styles = `
.fb-root{
  --ink:#0f172a;
  --muted:#64748b;
  --line:#e2e8f0;
  --teal:#0d9488;
  --teal-d:#0f766e;
  --teal-l:#ccfbf1;
  --teal-xl:#f0fdfa;
  --bg:#f4faf9;
  --red:#dc2626;

  font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  background:var(--bg);
  color:var(--ink);
  min-height:100vh;
  text-align:left;
}

.fb-root *{box-sizing:border-box}

.fb-root button,
.fb-root input,
.fb-root textarea,
.fb-root select{
  font-family:inherit;
}

/* Hero */

.fb-hero{
  position:relative;
  width:100%;
  height:280px;
  background:linear-gradient(135deg,#134e4a,#0d9488 60%,#14b8a6);
  overflow:hidden;
}

.fb-hero img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
}

.fb-hero::after{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(to top,rgba(2,6,23,.55),rgba(2,6,23,.1) 70%);
}

.fb-hero-in{
  position:absolute;
  left:0;
  right:0;
  bottom:84px;
  z-index:1;
  max-width:1100px;
  margin:0 auto;
  padding:0 24px;
}

.fb-hero h1{
  margin:0;
  color:#fff;
  font-size:36px;
  font-weight:800;
  letter-spacing:-.02em;
  line-height:1.15;
}

.fb-hero p{
  margin:12px 0 0;
  color:rgba(255,255,255,.88);
  font-size:16px;
  line-height:1.6;
  max-width:520px;
}

/* Layout */

.fb-wrap{
  position:relative;
  z-index:2;
  max-width:1100px;
  margin:-60px auto 0;
  padding:0 24px 90px;
}

.fb-grid{
  display:grid;
  gap:28px;
}

@media(min-width:960px){
  .fb-grid{
    grid-template-columns:380px 1fr;
    align-items:start;
  }

  .fb-formcard{
    position:sticky;
    top:24px;
  }
}

@media(max-width:600px){
  .fb-hero{height:240px}

  .fb-hero-in{
    bottom:70px;
    padding:0 18px;
  }

  .fb-hero h1{font-size:27px}

  .fb-wrap{
    padding:0 16px 72px;
    margin-top:-48px;
  }
}

/* Cards */

.fb-card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:22px;
  padding:28px;
  box-shadow:0 12px 36px rgba(15,23,42,.07);
}

@media(max-width:600px){
  .fb-card{
    padding:22px 18px;
    border-radius:18px;
  }
}

.fb-card h2{
  margin:0;
  font-size:22px;
  font-weight:800;
  letter-spacing:-.01em;
}

.fb-sub{
  margin:8px 0 0;
  color:var(--muted);
  font-size:14px;
  line-height:1.55;
}

/* Form */

.fb-form{
  display:grid;
  gap:20px;
  margin-top:24px;
}

.fb-field label,
.fb-label{
  display:block;
  margin-bottom:8px;
  font-size:13px;
  font-weight:700;
  color:#334155;
}

.fb-input{
  width:100%;
  border:1px solid var(--line);
  background:#f8fafc;
  border-radius:12px;
  padding:13px 16px;
  font-size:14px;
  color:var(--ink);
  outline:none;
  transition:border-color .2s,box-shadow .2s,background .2s;
}

.fb-input:focus{
  background:#fff;
  border-color:var(--teal);
  box-shadow:0 0 0 3px rgba(13,148,136,.15);
}

.fb-input.bad{border-color:var(--red)}

textarea.fb-input{
  resize:vertical;
  min-height:120px;
  line-height:1.55;
}

.fb-err{
  margin:8px 0 0;
  color:var(--red);
  font-size:13px;
}

.fb-count{
  margin:6px 0 0;
  text-align:right;
  color:#94a3b8;
  font-size:12px;
}

/* Rating */

.fb-rate{
  display:flex;
  align-items:center;
  gap:6px;
}

.fb-rate button{
  border:0;
  background:none;
  padding:2px;
  cursor:pointer;
  line-height:0;
  border-radius:8px;
}

.fb-rate button:focus-visible{
  outline:2px solid var(--teal);
}

.fb-rate-text{
  margin-left:10px;
  font-size:13px;
  font-weight:600;
  color:var(--teal-d);
}

/* Categories */

.fb-chips{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}

.fb-chip{
  border:1px solid #cbd5e1;
  background:#fff;
  color:#475569;
  border-radius:999px;
  padding:8px 16px;
  font-size:13px;
  font-weight:600;
  cursor:pointer;
  transition:background .15s,color .15s,border-color .15s;
}

.fb-chip:hover:not(.on){background:#f1f5f9}

.fb-chip.on{
  background:var(--teal);
  border-color:var(--teal);
  color:#fff;
}

/* Submit button */

.fb-btn{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  border:0;
  border-radius:12px;
  padding:14px 18px;
  font-size:15px;
  font-weight:700;
  cursor:pointer;
  color:#fff;
  background:var(--teal);
  transition:background .2s;
}

.fb-btn:hover:not(:disabled){background:var(--teal-d)}

.fb-btn:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.fb-ok{
  display:flex;
  align-items:center;
  gap:10px;
  padding:14px 16px;
  border-radius:12px;
  background:#f0fdf4;
  border:1px solid #bbf7d0;
  color:#166534;
  font-size:14px;
  font-weight:600;
}

/* Summary */

.fb-sum{
  display:grid;
  gap:24px;
  align-items:center;
}

@media(min-width:640px){
  .fb-sum{grid-template-columns:180px 1fr}
}

.fb-avg{
  text-align:center;
  padding:8px 0;
}

.fb-avg b{
  display:block;
  font-size:56px;
  font-weight:800;
  letter-spacing:-.03em;
  line-height:1;
  color:var(--ink);
}

.fb-avg .fb-stars{
  display:inline-flex;
  gap:3px;
  margin-top:12px;
}

.fb-avg small{
  display:block;
  margin-top:10px;
  color:var(--muted);
  font-size:13px;
}

.fb-bars{
  display:grid;
  gap:10px;
}

.fb-bar{
  display:grid;
  grid-template-columns:34px 1fr 30px;
  align-items:center;
  gap:12px;
  font-size:13px;
  color:var(--muted);
}

.fb-track{
  height:9px;
  border-radius:999px;
  background:#eef2f6;
  overflow:hidden;
}

.fb-fill{
  height:100%;
  border-radius:999px;
  background:linear-gradient(90deg,#f59e0b,#fbbf24);
}

.fb-bar span:last-child{text-align:right}

/* Toolbar */

.fb-toolbar{
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
  align-items:center;
  gap:16px;
  margin:32px 0 20px;
}

.fb-toolbar h3{
  margin:0;
  font-size:20px;
  font-weight:800;
}

.fb-filters{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}

.fb-select{
  border:1px solid var(--line);
  background:#fff;
  border-radius:12px;
  padding:10px 14px;
  font-size:13px;
  font-weight:600;
  color:#334155;
  outline:none;
  cursor:pointer;
}

.fb-select:focus{border-color:var(--teal)}

/* Feedback list */

.fb-list{
  list-style:none;
  margin:0;
  padding:0;
  display:grid;
  gap:18px;
}

.fb-item{
  background:#fff;
  border:1px solid var(--line);
  border-radius:18px;
  padding:24px;
  box-shadow:0 4px 18px rgba(15,23,42,.05);
}

@media(max-width:600px){
  .fb-item{padding:18px}
}

.fb-item-head{
  display:flex;
  align-items:center;
  gap:14px;
}

.fb-avatar{
  display:grid;
  place-items:center;
  flex-shrink:0;
  width:46px;
  height:46px;
  border-radius:50%;
  color:#fff;
  font-size:15px;
  font-weight:700;
}

.fb-who{
  flex:1;
  min-width:0;
}

.fb-who b{
  display:block;
  font-size:15px;
  word-break:break-word;
}

.fb-who small{
  display:block;
  margin-top:4px;
  color:#94a3b8;
  font-size:12px;
}

.fb-stars{
  display:inline-flex;
  gap:2px;
  flex-shrink:0;
}

.fb-meta{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:10px;
  margin-top:16px;
}

.fb-tag{
  display:inline-block;
  padding:4px 12px;
  border-radius:999px;
  background:var(--teal-xl);
  border:1px solid #99f6e4;
  color:var(--teal-d);
  font-size:12px;
  font-weight:600;
}

.fb-you{
  display:inline-block;
  padding:4px 12px;
  border-radius:999px;
  background:#eff6ff;
  border:1px solid #bfdbfe;
  color:#1d4ed8;
  font-size:12px;
  font-weight:600;
}

.fb-msg{
  margin:14px 0 0;
  color:#334155;
  font-size:14px;
  line-height:1.7;
  white-space:pre-wrap;
  word-break:break-word;
}

.fb-del{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px;
  margin-top:16px;
  padding-top:14px;
  border-top:1px solid #f1f5f9;
}

.fb-link{
  border:0;
  background:none;
  color:var(--red);
  font-size:13px;
  font-weight:600;
  cursor:pointer;
  padding:6px 10px;
  border-radius:8px;
}

.fb-link:hover{background:#fef2f2}

.fb-link.neutral{color:var(--muted)}

.fb-link.neutral:hover{background:#f1f5f9}

/* Show more */

.fb-more{
  display:block;
  margin:24px auto 0;
  border:1px solid #cbd5e1;
  background:#fff;
  color:#334155;
  border-radius:999px;
  padding:12px 28px;
  font-size:14px;
  font-weight:600;
  cursor:pointer;
  transition:background .15s;
}

.fb-more:hover{background:#f1f5f9}

/* Empty state */

.fb-empty{
  background:#fff;
  border:1px dashed #cbd5e1;
  border-radius:18px;
  padding:60px 24px;
  text-align:center;
}

.fb-empty div{font-size:40px}

.fb-empty p{
  margin:16px 0 0;
  color:var(--muted);
  font-size:15px;
  line-height:1.6;
}

@media(prefers-reduced-motion:reduce){
  .fb-btn,.fb-chip,.fb-input,.fb-more{transition:none}
}
`;

/* ---------- Main Component ---------- */

export default function Feedback() {
  const { user } = useAuth() || {};

  const [list, setList] = useState(loadFeedbacks);

  const [form, setForm] = useState({
    name: user?.name || "",
    rating: 0,
    category: "Overall",
    message: "",
  });

  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [deleteId, setDeleteId] = useState(null);

  /* Fill username */

  useEffect(() => {
    if (user?.name) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name,
      }));
    }
  }, [user]);

  /* Listen for other tabs */

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setList(loadFeedbacks());
      }
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Validation */

  const validate = () => {
    const errs = {};

    if (form.name.trim().length < 2) {
      errs.name = "Please enter your name";
    }

    if (!form.rating) {
      errs.rating = "Please select a star rating";
    }

    if (form.message.trim().length < 10) {
      errs.message = "Please write at least 10 characters of feedback";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  /* Submit */

  const submit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const entry = {
      id: makeId(),
      name: form.name.trim(),
      rating: form.rating,
      category: form.category,
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
      mine: true,
    };

    const next = [entry, ...list];

    setList(next);
    saveFeedbacks(next);

    setForm({
      name: form.name,
      rating: 0,
      category: "Overall",
      message: "",
    });

    setHover(0);
    setErrors({});
    setFilter("all");
    setSort("new");
    setVisible(PAGE_SIZE);

    setSent(true);

    setTimeout(() => setSent(false), 4000);
  };

  /* Delete */

  const remove = (id) => {
    const next = list.filter((f) => f.id !== id);

    setList(next);
    saveFeedbacks(next);
    setDeleteId(null);
  };

  /* Statistics */

  const stats = useMemo(() => {
    const total = list.length;
    const dist = [0, 0, 0, 0, 0, 0];

    let sum = 0;

    list.forEach((f) => {
      if (f.rating >= 1 && f.rating <= 5) {
        dist[f.rating] += 1;
        sum += f.rating;
      }
    });

    return {
      total,
      dist,
      avg: total ? sum / total : 0,
    };
  }, [list]);

  /* Filter and Sort */

  const rows = useMemo(() => {
    const f =
      filter === "all"
        ? list
        : list.filter((x) => x.rating === Number(filter));

    return [...f].sort((a, b) => {
      if (sort === "high") {
        return (
          b.rating - a.rating ||
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      if (sort === "low") {
        return (
          a.rating - b.rating ||
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [list, filter, sort]);

  const shown = rows.slice(0, visible);

  const shownRating = hover || form.rating;

  /* ---------- UI ---------- */

  return (
    <>
      <style>{styles}</style>

      <Navbar />

      <div className="fb-root">

        {/* HERO */}

        <section className="fb-hero">
          {HERO_IMAGE && (
            <img
              src={HERO_IMAGE}
              alt=""
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <div className="fb-hero-in">
            <h1>💬 Community Feedback</h1>

            <p>
              Share your experience with our community platform.
              Your feedback helps us improve our services for everyone.
            </p>
          </div>
        </section>

        <div className="fb-wrap">
          <div className="fb-grid">

            {/* FORM */}

            <aside className="fb-card fb-formcard">
              <h2>Give Feedback</h2>

              <p className="fb-sub">
                It takes just 1 minute. Your opinion matters to our community.
              </p>

              <form
                className="fb-form"
                onSubmit={submit}
                noValidate
              >

                {/* Name */}

                <div className="fb-field">
                  <label htmlFor="fb-name">Your Name</label>

                  <input
                    id="fb-name"
                    className={`fb-input ${errors.name ? "bad" : ""}`}
                    value={form.name}
                    maxLength={40}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Rahul Sharma"
                    autoComplete="name"
                  />

                  {errors.name && (
                    <p className="fb-err">{errors.name}</p>
                  )}
                </div>

                {/* Rating */}

                <div>
                  <span className="fb-label">Rating</span>

                  <div
                    className="fb-rate"
                    onMouseLeave={() => setHover(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} star`}
                        onMouseEnter={() => setHover(n)}
                        onClick={() =>
                          setForm({
                            ...form,
                            rating: n,
                          })
                        }
                      >
                        <Star
                          filled={n <= shownRating}
                          size={32}
                        />
                      </button>
                    ))}

                    {shownRating > 0 && (
                      <span className="fb-rate-text">
                        {RATING_TEXT[shownRating]}
                      </span>
                    )}
                  </div>

                  {errors.rating && (
                    <p className="fb-err">{errors.rating}</p>
                  )}
                </div>

                {/* Category */}

                <div>
                  <span className="fb-label">
                    What is it about?
                  </span>

                  <div className="fb-chips">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`fb-chip ${
                          form.category === c ? "on" : ""
                        }`}
                        onClick={() =>
                          setForm({
                            ...form,
                            category: c,
                          })
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}

                <div className="fb-field">
                  <label htmlFor="fb-msg">
                    Your Feedback
                  </label>

                  <textarea
                    id="fb-msg"
                    className={`fb-input ${
                      errors.message ? "bad" : ""
                    }`}
                    value={form.message}
                    maxLength={MAX_MESSAGE}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        message: e.target.value,
                      })
                    }
                    placeholder="What did you like? What can we improve?"
                  />

                  <p className="fb-count">
                    {form.message.length}/{MAX_MESSAGE}
                  </p>

                  {errors.message && (
                    <p className="fb-err">{errors.message}</p>
                  )}
                </div>

                {/* Success */}

                {sent && (
                  <div className="fb-ok" role="status">
                    ✅ Thank you! Your feedback has been added.
                  </div>
                )}

                <button type="submit" className="fb-btn">
                  Submit Feedback
                </button>

              </form>
            </aside>

            {/* SUMMARY + LIST */}

            <main style={{ minWidth: 0 }}>

              {/* Summary */}

              <section className="fb-card">
                <h2>Community Opinions</h2>

                <p className="fb-sub">
                  {stats.total > 0
                    ? "Here is what community members said about our platform."
                    : "No feedback yet. Be the first to share yours!"}
                </p>

                <div
                  className="fb-sum"
                  style={{ marginTop: 24 }}
                >

                  <div className="fb-avg">
                    <b>
                      {stats.total
                        ? stats.avg.toFixed(1)
                        : "0.0"}
                    </b>

                    <Stars value={stats.avg} size={20} />

                    <small>
                      {stats.total} feedback
                      {stats.total === 1 ? "" : "s"}
                    </small>
                  </div>

                  <div className="fb-bars">
                    {[5, 4, 3, 2, 1].map((n) => {
                      const pct = stats.total
                        ? (stats.dist[n] / stats.total) * 100
                        : 0;

                      return (
                        <div key={n} className="fb-bar">
                          <span>{n} ★</span>

                          <div className="fb-track">
                            <div
                              className="fb-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <span>{stats.dist[n]}</span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </section>

              {/* Toolbar */}

              {stats.total > 0 && (
                <div className="fb-toolbar">
                  <h3>All Feedback</h3>

                  <div className="fb-filters">

                    <select
                      className="fb-select"
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setVisible(PAGE_SIZE);
                      }}
                      aria-label="Rating filter"
                    >
                      <option value="all">All ratings</option>

                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} star
                        </option>
                      ))}
                    </select>

                    <select
                      className="fb-select"
                      value={sort}
                      onChange={(e) =>
                        setSort(e.target.value)
                      }
                      aria-label="Sort"
                    >
                      {SORTS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>
              )}

              {/* Empty State */}

              {stats.total === 0 && (
                <div
                  className="fb-empty"
                  style={{ marginTop: 24 }}
                >
                  <div>📝</div>

                  <p>
                    Everyone's feedback will appear here.
                    <br />
                    Add yours using the form on the left.
                  </p>
                </div>
              )}

              {stats.total > 0 && rows.length === 0 && (
                <div className="fb-empty">
                  <div>🔍</div>

                  <p>
                    There is no feedback with this rating.
                  </p>
                </div>
              )}

              {/* Feedback List */}

              <ul className="fb-list">
                {shown.map((f) => (
                  <li key={f.id} className="fb-item">

                    <div className="fb-item-head">

                      <div
                        className="fb-avatar"
                        style={{
                          background: colorFor(f.name),
                        }}
                      >
                        {initials(f.name)}
                      </div>

                      <div className="fb-who">
                        <b>{f.name}</b>

                        <small>
                          {prettyDate(f.createdAt)}
                        </small>
                      </div>

                      <Stars value={f.rating} />

                    </div>

                    <div className="fb-meta">
                      <span className="fb-tag">
                        {f.category}
                      </span>

                      {f.mine && (
                        <span className="fb-you">
                          Your feedback
                        </span>
                      )}
                    </div>

                    <p className="fb-msg">
                      {f.message}
                    </p>

                    {/* Delete */}

                    {f.mine && (
                      <div className="fb-del">

                        {deleteId === f.id ? (
                          <>
                            <button
                              type="button"
                              className="fb-link"
                              onClick={() => remove(f.id)}
                            >
                              Yes, delete
                            </button>

                            <button
                              type="button"
                              className="fb-link neutral"
                              onClick={() => setDeleteId(null)}
                            >
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="fb-link"
                            onClick={() => setDeleteId(f.id)}
                          >
                            🗑️ Delete
                          </button>
                        )}

                      </div>
                    )}

                  </li>
                ))}
              </ul>

              {/* Show More */}

              {rows.length > visible && (
                <button
                  type="button"
                  className="fb-more"
                  onClick={() =>
                    setVisible((v) => v + PAGE_SIZE)
                  }
                >
                  Show more ({rows.length - visible} remaining)
                </button>
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}