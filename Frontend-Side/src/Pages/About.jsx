import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
   use hui hai, kyunki index.css mein global `.grid` rule hai.

   NOTE 2: hero aur banner photos ke andar ka text image mein baked hai,
   isliye wo Hindi toggle se nahi badlega (baaki sab badlega).
------------------------------------------------------------------- */
const HERO_IMG = "/hero-community.png";
const BANNER_IMG = "/together-community.png";
const LOGO_IMG = "/MyCommunity%20Logo.png";

/* ==================================================================
   LANGUAGE (English / Hindi)
   Naya text chahiye to bas dono (en + hi) mein ek-ek key add karo.
================================================================== */
const T = {
  en: {
    tagline: "Stronger Community Better",
    heroAlt: "Neighbours standing together in a green community",
    bannerAlt: "Active people, healthy community: volunteers working together",
    langLabel: "Language",

    // Login / Signup card
    welcomeBack: "Welcome Back",
    loginSub: "Login to your account to continue",
    emailOrUser: "Email or Username",
    password: "Password",
    showPass: "Show password",
    hidePass: "Hide password",
    remember: "Remember me",
    forgot: "Forgot password?",
    login: "Login",
    or: "OR",
    createNew: "Create New Account",
    createAccount: "Create Account",
    signupSub: "Join your community in a few steps",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone Number",
    confirmPass: "Confirm Password",
    agree: "I agree to the Terms & Privacy Policy",
    signUp: "Sign Up",
    haveAccount: "Already have an account?",

    // About
    aboutLabel: "About MyCommunity",
    aboutPre: "A Smarter Way to Build a",
    aboutHl: "Better Community",
    aboutPost: "",
    aboutText:
      "MyCommunity is a digital platform designed to connect residents, volunteers, and local authorities. We aim to make communication easier, solve everyday issues faster, and create a more active, safe and united community.",
    learnMore: "Learn More",

    // Top members
    topLabel: "Top Contributors",
    topTitle: "Our Top Community Members & Volunteers",
    topSub: "The people who make our community better every day.",
    tabAll: "All",
    tabMember: "Members",
    tabVolunteer: "Volunteers",
    roleMember: "Member",
    roleVolunteer: "Volunteer",
    pts: "pts",
    sampleNote: "Sample data. Real members will appear here once connected.",

    // Footer
    ctaTitle: "Ready to be part of your community?",
    ctaSub: "Login or create your account to get started.",
    ctaBtn: "Login / Sign Up",
    footerDesc:
      "Connect with your neighbours, stay informed, raise concerns and build a safer, stronger community together.",
    quickLinks: "Quick Links",
    whatYouGet: "What You Get",
    contact: "Contact",
    address: "Your Society Name, City, State",
    rights: "© 2026 MyCommunity. All rights reserved.",
    madeWith: "Made with 💚 for our community",
    navHome: "Home",
    navAbout: "About",
    navFeatures: "Features",
    navContact: "Contact",
  },

  hi: {
    tagline: "मज़बूत कम्युनिटी, बेहतर कल",
    heroAlt: "हरी-भरी कम्युनिटी में साथ खड़े पड़ोसी",
    bannerAlt: "सक्रिय लोग, स्वस्थ कम्युनिटी: साथ काम करते स्वयंसेवक",
    langLabel: "भाषा",

    welcomeBack: "वापसी पर स्वागत है",
    loginSub: "जारी रखने के लिए अपने खाते में लॉगिन करें",
    emailOrUser: "ईमेल या यूज़रनेम",
    password: "पासवर्ड",
    showPass: "पासवर्ड दिखाएँ",
    hidePass: "पासवर्ड छिपाएँ",
    remember: "मुझे याद रखें",
    forgot: "पासवर्ड भूल गए?",
    login: "लॉगिन",
    or: "या",
    createNew: "नया खाता बनाएँ",
    createAccount: "खाता बनाएँ",
    signupSub: "कुछ ही कदमों में अपनी कम्युनिटी से जुड़ें",
    fullName: "पूरा नाम",
    email: "ईमेल",
    phone: "फ़ोन नंबर",
    confirmPass: "पासवर्ड की पुष्टि करें",
    agree: "मैं नियम और गोपनीयता नीति से सहमत हूँ",
    signUp: "साइन अप",
    haveAccount: "क्या आपका खाता पहले से है?",

    aboutLabel: "MyCommunity के बारे में",
    aboutPre: "एक",
    aboutHl: "बेहतर कम्युनिटी",
    aboutPost: "बनाने का स्मार्ट तरीका",
    aboutText:
      "MyCommunity एक डिजिटल प्लेटफ़ॉर्म है जो निवासियों, स्वयंसेवकों और स्थानीय प्रशासन को आपस में जोड़ता है। हमारा मकसद बातचीत आसान बनाना, रोज़मर्रा की समस्याएँ जल्दी सुलझाना और एक सक्रिय, सुरक्षित व एकजुट कम्युनिटी बनाना है।",
    learnMore: "और जानें",

    topLabel: "शीर्ष योगदानकर्ता",
    topTitle: "हमारे शीर्ष कम्युनिटी सदस्य और स्वयंसेवक",
    topSub: "वे लोग जो हर दिन हमारी कम्युनिटी को बेहतर बनाते हैं।",
    tabAll: "सभी",
    tabMember: "सदस्य",
    tabVolunteer: "स्वयंसेवक",
    roleMember: "सदस्य",
    roleVolunteer: "स्वयंसेवक",
    pts: "अंक",
    sampleNote: "नमूना डेटा। जुड़ने के बाद असली सदस्य यहाँ दिखेंगे।",

    ctaTitle: "अपनी कम्युनिटी का हिस्सा बनने के लिए तैयार हैं?",
    ctaSub: "शुरू करने के लिए लॉगिन करें या खाता बनाएँ।",
    ctaBtn: "लॉगिन / साइन अप",
    footerDesc:
      "अपने पड़ोसियों से जुड़ें, जानकारी पाते रहें, समस्याएँ उठाएँ और मिलकर एक सुरक्षित, मज़बूत कम्युनिटी बनाएँ।",
    quickLinks: "क्विक लिंक्स",
    whatYouGet: "आपको क्या मिलेगा",
    contact: "संपर्क",
    address: "आपकी सोसाइटी का नाम, शहर, राज्य",
    rights: "© 2026 MyCommunity. सर्वाधिकार सुरक्षित।",
    madeWith: "हमारी कम्युनिटी के लिए 💚 से बनाया गया",
    navHome: "होम",
    navAbout: "परिचय",
    navFeatures: "विशेषताएँ",
    navContact: "संपर्क",
  },
};

const LangCtx = createContext({ lang: "en", t: T.en, setLang: () => {}, pick: (o) => o?.en });

const useLang = () => useContext(LangCtx);

/* ==================================================================
   DATA
================================================================== */

/* Emoji icons: tumhare Home page ke Quick Actions / Services jaise hi */
const aboutCards = [
  {
    emoji: "📅",
    title: { en: "Events & Notices", hi: "इवेंट्स और नोटिस" },
    text: {
      en: "Stay updated with the latest events, notices and important updates.",
      hi: "ताज़ा इवेंट्स, नोटिस और ज़रूरी अपडेट्स से जुड़े रहें।",
    },
  },
  {
    emoji: "🚨",
    title: { en: "Raise Complaints", hi: "शिकायत दर्ज करें" },
    text: {
      en: "Report issues like maintenance, safety or other concerns.",
      hi: "मेंटेनेंस, सुरक्षा या दूसरी समस्याओं की रिपोर्ट करें।",
    },
  },
  {
    emoji: "🆘",
    title: { en: "Emergency Support", hi: "इमरजेंसी सहायता" },
    text: {
      en: "Get help during emergencies with quick access.",
      hi: "आपात स्थिति में तुरंत मदद पाएँ।",
    },
  },
  {
    emoji: "👥",
    title: { en: "Members & Volunteers", hi: "सदस्य और स्वयंसेवक" },
    text: {
      en: "Be a part of a stronger and more active community.",
      hi: "एक मज़बूत और सक्रिय कम्युनिटी का हिस्सा बनें।",
    },
  },
  {
    emoji: "☑️",
    title: { en: "Polls & Feedback", hi: "पोल और फीडबैक" },
    text: {
      en: "Share your opinion and help in better decisions.",
      hi: "अपनी राय दें और बेहतर फ़ैसलों में मदद करें।",
    },
  },
  {
    emoji: "📸",
    title: { en: "Community Feed", hi: "कम्युनिटी फ़ीड" },
    text: {
      en: "Explore, share memories, celebrate achievements and more.",
      hi: "यादें देखें और साझा करें, उपलब्धियाँ मनाएँ।",
    },
  },
];

