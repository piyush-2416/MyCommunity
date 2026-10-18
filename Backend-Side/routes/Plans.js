import express from "express";
import mongoose from "mongoose";
import Plan from "../models/Plan.js";
import { generatePlan } from "../Gemini.js";

const router = express.Router();

// Frontend ki lists se bilkul same honi chahiye
const COMMUNITY_TYPES = ["Housing society", "Mohalla / colony", "Gaon", "College campus", "Apartment tower", "Other"];
const RISKS = ["Baarish / baadh", "Aag", "Bhukamp", "Heatwave / loo", "Cold wave", "Bijli / paani outage", "Medical emergency", "Gas leak", "Chori / security", "Building / structure damage"];
const VULNERABLE = ["Bujurg", "Chhote bachche", "Divyang", "Garbhwati mahilayein", "Lambi bimari wale"];
const RESOURCES = ["Generator", "First-aid kit", "Fire extinguisher", "CCTV", "Security guard", "WhatsApp group", "Community hall", "Paani ki tanki", "Ambulance access"];

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const onlyAllowed = (v, allowed) =>
  Array.isArray(v) ? [...new Set(v.filter((x) => allowed.includes(x)))] : [];
const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ error: "Galat id" });

// Simple rate limit: free Gemini quota bachane ke liye (har IP se 10 plan / minute)
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 10) {
    return res.status(429).json({ error: "Bahut zyada requests. Ek minute baad try karo." });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

// TODO: login ke baad yahan auth middleware lagao aur Plan mein owner save karo,
// warna koi bhi dusre ke plans dekh ya delete kar sakta hai.

// 1) Naya plan banao (AI) aur save karo
router.post("/generate", rateLimit, async (req, res) => {
  try {
    const b = req.body || {};
    const input = {
      name: clean(b.name, 80),
      kind: COMMUNITY_TYPES.includes(b.kind) ? b.kind : null,
      households: Number(b.households),
      location: clean(b.location, 100),
      notes: clean(b.notes, 300),
      risks: onlyAllowed(b.risks, RISKS),
      vulnerable: onlyAllowed(b.vulnerable, VULNERABLE),
      resources: onlyAllowed(b.resources, RESOURCES),
    };

    if (!input.name) return res.status(400).json({ error: "Community ka naam likho." });
    if (!input.kind) return res.status(400).json({ error: "Community ka type chuno." });
    if (!Number.isInteger(input.households) || input.households < 1 || input.households > 100000) {
      return res.status(400).json({ error: "Gharon ki sankhya 1 se 1,00,000 ke beech honi chahiye." });
    }
    if (input.risks.length === 0) {
      return res.status(400).json({ error: "Kam se kam ek risk chuno." });
    }

    const { plan, fallback } = await generatePlan(input);

    const doc = await Plan.create({
      community: {
        name: input.name,
        kind: input.kind,
        households: input.households,
        location: input.location,
      },
      risks: input.risks,
      vulnerable: input.vulnerable,
      resources: input.resources,
      notes: input.notes,
      plan,
      fallback,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Plan nahi ban paya" });
  }
});

// 2) Saved plans ki list
router.get("/", async (req, res) => {
  try {
    const list = await Plan.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("community risks fallback createdAt")
      .lean();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Plans load nahi ho paye" });
  }
});

// 3) Ek plan poora
router.get("/:id", validId, async (req, res) => {
  try {
    const doc = await Plan.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Plan nahi mila" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Plan load nahi ho paya" });
  }
});

// 4) Checklist progress save karo: body = { done: ["0-1", "2-3"] }
router.patch("/:id/progress", validId, async (req, res) => {
  try {
    const done = Array.isArray(req.body.done)
      ? [...new Set(req.body.done.filter((x) => typeof x === "string" && x.length <= 12))].slice(0, 200)
      : null;
    if (!done) return res.status(400).json({ error: "done array chahiye" });

    const doc = await Plan.findByIdAndUpdate(req.params.id, { done }, { new: true }).select("done");
    if (!doc) return res.status(404).json({ error: "Plan nahi mila" });
    res.json({ done: doc.done });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Progress save nahi hua" });
  }
});   

// 5) Plan delete
router.delete("/:id", validId, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete nahi ho paya" });
  }
});

export default router;
