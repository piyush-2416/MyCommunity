import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import Navbar from "./Navbar";

/* ---------- Quick Access cards ---------- */
const QUICK = [
  { icon: "🤖", tag: "AI", title: "Ai Safety-Planner", desc: "AI se apni community ka safety plan banao.", to: "/SafetyPlanner" },
  { icon: "👵", tag: "Care", title: "Elder Care", desc: "Care, respect & support for our elders.", to: "/Elders" },
  { icon: "🆘", tag: "SafetyCheck", title: "Ai Self-Safety", desc: "Ai Self safety Feature. Emergency safety Helper.", to: "/SafetyChecker" },
  { icon: "🌱", tag: "Environment", title: "Trees & Plants", desc: "Make our community greener together.", to: "/TreesPlats" },
  { icon: "🔎", tag: "Community", title: "Lost & Found", desc: "Help your neighbors find lost items.", to: "/Lost_Found-data" },
  { icon: "🐾", tag: "Animals", title: "Animal Safety", desc: "Report, rescue & protect animals.", to: "/AnimalsSafety" },
];

// In status wale complaints "hal ho chuke" gine jaate hain
const DONE = ["resolved", "closed", "done", "solved", "completed"];

const TONES = {
  emerald: { icon: "bg-emerald-50 text-emerald-700" },
  sky: { icon: "bg-sky-50 text-sky-700" },
  amber: { icon: "bg-amber-50 text-amber-700" },
  rose: { icon: "bg-rose-50 text-rose-700" },
  violet: { icon: "bg-violet-50 text-violet-700" },
  slate: { icon: "bg-slate-100 text-slate-700" },
};

/* ---------- Helpers ---------- */
const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const todayText = () =>
  new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

const timeText = (d) => {
  const dt = d ? new Date(d) : null;
  return dt && !Number.isNaN(dt.getTime())
    ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";
};

/* ---------- Chhote components ---------- */
function SectionTitle({ title, hint }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
      {hint && <p className="mt-1 text-gray-500 text-sm">{hint}</p>}
    </div>
  );
}

/* ----- Community panel ke components ----- */

// Panel ke andar ek hisse ka heading strip
function BandTitle({ children }) {
  return (
    <div className="bg-gray-50 px-6 py-3 border-gray-200 border-y font-semibold text-gray-500 text-xs uppercase tracking-wider">
      {children}
    </div>
  );
}

// Members wala ek column
function MemberCell({ icon, tone, label, value, sub, to }) {
  const t = TONES[tone];
  return (
    <Link to={to} className="flex flex-col gap-4 hover:bg-gray-50 p-6 transition-colors">
      <span className={`flex justify-center items-center rounded-lg w-10 h-10 text-lg ${t.icon}`}>
        {icon}
      </span>
      <div>
        <p className="font-extrabold text-gray-900 text-4xl leading-none">{value}</p>
        <p className="mt-3 font-semibold text-gray-800 text-sm">{label}</p>
        {sub && <p className="mt-1 text-gray-500 text-xs">{sub}</p>}
      </div>
    </Link>
  );
}

