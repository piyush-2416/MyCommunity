import { useEffect, useMemo, useRef, useState } from "react";

// Aapke Server.js ka port 3000 hai
const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Backend (routes/Plans.js) ki lists se bilkul same
const COMMUNITY_TYPES = ["Housing society", "Mohalla / colony", "Gaon", "College campus", "Apartment tower", "Other"];
const RISKS = ["Baarish / baadh", "Aag", "Bhukamp", "Heatwave / loo", "Cold wave", "Bijli / paani outage", "Medical emergency", "Gas leak", "Chori / security", "Building / structure damage"];
const VULNERABLE = ["Bujurg", "Chhote bachche", "Divyang", "Garbhwati mahilayein", "Lambi bimari wale"];
const RESOURCES = ["Generator", "First-aid kit", "Fire extinguisher", "CCTV", "Security guard", "WhatsApp group", "Community hall", "Paani ki tanki", "Ambulance access"];

const EMERGENCY = [
  { n: "112", l: "Sabhi emergency" },
  { n: "100", l: "Police" },
  { n: "101", l: "Fire" },
  { n: "108", l: "Ambulance" },
];

const LEVEL = {
  low: { label: "Kam", cls: "bg-emerald-100 text-emerald-800" },
  medium: { label: "Madhyam", cls: "bg-amber-100 text-amber-800" },
  high: { label: "Zyada", cls: "bg-rose-100 text-rose-800" },
};

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100";
const cardCls = "rounded-3xl bg-white p-6 shadow-md shadow-teal-900/5 ring-1 ring-slate-100";

