import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Content (yahin se text/links edit kar sakte ho) ─────────
const FEATURES = [
  { icon: "📣", title: "Complaints", text: "Raise society issues, track their status and follow up until they are resolved.", to: "/Complaints" },
  { icon: "📢", title: "Notices", text: "Important committee announcements in one place, visible to everyone." },
  { icon: "📅", title: "Events", text: "See festival and meeting details, and how many people are attending.", to: "/Events" },
  { icon: "🚨", title: "Emergency Board", text: "Raise a medical, fire, blood or accident alert. Neighbours can tap 'I can help' and show up right away.", to: "/Emergency" },
  { icon: "🗳️", title: "Society Polls", text: "Decide together. Vote on active polls and see the results and the leading option once a poll closes.", to: "/Society_Polls" },
  { icon: "📇", title: "Directory & Members", text: "A direct directory of members, staff and important contacts." },
  { icon: "🔍", title: "Lost & Found", text: "Lost or found something? Post it and get your belongings back." },
  { icon: "🖼️", title: "Society Gallery", text: "Photos from events and memories, all in one place." },
  { icon: "🏪", title: "Multiple Businesses", text: "Different shops and services around the society (grocery, salon, repair and more) in one list, with contact details." },
  { icon: "🙋", title: "Requests", text: "Need something or some help? Post a request and let neighbours or the committee respond." },
  { icon: "🏆", title: "Achievements", text: "Recognise residents' wins and contributions: toppers, volunteers, sports and social service." },
];

const STEPS = [
  { title: "Post it", text: "Complaint, notice, poll or emergency, put whatever you need in front of the community." },
  { title: "The community sees it", text: "Every resident sees the same board, so no more digging through group chats." },
  { title: "Solve it together", text: "Help out, vote and update the status, and track it until it's done." },
];

// Add your name and role here
const TEAM = [{ name: "Your Name", role: "Developer", emoji: "👨‍💻" }];

// ─── Scroll reveal ───────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ab-rv ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const css = `
.ab-page{min-height:100vh;background:radial-gradient(circle at 1px 1px,rgba(46,139,87,.16) 1.5px,transparent 0) 0 0/22px 22px,linear-gradient(180deg,#dff3e7 0%,#e6f1f6 55%,#f2f8f4 100%)}
.ab{--ink:#173528;--mut:#587064;--line:#d3e6db;--green:#2e8b57;--teal:#0f766e;width:min(1100px,100%);margin:0 auto;padding:18px clamp(12px,3vw,32px) 56px;color:var(--ink);font-family:"Segoe UI",system-ui,sans-serif;text-align:left}
.ab *{box-sizing:border-box}
.ab h1,.ab h2,.ab h3,.ab p{margin:0}
.ab-hero{position:relative;overflow:hidden;display:grid;gap:20px;justify-items:center;text-align:center;padding:32px 20px;border-radius:26px;color:#fff;background:linear-gradient(120deg,#2f9e62,#0f766e 70%,#22b8a6);box-shadow:0 14px 32px rgba(15,118,110,.28)}
.ab-hero::before,.ab-hero::after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.1);animation:ab-drift 9s ease-in-out infinite}
.ab-hero::before{width:220px;height:220px;top:-90px;left:-60px}
.ab-hero::after{width:160px;height:160px;bottom:-70px;right:-40px;animation-delay:-4s}
.ab-logo{position:relative;z-index:1;width:112px;height:112px;border-radius:50%;border:4px solid #fff;background:#fff;object-fit:contain;padding:5px;box-shadow:0 10px 24px rgba(0,0,0,.22);animation:ab-bob 4s ease-in-out infinite}
.ab-hero div{position:relative;z-index:1}
.ab-hero h1{font-size:clamp(1.9rem,6vw,3rem);line-height:1.1;letter-spacing:-.02em;color:#fff}
.ab-hero p{margin-top:10px;max-width:46ch;font-size:clamp(.98rem,2.6vw,1.1rem);line-height:1.55;color:rgba(255,255,255,.92)}
.ab-sec{margin-top:36px}
.ab-sec>h2{font-size:clamp(1.3rem,4vw,1.7rem);margin-bottom:6px;letter-spacing:-.01em}
.ab-lead{color:var(--mut);margin-bottom:18px;max-width:60ch;line-height:1.55}
.ab-two{display:grid;gap:14px}
.ab-box{background:#fff;border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:0 2px 10px rgba(20,40,35,.06)}
.ab-box h3{font-size:1.1rem;margin-bottom:6px}
.ab-box p{color:var(--mut);line-height:1.6;font-size:.95rem}
.ab-ic{display:grid;place-items:center;width:46px;height:46px;border-radius:14px;margin-bottom:12px;font-size:1.4rem;background:#e6f5ec;transition:transform .25s}
.ab-grid{display:grid;grid-template-columns:1fr;gap:14px}
.ab-feat{display:block;color:inherit;text-decoration:none;transition:transform .2s,box-shadow .2s,border-color .2s}
.ab-go{display:inline-block;margin-top:10px;font-size:.85rem;font-weight:700;color:var(--teal)}
.ab-steps{display:grid;gap:14px;counter-reset:s}
.ab-step{position:relative;padding-left:64px}
.ab-step::before{counter-increment:s;content:counter(s);position:absolute;left:18px;top:18px;width:34px;height:34px;display:grid;place-items:center;border-radius:50%;color:#fff;font-weight:800;background:linear-gradient(135deg,var(--green),var(--teal))}
.ab-team{display:flex;flex-wrap:wrap;gap:14px}
.ab-team .ab-box{display:flex;align-items:center;gap:14px;min-width:240px}
.ab-av{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-size:1.6rem;background:#e6f5ec;border:3px solid #fff;box-shadow:0 4px 10px rgba(20,40,35,.12)}
.ab-cta{margin-top:36px;text-align:center;padding:28px 18px;border-radius:22px;color:#fff;background:linear-gradient(120deg,#0f766e,#2f9e62)}
.ab-cta h2{color:#fff;font-size:clamp(1.3rem,4vw,1.7rem)}
.ab-cta p{margin:8px 0 18px;color:rgba(255,255,255,.9)}
.ab-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 26px;border-radius:12px;background:#fff;color:var(--teal);font-weight:800;text-decoration:none;box-shadow:0 8px 18px rgba(0,0,0,.18);transition:transform .15s}
.ab-btn:active{transform:scale(.97)}
.ab-btn:focus-visible,.ab-feat:focus-visible{outline:3px solid #8fd3b4;outline-offset:3px}
.ab-foot{margin-top:22px;text-align:center;color:var(--mut);font-size:.85rem}
.ab-rv{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1)}
.ab-rv.in{opacity:1;transform:none}
@media(min-width:640px){.ab-hero{padding:44px 32px}.ab-two{grid-template-columns:1fr 1fr}.ab-grid{grid-template-columns:1fr 1fr}.ab-steps{grid-template-columns:repeat(3,1fr)}.ab-step{padding:72px 20px 20px}.ab-step::before{left:20px;top:20px}}
@media(min-width:960px){.ab-grid{grid-template-columns:repeat(3,1fr)}}
@media(hover:hover){.ab-feat:hover{transform:translateY(-4px);box-shadow:0 12px 26px rgba(20,40,35,.13);border-color:var(--green)}.ab-feat:hover .ab-ic{transform:rotate(-8deg) scale(1.1)}}
@keyframes ab-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ab-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,14px)}}
@media(prefers-reduced-motion:reduce){.ab *,.ab-rv{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}}
`;

function About() {
  return (
    <div className="ab-page">
      <div className="ab">
        <style>{css}</style>

        <header className="ab-hero">
          <img
            className="ab-logo"
            src="/MyCommunity%20Logo.png"
            alt="MyCommunity"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div>
            <h1>MyCommunity</h1>
            <p>Everything about your society in one place: complaints, notices, events, polls and emergencies, for every resident.</p>
          </div>
        </header>

        <section className="ab-sec">
          <Reveal>
            <h2>What we do</h2>
            <p className="ab-lead">
              Society information usually ends up scattered across WhatsApp groups and paper notices. MyCommunity
              brings everything into one simple app, so every resident knows what is happening in the society.
            </p>
          </Reveal>
          <div className="ab-two">
            <Reveal>
              <div className="ab-box">
                <div className="ab-ic">🎯</div>
                <h3>Our mission</h3>
                <p>Keep communication between residents and the committee clear, fast and open to everyone.</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="ab-box">
                <div className="ab-ic">🤝</div>
                <h3>Our belief</h3>
                <p>A strong community is one where neighbours stand by each other when it matters.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="ab-sec">
          <Reveal>
            <h2>What you get</h2>
            <p className="ab-lead">{FEATURES.length} modules, all in one place.</p>
          </Reveal>
          <div className="ab-grid">
            {FEATURES.map((f, i) => {
              const body = (
                <>
                  <div className="ab-ic">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  {f.to && <span className="ab-go">Open →</span>}
                </>
              );
              return (
                <Reveal key={f.title} delay={(i % 3) * 90}>
                  {f.to ? (
                    <Link to={f.to} className="ab-box ab-feat">{body}</Link>
                  ) : (
                    <div className="ab-box">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="ab-sec">
          <Reveal><h2>How it works</h2></Reveal>
          <div className="ab-steps" style={{ marginTop: 14 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
                <div className="ab-box ab-step">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ab-sec">
          <Reveal><h2 style={{ marginBottom: 14 }}>Built by</h2></Reveal>
          <Reveal delay={80}>
            <div className="ab-team">
              {TEAM.map((m) => (
                <div key={m.name} className="ab-box">
                  <div className="ab-av">{m.emoji}</div>
                  <div>
                    <h3>{m.name}</h3>
                    <p>{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Reveal>
          <section className="ab-cta">
            <h2>Join your community</h2>
            <p>Have a need or a suggestion, or just want to see what is happening in your society?</p>
            <Link to="/" className="ab-btn">Go to Home</Link>
          </section>
        </Reveal>

        <p className="ab-foot">Made with 💚 for our community</p>
      </div>
    </div>
  );
}

export default About;