// Do hisse wali bar + legend
function SplitMeter({ aLabel, aValue, aClass, bLabel, bValue, bClass }) {
  const total = aValue + bValue;
  const aPct = total ? Math.round((aValue / total) * 100) : 0;
  return (
    <div>
      <div
        className="flex bg-gray-100 rounded-full h-2.5 overflow-hidden"
        role="img"
        aria-label={`${aLabel} ${aValue}, ${bLabel} ${bValue}`}
      >
        {total > 0 && (
          <>
            <div className={aClass} style={{ width: `${aPct}%` }} />
            <div className={bClass} style={{ width: `${100 - aPct}%` }} />
          </>
        )}
      </div>
      {total === 0 ? (
        <p className="mt-2 text-gray-400 text-xs">Abhi koi data nahi hai</p>
      ) : (
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 text-gray-600 text-xs">
          <span className="flex items-center gap-1.5">
            <span className={`rounded-full w-2 h-2 ${aClass}`} />
            <b className="text-gray-900">{aValue}</b> {aLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`rounded-full w-2 h-2 ${bClass}`} />
            <b className="text-gray-900">{bValue}</b> {bLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// Kaam & Madad ki ek row: left mein title, beech mein meter (children), right mein number
function WorkRow({ icon, tone, title, sub, value, to, children }) {
  const t = TONES[tone];
  return (
    <Link
      to={to}
      className="flex sm:flex-row flex-col sm:items-center gap-4 sm:gap-6 hover:bg-gray-50 px-6 py-5 transition-colors"
    >
      <div className="flex items-center gap-4 sm:w-56 shrink-0">
        <span className={`flex justify-center items-center rounded-lg w-11 h-11 text-xl shrink-0 ${t.icon}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          {sub && <p className="mt-0.5 text-gray-500 text-xs">{sub}</p>}
        </div>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center sm:gap-3 sm:w-20 sm:text-right shrink-0">
        <p className="flex-1 font-extrabold text-gray-900 text-3xl leading-none">{value}</p>
        <span className="hidden sm:block text-gray-400 text-sm">→</span>
      </div>
    </Link>
  );
}

// Society wala chhota tile (grid ke andar)
function MiniStat({ icon, label, value, to }) {
  return (
    <Link to={to} className="flex items-center gap-4 bg-white hover:bg-gray-50 p-5 transition-colors">
      <span className="text-2xl shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="font-extrabold text-gray-900 text-2xl leading-none">{value}</p>
        <p className="mt-1.5 text-gray-500 text-xs truncate">{label}</p>
      </div>
    </Link>
  );
}

function RecentList({ title, items, to, empty, badge }) {
  return (
    <div className="bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
      <div className="flex justify-between items-center gap-3 pb-3 border-gray-100 border-b">
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        <Link to={to} className="font-semibold text-emerald-700 text-sm hover:underline whitespace-nowrap">
          Sab dekho →
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-gray-400 text-sm text-center">{empty}</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {items.map((it) => (
            <li key={it.id} className="py-3 last:pb-0">
              <div className="flex justify-between items-start gap-3">
                <p className="font-medium text-gray-800 text-sm break-words line-clamp-2">{it.title}</p>
                <span className="text-gray-400 text-xs whitespace-nowrap">{fmtDate(it.at)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {it.sub && <span className="max-w-full text-gray-500 text-xs truncate">{it.sub}</span>}
                {badge === "status" && it.status && (
                  <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600 text-xs">{it.status}</span>
                )}
                {badge === "urgency" && it.tag && (
                  <span className="bg-rose-50 px-2.5 py-0.5 rounded-full text-rose-600 text-xs">{it.tag}</span>
                )}
                {badge === "rating" && it.rating !== null && (
                  <span className="bg-amber-50 px-2.5 py-0.5 rounded-full text-amber-700 text-xs">⭐ {it.rating}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// "Aaj ka Kaam" ki ek row
function TaskRow({ icon, title, desc, to, tone, done }) {
  const t = TONES[done ? "emerald" : tone];
  return (
    <Link
      to={to}
      className="flex items-start gap-3 hover:bg-gray-50 p-3 border border-gray-200 rounded-xl transition-colors"
    >
      <span className={`flex justify-center items-center rounded-lg w-10 h-10 text-lg shrink-0 ${t.icon}`}>
        {done ? "✅" : icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="mt-0.5 text-gray-500 text-xs">{desc}</p>
      </div>
      <span className="self-center text-gray-400 text-sm">→</span>
    </Link>
  );
}

function QuickCard({ icon, tag, title, desc, to }) {
  return (
    <Link
      to={to}
      className="group flex flex-col bg-white shadow-sm hover:shadow-lg p-5 border border-gray-200 rounded-2xl transition hover:-translate-y-0.5"
    >
      <div className="flex justify-between items-start">
        <span className="flex justify-center items-center bg-emerald-50 rounded-xl w-12 h-12 text-2xl">{icon}</span>
        <span className="bg-emerald-50 px-3 py-1 rounded-full font-semibold text-emerald-700 text-xs">{tag}</span>
      </div>
      <h3 className="mt-4 font-bold text-gray-900 text-base">{title}</h3>
      <p className="flex-1 mt-1 text-gray-500 text-sm">{desc}</p>
      <span className="mt-4 font-semibold text-emerald-700 text-sm group-hover:underline">Explore →</span>
    </Link>
  );
}

/* ---------- Main page ---------- */
export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dir, setDir] = useState(null); // volunteer ki Directory profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    client
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((e) => setError(e.response?.data?.message || "Dashboard load nahi ho paya"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    client
      .get("/volunteer/profile")
      .then((res) => setDir(res.data))
      .catch(() => setDir(null));
  }, [load]);

  // Complaints: hal ho chuke vs baaki
  const complaintsDone = stats
    ? DONE.reduce((sum, k) => sum + (stats.complaints.byStatus[k] || 0), 0)
    : 0;
  const complaintsPending = stats ? Math.max(stats.complaints.total - complaintsDone, 0) : 0;
  const resolutionRate =
    stats && stats.complaints.total > 0
      ? Math.round((complaintsDone / stats.complaints.total) * 100)
      : null;

  const profilePending = dir && !dir.isProfileComplete;
  const activeEmergency = stats?.emergency.active ?? 0;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 w-full min-h-screen text-left">
        <div className="space-y-8 mx-auto px-4 sm:px-6 py-8 w-full max-w-7xl">
          {/* ================= 1. HERO ================= */}
          <section className="bg-slate-900 shadow-sm p-6 sm:p-8 rounded-2xl text-white">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-5">
              <div className="min-w-0">
                <p className="font-medium text-emerald-300 text-sm">
                  🤝 Volunteer Dashboard · {todayText()}
                </p>
                <h1 className="mt-2 font-extrabold text-emerald-100 text-2xl sm:text-3xl break-words">
                  Namaste, {user?.name}!
                </h1>
                <p className="mt-2 max-w-xl text-slate-300 text-sm leading-relaxed">
                  Society ka poora haal ek nazar mein. Aapki madad se hamari community aur surakshit banti hai.
                </p>
              </div>
              <div className="sm:text-right shrink-0">
                <button
                  type="button"
                  onClick={load}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-60 px-5 py-2.5 border border-white/20 rounded-lg font-semibold text-sm"
                >
                  {loading ? "Load ho raha hai..." : "🔄 Refresh"}
                </button>
                {stats?.updatedAt && (
                  <p className="mt-2 text-slate-400 text-xs">Last updated: {timeText(stats.updatedAt)}</p>
                )}
              </div>
            </div>

            {stats && (
              <div className="gap-6 grid grid-cols-2 lg:grid-cols-4 mt-8 pt-6 border-white/10 border-t">
                <div>
                  <p className="font-extrabold text-rose-300 text-3xl">{stats.emergency.active}</p>
                  <p className="mt-1 text-slate-400 text-xs uppercase tracking-wide">Active Emergency</p>
                </div>
                <div>
                  <p className="font-extrabold text-amber-300 text-3xl">{complaintsPending}</p>
                  <p className="mt-1 text-slate-400 text-xs uppercase tracking-wide">Complaints baaki</p>
                </div>
                <div>
                  <p className="font-extrabold text-emerald-300 text-3xl">
                    {resolutionRate !== null ? `${resolutionRate}%` : "—"}
                  </p>
                  <p className="mt-1 text-slate-400 text-xs uppercase tracking-wide">Complaints hal hue</p>
                </div>
                <div>
                  <p className="font-extrabold text-sky-300 text-3xl">{stats.users.total}</p>
                  <p className="mt-1 text-slate-400 text-xs uppercase tracking-wide">Total Members</p>
                </div>
              </div>
            )}
          </section>

          {/* ================= 2. ALERTS ================= */}
          {activeEmergency > 0 && (
            <Link
              to="/Emergency"
              role="alert"
              className="flex flex-wrap justify-between items-center gap-3 bg-red-50 hover:bg-red-100 p-4 border border-red-200 rounded-xl text-red-800 text-sm transition-colors"
            >
              <span>
                🚨 <b>{activeEmergency}</b> active emergency {activeEmergency === 1 ? "hai" : "hain"}, turant dekho.
              </span>
              <b>Emergency page kholo →</b>
            </Link>
          )}

          {profilePending && (
            <Link
              to="/volunteer/profile"
              className="block bg-amber-50 hover:bg-amber-100 p-4 border border-amber-200 rounded-xl text-amber-800 text-sm transition-colors"
            >
              ⚠️ Aapki Directory profile adhuri hai, isliye aap Community Directory mein nahi dikh rahe.{" "}
              <b>Abhi poori karo →</b>
            </Link>
          )}

          {dir && dir.isProfileComplete && (
            <div className="flex flex-wrap justify-between items-center gap-3 bg-white shadow-sm p-4 border border-emerald-200 rounded-xl">
              <p className="text-gray-700 text-sm">
                ✅ Aap Community Directory mein dikh rahe ho
                <span className="ml-2 text-gray-500">
                  ({dir.role}, {dir.department}) · {dir.available ? "🟢 Available" : "🔴 Available nahi"}
                </span>
              </p>
              <Link to="/volunteer/profile" className="font-semibold text-emerald-700 text-sm hover:underline">
                Profile edit karo →
              </Link>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex flex-wrap justify-between items-center gap-3 bg-red-50 p-4 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              <span>⚠️ {error}</span>
              <button type="button" onClick={load} className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold text-white">
                Retry
              </button>
            </div>
          )}

          {/* ================= 3. LOADING ================= */}
          {loading && !stats && (
            <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Dashboard load ho raha hai">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-24" />
              ))}
            </div>
          )}

          {stats && (
            <>
              {/* ================= 4. COMMUNITY PANEL + AAJ KA KAAM ================= */}
              <section className="items-start gap-8 grid lg:grid-cols-3">
                {/* ----- Left: ek hi panel, 3 hisse ----- */}
                <div className="lg:col-span-2 bg-white shadow-sm border border-gray-200 rounded-2xl min-w-0 overflow-hidden">
                  <div className="px-6 py-5">
                    <h2 className="font-bold text-gray-900 text-lg">📊 Community ek nazar mein</h2>
                    <p className="mt-1 text-gray-500 text-sm">Kisi bhi row par click karke detail dekho</p>
                  </div>

                  {/* --- Members --- */}
                  <BandTitle>👥 Members</BandTitle>
                  <div className="grid sm:grid-cols-3 sm:divide-x divide-y sm:divide-y-0 divide-gray-200">
                    <MemberCell
                      icon="🏠" tone="emerald" to="/Directory"
                      label="Residents" value={stats.users.residents}
                      sub={`Total ${stats.users.total} members`}
                    />
                    <MemberCell
                      icon="🤝" tone="sky" to="/Directory"
                      label="Volunteers" value={stats.users.volunteers}
                      sub="Madad ke liye taiyar"
                    />
                    <MemberCell
                      icon="📇" tone="violet" to="/Directory"
                      label="Directory" value={stats.counts.directory}
                      sub="Listed members"
                    />
                  </div>

                  {/* --- Kaam & Madad --- */}
                  <BandTitle>🛟 Kaam &amp; Madad</BandTitle>
                  <div className="divide-y divide-gray-100">
                    <WorkRow
                      icon="📝" tone="amber" to="/Complaints"
                      title="Complaints" sub={`Total ${stats.complaints.total}`}
                      value={stats.complaints.total}
                    >
                      <SplitMeter
                        aLabel="baaki" aValue={complaintsPending} aClass="bg-amber-400"
                        bLabel="hal ho gaye" bValue={complaintsDone} bClass="bg-emerald-500"
                      />
                    </WorkRow>

                    <WorkRow
                      icon="🚨" tone="rose" to="/Emergency"
                      title="Emergency" sub="Active aur resolved"
                      value={stats.emergency.active}
                    >
                      <SplitMeter
                        aLabel="active" aValue={stats.emergency.active} aClass="bg-rose-500"
                        bLabel="resolved" bValue={stats.emergency.resolved} bClass="bg-emerald-500"
                      />
                    </WorkRow>

                    <WorkRow
                      icon="💬" tone="sky" to="/Feedback"
                      title="Feedback" sub="Residents ki raay"
                      value={stats.feedback.total}
                    >
                      <p className="text-gray-600 text-sm">
                        {stats.feedback.avgRating !== null ? (
                          <>
                            <span className="font-bold text-gray-900">⭐ {stats.feedback.avgRating}</span> average rating
                          </>
                        ) : (
                          <span className="text-gray-400">Abhi rating nahi</span>
                        )}
                      </p>
                    </WorkRow>
                  </div>

                  {/* --- Society --- */}
                  <BandTitle>🏘️ Society</BandTitle>
                  <div className="gap-px★ grid grid-cols-2 sm:grid-cols-3 bg-gray-200 border-gray-200 border-t">
                    <MiniStat icon="🏪" label="Businesses" value={stats.counts.business} to="/Business" />
                    <MiniStat icon="🎉" label="Events" value={stats.counts.events} to="/Events" />
                    <MiniStat icon="📢" label="Notices" value={stats.counts.notices} to="/Notice" />
                    <MiniStat icon="🗳️" label="Voting Polls" value={stats.counts.polls} to="/Society_Polls" />
                    <MiniStat icon="🔎" label="Lost & Found" value={stats.counts.lostFound} to="/Lost_Found-data" />
                    <MiniStat icon="📸" label="Memories" value={stats.counts.gallery} to="/Gallery" />
                  </div>
                </div>

                {/* ----- Right: Aaj ka Kaam ----- */}
                <aside className="lg:top-6 lg:sticky bg-white shadow-sm p-5 border border-gray-200 rounded-2xl min-w-0">
                  <SectionTitle title="🎯 Aaj ka Kaam" hint="Jahan aapki sabse zyada zarurat hai" />
                  <div className="space-y-3">
                    <TaskRow
                      icon="🚨" tone="rose" to="/Emergency"
                      done={stats.emergency.active === 0}
                      title={stats.emergency.active === 0 ? "Koi active emergency nahi" : `${stats.emergency.active} active emergency`}
                      desc={stats.emergency.active === 0 ? "Sab theek hai, bas nazar rakhein." : "Turant dekho aur madad karo."}
                    />
                    <TaskRow
                      icon="📝" tone="amber" to="/Complaints"
                      done={complaintsPending === 0}
                      title={complaintsPending === 0 ? "Saari complaints hal ho chuki hain" : `${complaintsPending} complaints baaki`}
                      desc={complaintsPending === 0 ? "Shabash! Kuch pending nahi." : "Inhe review karke hal karne mein madad karo."}
                    />
                    {profilePending && (
                      <TaskRow
                        icon="📇" tone="violet" to="/volunteer/profile"
                        title="Directory profile poori karo"
                        desc="Profile complete hone par aap Community Directory mein dikhoge."
                      />
                    )}
                    <TaskRow
                      icon="💬" tone="sky" to="/Feedback"
                      done={stats.feedback.total === 0}
                      title={stats.feedback.total === 0 ? "Abhi koi feedback nahi" : `${stats.feedback.total} feedback mile`}
                      desc={
                        stats.feedback.avgRating !== null
                          ? `Average rating ⭐ ${stats.feedback.avgRating}, padh ke improve karo.`
                          : "Residents ki raay yahan dikhegi."
                      }
                    />
                  </div>
                </aside>
              </section>

              {/* ================= 5. RECENT ACTIVITY ================= */}
              <section>
                <SectionTitle title="🕒 Haal hi ki activity" />
                <div className="gap-5 grid lg:grid-cols-3">
                  <RecentList
                    title="Latest Complaints" items={stats.recent.complaints}
                    to="/Complaints" empty="Koi complaint nahi" badge="status"
                  />
                  <RecentList
                    title="Active Emergencies" items={stats.recent.emergencies}
                    to="/Emergency" empty="Koi active emergency nahi 🎉" badge="urgency"
                  />
                  <RecentList
                    title="Latest Feedback" items={stats.recent.feedback}
                    to="/Feedback" empty="Abhi koi feedback nahi" badge="rating"
                  />
                </div>
              </section>
            </>
          )}

          {/* ================= 6. QUICK ACCESS (hamesha dikhta hai) ================= */}
          <section>
            <SectionTitle title="⚡ Quick Access" hint="Zyada use hone wale features" />
            <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
              {QUICK.map((c) => (
                <QuickCard key={c.title} {...c} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
