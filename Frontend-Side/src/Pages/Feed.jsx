import { useState, useEffect, useRef } from "react";
import { ImageIcon, BarChart3, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2, X, Plus, Check, Flame, Users, Megaphone, Leaf } from "lucide-react";

const applyPrefs = () => {
  const d = document.documentElement;
  d.dataset.theme = localStorage.getItem("theme") || "light";
  d.dataset.accent = localStorage.getItem("accent") || "teal";
};

const TABS = ["All", "Thoughts", "Events", "Health", "Polls", "Saved"];
const POST_TAGS = ["Thoughts", "Events", "Health"];
const TOPICS = [["#TreePlantation", 128], ["#HealthCamp", 94], ["#CulturalFest", 71], ["#CleanColony", 55]];
const MEMBERS = ["Anjali Sharma", "Rohit Verma", "Neha Singh"];
const NOTICES = [
  { t: "Water supply Sunday ko 10 se 12 baje band rahegi", d: "Society Office" },
  { t: "Community hall booking ab open hai", d: "Admin" },
  { t: "Is mahine ki meeting 25 tareekh ko hogi", d: "Secretary" },
];

const SEED = [
  { id: 1, name: "Anjali Sharma", tag: "Events", time: "3h ago", body: "Today's #TreePlantation drive was a huge success! Thanks to all the volunteers who joined.", img: "https://picsum.photos/seed/feed1/800/420", likes: 24, comments: [{ n: "Rohit Verma", t: "Great work everyone!" }] },
  { id: 2, name: "Rohit Verma", tag: "Health", time: "4h ago", body: "Free #HealthCamp this Sunday at the community hall. Don't miss it!", likes: 12, comments: [] },
  { id: 3, name: "Neha Singh", tag: "Polls", time: "6h ago", body: "Which day works best for the next #CulturalFest?", poll: [["Saturday", 24], ["Sunday", 31], ["Friday evening", 9]], likes: 4, comments: [] },
];

