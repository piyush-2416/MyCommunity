import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { requireAuth, requireRole } from "./Middleware/auth.js";
import volunteerProfileRouter from "./routes/VolunteerProfile.js";
import authRouter from "./routes/Auth.js";
import plansRouter from "./routes/Plans.js";
import safetyRouter from "./routes/Safety.js";
import statsRouter from "./routes/Stats.js";

// ─── Config ──────────────────────────────────────────────────
// .env / Render Environment me ye hone chahiye:
// MONGODB_URI, PORT, JWT_SECRET (32+ chars), NODE_ENV=production,
// CLIENT_URL=https://tumhari-site.netlify.app   (bina last "/" ke; comma se kai URL bhi chalenge)
// VOLUNTEER_INVITE_CODE, GEMINI_API_KEY ...
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

const Community_Data = "Community-data";
const Complaints_Collection = "Complaints-data";
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
app.set("trust proxy", 1); // Render par secure cookie ke liye

const allowedOrigins = [
  ...(process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean),
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // cookie bhejne ke liye zaroori
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// ─── Helpers ─────────────────────────────────────────────────
const uid = (req) => String(req.user?._id ?? "");
const str = (v) => String(v ?? "").trim();

// Record badalne ki ijazat: banane wala ya admin.
// Purane records (jinme createdBy nahi hai) koi bhi logged-in user badal sakta hai.
const canModify = (doc, req) =>
  !doc?.createdBy || doc.createdBy === uid(req) || req.user?.role === "admin";

const COMPLAINT_STATUS = ["Pending", "In Progress", "Resolved"];
const normComplaintStatus = (s) =>
  COMPLAINT_STATUS.find((x) => x.toLowerCase() === str(s).toLowerCase());

const URGENCY = ["low", "medium", "high", "critical"];
const EMERGENCY_STATUS = ["active", "resolved"];

// ─── Health check (public) ───────────────────────────────────
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Server chal raha hai 🚀", port: PORT });
});

// ─── Auth (public: signup / login / logout / me) ─────────────
app.use("/api/auth", authRouter);
app.use("/api/volunteer/profile", requireAuth, requireRole("volunteer"), volunteerProfileRouter);
app.use("/api/stats", requireAuth, requireRole("volunteer", "admin"), statsRouter);

// ─── Data routes ka access rule (SIRF EK JAGAH) ──────────────
// GET (padhna): sabke liye khula | POST/PUT/PATCH/DELETE: login zaroori
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

app.use("/api/plans", requireAuth, plansRouter);
app.use("/api/safety", requireAuth, safetyRouter);

// ─── DB Connection ───────────────────────────────────────────
const client = new MongoClient(MONGODB_URI);
let communityDb;

async function connectDB() {
  await client.connect();
  await mongoose.connect(MONGODB_URI, { dbName: Community_Data }); // Safety Planner + Users ke liye
  communityDb = client.db(Community_Data);
  app.locals.communityDb = communityDb; // VolunteerProfile router isse DB leta hai
  console.log(`✅ MongoDB + Mongoose Connected → db: "${Community_Data}"`);
}

const col = () => communityDb.collection(Complaints_Collection);

async function findById(id) {
  if (ObjectId.isValid(id)) {
    const doc = await col().findOne({ _id: new ObjectId(id) });
    if (doc) return { doc, query: { _id: new ObjectId(id) } };
  }
  const doc = await col().findOne({ _id: id });
  if (doc) return { doc, query: { _id: id } };
  return { doc: null, query: null };
}

// ═══════════════════════════════════════════════════════════
// COMPLAINTS CRUD  (/api/Events)
// ═══════════════════════════════════════════════════════════

