import React from "react";
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

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-emerald-50 via-emerald-50 to-emerald-50 w-full overflow-hidden">
      {/* top accent bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-200 to-emerald-50 w-full h-2" />

      {/* decorative background trees/park illustration on the right */}
      <div className="right-0 bottom-0 absolute opacity-90 w-1/2 h-full pointer-events-none">
        <svg
          viewBox="0 0 600 300"
          className="right-0 bottom-0 absolute w-full h-full"
          preserveAspectRatio="xMaxYMax slice"
        >
          {/* rolling hill */}
          <path
            d="M0,220 C150,160 350,260 600,180 L600,300 L0,300 Z"
            fill="#c9e8cf"
            opacity="0.6"
          />
          {/* houses */}
          <rect x="470" y="150" width="55" height="55" fill="#e8f3ea" opacity="0.7" />
          <polygon points="470,150 497,125 525,150" fill="#a9d6b4" opacity="0.7" />
          <rect x="530" y="170" width="45" height="40" fill="#e8f3ea" opacity="0.6" />
          <polygon points="530,170 552,150 575,170" fill="#a9d6b4" opacity="0.6" />
          {/* street lamp */}
          <line x1="430" y1="150" x2="430" y2="230" stroke="#7fb98a" strokeWidth="3" />
          <circle cx="430" cy="148" r="6" fill="#7fb98a" />
          {/* bench */}
          <rect x="440" y="225" width="45" height="6" fill="#8fbf99" />
          <line x1="445" y1="231" x2="445" y2="245" stroke="#8fbf99" strokeWidth="3" />
          <line x1="480" y1="231" x2="480" y2="245" stroke="#8fbf99" strokeWidth="3" />
          {/* trees */}
          <g fill="#6fb37d">
            <circle cx="380" cy="200" r="28" />
            <circle cx="405" cy="215" r="20" />
            <circle cx="555" cy="230" r="22" />
            <circle cx="90" cy="240" r="18" opacity="0.5" />
            <circle cx="50" cy="255" r="24" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* flying birds */}
      <svg className="top-10 right-24 absolute w-10 h-10 text-emerald-300" viewBox="0 0 24 24" fill="none">
        <path d="M2 12c2-3 4-3 6 0 2-3 4-3 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="top-24 right-14 absolute w-7 h-7 text-emerald-300" viewBox="0 0 24 24" fill="none">
        <path d="M2 12c2-3 4-3 6 0 2-3 4-3 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div className="relative mx-auto px-10 pt-12 pb-10 max-w-6xl">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex justify-center items-center bg-emerald-800 rounded-full w-14 h-14 shrink-0">
                <Users className="w-6 h-6 text-white" strokeWidth={2} />
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