/* SAMPLE DATA: baad mein backend (/api/Directory ya apna route) se laana hai.
   role: "member" | "volunteer"  |  points = contribution score */
const people = [
  {
    id: 1,
    name: { en: "Rahul Sharma", hi: "राहुल शर्मा" },
    flat: "A-101",
    role: "volunteer",
    points: 320,
    note: { en: "Led the Clean & Green Drive", hi: "क्लीन एंड ग्रीन ड्राइव का नेतृत्व किया" },
  },
  {
    id: 2,
    name: { en: "Anjali Singh", hi: "अंजलि सिंह" },
    flat: "B-302",
    role: "member",
    points: 290,
    note: { en: "Most active in polls and feedback", hi: "पोल और फीडबैक में सबसे सक्रिय" },
  },
  {
    id: 3,
    name: { en: "Amit Gupta", hi: "अमित गुप्ता" },
    flat: "B-105",
    role: "volunteer",
    points: 260,
    note: { en: "Organised the free health camp", hi: "फ्री हेल्थ कैंप का आयोजन किया" },
  },
  {
    id: 4,
    name: { en: "Priya Verma", hi: "प्रिया वर्मा" },
    flat: "C-204",
    role: "member",
    points: 235,
    note: { en: "Helped get street lights fixed", hi: "स्ट्रीट लाइट ठीक करवाने में मदद की" },
  },
  {
    id: 5,
    name: { en: "Sandeep Yadav", hi: "संदीप यादव" },
    flat: "A-403",
    role: "volunteer",
    points: 210,
    note: { en: "Blood donation drive coordinator", hi: "रक्तदान शिविर के समन्वयक" },
  },
  {
    id: 6,
    name: { en: "Neha Joshi", hi: "नेहा जोशी" },
    flat: "D-107",
    role: "member",
    points: 190,
    note: { en: "Guides and welcomes new residents", hi: "नए निवासियों का स्वागत और मार्गदर्शन" },
  },
  {
    id: 7,
    name: { en: "Mohit Kumar", hi: "मोहित कुमार" },
    flat: "B-210",
    role: "volunteer",
    points: 175,
    note: { en: "Weekend plantation volunteer", hi: "वीकेंड पौधारोपण स्वयंसेवक" },
  },
  {
    id: 8,
    name: { en: "Kavita Mishra", hi: "कविता मिश्रा" },
    flat: "C-309",
    role: "member",
    points: 160,
    note: { en: "Regular helper in elder care", hi: "बुज़ुर्गों की देखभाल में नियमित सहयोग" },
  },
];

const avatarColors = [
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
];

const medals = ["🥇", "🥈", "🥉"];

const socials = [
  { label: "Instagram", short: "IG" },
  { label: "Facebook", short: "f" },
  { label: "X", short: "X" },
  { label: "YouTube", short: "▶" },
  { label: "LinkedIn", short: "in" },
];

/* ==================================================================
   SMALL HELPERS
================================================================== */

/* Scroll pe ek baar halka fade-in */
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

/* Chhota reusable input (icon ke saath) */
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