app.get("/api/Events", async (req, res) => {
  try {
    const data = await col().find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/Events/:id", async (req, res) => {
  try {
    const { doc } = await findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Complaint not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE
app.post("/api/Events", async (req, res) => {
  try {
    const b = req.body ?? {};
    const title = str(b.title);
    const type = str(b.type);
    const location = str(b.location);

    if (!title || !type || !location) {
      return res.status(400).json({
        success: false,
        error: "Title, type aur location required hain!",
      });
    }

    const newDoc = {
      complaintId: `CMP-${Date.now().toString().slice(-6)}`,
      title,
      type,
      location,
      status: normComplaintStatus(b.status) || "Pending",
      description: str(b.description),
      photo: str(b.photo),
      raiseBy: str(b.raiseBy),
      raisedBytitle: str(b.raisedBytitle),
      createdBy: uid(req),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col().insertOne(newDoc);
    res.status(201).json({
      success: true,
      message: "Complaint create ho gayi! ✅",
      data: { _id: result.insertedId, ...newDoc },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE
app.put("/api/Events/:id", async (req, res) => {
  try {
    const { doc, query } = await findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Complaint not found" });
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf banane wala ise badal sakta hai" });
    }

    const b = req.body ?? {};
    const fields = {};
    for (const k of ["title", "type", "location", "description", "photo", "raiseBy", "raisedBytitle"]) {
      if (b[k] !== undefined) fields[k] = str(b[k]);
    }
    for (const k of ["title", "type", "location"]) {
      if (k in fields && !fields[k]) {
        return res.status(400).json({ success: false, error: `${k} khali nahi ho sakta` });
      }
    }
    if (b.status !== undefined) {
      const s = normComplaintStatus(b.status);
      if (!s) return res.status(400).json({ success: false, error: "Status galat hai" });
      fields.status = s;
    }
    fields.updatedAt = new Date();

    const result = await col().findOneAndUpdate(query, { $set: fields }, { returnDocument: "after" });
    res.json({
      success: true,
      message: "Complaint update ho gayi! ✅",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE
app.delete("/api/Events/:id", async (req, res) => {
  try {
    const { doc, query } = await findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Complaint not found" });
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf banane wala ise delete kar sakta hai" });
    }
    await col().deleteOne(query);
    res.json({ success: true, message: "Complaint delete ho gayi! 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// COMMUNITY PAGES (read-only GET routes)
// ═══════════════════════════════════════════════════════════

const listRoute = (path, collectionName, filter = {}) =>
  app.get(path, async (req, res) => {
    try {
      const data = await communityDb.collection(collectionName).find(filter).toArray();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

listRoute("/api/products", collection);
listRoute("/api/complaints", collection2);
listRoute("/api/Notice", collection3);
listRoute("/api/Directory", collection9, { isProfileComplete: { $ne: false } });
listRoute("/api/community-events", collection4);
listRoute("/api/Lost_Found-data", collection5);
listRoute("/api/Society_Gallery", collection6);
listRoute("/api/Society_Polls", collection7);

// ═══════════════════════════════════════════════════════════
// EMERGENCY: list, create, edit, delete, resolve, "I can help"
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

// LIST
app.get("/api/Emergency", async (req, res) => {
  try {
    const data = await emergencyCol().find().sort({ createdAt: -1 }).toArray();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE
app.post("/api/Emergency", async (req, res) => {
  try {
    const b = req.body ?? {};
    const name = str(b.name);
    const phone = str(b.phone);
    const emergencyType = str(b.emergencyType);
    const title = str(b.title);
    const location = str(b.location);

    if (!name || !phone || !emergencyType || !title || !location) {
      return res.status(400).json({
        success: false,
        error: "Name, phone, emergency type, title aur location required hain!",
      });
    }

    const urgency = str(b.urgency || "medium").toLowerCase();
    const newDoc = {
      name,
      phone,
      emergencyType,
      title,
      description: str(b.description),
      bloodGroup: str(b.bloodGroup),
      peopleRequired: Math.max(1, Number(b.peopleRequired) || 1),
      location,
      urgency: URGENCY.includes(urgency) ? urgency : "medium",
      status: "active",
      respondedBy: [],
      createdBy: uid(req),
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

// EDIT (pehle ye route tha hi nahi, isliye Edit fail hota tha)
app.put("/api/Emergency/:id", async (req, res) => {
  try {
    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Emergency not found" });
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf raise karne wala ise badal sakta hai" });
    }

    const b = req.body ?? {};
    const fields = {};
    for (const k of ["name", "phone", "emergencyType", "title", "description", "bloodGroup", "location"]) {
      if (b[k] !== undefined) fields[k] = str(b[k]);
    }
    for (const k of ["name", "phone", "emergencyType", "title", "location"]) {
      if (k in fields && !fields[k]) {
        return res.status(400).json({ success: false, error: `${k} khali nahi ho sakta` });
      }
    }
    if (b.peopleRequired !== undefined) {
      fields.peopleRequired = Math.max(1, Number(b.peopleRequired) || 1);
    }
    if (b.urgency !== undefined) {
      const u = str(b.urgency).toLowerCase();
      if (!URGENCY.includes(u)) return res.status(400).json({ success: false, error: "Urgency galat hai" });
      fields.urgency = u;
    }
    if (b.status !== undefined) {
      const s = str(b.status).toLowerCase();
      if (!EMERGENCY_STATUS.includes(s)) return res.status(400).json({ success: false, error: "Status galat hai" });
      fields.status = s;
      fields.resolvedAt = s === "resolved" ? new Date() : null;
    }
    fields.updatedAt = new Date();

    const result = await emergencyCol().findOneAndUpdate(query, { $set: fields }, { returnDocument: "after" });
    res.json({
      success: true,
      message: "Emergency update ho gayi ✅",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE (ye route bhi nahi tha)
app.delete("/api/Emergency/:id", async (req, res) => {
  try {
    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Emergency not found" });
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf raise karne wala ise delete kar sakta hai" });
    }
    await emergencyCol().deleteOne(query);
    res.json({ success: true, message: "Emergency delete ho gayi 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// RESOLVE / status badalna
app.patch("/api/Emergency/:id/status", async (req, res) => {
  try {
    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Emergency not found" });
    if (!canModify(doc, req)) {
      return res.status(403).json({ success: false, error: "Sirf raise karne wala ise resolve kar sakta hai" });
    }

    const wanted = str(req.body?.status || "resolved").toLowerCase();
    const status = EMERGENCY_STATUS.includes(wanted) ? wanted : "resolved";

    const result = await emergencyCol().findOneAndUpdate(
      query,
      {
        $set: {
          status,
          resolvedAt: status === "resolved" ? new Date() : null,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    res.json({
      success: true,
      message: status === "resolved" ? "Emergency resolve ho gayi ✅" : "Emergency dobara active ho gayi",
      data: result?.value ?? result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// "I can help": naam login wale user ka aata hai, body ka nahi
app.post("/api/Emergency/:id/respond", async (req, res) => {
  try {
    const responderName = str(req.user?.name);
    if (!responderName) {
      return res.status(400).json({ success: false, error: "User ka naam nahi mila" });
    }

    const { doc, query } = await findEmergency(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: "Emergency not found" });

    const result = await emergencyCol().findOneAndUpdate(
      query,
      { $addToSet: { respondedBy: responderName }, $set: { updatedAt: new Date() } },
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

// ─── Error handler ───────────────────────────────────────────
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
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });