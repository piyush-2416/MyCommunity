import express from "express";
import mongoose from "mongoose";
import SafetySos from "../models/SafetySos.js";
import { assessSituation } from "../SafetyAI.js";

const router = express.Router();

// Frontend ki lists se bilkul same honi chahiye
const PLACES = ["Ghar par", "Raaste / sadak par", "Cab / auto / bus mein", "Office / college mein", "Anjaan jagah par", "Anya"];
const TIMES = ["Din", "Raat"];
const REASONS = ["button", "timer", "check"];

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

// "+91 98765-43210" -> "9876543210" (galat ho to null)
const cleanPhone = (raw) => {
  const last10 = String(raw ?? "").replace(/\D/g, "").slice(-10);
  return /^[6-9]\d{9}$/.test(last10) ? last10 : null;
};

// Har route ka alag rate limit (free Gemini quota aur spam se bachne ke liye)
function limiter(max) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < 60_000);
    if (recent.length >= max) {
      return res.status(429).json({ error: "Bahut zyada requests. Ek minute baad try karo." });
    }
    recent.push(now);
    hits.set(req.ip, recent);
    next();
  };
}
const assessLimit = limiter(10);
const sosLimit = limiter(6);

// TODO: login ke baad yahan auth middleware lagao, taaki SOS sirf logged-in residents bhej sakein.

// 1) Personal Safety Check (Gemini + rule-based safety net)
router.post("/assess", assessLimit, async (req, res) => {
  try {
    const b = req.body || {};
    const situation = clean(b.situation, 500);
    if (situation.length < 10) {
      return res.status(400).json({ error: "Situation 10 se 500 characters ke beech likho." });
    }

    const input = {
      situation,
      place: PLACES.includes(b.place) ? b.place : "Anya",
      time: TIMES.includes(b.time) ? b.time : "Din",
      alone: b.alone === true,
    };

    const { result, source } = await assessSituation(input);
    res.json({ ...result, source });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Safety check nahi ho paya" });
  }
});

// 2) SOS log: Safety-sos mein save, aur chaho to community ke Emergency page par bhi dikhao
router.post("/sos", sosLimit, async (req, res) => {
  try {
    const b = req.body || {};
    const name = clean(b.name, 60);
    const phone = cleanPhone(b.phone);
    const message = clean(b.message, 400);
    const level = ["caution", "danger", "emergency"].includes(b.level) ? b.level : "emergency";
    const reason = REASONS.includes(b.reason) ? b.reason : "button";

    if (!message) return res.status(400).json({ error: "Message chahiye" });
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database abhi ready nahi hai" });
    }

    // Location optional hai
    let coords = null;
    if (b.lat != null && b.lng != null && b.lat !== "" && b.lng !== "") {
      const lat = Number(b.lat);
      const lng = Number(b.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        const acc = Number(b.accuracy);
        coords = { lat, lng, accuracy: Number.isFinite(acc) ? Math.round(acc) : null };
      }
    }

    // Community ko tabhi alert jab naam aur sahi number ho (warna Emergency page par kisi ko pata nahi chalega kiska hai)
    const wantsCommunity = b.alertCommunity === true;
    const canAlertCommunity = !!(wantsCommunity && name && phone);
    let note = "";
    if (wantsCommunity && !canAlertCommunity) {
      note = "Community alert ke liye apna naam aur sahi mobile number bharo.";
    }

    const now = new Date();
    const saved = await SafetySos.create({
      name,
      phone: phone || "",
      message,
      ...(coords && { coords }),
      level,
      reason,
      communityAlerted: canAlertCommunity,
    });

    if (canAlertCommunity) {
      // Aapke existing /api/Emergency page ke format mein
      await mongoose.connection.db.collection("Emergency").insertOne({
        name,
        phone,
        emergencyType: "SOS",
        title: "SOS: madad chahiye",
        description: message,
        bloodGroup: "",
        peopleRequired: 1,
        location: coords
          ? `GPS: https://maps.google.com/?q=${coords.lat},${coords.lng}`
          : "Location share nahi hui",
        urgency: "high",
        status: "active",
        respondedBy: [],
        source: "sos-button",
        createdAt: now,
        updatedAt: now,
      });
    }

    res.status(201).json({ ok: true, id: saved._id, communityAlerted: canAlertCommunity, note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SOS save nahi ho paya" });
  }
});

export default router;