/* EN | हिं toggle (hero ke top-right mein) */
function LangToggle() {
  const { lang, setLang, t } = useLang();
  const base = "px-3 h-8 rounded-full text-xs font-semibold";
  return (
    <div
      role="group"
      aria-label={t.langLabel}
      className="top-3 right-3 z-20 absolute flex items-center gap-0.5 bg-white/95 shadow-md p-1 rounded-full"
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
        className={`${base} ${lang === "en" ? "bg-[#3cb371] text-white" : "text-slate-600"}`}
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={lang === "hi"}
        onClick={() => setLang("hi")}
        className={`${base} ${lang === "hi" ? "bg-[#3cb371] text-white" : "text-slate-600"}`}
      >
        हिं
      </button>
    </div>
  );
}

/* ==================================================================
   LOGIN / SIGNUP CARD
================================================================== */
function AuthCard() {
  const { t } = useLang();
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
      aria-label={showPass ? t.hidePass : t.showPass}
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
            <h2 className="font-bold text-slate-900 text-xl">{t.welcomeBack}</h2>
            <p className="mt-1 text-slate-500 text-sm">{t.loginSub}</p>
          </div>

          <Field
            icon={Mail}
            type="text"
            name="identifier"
            value={login.identifier}
            onChange={onLoginChange}
            placeholder={t.emailOrUser}
            autoComplete="username"
          />

          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="password"
            value={login.password}
            onChange={onLoginChange}
            placeholder={t.password}
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
              {t.remember}
            </label>
            <button type="button" className="font-medium text-emerald-700">
              {t.forgot}
            </button>
          </div>

          <button
            type="submit"
            className="bg-emerald-700 rounded-full w-full h-11 font-semibold text-white text-sm"
          >
            {t.login}
          </button>

          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex-1 bg-slate-200 h-px" />
            {t.or}
            <span className="flex-1 bg-slate-200 h-px" />
          </div>

          <button
            type="button"
            onClick={() => setMode("signup")}
            className="flex justify-center items-center gap-2 border border-emerald-700 rounded-full w-full h-11 font-semibold text-emerald-700 text-sm"
          >
            <UserPlus size={17} />
            {t.createNew}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-3.5">
          <div>
            <h2 className="font-bold text-slate-900 text-xl">{t.createAccount}</h2>
            <p className="mt-1 text-slate-500 text-sm">{t.signupSub}</p>
          </div>

          <Field
            icon={User}
            type="text"
            name="fullName"
            value={signup.fullName}
            onChange={onSignupChange}
            placeholder={t.fullName}
            autoComplete="name"
          />
          <Field
            icon={Mail}
            type="email"
            name="email"
            value={signup.email}
            onChange={onSignupChange}
            placeholder={t.email}
            autoComplete="email"
          />
          <Field
            icon={Phone}
            type="tel"
            name="phone"
            value={signup.phone}
            onChange={onSignupChange}
            placeholder={t.phone}
            autoComplete="tel"
          />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="password"
            value={signup.password}
            onChange={onSignupChange}
            placeholder={t.password}
            autoComplete="new-password"
            right={eyeBtn}
          />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            name="confirmPassword"
            value={signup.confirmPassword}
            onChange={onSignupChange}
            placeholder={t.confirmPass}
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
            {t.agree}
          </label>

          <button
            type="submit"
            className="bg-emerald-700 rounded-full w-full h-11 font-semibold text-white text-sm"
          >
            {t.signUp}
          </button>

          <p className="pt-1 text-slate-500 text-xs text-center">
            {t.haveAccount}{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-semibold text-emerald-700"
            >
              {t.login}
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

/* ==================================================================
   ABOUT
================================================================== */
function AboutSection() {
  const { t, pick } = useLang();

  return (
    <section id="about" className="bg-[#f4fbf7] py-12 sm:py-16 lg:py-20">
      <div className="items-start gap-8 lg:gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-left [display:grid]">
        {/* Left: text */}
        <Reveal>
          <p className="flex items-center gap-3 font-semibold text-[#2e8b57] text-sm">
            {t.aboutLabel}
            <span className="bg-[#3cb371] rounded-full w-8 h-0.5" />
          </p>

          <h2 className="mt-3 font-extrabold text-[#1d2b24] text-[1.75rem] sm:text-4xl leading-tight">
            {t.aboutPre} <span className="text-[#3cb371]">{t.aboutHl}</span>
            {t.aboutPost && ` ${t.aboutPost}`}
          </h2>

          <p className="mt-4 max-w-xl text-[#5f6f68] text-sm sm:text-base leading-7">
            {t.aboutText}
          </p>

          <a
            href="#community"
            className="inline-flex items-center gap-2 bg-[#3cb371] mt-6 px-6 rounded-full h-11 font-semibold text-white text-sm"
          >
            {t.learnMore}
            <ArrowRight size={16} />
          </a>
        </Reveal>

        {/* Right: cards */}
        <Reveal>
          <div className="gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 [display:grid]">
            {aboutCards.map((card) => (
              <article
                key={card.title.en}
                className="flex items-start gap-3 bg-white p-4 border border-[#dcece4] border-l-[#3cb371] border-l-4 rounded-xl"
              >
                <span className="flex justify-center items-center bg-[#eaf8f0] rounded-lg w-10 h-10 text-xl shrink-0">
                  {card.emoji}
                </span>
                <div className="min-w-0">
                  <h3 className="m-0! font-bold text-[#26332c] text-[15px] leading-snug">
                    {pick(card.title)}
                  </h3>
                  <p className="mt-1 text-[#6d7a73] text-[13px] leading-5">
                    {pick(card.text)}
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

/* ==================================================================
   TOP COMMUNITY MEMBERS & VOLUNTEERS
================================================================== */
function TopPeopleSection() {
  const { t, pick } = useLang();
  const [filter, setFilter] = useState("all"); // "all" | "member" | "volunteer"

  const tabs = [
    { key: "all", label: t.tabAll },
    { key: "member", label: t.tabMember },
    { key: "volunteer", label: t.tabVolunteer },
  ];

  const list = people
    .filter((p) => filter === "all" || p.role === filter)
    .sort((a, b) => b.points - a.points)
    .slice(0, 8);

  return (
    <section id="community" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-left">
        {/* Heading + tabs */}
        <div className="flex lg:flex-row flex-col lg:justify-between lg:items-end gap-5">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 font-semibold text-[#2e8b57] text-sm">
              {t.topLabel}
              <span className="bg-[#3cb371] rounded-full w-8 h-0.5" />
            </p>
            <h2 className="mt-3 font-extrabold text-[#1d2b24] text-[1.6rem] sm:text-3xl leading-tight">
              {t.topTitle}
            </h2>
            <p className="mt-2 text-[#5f6f68] text-sm sm:text-base">{t.topSub}</p>
          </div>

          <div role="group" className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={filter === tab.key}
                onClick={() => setFilter(tab.key)}
                className={`h-9 rounded-full px-4 text-sm font-medium border ${
                  filter === tab.key
                    ? "border-[#3cb371] bg-[#3cb371] text-white"
                    : "border-[#dcece4] bg-white text-[#4b5b53]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <Reveal className="mt-8">
          <div className="gap-3 sm:gap-4 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 [display:grid]">
            {list.map((p, i) => {
              const name = pick(p.name);
              const isVol = p.role === "volunteer";
              return (
                <article
                  key={p.id}
                  className="flex flex-col bg-[#f8fcfa] p-4 border border-[#dcece4] rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                        avatarColors[(p.id - 1) % avatarColors.length]
                      }`}
                    >
                      {Array.from(name)[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="m-0! font-bold text-[#26332c] text-[15px] truncate leading-snug">
                        {name}
                      </h3>
                      <p className="text-[#8a968f] text-xs">{p.flat}</p>
                    </div>
                    {i < 3 && (
                      <span className="text-xl leading-none" aria-hidden="true">
                        {medals[i]}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[#5f6f68] text-[13px] leading-5 grow">
                    {pick(p.note)}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        isVol
                          ? "bg-[#eaf8f0] text-[#2e8b57]"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {isVol ? t.roleVolunteer : t.roleMember}
                    </span>
                    <span className="font-bold text-[#2e8b57] text-sm">
                      {p.points} <span className="font-medium text-[#8a968f] text-xs">{t.pts}</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-4 text-[#9aa5a0] text-xs">{t.sampleNote}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================================================================
   FOOTER
================================================================== */
function Footer() {
  const { t, pick } = useLang();

  const links = [
    { label: t.navHome, href: "#home" },
    { label: t.navAbout, href: "#about" },
    { label: t.navFeatures, href: "#features" },
    { label: t.navContact, href: "#contact" },
  ];
  // About ke 5 cards ke title hi services ban jate hain
  const services = [0, 1, 2, 4, 5].map((i) => pick(aboutCards[i].title));

  return (
    <footer id="contact" className="bg-[#0f3b2a] text-[#cfe8da] text-left">
      <div className="bg-gradient-to-r from-[#2e8b57] via-[#3cb371] to-[#9bdcb8] h-1" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* CTA band */}
        <div className="flex sm:flex-row flex-col sm:items-center gap-4 sm:gap-6 bg-[#17503a] my-10 px-5 sm:px-7 py-6 rounded-2xl">
          <div className="flex-1">
            <p className="font-bold text-white text-lg sm:text-xl">{t.ctaTitle}</p>
            <p className="mt-1 text-[#a9d4bd] text-sm">{t.ctaSub}</p>
          </div>
          <a
            href="#home"
            className="inline-flex justify-center items-center bg-white px-6 rounded-full h-11 font-semibold text-[#2e8b57] text-sm shrink-0"
          >
            {t.ctaBtn}
          </a>
        </div>

        {/* Columns */}
        <div className="gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] pb-10 [display:grid]">
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
                <p className="text-[#a9d4bd] text-xs">{t.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6">{t.footerDesc}</p>
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

          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">{t.quickLinks}</h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">{t.whatYouGet}</h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="bg-[#3cb371] rounded-full w-1.5 h-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact: ye details apni asli details se badal dena */}
          <div>
            <h4 className="mb-4 font-semibold text-white text-sm">{t.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5">
                <span aria-hidden="true">📍</span>
                <span>{t.address}</span>
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

      <div className="border-white/10 border-t">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-2 mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl text-[#a9d4bd] text-xs text-center">
          <p>{t.rights}</p>
          <p>{t.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}

/* ==================================================================
   PAGE
================================================================== */
export default function Auth() {
  // Language: choice localStorage mein yaad rehti hai
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("lang") === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: T[lang],
    pick: (obj) => obj?.[lang] ?? obj?.en,
  };

  return (
    <LangCtx.Provider value={value}>
      <div className="bg-white w-full min-h-screen text-slate-800 text-left">
        {/* ================= HERO + AUTH CARD ================= */}
        <section id="home" className="relative">
          <LangToggle />

          {/* Mobile: poori image upar. Desktop: background. */}
          <img
            src={HERO_IMG}
            alt={value.t.heroAlt}
            className="block lg:absolute lg:inset-0 w-full h-auto lg:h-full object-cover object-left"
          />

          <div className="relative flex justify-center lg:justify-end lg:items-center bg-emerald-50/60 lg:bg-transparent px-4 sm:px-6 lg:px-[4%] py-8 lg:py-10 lg:min-h-[clamp(32rem,41vw,40rem)]">
            <AuthCard />
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <AboutSection />

        {/* ================= TOP MEMBERS & VOLUNTEERS ================= */}
        <TopPeopleSection />

        {/* ================= TOGETHER BANNER ================= */}
        <section id="features" className="bg-[#f4fbf7] py-10 sm:py-14">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <img
              src={BANNER_IMG}
              alt={value.t.bannerAlt}
              className="block shadow-sm rounded-2xl sm:rounded-3xl w-full h-auto object-cover"
            />
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <Footer />
      </div>
    </LangCtx.Provider>
  );
}
