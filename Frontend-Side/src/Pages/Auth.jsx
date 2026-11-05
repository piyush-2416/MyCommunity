import React, { useEffect, useRef, useState } from "react";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
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

/* Apne asli routes yahan daalo */
const LOGIN_PATH = "/login";
const SIGNUP_PATH = "/signup";

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
  {
    emoji: "🧭",
    title: "Explore",
    text: "Discover nearby places, services and activities around your community.",
  },
  {
    emoji: "🏆",
    title: "Community Achievements",
    text: "Celebrate the milestones and wins of our residents and volunteers.",
  },
  {
    emoji: "🏪",
    title: "Local Businesses",
    text: "Find and support trusted shops and service providers in your area.",
  },
  {
    emoji: "👵",
    title: "Elders Care",
    text: "Help and support for senior citizens, from daily needs to companionship.",
  },
  {
    emoji: "🌳",
    title: "Tree Plantation",
    text: "Join plantation drives and help keep our surroundings green.",
  },
  {
    emoji: "🐾",
    title: "Animal Safety",
    text: "Report injured or stray animals and support their care and safety.",
  },
  {
    emoji: "🔍",
    title: "Lost & Found",
    text: "Post or search for lost items and help return them to their owners.",
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

/* ---------- Sirf do button: Login aur Create Account ---------- */
function AuthButtons() {
  return (
    <div className="flex flex-col gap-4 bg-white/95 shadow-xl p-6 sm:p-8 rounded-3xl w-full lg:w-[360px] max-w-md">
      <a
        href={LOGIN_PATH}
        className="group flex justify-between items-center bg-emerald-700 hover:bg-emerald-800 shadow-md px-6 rounded-2xl h-16 font-bold text-white text-lg"
      >
        <span className="flex items-center gap-3">
          <span className="flex justify-center items-center bg-white/15 rounded-xl w-10 h-10">
            <LogIn size={20} />
          </span>
          Login
        </span>
        <ArrowRight size={20} className="opacity-80" />
      </a>

      <a
        href={SIGNUP_PATH}
        className="group flex justify-between items-center bg-white hover:bg-emerald-50 px-6 border-2 border-emerald-700 rounded-2xl h-16 font-bold text-emerald-700 text-lg"
      >
        <span className="flex items-center gap-3">
          <span className="flex justify-center items-center bg-emerald-100 rounded-xl w-10 h-10">
            <UserPlus size={20} />
          </span>
          Create Account
        </span>
        <ArrowRight size={20} className="opacity-80" />
      </a>
    </div>
  );
}

/* ---------- About section ---------- */
function AboutSection() {
  const total = aboutCards.length;

  return (
    <section id="about" className="bg-[#f4fbf7] py-12 sm:py-16 lg:py-20">
      <div className="items-start gap-8 lg:gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-left [display:grid]">
        {/* ---- Left: text (desktop pe sticky) ---- */}
        <div className="lg:top-24 lg:sticky">
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

         <Link to="/About"><a
              href="#features"
              className="inline-flex items-center gap-2 bg-[#3cb371] mt-6 px-6 rounded-full h-11 font-semibold text-white text-sm"
            >
              Learn More
              <ArrowRight size={16} />
            </a></Link>
          </Reveal>
        </div>

        {/* ---- Right: cards grid ---- */}
        <Reveal>
          <div className="gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 [display:grid]">
            {aboutCards.map((card, i) => {
              const isLast = i === total - 1;
              /* 2 col (sm/lg) mein odd count ho to last card full width */
              const spanSm = isLast && total % 2 === 1 ? "sm:col-span-2" : "";
              /* 3 col (xl) mein last row adhoori ho to last card bachi hui jagah le */
              const rem = total % 3;
              const spanXl =
                isLast && rem === 1
                  ? "xl:col-span-3"
                  : isLast && rem === 2
                  ? "xl:col-span-2"
                  : "xl:col-span-1";

              return (
                <article
                  key={card.title}
                  className={`flex items-start gap-3 bg-white p-4 border border-[#dcece4] border-l-[#3cb371] border-l-4 rounded-xl h-full ${spanSm} ${spanXl}`}
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
              );
            })}
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
      {/* ================= HERO + DO BUTTON ================= */}
      <section id="home" className="relative">
        {/* Mobile: poori image upar dikhti hai. Desktop: background ban jati hai. */}
        <img
          src={HERO_IMG}
          alt="Neighbours standing together in a green community"
          className="block lg:absolute lg:inset-0 w-full h-auto lg:h-full object-cover object-left"
        />

        <div className="relative flex justify-center lg:justify-end lg:items-center bg-emerald-50/60 lg:bg-transparent px-4 sm:px-6 lg:px-[4%] py-8 lg:py-10 lg:min-h-[clamp(32rem,41vw,40rem)]">
          <AuthButtons />
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