async function api(path, opts = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, { headers: { "Content-Type": "application/json" }, ...opts });
  } catch {
    throw new Error("Backend se connect nahi ho paya. Server (port 3000) chal raha hai?");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Server error");
  return data;
}

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* Chhota helper: chips (single ya multi select) */
function Chips({ label, options, value, onChange, single = false }) {
  const toggle = (o) => {
    if (single) return onChange(o);
    onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  };
  const isOn = (o) => (single ? value === o : value.includes(o));
  return (
    <div>
      <p className="font-semibold text-slate-700 text-sm">{label}</p>
      <div className="flex flex-wrap gap-2 mt-2" role={single ? "radiogroup" : "group"} aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role={single ? "radio" : undefined}
            aria-checked={single ? isOn(o) : undefined}
            aria-pressed={single ? undefined : isOn(o)}
            onClick={() => toggle(o)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              isOn(o)
                ? "border-transparent bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/30"
                : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SafetyPlanner() {
  // form
  const [name, setName] = useState("");
  const [kind, setKind] = useState("Housing society");
  const [households, setHouseholds] = useState("");
  const [location, setLocation] = useState("");
  const [risks, setRisks] = useState([]);
  const [vulnerable, setVulnerable] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState("");
  // data
  const [doc, setDoc] = useState(null); // poora saved plan document
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const plan = doc?.plan;
  const done = doc?.done ?? [];

  const loadSaved = async () => {
    try {
      setSaved(await api("/plans"));
    } catch {
      /* list na aaye to bhi page chale */
    }
  };
  useEffect(() => {
    loadSaved();
  }, []);

  const scrollToResult = () =>
    setTimeout(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 50);

  const generate = async () => {
    setError("");
    if (!name.trim()) return setError("Community ka naam likho.");
    if (!Number(households) || Number(households) < 1) return setError("Gharon ki sankhya likho.");
    if (risks.length === 0) return setError("Kam se kam ek risk chuno.");

    setLoading(true);
    setDoc(null);
    try {
      // Backend route: POST /api/plans/generate
      const created = await api("/plans/generate", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          kind,
          households: Number(households),
          location: location.trim(),
          risks,
          vulnerable,
          resources,
          notes: notes.trim(),
        }),
      });
      setDoc(created);
      loadSaved();
      scrollToResult();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openPlan = async (id) => {
    setError("");
    try {
      setDoc(await api(`/plans/${id}`));
      scrollToResult();
    } catch (err) {
      setError(err.message);
    }
  };

  const removePlan = async (id) => {
    if (!window.confirm("Ye plan delete kar dein?")) return;
    try {
      await api(`/plans/${id}`, { method: "DELETE" });
      if (doc?._id === id) setDoc(null);
      loadSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  // Checklist tick: turant dikhao, phir server par save
  const toggleItem = async (itemId) => {
    const old = done;
    const next = old.includes(itemId) ? old.filter((x) => x !== itemId) : [...old, itemId];
    setDoc((d) => ({ ...d, done: next }));
    try {
      await api(`/plans/${doc._id}/progress`, { method: "PATCH", body: JSON.stringify({ done: next }) });
    } catch {
      setDoc((d) => ({ ...d, done: old }));
      setError("Progress save nahi ho paya.");
    }
  };

  const totalItems = useMemo(
    () => (plan ? (plan.checklist ?? []).reduce((n, c) => n + c.items.length, 0) : 0),
    [plan]
  );
  const pct = totalItems ? Math.round((done.length / totalItems) * 100) : 0;

  return (
    <div className="bg-slate-50 min-h-screen text-left">
      {/* ================= HERO ================= */}
      <header className="print:hidden relative bg-gradient-to-br from-teal-900 via-emerald-800 to-sky-700 px-5 pt-12 sm:pt-16 pb-32 overflow-hidden">
        <div className="-top-24 -right-20 absolute bg-amber-300/25 blur-3xl rounded-full w-80 h-80 pointer-events-none" />
        <div className="-bottom-32 left-1/4 absolute bg-sky-400/25 blur-3xl rounded-full w-72 h-72 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 border border-white/25 rounded-full font-medium text-white text-sm">
            <span className="bg-emerald-300 rounded-full w-2 h-2 motion-safe:animate-pulse" />
            AI Powered · Hinglish mein plan
          </span>
          <h1 className="mt-4 font-extrabold text-white text-4xl sm:text-5xl tracking-tight">
            Community Safety{" "}
            <span className="bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-200 to-sky-200 text-transparent">Planner</span>
          </h1>
          <p className="mt-3 max-w-xl text-teal-50/90 text-lg">
            Apni community ke risks batao, AI poora preparedness plan banayega: checklist, roles, evacuation aur drills.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="font-medium text-teal-100 text-sm">Emergency mein turant call:</span>
            {EMERGENCY.map((e) => (
              <a
                key={e.n}
                href={`tel:${e.n}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-1.5 border border-white/25 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 text-white text-sm transition"
              >
                <b>{e.n}</b> · {e.l}
              </a>
            ))}
          </div>
        </div>
      </header>

      <main className="relative mx-auto -mt-20 print:mt-0 px-5 pb-20 print:max-w-none max-w-4xl">
        {/* ================= FORM ================= */}
        <div className="print:hidden space-y-6 bg-white shadow-2xl shadow-teal-900/10 p-5 sm:p-8 rounded-3xl ring-1 ring-slate-100">
          <div className="gap-5 grid sm:grid-cols-2">
            <label className="flex flex-col gap-2 font-semibold text-slate-700 text-sm">
              Community ka naam
              <input className={fieldCls} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Jaise: Shanti Nagar Society" />
            </label>
            <label className="flex flex-col gap-2 font-semibold text-slate-700 text-sm">
              Kitne ghar / parivaar?
              <input className={fieldCls} type="number" min="1" inputMode="numeric" value={households} onChange={(e) => setHouseholds(e.target.value)} placeholder="Jaise: 120" />
            </label>
            <label className="flex flex-col gap-2 sm:col-span-2 font-semibold text-slate-700 text-sm">
              Jagah (optional)
              <input className={fieldCls} value={location} maxLength={100} onChange={(e) => setLocation(e.target.value)} placeholder="Jaise: Ghaziabad, Uttar Pradesh" />
            </label>
          </div>

          <Chips label="Community ka type" options={COMMUNITY_TYPES} value={kind} onChange={setKind} single />
          <Chips label="Kin risks ki taiyari chahiye? (ek ya zyada chuno)" options={RISKS} value={risks} onChange={setRisks} />
          <Chips label="Community mein kaun-kaun hai? (optional)" options={VULNERABLE} value={vulnerable} onChange={setVulnerable} />
          <Chips label="Abhi aapke paas kya hai? (optional)" options={RESOURCES} value={resources} onChange={setResources} />

          <label className="flex flex-col gap-2 font-semibold text-slate-700 text-sm">
            Koi aur baat? (optional)
            <textarea className={`${fieldCls} resize-none`} rows={3} maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jaise: nadi paas hai, pichhli baarish mein ground floor mein paani bhar gaya tha..." />
            <small className="self-end font-normal text-slate-400 text-xs">{notes.length}/300</small>
          </label>

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            aria-busy={loading}
            className="flex justify-center items-center gap-2 bg-gradient-to-r from-teal-600 hover:from-teal-700 to-emerald-600 hover:to-emerald-700 disabled:opacity-70 shadow-lg shadow-teal-600/30 hover:shadow-xl py-3.5 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200 w-full font-semibold text-white transition disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Plan ban raha hai...
              </>
            ) : (
              <>Safety plan banao <span aria-hidden="true">→</span></>
            )}
          </button>
        </div>

        {error && (
          <div role="alert" className="print:hidden bg-rose-50 mt-6 px-5 py-4 border border-rose-200 rounded-2xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="print:hidden space-y-4 mt-8" aria-hidden="true">
            {[0, 1].map((n) => (
              <div key={n} className="bg-white p-6 rounded-3xl ring-1 ring-slate-100">
                <div className="bg-slate-200 rounded-full w-1/3 h-5 motion-safe:animate-pulse" />
                <div className="bg-slate-100 mt-4 rounded-full w-full h-3 motion-safe:animate-pulse" />
                <div className="bg-slate-100 mt-2 rounded-full w-4/5 h-3 motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* ================= RESULT ================= */}
        {doc && plan && (
          <div ref={resultRef} className="space-y-5 mt-8 scroll-mt-6" aria-live="polite">
            {doc.fallback && (
              <div className="bg-amber-50 px-5 py-4 border border-amber-200 rounded-2xl text-amber-800 text-sm">
                AI abhi available nahi hai, isliye ye general plan hai. Thodi der baad naya plan banake dekho.
              </div>
            )}

            {/* Overview */}
            <section className={cardCls}>
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-2xl">{doc.community.name}</h2>
                  <p className="text-slate-500 text-sm">
                    {doc.community.kind} · {doc.community.households} ghar
                    {doc.community.location && ` · ${doc.community.location}`} · {fmtDate(doc.createdAt)}
                  </p>
                </div>
                <div className="print:hidden flex gap-2">
                  <button type="button" onClick={() => window.print()} className="hover:bg-slate-50 px-4 py-1.5 border border-slate-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 text-sm transition">
                    Print karo
                  </button>
                  <button type="button" onClick={() => { setDoc(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:bg-slate-50 px-4 py-1.5 border border-slate-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-slate-700 text-sm transition">
                    Naya plan
                  </button>
                </div>
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">{plan.overview}</p>
            </section>

            {/* Risks */}
            {(plan.risks ?? []).length > 0 && (
              <section className={cardCls}>
                <h3 className="font-bold text-slate-900 text-xl">Risk assessment</h3>
                <div className="gap-4 grid md:grid-cols-2 mt-4">
                  {plan.risks.map((r) => (
                    <div key={r.name} className="p-4 border border-slate-200 rounded-2xl">
                      <div className="flex justify-between items-center gap-2">
                        <b className="text-slate-900">{r.name}</b>
                        <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${(LEVEL[r.level] ?? LEVEL.medium).cls}`}>
                          {(LEVEL[r.level] ?? LEVEL.medium).label}
                        </span>
                      </div>
                      {r.why && <p className="mt-2 text-slate-600 text-sm">{r.why}</p>}
                      {(r.prepare ?? []).length > 0 && (
                        <ul className="space-y-1 mt-2 pl-5 text-slate-700 text-sm list-disc">
                          {r.prepare.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Checklist */}
            {(plan.checklist ?? []).length > 0 && (
              <section className={cardCls}>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-xl">Taiyari checklist</h3>
                  <span className="bg-teal-100 px-3.5 py-1 rounded-full font-semibold text-teal-800 text-xs">
                    {done.length}/{totalItems} ho gaye
                  </span>
                </div>
                <div className="bg-slate-100 mt-4 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 rounded-full h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>

                <div className="gap-6 grid md:grid-cols-2 mt-4">
                  {plan.checklist.map((c) => (
                    <div key={c.category}>
                      <h4 className="font-semibold text-teal-800">{c.category}</h4>
                      <ul className="mt-1 divide-y divide-slate-100">
                        {c.items.map((it) => {
                          const on = done.includes(it.id);
                          return (
                            <li key={it.id}>
                              <label className="flex items-start gap-3 py-2.5 cursor-pointer">
                                <input type="checkbox" checked={on} onChange={() => toggleItem(it.id)} className="mt-1 w-5 h-5 accent-teal-600 cursor-pointer shrink-0" />
                                <span className={`text-sm transition ${on ? "text-slate-400 line-through" : "text-slate-700"}`}>{it.text}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Roles */}
            {(plan.roles ?? []).length > 0 && (
              <section className={cardCls}>
                <h3 className="font-bold text-slate-900 text-xl">Kaun kya karega</h3>
                <div className="mt-3 divide-y divide-slate-100">
                  {plan.roles.map((r) => (
                    <div key={r.role} className="gap-1 sm:gap-4 grid sm:grid-cols-[200px_1fr] py-3">
                      <b className="text-slate-900">{r.role}</b>
                      <span className="text-slate-600 text-sm">{r.responsibility}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Communication + Evacuation */}
            <div className="gap-5 grid md:grid-cols-2">
              {plan.communicationPlan && (
                <section className="bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-700 print:bg-none shadow-lg shadow-teal-900/20 p-6 rounded-3xl print:ring-1 print:ring-slate-300 text-white print:text-slate-900">
                  <h3 className="font-bold text-lg">Alert aur communication</h3>
                  <p className="mt-2 text-teal-50 print:text-slate-700 leading-relaxed">{plan.communicationPlan}</p>
                </section>
              )}
              {(plan.evacuation?.assemblyPoint || (plan.evacuation?.steps ?? []).length > 0) && (
                <section className={cardCls}>
                  <h3 className="font-bold text-slate-900 text-lg">Evacuation plan</h3>
                  {plan.evacuation.assemblyPoint && (
                    <p className="bg-emerald-50 mt-2 px-3 py-2 rounded-xl text-emerald-900 text-sm">
                      <b>Assembly point:</b> {plan.evacuation.assemblyPoint}
                    </p>
                  )}
                  <ol className="space-y-1.5 mt-3 pl-5 text-slate-700 text-sm list-decimal">
                    {(plan.evacuation.steps ?? []).map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </section>
              )}
            </div>

            {/* Drills */}
            {(plan.drills ?? []).length > 0 && (
              <section className={cardCls}>
                <h3 className="font-bold text-slate-900 text-xl">Mock drills</h3>
                <div className="gap-4 grid md:grid-cols-2 mt-3">
                  {plan.drills.map((d) => (
                    <div key={d.name} className="p-4 border border-slate-200 rounded-2xl">
                      <div className="flex justify-between items-center gap-2">
                        <b className="text-slate-900">{d.name}</b>
                        {d.frequency && <span className="bg-sky-100 px-3 py-0.5 rounded-full font-semibold text-sky-800 text-xs">{d.frequency}</span>}
                      </div>
                      {d.how && <p className="mt-2 text-slate-600 text-sm">{d.how}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Vulnerable + contacts */}
            {((plan.vulnerableSupport ?? []).length > 0 || (plan.contactsToCollect ?? []).length > 0) && (
              <div className="gap-5 grid md:grid-cols-2">
                {(plan.vulnerableSupport ?? []).length > 0 && (
                  <section className="bg-amber-50 p-6 border border-amber-200 rounded-3xl">
                    <h3 className="font-bold text-amber-900 text-lg">Khaas madad chahiye unko</h3>
                    <ul className="space-y-1.5 mt-2 pl-5 text-amber-900/90 text-sm list-disc">
                      {plan.vulnerableSupport.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}
                {(plan.contactsToCollect ?? []).length > 0 && (
                  <section className={cardCls}>
                    <h3 className="font-bold text-slate-900 text-lg">Ye contacts jama karo</h3>
                    <ul className="space-y-1.5 mt-2 pl-5 text-slate-700 text-sm list-disc">
                      {plan.contactsToCollect.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </section>
                )}
              </div>
            )}

            <p className="text-slate-400 text-sm">
              Ye AI ke sujhav hain, professional safety advice nahi. Kisi bhi emergency mein 112 / 108 / 101 par call karo, aur apne local disaster management office se plan confirm karo.
            </p>
          </div>
        )}

        {/* ================= SAVED PLANS ================= */}
        {saved.length > 0 && (
          <section className="print:hidden mt-12">
            <h2 className="font-bold text-slate-900 text-xl">Aapke saved plans</h2>
            <div className="gap-4 grid sm:grid-cols-2 mt-4">
              {saved.map((s) => (
                <div key={s._id} className={`rounded-2xl border bg-white p-4 shadow-sm ${doc?._id === s._id ? "border-teal-400 ring-2 ring-teal-100" : "border-slate-200"}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <b className="block text-slate-900 truncate">{s.community.name}</b>
                      <p className="text-slate-500 text-xs">{s.community.kind} · {fmtDate(s.createdAt)}</p>
                    </div>
                    {s.fallback && <span className="bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold text-amber-800 text-xs shrink-0">General</span>}
                  </div>
                  <p className="mt-2 text-slate-500 text-xs truncate">{(s.risks ?? []).join(" · ")}</p>
                  <div className="flex gap-2 mt-3">
                    <button type="button" onClick={() => openPlan(s._id)} className="bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 font-semibold text-white text-sm transition">
                      Kholo
                    </button>
                    <button type="button" onClick={() => removePlan(s._id)} className="px-4 py-1.5 border border-slate-200 hover:border-rose-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 font-semibold text-slate-600 hover:text-rose-700 text-sm transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
