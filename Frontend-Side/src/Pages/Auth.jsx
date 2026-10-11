import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  UserPlus,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------
   Images: public folder mein rakho
     public/hero-community.png       (hero background)
     public/together-community.png   (Active People banner)
     public/MyCommunity Logo.png     (tumhara purana logo)

   NOTE: is file mein Tailwind ki `grid` class ki jagah `[display:grid]`
   use hui hai, kyunki tumhari index.css mein ek global `.grid` rule hai
   jo Tailwind ke grid-cols ko override kar deta hai.
------------------------------------------------------------------- */
const HERO_IMG = "/hero-community.png";
const BANNER_IMG = "/together-community.png";
const LOGO_IMG = "/MyCommunity%20Logo.png";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

const footerServices = [
  "Events & Notices",
  "Raise Complaints",
  "Emergency Support",
  "Polls & Feedback",
  "Community Feed",
];

/* Emoji icons: tumhare Home page ke Quick Actions / Services jaise hi */
const aboutCards = [
  {
    emoji: "📅",
    title: "Events & Notices",
    text: "Stay updated with the latest events, notices and important updates.",
  },
  {
    emoji: "🚨",
    title: "Raise Complaints",
    text: "Report issues like maintenance, safety or other concerns.",
  },
  {
    emoji: "🆘",
    title: "Emergency Support",
    text: "Get help during emergencies with quick access.",
  },
  {
    emoji: "👥",
    title: "Members & Volunteers",
    text: "Be a part of a stronger and more active community.",
  },
  {
    emoji: "☑️",
    title: "Polls & Feedback",
    text: "Share your opinion and help in better decisions.",
  },
  {
    emoji: "📸",
    title: "Community Feed",
    text: "Explore, share memories, celebrate achievements and more.",
  },
];

const socials = [
  { label: "Instagram", short: "IG" },
  { label: "Facebook", short: "f" },
  { label: "X", short: "X" },
  { label: "YouTube", short: "▶" },
  { label: "LinkedIn", short: "in" },
];

/* ---------- Scroll pe ek baar halka fade-in (bas itna hi) ---------- */
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Chhota reusable input (icon ke saath) ---------- */
function Field({ icon: Icon, right, ...inputProps }) {
  return (
    <div className="flex items-center gap-3 bg-white px-3 border border-slate-200 focus-within:border-emerald-600 rounded-lg focus-within:ring-2 focus-within:ring-emerald-100 h-11">
      <Icon size={17} className="text-slate-500 shrink-0" />
      <input
        {...inputProps}
        className="flex-1 bg-transparent outline-none min-w-0 h-full text-slate-800 placeholder:text-slate-400 text-sm"
      />
      {right}
    </div>
  );
}

/* ---------- Login / Signup card ---------- */
function AuthCard() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPass, setShowPass] = useState(false);

  const [login, setLogin] = useState({ identifier: "", password: "", remember: false });
  const [signup, setSignup] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const onLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLogin((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const onSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignup((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // TODO (baad mein): yahan API call / validation lagani hai
  const handleLogin = (e) => {
    e.preventDefault();
  };
  const handleSignup = (e) => {
    e.preventDefault();
  };

  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShowPass((s) => !s)}
      aria-label={showPass ? "Hide password" : "Show password"}
      className="text-slate-500 shrink-0"
    >
      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );

  return (
    <div className="bg-white shadow-xl p-6 sm:p-7 rounded-2xl w-full lg:w-[380px] max-w-md text-left">
      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <h2 className="font-bold text-slate-900 text-xl">Welcome Back</h2>
            <p className="mt-1 text-slate-500 text-sm">
              Login to your account to continue
            </p>
          </div>

          <Field
            icon={Mail}
            type="text"
            name="identifier"
            value={login.identifier}
            onChange={onLoginChange}
            placeholder="Email or Username"
            autoComplete="username"
          />

          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="password"
            value={login.password}
            onChange={onLoginChange}
            placeholder="Password"
            autoComplete="current-password"
            right={eyeBtn}
          />

          <div className="flex justify-between items-center gap-2 text-sm">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={login.remember}
                onChange={onLoginChange}
                className="w-4 h-4 accent-emerald-700"
              />
              Remember me
            </label>
            <button type="button" className="font-medium text-emerald-700">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-emerald-700 rounded-full w-full h-11 font-semibold text-white text-sm"
          >
            Login
          </button>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex-1 bg-slate-200 h-px" />
            OR
            <span className="flex-1 bg-slate-200 h-px" />
          </div>

          <button
            type="button"
            onClick={() => setMode("signup")}
            className="flex justify-center items-center gap-2 border border-emerald-700 rounded-full w-full h-11 font-semibold text-emerald-700 text-sm"
          >
            <UserPlus size={17} />
            Create New Account
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-3.5">
          <div>
            <h2 className="font-bold text-slate-900 text-xl">Create Account</h2>
            <p className="mt-1 text-slate-500 text-sm">
              Join your community in a few steps
            </p>
          </div>

          <Field
            icon={User}
            type="text"
            name="fullName"
            value={signup.fullName}
            onChange={onSignupChange}
            placeholder="Full Name"
            autoComplete="name"
          />
          <Field
            icon={Mail}
            type="email"
            name="email"
            value={signup.email}
            onChange={onSignupChange}
            placeholder="Email"
            autoComplete="email"
          />
          <Field
            icon={Phone}
            type="tel"
            name="phone"
            value={signup.phone}
            onChange={onSignupChange}
            placeholder="Phone Number"
            autoComplete="tel"
          />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="password"
            value={signup.password}
            onChange={onSignupChange}
            placeholder="Password"
            autoComplete="new-password"
            right={eyeBtn}
          />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="confirmPassword"
            value={signup.confirmPassword}
            onChange={onSignupChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />

          <label className="flex items-start gap-2 text-slate-600 text-xs cursor-pointer">
            <input
              type="checkbox"
              name="agree"
              checked={signup.agree}
              onChange={onSignupChange}
              className="mt-0.5 w-4 h-4 accent-emerald-700 shrink-0"
            />
            I agree to the Terms &amp; Privacy Policy
          </label>

          <button
            type="submit"
            className="bg-emerald-700 rounded-full w-full h-11 font-semibold text-white text-sm"
          >
            Sign Up
          </button>

          <p className="pt-1 text-slate-500 text-xs text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-semibold text-emerald-700"
            >
              Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

/* ---------- About section ---------- */
function AboutSection() {
  return (
    <section id="about" className="bg-[#f4fbf7] py-12 sm:py-16 lg:py-20">
      <div className="items-start gap-8 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-left [display:grid]">
        {/* ---- Left: text ---- */}
        <Reveal>
          <p className="flex items-center gap-3 font-semibold text-[#2e8b57] text-sm">
            About MyCommunity
            <span className="bg-[#3cb371] rounded-full w-8 h-0.5" />
          </p>

          <h2 className="mt-3 font-extrabold text-[#1d2b24] text-[1.75rem] sm:text-4xl leading-tight">
            A Smarter Way to Build a{" "}
            <span className="text-[#3cb371]">Better Community</span>
          </h2>

          <p className="mt-4 max-w-xl text-[#5f6f68] text-sm sm:text-base leading-7">
            MyCommunity is a digital platform designed to connect residents,
            volunteers, and local authorities. We aim to make communication
            easier, solve everyday issues faster, and create a more active,
            safe and united community.
          </p>

          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-[#3cb371] mt-6 px-6 rounded-full h-11 font-semibold text-white text-sm"
          >
            Learn More
            <ArrowRight size={16} />
          </a>
        </Reveal>

        {/* ---- Right: cards (sab static, koi hover animation nahi) ---- */}
        <Reveal>
          <div className="gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 [display:grid]">
            {aboutCards.map((card) => (
              <article
                key={card.title}
                className="flex items-start gap-3 bg-white p-4 border border-[#dcece4] border-l-[#3cb371] border-l-4 rounded-xl"
              >
                <span className="flex justify-center items-center bg-[#eaf8f0] rounded-lg w-10 h-10 text-xl shrink-0">
                  {card.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0! font-bold text-[#26332c] text-[15px] leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-[#6d7a73] text-[13px] leading-5">
                    {card.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer id="contact" className="bg-[#0f3b2a] text-[#cfe8da] text-left">
      {/* top accent line */}
      <div className="bg-gradient-to-r from-[#2e8b57] via-[#3cb371] to-[#9bdcb8] h-1" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* CTA band */}
        <div className="flex sm:flex-row flex-col sm:items-center gap-4 sm:gap-6 bg-[#17503a] my-10 px-5 sm:px-7 py-6 rounded-2xl">
          <div className="flex-1">
            <p className="font-bold text-white text-lg sm:text-xl">
              Ready to be part of your community?
            </p>
            <p className="mt-1 text-[#a9d4bd] text-sm">
              Login or create your account to get started.
            </p>
          </div>
          <a
            href="#home"
            className="inline-flex justify-center items-center bg-white px-6 rounded-full h-11 font-semibold text-[#2e8b57] text-sm shrink-0"
          >
            Login / Sign Up
          </a>
        </div>

        {/* Columns */}
        <div className="gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] pb-10 [display:grid]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={LOGO_IMG}
                alt="MyCommunity logo"
                className="bg-white p-1 rounded-full w-12 h-12 object-contain shrink-0"
              />
              <div>
                <p className="font-bold text-white text-lg leading-tight">
                  my<span className="text-[#6fd39b]">community</span>
                </p>
                <p className="text-[#a9d4bd] text-xs">Stronger Community Better</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Connect with your neighbours, stay informed, raise concerns and
              build a safer, stronger community together.
            </p>
            <div className="flex gap-2.5 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#contact"
                  aria-label={s.label}
                  className="flex justify-center items-center bg-white/10 rounded-full w-9 h-9 font-bold text-white text-xs"
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">What You Get</h4>
            <ul className="space-y-2.5 text-sm">
              {footerServices.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="bg-[#3cb371] rounded-full w-1.5 h-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact: ye details apni asli details se badal dena */}
          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5">
                <span aria-hidden="true">📍</span>
                <span>Your Society Name, City, State</span>
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden="true">📞</span>
                <span>+91 00000 00000</span>
              </li>
              <li className="flex gap-2.5">
                <span aria-hidden="true">✉️</span>
                <span className="break-all">support@mycommunity.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-white/10 border-t">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl text-[#a9d4bd] text-xs text-center">
          <p>© 2026 MyCommunity. All rights reserved.</p>
          <p>Made with 💚 for our community</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function Auth() {
  return (
    <div className="bg-white w-full min-h-screen text-slate-800 text-left">
      {/* ================= HERO + AUTH CARD ================= */}
      <section id="home" className="relative">
        {/* Mobile: poori image upar dikhti hai. Desktop: background ban jati hai. */}
        <img
          src={HERO_IMG}
          alt="Neighbours standing together in a green community"
          className="block lg:absolute lg:inset-0 w-full h-auto lg:h-full object-cover object-left"
        />

        <div className="relative flex justify-center lg:justify-end lg:items-center bg-emerald-50/60 lg:bg-transparent px-4 sm:px-6 lg:px-[4%] py-8 lg:py-10 lg:min-h-[clamp(32rem,41vw,40rem)]">
          <AuthCard />
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <AboutSection />

      {/* ================= TOGETHER BANNER ================= */}
      <section id="features" className="py-10 sm:py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <img
            src={BANNER_IMG}
            alt="Active people, healthy community: volunteers working together"
            className="block shadow-sm rounded-2xl sm:rounded-3xl w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}