const CSS = `
.fd-page{
  /* emerald-500 = #10b981 (base color) */
  --em:#10b981;      /* emerald-500: banner, poll bars */
  --g:#059669;       /* emerald-600: buttons, active tabs, links */
  --gd:#047857;      /* emerald-700: hover, dark text on light green */
  --soft:#d1fae5;    /* emerald-100 */
  --soft2:#ecfdf5;   /* emerald-50 */
  --bg:#ecfdf5;--card:#ffffff;--bd:#c6efdc;
  --tx:#16332a;--mut:#4f7266;
  background:var(--bg);border-radius:16px;padding:28px 24px 48px;color:var(--tx)
}
[data-theme="dark"] .fd-page{
  --em:#047857;--g:#34d399;--gd:#6ee7b7;
  --soft:#1b3a2f;--soft2:#17302a;
  --bg:#0f1f19;--card:#16291f;--bd:#26463a;
  --tx:#e6f5ee;--mut:#9dbcae
}
.fd-page *{box-sizing:border-box}
.fd{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:24px;align-items:start;max-width:1060px;margin:0 auto}

/* banner (emerald-500) */
.fd-banner{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;max-width:1060px;margin:0 auto 24px;padding:28px 32px;border-radius:14px;background:var(--em);color:#fff}
.fd-bl{display:flex;align-items:center;gap:16px}
.fd-logo{flex:none;width:52px;height:52px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;color:#fff}
.fd-banner h1{margin:0 0 4px;font-size:26px;font-weight:700;color:#fff}
.fd-banner p{margin:0;font-size:14px;color:rgba(255,255,255,.92)}
.fd-stats{display:flex;gap:12px;flex-wrap:wrap}
.fd-stat{min-width:96px;padding:10px 18px;border-radius:10px;background:rgba(255,255,255,.18);text-align:center}
.fd-stat b{display:block;font-size:20px;font-weight:700;color:#fff}
.fd-stat small{font-size:12px;color:rgba(255,255,255,.9)}

.fd-card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:20px}
.fd-av{flex:none;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:var(--gd);background:var(--soft)}
.fd-av.sm{width:32px;height:32px;font-size:13px}

/* composer */
.fd-comp{margin-bottom:20px}
.fd-comp-top{display:flex;gap:12px}
.fd-comp textarea{flex:1;border:0;outline:0;background:none;resize:none;min-height:64px;font:inherit;font-size:15px;line-height:1.5;color:var(--tx)}
.fd-comp textarea::placeholder{color:var(--mut)}
.fd-prev{position:relative;margin-top:12px}
.fd-prev img{width:100%;max-height:260px;object-fit:cover;border-radius:10px;display:block}
.fd-prev button{position:absolute;top:8px;right:8px;width:28px;height:28px;border:0;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.fd-pollin{margin-top:12px;display:flex;flex-direction:column;gap:8px}
.fd-pollin input{width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--bd);background:var(--soft2);color:var(--tx);font:inherit;font-size:14px;outline:0}
.fd-pollin input:focus{border-color:var(--em)}
.fd-addopt{align-self:flex-start;display:flex;align-items:center;gap:4px;padding:6px 10px;border:0;background:none;color:var(--g);font:inherit;font-size:13px;font-weight:600;cursor:pointer}
.fd-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)}
.fd-tl{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.fd-tbtn{display:flex;align-items:center;gap:6px;padding:8px 12px;border:0;border-radius:8px;background:none;color:var(--mut);font:inherit;font-size:13px;font-weight:500;cursor:pointer}
.fd-tbtn:hover,.fd-tbtn.on{background:var(--soft);color:var(--gd)}
.fd-select{height:34px;padding:0 10px;border:1px solid var(--bd);border-radius:8px;background:var(--soft2);color:var(--tx);font:inherit;font-size:13px;outline:0}
.fd-btn{height:38px;padding:0 22px;border:0;border-radius:8px;background:var(--g);color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer}
[data-theme="dark"] .fd-btn,[data-theme="dark"] .fd-tab.on,[data-theme="dark"] .fd-follow.on{color:#06281d}
.fd-btn:hover{background:var(--gd)}

/* tabs */
.fd-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.fd-tab{padding:8px 16px;border:1px solid var(--bd);border-radius:99px;background:var(--card);color:var(--tx);font:inherit;font-size:13px;font-weight:500;cursor:pointer}
.fd-tab:hover{border-color:var(--em)}
.fd-tab.on{background:var(--g);border-color:var(--g);color:#fff}
.fd-filter{display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;padding:6px 12px;border-radius:99px;font-size:13px;color:var(--gd);background:var(--soft)}
.fd-filter button{border:0;background:none;color:inherit;cursor:pointer;display:flex;padding:0}

/* post */
.fd-post{margin-bottom:20px}
.fd-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
.fd-user{display:flex;gap:12px;align-items:center}
.fd-user b{display:block;font-size:15px;font-weight:600}
.fd-user small{font-size:12px;color:var(--mut)}
.fd-hr{display:flex;align-items:center;gap:8px}
.fd-pill{padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;color:var(--gd);background:var(--soft)}
.fd-pill.Events{color:#a16207;background:#fef3c7}
.fd-pill.Health{color:#0369a1;background:#e0f2fe}
.fd-pill.Polls{color:#6d28d9;background:#ede9fe}
[data-theme="dark"] .fd-pill.Events{color:#fcd34d;background:#3a3216}
[data-theme="dark"] .fd-pill.Health{color:#7dd3fc;background:#16303f}
[data-theme="dark"] .fd-pill.Polls{color:#c4b5fd;background:#2c2445}
.fd-menu{position:relative}
.fd-dots{width:32px;height:32px;border:0;border-radius:8px;background:none;color:var(--mut);cursor:pointer;display:flex;align-items:center;justify-content:center}
.fd-dots:hover{background:var(--soft)}
.fd-drop{position:absolute;right:0;top:36px;z-index:5;min-width:150px;padding:6px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:0 6px 18px rgba(0,0,0,.1)}
.fd-drop button{display:flex;align-items:center;gap:8px;width:100%;padding:9px 12px;border:0;border-radius:6px;background:none;color:var(--tx);font:inherit;font-size:13px;cursor:pointer;text-align:left}
.fd-drop button:hover{background:var(--soft)}
.fd-drop .danger{color:#dc2626}
.fd-text{margin:14px 0 0;font-size:15px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.fd-text .ht{color:var(--g);cursor:pointer;font-weight:600}
.fd-img{margin-top:14px;border-radius:10px;overflow:hidden}
.fd-img img{width:100%;max-height:360px;object-fit:cover;display:block}

/* poll */
.fd-poll{margin-top:14px;display:flex;flex-direction:column;gap:8px}
.fd-opt{position:relative;overflow:hidden;display:block;width:100%;padding:11px 14px;border:1px solid var(--bd);border-radius:8px;background:var(--soft2);color:var(--tx);font:inherit;font-size:14px;text-align:left;cursor:pointer}
.fd-opt:hover{border-color:var(--em)}
.fd-opt i{position:absolute;inset:0 auto 0 0;background:color-mix(in srgb,var(--em) 28%,transparent)}
.fd-opt span{position:relative;display:flex;justify-content:space-between;align-items:center;gap:8px}
.fd-opt.me{border-color:var(--em)}
.fd-pollnote{font-size:12px;color:var(--mut)}

/* actions */
.fd-acts{display:flex;gap:4px;margin-top:16px;padding-top:12px;border-top:1px solid var(--bd)}
.fd-act{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border:0;border-radius:8px;background:none;color:var(--mut);font:inherit;font-size:13px;font-weight:500;cursor:pointer}
.fd-act:hover{background:var(--soft);color:var(--gd)}
.fd-act.like.on{color:#e11d48}
.fd-act.like.on svg{fill:#e11d48}
.fd-act.save.on{color:var(--g)}
.fd-act.save.on svg{fill:var(--g)}

/* comments */
.fd-cm{margin-top:12px;display:flex;flex-direction:column;gap:12px}
.fd-c{display:flex;gap:10px}
.fd-cb{padding:9px 12px;border-radius:10px;background:var(--soft);font-size:13px;line-height:1.5}
.fd-cb b{display:block;font-size:13px}
.fd-cin{display:flex;gap:8px}
.fd-cin input{flex:1;height:38px;padding:0 14px;border:1px solid var(--bd);border-radius:8px;background:var(--soft2);color:var(--tx);font:inherit;font-size:13px;outline:0}
.fd-cin input:focus{border-color:var(--em)}

/* sidebar */
.fd-side{position:sticky;top:20px;display:flex;flex-direction:column;gap:20px}
.fd-side h3{margin:0 0 12px;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600}
.fd-side h3 svg{color:var(--g)}
.fd-notice{padding:10px 0;border-bottom:1px solid var(--bd);font-size:14px;line-height:1.45}
.fd-notice:last-child{border-bottom:0;padding-bottom:0}
.fd-notice small{display:block;margin-top:2px;font-size:12px;color:var(--mut)}
.fd-tp{display:flex;justify-content:space-between;align-items:center;width:100%;padding:10px 0;border:0;border-bottom:1px solid var(--bd);background:none;color:var(--tx);font:inherit;font-size:14px;cursor:pointer;text-align:left}
.fd-tp:last-child{border-bottom:0}
.fd-tp:hover{color:var(--g)}
.fd-tp small{color:var(--mut)}
.fd-mem{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0}
.fd-mem div{display:flex;align-items:center;gap:10px;font-size:14px;min-width:0}
.fd-follow{padding:5px 12px;border:1px solid var(--g);border-radius:99px;background:none;color:var(--g);font:inherit;font-size:12px;font-weight:600;cursor:pointer}
.fd-follow.on{background:var(--g);color:#fff}

.fd-empty{text-align:center;padding:48px 16px;color:var(--mut);font-size:15px}
.fd-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 20px;border-radius:8px;background:#064e3b;color:#fff;font-size:14px;z-index:50}

@media(max-width:900px){
  .fd{grid-template-columns:1fr}
  .fd-side{display:none}
  .fd-page{padding:20px 14px 40px}
  .fd-banner{padding:22px 20px}
}
`;

