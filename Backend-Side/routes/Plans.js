import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { requireRole } from "./Middleware/auth.js";
import volunteerProfileRouter from "./routes/VolunteerProfile.js";
import authRouter from "./routes/Auth.js";
import plansRouter from "./routes/Plans.js";
import safetyRouter from "./routes/Safety.js";
import { requireAuth } from "./Middleware/auth.js";
// import { requireAuth, requireRole } from "./Middleware/auth.js";
import statsRouter from "./routes/Stats.js";
// ─── Config ──────────────────────────────────────────────────
// .env me ye likho (Server.js ke saath wale folder me):
// MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/?appName=...
// PORT=3000
// JWT_SECRET=kam_se_kam_32_characters_ka_random_string
// CLIENT_URL=http://localhost:5173
// GEMINI_API_KEY=...
// GEMINI_MODEL=gemini-3.8-flash
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI .env me nahi mila!");
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("❌ .env mein JWT_SECRET (kam se kam 32 characters) daalo.");
  process.exit(1);
}
if (!process.env.VOLUNTEER_INVITE_CODE) {
  console.warn("⚠️ VOLUNTEER_INVITE_CODE .env me nahi mila: volunteer signup band rahega.");
}

const Community_data = "Community-data";
const Collection1 = "Complaints-data";
const Community_Data = "Community-data";
const collection = "Business-data";
const collection2 = "Complaints-data";
const collection3 = "Notices-data";
const collection4 = "Events";
const collection5 = "Lost_Found-data";
const collection6 = "Society_Gallery";
const collection7 = "Society Polls/Voting Collection";
const collection8 = "Emergency";
const collection9 = "Directory";

// ─── App + Middleware (SABSE PEHLE) ──────────────────────────
const app = express();
app.set("trust proxy", 1); // Render jaise hosting par secure cookie ke liye

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true, // cookie bhejne ke liye zaroori
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// ─── Helpers ─────────────────────────────────────────────────
const uid = (req) => String(req.user?._id ?? "");

// Record badalne ki ijazat: banane wala ya admin.
// Purane records (jinme createdBy nahi hai) koi bhi logged-in user badal sakta hai.
const canModify = (doc, req) =>
  !doc?.createdBy || doc.createdBy === uid(req) || req.user?.role === "admin";

// ─── Health check (public) ───────────────────────────────────
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Server chal raha hai 🚀", port: PORT });
});

// ─── Auth (public: signup / login / logout / me) ─────────────
app.use("/api/auth", authRouter);
// ─── Volunteer apni Directory profile yahan se bharta hai ────
app.use("/api/volunteer/profile", requireAuth, requireRole("volunteer"), volunteerProfileRouter);
// ─── Dashboard stats (sirf volunteer aur admin) ──────────────
app.use("/api/stats", requireAuth, requireRole("volunteer", "admin"), statsRouter);
// ─── Data routes ka access rule (SIRF EK JAGAH) ──────────────
// GET (padhna)  : sabke liye khula
// POST/PUT/PATCH/DELETE (likhna/badalna): login zaroori
const readPublic = (req, res, next) =>
  req.method === "GET" ? next() : requireAuth(req, res, next);

app.use(
  [
    "/api/Events",
    "/api/Emergency",
    "/api/products",
    "/api/complaints",
    "/api/Notice",
    "/api/Directory",
    "/api/community-events",
    "/api/Lost_Found-data",
    "/api/Society_Gallery",
    "/api/Society_Polls",
  ],
  readPublic
);

// Emergency list me logon ke phone number hote hain. Agar ye sirf logged-in logon ko
// dikhane hain, to upar ki list se "/api/Emergency" hata do aur ye line khol do:
// app.use("/api/Emergency", requireAuth);

// Safety Planner (Mongoose router): /api/plans/generate, /api/plans, /api/plans/:id ...
app.use("/api/plans", requireAuth, plansRouter);

// Personal Safety Check + SOS: /api/safety/assess, /api/safety/sos
app.use("/api/safety", requireAuth, safetyRouter);

// ─── DB Connection ───────────────────────────────────────────
const client = new MongoClient(MONGODB_URI);

let db;
let communityDb;

async function connectDB() {
  await client.connect();
  await mongoose.connect(MONGODB_URI, { dbName: Community_Data }); // Safety Planner + Users ke liye

  db = client.db(Community_data);
  communityDb = client.db(Community_Data);
app.locals.communityDb = communityDb; // VolunteerProfile router isse DB leta hai
  console.log(
    `✅ MongoDB Connected → db: "${Community_data}", collection: "${Collection1}"`
  );
  console.log(`✅ MongoDB Connected → db: "${Community_Data}"`);
  console.log(`✅ Mongoose Connected → db: "${Community_Data}"`);
}

