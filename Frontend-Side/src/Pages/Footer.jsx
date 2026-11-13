import React from "react";
import { Link } from "lucide-react";
import {
  Home,
  Link as LinkIcon,
  Users,
  Mail,
  ChevronRight,
  Heart,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = ["Home", "About Us", "Contact", "FAQs", "Help & Support"];
const usefulLinks = [
  "Terms of Use",
  "Privacy Policy",
  "Cookie Policy",
  "Community Guidelines",
  "Sitemap",
];
const communityLinks = [
  "Members",
  "Local Directory",
  "Events",
  "Schemes & Documents",
  "Gallery",
];

const socialIcons = [
  { Icon: FaFacebookF, label: "Facebook" },
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaYoutube, label: "YouTube" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaXTwitter, label: "X" },
];

function FooterColumn({ icon: Icon, title, links }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
        <h4 className="font-bold text-emerald-800 text-sm tracking-wide">
          {title}
        </h4>
      </div>
      <div className="bg-emerald-600 mb-4 rounded-full w-8 h-[3px]" />
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="flex items-center gap-1 text-gray-600 hover:text-emerald-700 text-sm transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------
   BACKGROUND THEME (sirf decoration, content ko touch nahi karta)
------------------------------------------------------------------- */
function FooterBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {/* soft color glows */}
      <div className="-top-24 -left-24 absolute bg-emerald-200/50 blur-3xl rounded-full w-96 h-96" />
      <div className="top-10 right-1/4 absolute bg-emerald-100 blur-3xl rounded-full w-80 h-80" />
      <div className="-right-20 bottom-10 absolute bg-emerald-200/40 blur-3xl rounded-full w-96 h-96" />

      {/* dotted pattern, upar se neeche fade hota hai */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      >
        <defs>
          <pattern id="fc-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#a7d9b6" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fc-dots)" />
      </svg>

      {/* sun glow (top right) */}
      <div className="top-6 right-10 absolute bg-emerald-100 shadow-[0_0_60px_20px_rgba(167,243,208,0.6)] rounded-full w-16 h-16" />

      {/* clouds */}
      <svg className="top-12 left-[38%] absolute w-24 h-10 text-white/80" viewBox="0 0 100 40" fill="currentColor">
        <ellipse cx="30" cy="25" rx="22" ry="12" />
        <ellipse cx="55" cy="18" rx="22" ry="14" />
        <ellipse cx="75" cy="27" rx="18" ry="10" />
      </svg>
      <svg className="top-24 right-[30%] absolute w-16 h-7 text-white/70" viewBox="0 0 100 40" fill="currentColor">
        <ellipse cx="30" cy="25" rx="22" ry="12" />
        <ellipse cx="55" cy="18" rx="22" ry="14" />
        <ellipse cx="75" cy="27" rx="18" ry="10" />
      </svg>

      {/* birds */}
      <svg className="top-10 right-24 absolute w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none">
        <path d="M2 12c2-3 4-3 6 0 2-3 4-3 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="top-24 right-14 absolute w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none">
        <path d="M2 12c2-3 4-3 6 0 2-3 4-3 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* neeche poori width ka community skyline */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        className="bottom-0 left-0 absolute w-full h-64 md:h-80"
      >
        {/* far hills */}
        <path
          d="M0,190 C180,130 360,210 600,170 C840,130 1080,200 1260,160 C1350,140 1400,150 1440,160 L1440,320 L0,320 Z"
          fill="#d9f0df"
          opacity="0.7"
        />
        {/* mid hills */}
        <path
          d="M0,240 C200,190 420,265 700,225 C980,185 1200,255 1440,210 L1440,320 L0,320 Z"
          fill="#c9e8cf"
          opacity="0.7"
        />

        {/* left side: halke trees (text ke peeche, isliye light) */}
        <g fill="#6fb37d" opacity="0.35">
          <circle cx="70" cy="250" r="26" />
          <circle cx="110" cy="262" r="18" />
          <circle cx="250" cy="258" r="22" />
          <circle cx="620" cy="245" r="20" />
          <circle cx="655" cy="255" r="15" />
        </g>

        {/* houses cluster 1 */}
        <g opacity="0.75">
          <rect x="760" y="195" width="50" height="60" fill="#e8f3ea" />
          <polygon points="755,195 785,168 815,195" fill="#a9d6b4" />
          <rect x="778" y="225" width="14" height="30" fill="#c9e8cf" />
          <rect x="820" y="215" width="42" height="40" fill="#e8f3ea" />
          <polygon points="815,215 841,192 867,215" fill="#a9d6b4" />
        </g>

        {/* apartment block */}
        <g opacity="0.7">
          <rect x="900" y="170" width="46" height="90" fill="#e8f3ea" />
          <rect x="946" y="190" width="38" height="70" fill="#d5ecda" />
          <g fill="#a9d6b4">
            <rect x="908" y="182" width="8" height="8" />
            <rect x="926" y="182" width="8" height="8" />
            <rect x="908" y="202" width="8" height="8" />
            <rect x="926" y="202" width="8" height="8" />
            <rect x="908" y="222" width="8" height="8" />
            <rect x="926" y="222" width="8" height="8" />
            <rect x="954" y="202" width="7" height="7" />
            <rect x="969" y="202" width="7" height="7" />
            <rect x="954" y="222" width="7" height="7" />
            <rect x="969" y="222" width="7" height="7" />
          </g>
        </g>

        {/* houses cluster 2 */}
        <g opacity="0.75">
          <rect x="1030" y="205" width="55" height="55" fill="#e8f3ea" />
          <polygon points="1024,205 1057,176 1091,205" fill="#a9d6b4" />
          <rect x="1050" y="235" width="14" height="25" fill="#c9e8cf" />
          <rect x="1100" y="225" width="44" height="35" fill="#e8f3ea" />
          <polygon points="1094,225 1122,203 1150,225" fill="#a9d6b4" />
        </g>

        {/* street lamps */}
        <g stroke="#7fb98a" strokeWidth="3" opacity="0.85">
          <line x1="720" y1="190" x2="720" y2="262" />
          <line x1="1180" y1="195" x2="1180" y2="265" />
          <line x1="1340" y1="200" x2="1340" y2="268" />
        </g>
        <g fill="#7fb98a" opacity="0.85">
          <circle cx="720" cy="188" r="6" />
          <circle cx="1180" cy="193" r="6" />
          <circle cx="1340" cy="198" r="6" />
        </g>

        {/* bench */}
        <g fill="#8fbf99" opacity="0.8">
          <rect x="1210" y="250" width="48" height="6" />
          <rect x="1215" y="256" width="3" height="12" />
          <rect x="1250" y="256" width="3" height="12" />
        </g>

        {/* right side trees (thode gehre) */}
        <g fill="#6fb37d">
          <circle cx="690" cy="238" r="24" opacity="0.7" />
          <circle cx="1000" cy="262" r="22" opacity="0.6" />
          <circle cx="1165" cy="238" r="26" opacity="0.8" />
          <circle cx="1195" cy="252" r="18" opacity="0.8" />
          <circle cx="1285" cy="242" r="28" opacity="0.8" />
          <circle cx="1325" cy="255" r="20" opacity="0.8" />
          <circle cx="1400" cy="240" r="24" opacity="0.8" />
        </g>
        <g stroke="#5fa06d" strokeWidth="4" opacity="0.8">
          <line x1="1165" y1="262" x2="1165" y2="275" />
          <line x1="1285" y1="268" x2="1285" y2="280" />
          <line x1="1400" y1="262" x2="1400" y2="278" />
        </g>

        {/* grass strip */}
        <path
          d="M0,285 C240,265 480,300 720,282 C960,264 1200,296 1440,278 L1440,320 L0,320 Z"
          fill="#b7e0c1"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative bg-emerald-50 w-full overflow-hidden">
      {/* top accent bar */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-200 to-emerald-50 w-full h-2" />

      {/* background theme */}
      <FooterBackground />

      <div className="relative mx-auto px-10 pt-12 pb-10 max-w-6xl">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* <div className="flex justify-center items-center bg-emerald-800 rounded-full w-14 h-14 shrink-0">
                {/* <Users className="w-6 h-6 text-white" strokeWidth={2} /> */}
               {/* </div> */}
                 <div className="drawer-content">
   <Link to="/" >  <label htmlFor="my-drawer-1" className="inline-block cursor-pointer">
        <img
          src="/MyCommunity%20Logo.png"
          alt="MyCommunity Logo"
          className="bg-white shadow-md p-1 border-4 border-white rounded-full w-10 md:w-20 h-7 md:h-16 object-contain transition-transform duration-200"
        />
      </label></Link>
    </div>
              <h3 className="font-extrabold text-xl leading-tight">
                <span className="text-slate-800">Stronger</span>
                <br />
                <span className="text-emerald-700">Community,</span>
                <br />
                <span className="text-emerald-700">Better Tomorrow</span>
              </h3>
            </div>
            <p className="mb-5 max-w-[240px] text-gray-600 text-sm leading-relaxed">
              Together we build a safer, healthier and happier community for
              everyone.
            </p>
            <div className="flex items-center gap-3">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex justify-center items-center bg-emerald-700 hover:bg-emerald-800 rounded-full w-8 h-8 transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn icon={Home} title="QUICK LINKS" links={quickLinks} />
          <FooterColumn icon={LinkIcon} title="USEFUL LINKS" links={usefulLinks} />
          <FooterColumn icon={Users} title="COMMUNITY" links={communityLinks} />

          {/* Newsletter column */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
              <h4 className="font-bold text-emerald-800 text-sm tracking-wide">
                Newsletter
              </h4>
            </div>
            <div className="bg-emerald-600 mb-4 rounded-full w-8 h-[3px]" />
            <p className="mb-4 text-gray-600 text-sm leading-relaxed">
              Stay updated with the latest news, events and community
              updates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-stretch bg-white shadow-sm rounded-md max-w-[260px] overflow-hidden"
            >
              <div className="flex items-center pr-2 pl-3 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 py-2 outline-none min-w-0 text-gray-700 text-sm placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 px-4 font-semibold text-white text-sm transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* wavy divider */}
      <svg
        className="block relative w-full text-emerald-50"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 C240,40 480,0 720,15 C960,30 1200,5 1440,20 L1440,40 L0,40 Z"
          fill="#065f46"
        />
      </svg>

      {/* bottom bar */}
      <div className="bg-emerald-800 text-emerald-100 text-sm">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-2 mx-auto px-10 py-4 max-w-6xl">
          <p>&copy; 2025 Stronger Community. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="hidden sm:inline-block bg-emerald-600 mr-2 w-px h-4" />
            Made with <Heart className="fill-current w-4 h-4 text-emerald-200" />{" "}
            for our community
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;