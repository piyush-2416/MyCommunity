import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config(); // import order ki wajah se yahan bhi zaroori hai

// Model ka naam badalta rehta hai: .env mein GEMINI_MODEL rakho
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// Sirf ye numbers kisi bhi jawab mein allowed hain (Gemini khud se number nahi bana sakta)
const NUMBERS = {
  "112": "Sabhi emergency",
  "100": "Police",
  "101": "Fire",
  "108": "Ambulance",
  "1091": "Mahila helpline",
  "14416": "Tele-MANAS (mental health helpline)",
};
const LEVELS = ["safe", "caution", "danger", "emergency"];
const CATEGORIES = ["medical", "fire_gas", "personal_threat", "travel", "home", "self_harm", "other"];

const rank = (l) => LEVELS.indexOf(l);
const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (typeof v === "string" ? v.trim() : "");
const strs = (v) => arr(v).map(str).filter(Boolean);
const call = (number, reason) => ({ number, label: NUMBERS[number], reason });

/* ------------------------------------------------------------------ */
/* 1) RULE-BASED TRIAGE: Gemini fail ho tab bhi khatre wale words pakde */
/* ------------------------------------------------------------------ */
const RULES = [
  {
    category: "self_harm",
    level: "emergency",
    re: /(suicide|suicidal|khud ko (khatam|maar)|jaan (de|dena)|marna chah|mar jana chah|zindagi khatam|end my life|kill myself|jeena nahi)/,
  },
  {
    category: "medical",
    level: "emergency",
    re: /(behosh|unconscious|saans nahi|saans (ruk|band)|not breathing|seene (mein|me) (tez )?dard|chest pain|heart attack|daura pad|seizure|mirgi|bahut (zyada )?khoon|heavy bleeding|zeher|poison|overdose|current lag)/,
  },
  {
    category: "fire_gas",
    level: "emergency",
    re: /(aag (lag|lagi|lag gayi)|fire lag|dhuan|dhuaan|gas (leak|ki smell|ki badbu)|cylinder (leak|phat)|blast|dhamaka)/,
  },
  {
    category: "personal_threat",
    level: "emergency",
    re: /(chaaku|chaku|knife|gun|bandook|pistol|hamla|attack|kidnap|agwa|zabardasti)/,
  },
  {
    category: "personal_threat",
    level: "danger",
    re: /(follow kar|following me|mujhe follow|peecha kar|pichha kar|pichhe pad|stalk|chhed|molest|harass|dhamki|threat|maar(ne| raha| rahe)|gher liya|gher rakha)/,
  },
];

export function triage(text) {
  const t = String(text).toLowerCase();
  let best = null;
  for (const r of RULES) {
    if (!r.re.test(t)) continue;
    if (r.category === "self_harm") return { category: r.category, level: r.level }; // sabse upar
    if (!best || rank(r.level) > rank(best.level)) best = { category: r.category, level: r.level };
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* 2) FIXED RESPONSES: sabse risky cases ke liye pehle se likhe jawab  */
/* ------------------------------------------------------------------ */
function templateFor(category, level = "caution") {
  switch (category) {
    case "self_harm":
      return {
        level: "emergency",
        category: "self_harm",
        headline: "Aap akele nahi hain. Abhi kisi se baat karna zaroori hai.",
        whatsHappening:
          "Aapne bahut dard ya mushkil ki baat likhi hai. Is waqt kisi insaan se jud jana sabse zaroori hai.",
        steps: [
          "Agar aap abhi khud ko nuksaan pahunchane ke khatre mein hain, turant 112 par call karo.",
          "Kisi bharose ke insaan (family, dost, padosi) ko abhi bulao ya unke paas chale jao.",
          "Khud ko nuksaan pahunchane wali cheezon se door raho aur kisi ke saath raho.",
          "Tele-MANAS (14416) par call karke kisi trained counsellor se baat kar sakte ho.",
        ],
        avoid: ["Akele mat raho", "Is waqt koi bada faisla mat lo"],
        callNow: [
          call("112", "Agar abhi khatra hai"),
          call("14416", "Kisi counsellor se baat karne ke liye"),
        ],
        sosMessage: "Mujhe abhi kisi ki zaroorat hai. Please mujhe call karo ya mere paas aao.",
        checkAgainInMinutes: null,
      };

    case "medical":
      return {
        level: "emergency",
        category: "medical",
        headline: "Medical emergency ho sakti hai: turant madad bulao",
        whatsHappening: "Jo aapne likha hai wo jaan ke liye khatarnak ho sakta hai, isliye der mat karo.",
        steps: [
          "Abhi 108 (ambulance) par call karo.",
          "Mareez ko aaram se rakho aur unke paas hi raho, akela mat chhodo.",
          "Aas-paas ke kisi insaan ya padosi ko turant bulao.",
          "Gate, lift aur raasta khali rakho taaki ambulance aur madadgar jaldi pahunch sakein.",
        ],
        avoid: ["Bina jaankari ke dawai mat do", "Mareez ko khud se gaadi mein bithane se pehle ambulance se poochho"],
        callNow: [call("108", "Ambulance"), call("112", "Agar 108 na lage")],
        sosMessage: "Medical emergency hai. Please turant aao ya ambulance bulane mein madad karo.",
        checkAgainInMinutes: null,
      };

    case "fire_gas":
      return {
        level: "emergency",
        category: "fire_gas",
        headline: "Aag ya gas ka khatra: turant bahar niklo",
        whatsHappening: "Aag, dhuan ya gas leak bahut tezi se khatarnak ho sakta hai.",
        steps: [
          "Sabko lekar turant bahar khule hisse mein niklo. Lift mat use karo.",
          "Gas ki smell ho to koi switch, lighter ya flame mat chalao; khidkiyan kholo.",
          "Bahar nikalkar 101 (fire) par call karo.",
          "Apne aap ko sabse pehle bacha lo, saamaan lene wapas mat jao.",
        ],
        avoid: ["Lift ka use mat karo", "Gas leak mein bijli ke switch mat dabao"],
        callNow: [call("101", "Fire"), call("112", "Sabhi emergency")],
        sosMessage: "Aag ya gas ka khatra hai. Please turant aao ya fire brigade ko call karne mein madad karo.",
        checkAgainInMinutes: null,
      };

    case "personal_threat":
      return {
        level: level === "emergency" ? "emergency" : "danger",
        category: "personal_threat",
        headline: "Aapki safety ko khatra ho sakta hai: surakshit jagah par jao",
        whatsHappening: "Koi aapko pareshan ya khatre mein daal sakta hai. Apni safety sabse pehle hai.",
        steps: [
          "Kisi roshan, bheed wali jagah (dukaan, petrol pump, guard wala gate) ki taraf jao.",
          "Abhi 112 ya 100 par call karo aur apni jagah batao.",
          "Kisi bharose ke insaan ko phone karke apni location bhejo aur line par bane raho.",
          "Samne wale se bahas ya muqabla mat karo.",
        ],
        avoid: ["Sunsaan raaste ya andhere mein mat jao", "Akele ghar ya gaadi mein mat chhupo agar bheed paas ho"],
        callNow: [
          call("112", "Turant madad"),
          call("100", "Police"),
          call("1091", "Agar aap mahila hain ya kisi mahila ki madad kar rahe hain"),
        ],
        sosMessage: "Mujhe lag raha hai koi mujhe pareshan kar raha hai. Please mujhe call karo aur meri location dekho.",
        checkAgainInMinutes: 5,
      };

    default:
      return {
        level: "caution",
        category: "other",
        headline: "Savdhaan raho: AI abhi available nahi hai, ye general salah hai",
        whatsHappening:
          "Aapki situation ka poora andaza nahi laga paaye, isliye ye sabke kaam aane wali savdhaaniyan hain.",
        steps: [
          "Kisi roshan, jaani-pehchani ya bheed wali jagah par raho.",
          "Kisi bharose ke insaan ko apni jagah aur situation batao.",
          "Agar khatra badhe ya darr lage to der mat karo, 112 par call karo.",
          "Apni gut feeling par bharosa rakho: asahaj lage to wahan se hat jao.",
        ],
        avoid: ["Akele sunsaan jagah par mat jao", "Anjaan logon se lift ya khaana-peena mat lo"],
        callNow: [call("112", "Agar khatra lage")],
        sosMessage: "Mujhe thoda asurakshit lag raha hai. Please mujhse baat karo aur meri location dekhte raho.",
        checkAgainInMinutes: 15,
      };
  }
}

/* ------------------------------------------------------------------ */
/* 3) GEMINI                                                          */
/* ------------------------------------------------------------------ */
const SYSTEM_PROMPT = `
Tum "MyCommunity" ke Personal Safety Assistant ho. Koi insaan abhi apni safety ke baare mein soch raha hai.
Shant, seedhi aur madadgaar Hinglish mein jawab do.

Rules:
- Pehle level tay karo: "safe" (khatra nahi), "caution" (savdhaan rehna), "danger" (khatra ho sakta hai, turant kadam chahiye), "emergency" (jaan ka khatra, abhi call karo). Shak ho to ek level upar rakho.
- Steps chhote aur kiye ja sakne wale hon, sabse zaroori pehle (3 se 6 steps).
- Peecha karne ya hinsa karne wale se bhidne ya bahas karne ki salah kabhi mat do. Roshan, bheed wali jagah jaane aur kisi bharose ke insaan ko batane ko kaho.
- Medical ya legal salah, dawai ya dose mat do. Sirf basic safety aur madad bulane ke steps do.
- Phone number, address ya naam khud se mat banao. callNow mein sirf ye numbers likh sakte ho: 112 (sabhi emergency), 100 (police), 101 (fire), 108 (ambulance), 1091 (mahila helpline).
- sosMessage bharose ke logon ko bhejne wala chhota message ho (2 line tak). Usme location mat likho, app khud jod dega.
- Sirf JSON return karo, koi extra text ya backticks nahi.

Format:
{
  "level": "safe" | "caution" | "danger" | "emergency",
  "category": "medical" | "fire_gas" | "personal_threat" | "travel" | "home" | "other",
  "headline": string,
  "whatsHappening": string,
  "steps": [string],
  "avoid": [string],
  "callNow": [{ "number": string, "reason": string }],
  "sosMessage": string,
  "checkAgainInMinutes": number | null
}
`;

async function askGemini(input, tri) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY set nahi hai");
  const ai = new GoogleGenAI({ apiKey: key });

  const contents =
    `Jagah: ${input.place}\n` +
    `Samay: ${input.time}\n` +
    `Akela/akeli: ${input.alone ? "Haan" : "Nahi, kisi ke saath hai"}\n` +
    (tri ? `Server ne ise "${tri.category}" pehchana hai, level kam se kam "${tri.level}" rakho.\n` : "") +
    `Situation: ${input.situation}`;

  const request = ai.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json", temperature: 0.3 },
  });
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), 25000));

  const response = await Promise.race([request, timeout]);
  const text = (response.text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// Gemini ka output kabhi galat shape mein aata hai; hamesha saaf karo aur safety rules lagao
export function normalize(raw, tri) {
  const steps = strs(raw?.steps).slice(0, 6);
  if (!steps.length) throw new Error("Gemini ne steps nahi diye");

  let level = LEVELS.includes(raw.level) ? raw.level : "caution";
  if (tri && rank(tri.level) > rank(level)) level = tri.level; // rules se neeche kabhi nahi

  let category = CATEGORIES.includes(raw.category) ? raw.category : "other";
  if (tri && category === "other") category = tri.category;

  const seen = new Set();
  const callNow = arr(raw.callNow)
    .map((c) => ({ number: str(c?.number).replace(/\D/g, ""), reason: str(c?.reason) }))
    .filter((c) => NUMBERS[c.number] && !seen.has(c.number) && seen.add(c.number))
    .map((c) => call(c.number, c.reason));

  // danger / emergency mein 112 hamesha dikhao
  if (rank(level) >= rank("danger") && !callNow.some((c) => c.number === "112")) {
    callNow.unshift(call("112", "Turant madad ke liye"));
  }

  const mins = Number(raw.checkAgainInMinutes);
  return {
    level,
    category,
    headline: str(raw.headline) || "Aapki situation ka jawab",
    whatsHappening: str(raw.whatsHappening),
    steps,
    avoid: strs(raw.avoid).slice(0, 4),
    callNow: callNow.slice(0, 4),
    sosMessage:
      str(raw.sosMessage).slice(0, 300) ||
      "Mujhe madad chahiye. Please mujhe call karo aur meri location dekho.",
    checkAgainInMinutes: Number.isFinite(mins) && mins > 0 && mins <= 120 ? Math.round(mins) : null,
  };
}

/* ------------------------------------------------------------------ */
/* 4) Route ye function use karta hai                                 */
/* ------------------------------------------------------------------ */
export async function assessSituation(input) {
  const tri = triage(input.situation);

  // Sabse sensitive case: LLM se nahi, pehle se likha jawab
  if (tri?.category === "self_harm") {
    return { result: templateFor("self_harm"), source: "rules" };
  }

  try {
    const raw = await askGemini(input, tri);
    return { result: normalize(raw, tri), source: "gemini" };
  } catch (err) {
    console.error("Safety Gemini fail, fallback use ho raha hai:", err.message);
    const result = tri ? templateFor(tri.category, tri.level) : templateFor("other");
    return { result, source: "fallback" };
  }
}