const col = () => db.collection(Collection1);

// ═══════════════════════════════════════════════════════════
// PAGE 1: /api/Events
// ═══════════════════════════════════════════════════════════

async function findById(id) {
  if (ObjectId.isValid(id)) {
    const doc = await col().findOne({ _id: new ObjectId(id) });
    if (doc) return { doc, query: { _id: new ObjectId(id) } };
  }

  const doc = await col().findOne({ _id: id });
  if (doc) return { doc, query: { _id: id } };

  return { doc: null, query: null };
}

// ─── GET ALL Events ──────────────────────────────────────────
app.get("/api/Events", async (req, res) => {
  try {
    const Events = await col().find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, count: Events.length, data: Events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET ONE Events ──────────────────────────────────────────
app.get("/api/Events/:id", async (req, res) => {
  try {
    const { doc } = await findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Events not found" });
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CREATE Events ───────────────────────────────────────────
app.post("/api/Events", async (req, res) => {
  try {
    const { title, type, location, status, description, photo } = req.body;

    if (!title || !type || !status) {
      return res.status(400).json({
        success: false,
        error: "Name, type aur price required hain!",
      });
    }

    const newEvents = {
      title: title.trim(),
      type: type.trim(),
      location: location?.trim() || "",
      status: parseFloat(status),
      description: description?.trim() || "",
      photo: photo?.trim() || "",
      createdBy: uid(req), // kisne banaya
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col().insertOne(newEvents);

    res.status(201).json({
      success: true,
      message: "Events create ho gaya! ✅",
      data: { _id: result.insertedId, ...newEvents },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── UPDATE Events ───────────────────────────────────────────
app.put("/api/Events/:id", async (req, res) => {
  try {
    const { doc, query } = await findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Events not found" });
    }
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf banane wala ise badal sakta hai" });
    }

    const { title, type, location, status, description, photo } = req.body;

    const updatedFields = {
      ...(title !== undefined && { title: title.trim() }),
      ...(type !== undefined && { type: type.trim() }),
      ...(location !== undefined && { location: location.trim() }),
      ...(status !== undefined && { status: parseFloat(status) }),
      ...(description !== undefined && { description: description.trim() }),
      ...(photo !== undefined && { photo: photo.trim() }),
      updatedAt: new Date(),
    };

    const result = await col().findOneAndUpdate(
      query,
      { $set: updatedFields },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      message: "Events update ho gaya! ✅",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE Events ───────────────────────────────────────────
app.delete("/api/Events/:id", async (req, res) => {
  try {
    const { doc, query } = await findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Events not found" });
    }
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf banane wala ise delete kar sakta hai" });
    }

    await col().deleteOne(query);
    res.json({ success: true, message: "Events delete ho gaya! 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// PAGE 2: COMMUNITY PAGES (read-only GET routes)
// ═══════════════════════════════════════════════════════════

app.get("/api/products", async (req, res) => {
  try {
    const data = await communityDb.collection(collection).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/complaints", async (req, res) => {
  try {
    const data = await communityDb.collection(collection2).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Notice", async (req, res) => {
  try {
    const data = await communityDb.collection(collection3).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Directory", async (req, res) => {
  try {
    const data = await communityDb
      .collection(collection9)
      .find({ isProfileComplete: { $ne: false } })
      .toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/community-events", async (req, res) => {
  try {
    const data = await communityDb.collection(collection4).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Lost_Found-data", async (req, res) => {
  try {
    const data = await communityDb.collection(collection5).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Society_Gallery", async (req, res) => {
  try {
    const data = await communityDb.collection(collection6).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Society_Polls", async (req, res) => {
  try {
    const data = await communityDb.collection(collection7).find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════
// PAGE 3: EMERGENCY — Create + Resolve (+ list, "I can help")
// ═══════════════════════════════════════════════════════════

const emergencyCol = () => communityDb.collection(collection8);

async function findEmergency(id) {
  if (ObjectId.isValid(id)) {
    const doc = await emergencyCol().findOne({ _id: new ObjectId(id) });
    if (doc) return { doc, query: { _id: new ObjectId(id) } };
  }
  const doc = await emergencyCol().findOne({ _id: id });
  if (doc) return { doc, query: { _id: id } };
  return { doc: null, query: null };
}

// ─── LIST ────────────────────────────────────────────────────
app.get("/api/Emergency", async (req, res) => {
  try {
    const data = await emergencyCol().find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── CREATE (Raise Emergency) ────────────────────────────────
app.post("/api/Emergency", async (req, res) => {
  try {
    const {
      name,
      phone,
      emergencyType,
      title,
      description,
      bloodGroup,
      peopleRequired,
      location,
      urgency,
    } = req.body;

    if (!name || !phone || !emergencyType || !title || !location) {
      return res.status(400).json({
        success: false,
        error: "Name, phone, emergency type, title aur location required hain!",
      });
    }

    const newDoc = {
      name: name.trim(),
      phone: phone.trim(),
      emergencyType: emergencyType.trim(),
      title: title.trim(),
      description: description?.trim() || "",
      bloodGroup: bloodGroup?.trim() || "",
      peopleRequired: Number(peopleRequired) || 1,
      location: location.trim(),
      urgency: (urgency || "medium").toLowerCase(),
      status: "active",
      respondedBy: [],
      createdBy: uid(req), // kisne raise ki
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await emergencyCol().insertOne(newDoc);

    res.status(201).json({
      success: true,
      message: "Emergency raise ho gayi! 🚨",
      data: { _id: result.insertedId, ...newDoc },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── RESOLVE (Active → Resolved) ─────────────────────────────
app.patch("/api/Emergency/:id/status", async (req, res) => {
  try {
    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Emergency not found" });
    }
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf raise karne wala ise resolve kar sakta hai" });
    }

    const result = await emergencyCol().findOneAndUpdate(
      query,
      {
        $set: {
          status: "resolved",
          resolvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      message: "Emergency resolve ho gayi ✅",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── "I can help" ────────────────────────────────────────────
// Naam ab login wale user ka aata hai, body ka nahi (koi aur ke naam se help nahi kar sakta)
app.post("/api/Emergency/:id/respond", async (req, res) => {
  try {
    const responderName = String(req.user?.name ?? "").trim();
    if (!responderName) {
      return res.status(400).json({ success: false, error: "User ka naam nahi mila" });
    }

    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Emergency not found" });
    }

    const result = await emergencyCol().findOneAndUpdate(
      query,
      {
        $addToSet: { respondedBy: responderName },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      message: "Shukriya, aap help kar rahe hain 🙌",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 404 handler (HAMESHA saare routes ke baad) ──────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Error handler (galat JSON waghera) ──────────────────────
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Galat JSON bheja gaya" });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Data bahut bada hai" });
  }
  console.error("❌ Server error:", err);
  res.status(err.status || 500).json({ success: false, error: "Server error" });
});

// ─── START SERVER ────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);

      console.log(`\n🔐 Auth Routes:`);
      console.log(`   POST   /api/auth/signup`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/logout`);
      console.log(`   GET    /api/auth/me`);

      console.log(`\n📦 Events Routes (GET khula, baaki login zaroori):`);
      console.log(`   GET    /api/Events`);
      console.log(`   GET    /api/Events/:id`);
      console.log(`   POST   /api/Events`);
      console.log(`   PUT    /api/Events/:id`);
      console.log(`   DELETE /api/Events/:id`);

      console.log(`\n🚨 Emergency Routes (GET khula, baaki login zaroori):`);
      console.log(`   GET    /api/Emergency`);
      console.log(`   POST   /api/Emergency`);
      console.log(`   PATCH  /api/Emergency/:id/status`);
      console.log(`   POST   /api/Emergency/:id/respond`);

      console.log(`\n📦 Community Page Routes (GET khula):`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/complaints`);
      console.log(`   GET    /api/Notice`);
      console.log(`   GET    /api/Directory`);
      console.log(`   GET    /api/community-events`);
      console.log(`   GET    /api/Lost_Found-data`);
      console.log(`   GET    /api/Society_Gallery`);
      console.log(`   GET    /api/Society_Polls`);

      console.log(`\n🛡️ Safety Planner Routes (login zaroori):`);
      console.log(`   POST   /api/plans/generate`);
      console.log(`   GET    /api/plans`);
      console.log(`   GET    /api/plans/:id`);
      console.log(`   PATCH  /api/plans/:id/progress`);
      console.log(`   DELETE /api/plans/:id`);

      console.log(`\n🆘 Personal Safety Routes (login zaroori):`);
      console.log(`   POST   /api/safety/assess`);
      console.log(`   POST   /api/safety/sos\n`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });
