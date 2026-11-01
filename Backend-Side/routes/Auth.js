import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import { requireAuth } from "../Middleware/auth.js";

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// Frontend aur backend alag domain par ho (production) to sameSite "none" + secure chahiye
const cookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validEmail = (e) => EMAIL_RE.test(e) && !/(^\.|\.@|\.\.)/.test(e);

// Dummy hash: user na mile tab bhi compare chalta hai, taaki timing se pata na chale
const DUMMY_HASH = bcrypt.hashSync("dummy-password-123", 10);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Bahut zyada koshish ho gayi, 15 minute baad try karo" },
});

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

function setAuthCookie(res, user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { ...cookieBase, maxAge: SEVEN_DAYS });
}

function publicUser(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    role: u.role,
    createdAt: u.createdAt,
  };
}

// 10 digit mobile; khali ho to chalega, galat ho to null
function cleanPhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (!d) return "";
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

// ---------- POST /api/auth/signup ----------
router.post("/signup", authLimiter, async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const phone = cleanPhone(req.body?.phone);
    // admin yahan se nahi ban sakta, sirf "user" ya "volunteer"
    const role = req.body?.role === "volunteer" ? "volunteer" : "user";

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: "Naam 2 se 60 letters ka hona chahiye" });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ message: "Sahi email daalo" });
    }
    if (phone === null) {
      return res.status(400).json({ message: "Sahi 10 digit ka mobile number daalo" });
    }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        message: "Password kam se kam 8 characters ka ho, usme letter aur number dono hon",
      });
    }
    if (password.length > 72) {
      return res.status(400).json({ message: "Password 72 characters se chhota rakho" });
    }

    // Volunteer banne ke liye invite code zaroori
    if (role === "volunteer") {
      const expected = process.env.VOLUNTEER_INVITE_CODE;
      if (!expected) {
        return res.status(403).json({ message: "Volunteer signup abhi band hai" });
      }
      if (!safeEqual(req.body?.inviteCode ?? "", expected)) {
        return res.status(403).json({ message: "Volunteer invite code galat hai" });
      }
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Ye email pehle se registered hai" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, password: hashed, role });

    setAuthCookie(res, user); // signup ke baad seedha login
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Ye email pehle se registered hai" });
    }
    console.error("POST /api/auth/signup:", error);
    res.status(500).json({ message: "Signup nahi ho paya" });
  }
});

// ---------- POST /api/auth/login ----------
router.post("/login", authLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email aur password dono daalo" });
    }

    const user = await User.findOne({ email }).select("+password");
    const ok = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !ok) {
      return res.status(401).json({ message: "Email ya password galat hai" });
    }

    setAuthCookie(res, user);
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("POST /api/auth/login:", error);
    res.status(500).json({ message: "Login nahi ho paya" });
  }
});

// ---------- POST /api/auth/logout ----------
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieBase);
  res.json({ message: "Logout ho gaya" });
});

// ---------- GET /api/auth/me ----------
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});
// ---------- PUT /api/auth/me (naam aur phone badalna) ----------
router.put("/me", requireAuth, async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const phone = cleanPhone(req.body?.phone);

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: "Naam 2 se 60 letters ka hona chahiye" });
    }
    if (phone === null) {
      return res.status(400).json({ message: "Sahi 10 digit ka mobile number daalo" });
    }

    await User.updateOne({ _id: req.user._id }, { $set: { name, phone } });
    const fresh = await User.findById(req.user._id);

    // Volunteer ka naam Directory mein bhi badal do
    if (fresh.role === "volunteer") {
      await req.app.locals.communityDb
        ?.collection("Directory")
        .updateOne({ userId: String(fresh._id) }, { $set: { name: fresh.name } });
    }

    res.json({ user: publicUser(fresh) });
  } catch (error) {
    console.error("PUT /api/auth/me:", error);
    res.status(500).json({ message: "Profile save nahi ho paya" });
  }
});


export default router;