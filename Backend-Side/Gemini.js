import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config(); // import order ki wajah se yahan bhi zaroori hai

// Model ka naam badalta rehta hai: .env mein GEMINI_MODEL rakho.
// Purana "gemini-2.5-flash" ab naye users ke liye band hai, isliye default naya rakha hai.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// ---------- chhote helpers ----------
const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (typeof v === "string" ? v.trim() : "");
const strs = (v) => arr(v).map(str).filter(Boolean);

// ---------- Gemini ka JSON saaf karke frontend wale shape mein lao ----------
function normalizePlan(raw) {
  const plan = {
    overview: str(raw.overview),

    risks: arr(raw.risks)
      .map((r) => {
        const level = str(r.level).toLowerCase();
        return {
          name: str(r.name),
          level: ["low", "medium", "high"].includes(level) ? level : "medium",
          why: str(r.why),
          prepare: strs(r.prepare),
        };
      })
      .filter((r) => r.name),

    // item id = "<category index>-<item index>", jaise "0-1" (progress save isi se hota hai)
    checklist: arr(raw.checklist)
      .map((c) => ({ category: str(c.category), items: strs(c.items) }))
      .filter((c) => c.category && c.items.length)
      .map((c, ci) => ({
        category: c.category,
        items: c.items.map((text, ii) => ({ id: `${ci}-${ii}`, text })),
      })),

    roles: arr(raw.roles)
      .map((r) => ({ role: str(r.role), responsibility: str(r.responsibility) }))
      .filter((r) => r.role),

    communicationPlan: str(raw.communicationPlan),

    evacuation: {
      assemblyPoint: str(raw.evacuation?.assemblyPoint),
      steps: strs(raw.evacuation?.steps),
    },

    drills: arr(raw.drills)
      .map((d) => ({ name: str(d.name), frequency: str(d.frequency), how: str(d.how) }))
      .filter((d) => d.name),

    vulnerableSupport: strs(raw.vulnerableSupport),
    contactsToCollect: strs(raw.contactsToCollect),
  };

  if (!plan.checklist.length) throw new Error("Gemini ne checklist nahi di");
  return plan;
}

// ---------- Gemini band / fail ho to general plan ----------
function fallbackPlan(p) {
  const withIds = (cats) =>
    cats.map((c, ci) => ({
      category: c.category,
      items: c.items.map((text, ii) => ({ id: `${ci}-${ii}`, text })),
    }));

  return {
    overview: `${p.name} ke liye ek general taiyari plan. Local disaster management office se ek baar confirm zaroor karo.`,
    risks: p.risks.map((r) => ({
      name: r,
      level: "medium",
      why: "Is risk ke liye pehle se taiyari rakhna zaroori hai.",
      prepare: ["Sabko is risk ke baare mein batao", "Emergency numbers sabke paas rakho"],
    })),
    checklist: withIds([
      {
        category: "Emergency kit",
        items: [
          "3 din ka pani aur sookha khana",
          "First-aid box",
          "Torch aur extra batteries",
          "Zaroori dawaiyan",
          "Important documents ki copy",
        ],
      },
      {
        category: "Ghar aur building",
        items: [
          "Bijli, gas aur pani ke main switch ki jagah sabko batao",
          "Exit raste hamesha khule rakho",
          "Fire extinguisher ya paani ki balti check karo",
        ],
      },
    ]),
    roles: [
      { role: "Coordinator", responsibility: "Sabko alert karna aur emergency numbers ki list rakhna" },
      { role: "First-aid team", responsibility: "Ghayal logon ki madad aur first-aid kit sambhalna" },
    ],
    communicationPlan:
      "Ek WhatsApp group banao jisme har ghar ka ek member ho. Emergency mein 112 (sab), 100 (police), 101 (fire), 108 (ambulance) par call karo.",
    evacuation: {
      assemblyPoint: "Society ka khula maidan / parking area (pehle se tay kar lo)",
      steps: [
        "Shaanti se bahar niklo, lift mat use karo",
        "Pehle se tay kiye gaye open area par ikattha ho",
        "Sabki ginti karo aur coordinator ko batao",
      ],
    },
    drills: [
      {
        name: "Evacuation drill",
        frequency: "Saal mein 2 baar",
        how: "Sab log exit route aur meeting point ki practice karein.",
      },
    ],
    vulnerableSupport: p.vulnerable.map(
      (g) => `${g}: ek volunteer tay karo aur inki zaroori cheezein kit mein rakho`
    ),
    contactsToCollect: [
      "Har ghar ka ek mobile number",
      "Nazdeeki hospital aur doctor",
      "Society secretary / security guard",
    ],
  };
}

// ---------- Gemini ko call ----------
async function askGemini(p) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY set nahi hai");
  const ai = new GoogleGenAI({ apiKey: key });

  const prompt = `
Tum ek community disaster preparedness expert ho. Neeche di gayi community ke liye practical safety plan banao.
Bhasha: simple Hinglish. Sirf JSON do, koi extra text ya markdown nahi.

Community: ${p.name} (${p.kind}), ${p.households} ghar
Jagah: ${p.location || "Nahi bataya"}
Risks: ${p.risks.join(", ")}
Vulnerable groups: ${p.vulnerable.join(", ") || "Koi nahi bataya"}
Available resources: ${p.resources.join(", ") || "Koi nahi bataya"}
Extra baat: ${p.notes || "Koi nahi"}

JSON shape bilkul aisa ho:
{
  "overview": "2-3 line ka saransh",
  "risks": [{ "name": "", "level": "low|medium|high", "why": "", "prepare": ["", ""] }],
  "checklist": [{ "category": "", "items": ["", ""] }],
  "roles": [{ "role": "", "responsibility": "" }],
  "communicationPlan": "alert kaise bhejenge, 3-4 line",
  "evacuation": { "assemblyPoint": "", "steps": ["", ""] },
  "drills": [{ "name": "", "frequency": "", "how": "" }],
  "vulnerableSupport": ["", ""],
  "contactsToCollect": ["", ""]
}

Zaroori rules:
- "risks" mein sirf wahi risks rakho jo upar diye gaye hain, har ek ke liye ek entry.
- Phone number, address, vendor ya company ka naam KHUD SE MAT BANAO.
- Sirf ye emergency numbers likh sakte ho: 112, 100, 101, 108.
- Checklist ke 3 se 5 sections rakho, har section mein 3 se 6 items.
- Dawai ya medical dose ki salah mat do.
`.trim();

  const call = ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { responseMimeType: "application/json", temperature: 0.4 },
  });
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini timeout")), 45000)
  );

  const response = await Promise.race([call, timeout]);
  const text = (response.text || "").replace(/```json|```/g, "").trim();
  return normalizePlan(JSON.parse(text));
}

// ---------- Ye function route use karta hai ----------
export async function generatePlan(input) {
  try {
    return { plan: await askGemini(input), fallback: false };
  } catch (err) {
    console.error("Gemini fail, fallback use ho raha hai:", err.message);
    return { plan: fallbackPlan(input), fallback: true };
  }
}