const initial = (n) => (n || "?")[0].toUpperCase();

export default function Feed() {
  const [posts, setPosts] = useState(
    SEED.map((p) => ({ ...p, liked: false, saved: false, open: false, voted: null }))
  );
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [pollOn, setPollOn] = useState(false);
  const [opts, setOpts] = useState(["", ""]);
  const [tag, setTag] = useState("Thoughts");
  const [tab, setTab] = useState("All");
  const [topic, setTopic] = useState("");
  const [cmt, setCmt] = useState({});
  const [menu, setMenu] = useState(null);
  const [followed, setFollowed] = useState([]);
  const [toast, setToast] = useState("");
  const file = useRef();

  useEffect(applyPrefs, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const upd = (id, f) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...f(x) } : x)));

  const like = (id) => upd(id, (x) => ({ liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }));
  const save = (id) => upd(id, (x) => ({ saved: !x.saved }));

  const vote = (id, i) =>
    upd(id, (x) =>
      x.voted !== null ? {} : { voted: i, poll: x.poll.map(([l, v], k) => [l, k === i ? v + 1 : v]) }
    );

  const addComment = (id) => {
    const t = (cmt[id] || "").trim();
    if (!t) return;
    upd(id, (x) => ({ comments: [...x.comments, { n: "You", t }] }));
    setCmt({ ...cmt, [id]: "" });
  };

  const pickImage = (e) => {
    const f = e.target.files[0];
    if (f) setImg(URL.createObjectURL(f));
    e.target.value = "";
  };

  const share = () => {
    navigator.clipboard?.writeText(location.href);
    setToast("Link copied");
  };

  const submit = () => {
    const valid = opts.map((o) => o.trim()).filter(Boolean);
    if (!text.trim() && !img) return setToast("Kuch likho ya photo add karo");
    if (pollOn && valid.length < 2) return setToast("Poll ke liye kam se kam 2 options bharo");

    setPosts((p) => [
      {
        id: Date.now(),
        name: "You",
        tag: pollOn ? "Polls" : tag,
        time: "Just now",
        body: text.trim(),
        img,
        poll: pollOn ? valid.map((o) => [o, 0]) : null,
        likes: 0,
        comments: [],
        liked: false,
        saved: false,
        open: false,
        voted: null,
      },
      ...p,
    ]);
    setText("");
    setImg(null);
    setPollOn(false);
    setOpts(["", ""]);
    setTag("Thoughts");
    setToast("Post ho gaya");
  };

  const remove = (id) => {
    setPosts((p) => p.filter((x) => x.id !== id));
    setMenu(null);
    setToast("Post delete ho gaya");
  };

  const shown = posts.filter(
    (p) =>
      (tab === "All" || (tab === "Saved" ? p.saved : p.tag === tab)) &&
      (!topic || p.body.toLowerCase().includes(topic.toLowerCase()))
  );

  const renderBody = (body) =>
    body.split(/(#\w+)/g).map((part, i) =>
      part.startsWith("#") ? (
        <span key={i} className="ht" onClick={() => setTopic(part)}>
          {part}
        </span>
      ) : (
        part
      )
    );

  const totalLikes = posts.reduce((a, p) => a + p.likes, 0);

  return (
    <div className="fd-page" onClick={() => setMenu(null)}>
      <style>{CSS}</style>

      <div className="fd-banner">
        <div className="fd-bl">
          <div className="fd-logo">
            <Leaf size={26} />
          </div>
          <div>
            <h1>Community Feed</h1>
            <p>Apne mohalle ki khabrein, vichar aur photos ek jagah</p>
          </div>
        </div>
        <div className="fd-stats">
          <div className="fd-stat">
            <b>1.2k</b>
            <small>Members</small>
          </div>
          <div className="fd-stat">
            <b>{posts.length}</b>
            <small>Posts</small>
          </div>
          <div className="fd-stat">
            <b>{totalLikes}</b>
            <small>Likes</small>
          </div>
        </div>
      </div>

      <div className="fd">
        <div>
          {/* composer */}
          <div className="fd-card fd-comp">
            <div className="fd-comp-top">
              <div className="fd-av">Y</div>
              <textarea
                placeholder="Apni community se kuch share karo..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {img && (
              <div className="fd-prev">
                <img src={img} alt="" />
                <button onClick={() => setImg(null)} aria-label="Remove photo">
                  <X size={16} />
                </button>
              </div>
            )}

            {pollOn && (
              <div className="fd-pollin">
                {opts.map((o, i) => (
                  <input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={o}
                    onChange={(e) => setOpts(opts.map((x, k) => (k === i ? e.target.value : x)))}
                  />
                ))}
                {opts.length < 4 && (
                  <button className="fd-addopt" onClick={() => setOpts([...opts, ""])}>
                    <Plus size={14} /> Add option
                  </button>
                )}
              </div>
            )}

            <div className="fd-tools">
              <div className="fd-tl">
                <button className="fd-tbtn" onClick={() => file.current.click()}>
                  <ImageIcon size={17} /> Photo
                </button>
                <button className={"fd-tbtn" + (pollOn ? " on" : "")} onClick={() => setPollOn(!pollOn)}>
                  <BarChart3 size={17} /> Poll
                </button>
                {!pollOn && (
                  <select className="fd-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                    {POST_TAGS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                )}
                <input ref={file} type="file" accept="image/*" hidden onChange={pickImage} />
              </div>
              <button className="fd-btn" onClick={submit}>
                Post
              </button>
            </div>
          </div>

          {/* tabs */}
          <div className="fd-tabs">
            {TABS.map((t) => (
              <button key={t} className={"fd-tab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {topic && (
            <div className="fd-filter">
              Showing {topic}
              <button onClick={() => setTopic("")} aria-label="Clear topic">
                <X size={14} />
              </button>
            </div>
          )}

          {/* posts */}
          {shown.length === 0 ? (
            <div className="fd-card fd-empty">Yahan abhi kuch nahi hai. Pehli post aap karo!</div>
          ) : (
            shown.map((p) => {
              const pollTotal = p.poll ? p.poll.reduce((a, b) => a + b[1], 0) || 1 : 1;
              return (
                <div key={p.id} className="fd-card fd-post">
                  <div className="fd-head">
                    <div className="fd-user">
                      <div className="fd-av">{initial(p.name)}</div>
                      <div>
                        <b>{p.name}</b>
                        <small>{p.time}</small>
                      </div>
                    </div>
                    <div className="fd-hr">
                      <span className={"fd-pill " + p.tag}>{p.tag}</span>
                      <div className="fd-menu" onClick={(e) => e.stopPropagation()}>
                        <button className="fd-dots" onClick={() => setMenu(menu === p.id ? null : p.id)} aria-label="More">
                          <MoreHorizontal size={18} />
                        </button>
                        {menu === p.id && (
                          <div className="fd-drop">
                            <button
                              onClick={() => {
                                save(p.id);
                                setMenu(null);
                              }}
                            >
                              <Bookmark size={15} /> {p.saved ? "Unsave" : "Save post"}
                            </button>
                            <button
                              onClick={() => {
                                share();
                                setMenu(null);
                              }}
                            >
                              <Share2 size={15} /> Copy link
                            </button>
                            {p.name === "You" && (
                              <button className="danger" onClick={() => remove(p.id)}>
                                <Trash2 size={15} /> Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {p.body && <p className="fd-text">{renderBody(p.body)}</p>}

                  {p.img && (
                    <div className="fd-img">
                      <img src={p.img} alt="" />
                    </div>
                  )}

                  {p.poll && (
                    <div className="fd-poll">
                      {p.poll.map(([l, v], k) => (
                        <button
                          key={l + k}
                          className={"fd-opt" + (p.voted === k ? " me" : "")}
                          onClick={() => vote(p.id, k)}
                        >
                          {p.voted !== null && <i style={{ width: (v / pollTotal) * 100 + "%" }} />}
                          <span>
                            <span>
                              {p.voted === k && <Check size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />}
                              {l}
                            </span>
                            {p.voted !== null && <b>{Math.round((v / pollTotal) * 100)}%</b>}
                          </span>
                        </button>
                      ))}
                      <span className="fd-pollnote">
                        {p.voted === null ? "Vote karo to results dikhenge" : `${pollTotal} votes`}
                      </span>
                    </div>
                  )}

                  <div className="fd-acts">
                    <button className={"fd-act like" + (p.liked ? " on" : "")} onClick={() => like(p.id)}>
                      <Heart size={17} /> {p.likes}
                    </button>
                    <button className="fd-act" onClick={() => upd(p.id, (x) => ({ open: !x.open }))}>
                      <MessageCircle size={17} /> {p.comments.length}
                    </button>
                    <button className="fd-act" onClick={share}>
                      <Share2 size={17} /> Share
                    </button>
                    <button className={"fd-act save" + (p.saved ? " on" : "")} onClick={() => save(p.id)}>
                      <Bookmark size={17} />
                    </button>
                  </div>

                  {p.open && (
                    <div className="fd-cm">
                      {p.comments.map((m, k) => (
                        <div key={k} className="fd-c">
                          <div className="fd-av sm">{initial(m.n)}</div>
                          <div className="fd-cb">
                            <b>{m.n}</b>
                            {m.t}
                          </div>
                        </div>
                      ))}
                      <div className="fd-cin">
                        <input
                          placeholder="Write a comment..."
                          value={cmt[p.id] || ""}
                          onChange={(e) => setCmt({ ...cmt, [p.id]: e.target.value })}
                          onKeyDown={(e) => e.key === "Enter" && addComment(p.id)}
                        />
                        <button className="fd-btn" onClick={() => addComment(p.id)}>
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* sidebar */}
        <aside className="fd-side">
          <div className="fd-card">
            <h3>
              <Megaphone size={17} /> Notice board
            </h3>
            {NOTICES.map((n) => (
              <div key={n.t} className="fd-notice">
                {n.t}
                <small>{n.d}</small>
              </div>
            ))}
          </div>

          <div className="fd-card">
            <h3>
              <Flame size={17} /> Trending topics
            </h3>
            {TOPICS.map(([t, n]) => (
              <button key={t} className="fd-tp" onClick={() => setTopic(t)}>
                <span>{t}</span>
                <small>{n} posts</small>
              </button>
            ))}
          </div>

          <div className="fd-card">
            <h3>
              <Users size={17} /> Active members
            </h3>
            {MEMBERS.map((n) => {
              const f = followed.includes(n);
              return (
                <div key={n} className="fd-mem">
                  <div>
                    <span className="fd-av sm">{initial(n)}</span>
                    <span>{n}</span>
                  </div>
                  <button
                    className={"fd-follow" + (f ? " on" : "")}
                    onClick={() => setFollowed(f ? followed.filter((x) => x !== n) : [...followed, n])}
                  >
                    {f ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {toast && <div className="fd-toast">{toast}</div>}
    </div>
  );
}