import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import plansRouter from "./routes/Plans.js";
import safetyRouter from "./routes/Safety.js";

dotenv.config();

// ─── Config ──────────────────────────────────────────────────
// .env me ye likho (Server.js ke saath wale folder me):
// MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/?appName=...
// PORT=3000
// GEMINI_API_KEY=...
// GEMINI_MODEL=gemini-3.8-flash
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI .env me nahi mila!");
  process.exit(1);
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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Safety Planner (Mongoose router): /api/plans/generate, /api/plans, /api/plans/:id ...
// Ye express.json() ke BAAD aur 404 handler ke PEHLE hona chahiye.
app.use("/api/plans", plansRouter);

// Personal Safety Check + SOS: /api/safety/assess, /api/safety/sos
app.use("/api/safety", safetyRouter);

// ─── DB Connection ───────────────────────────────────────────
const client = new MongoClient(MONGODB_URI);

let db;
let communityDb;

async function connectDB() {
  await client.connect();
  await mongoose.connect(MONGODB_URI, { dbName: Community_Data }); // Safety Planner ke liye

  db = client.db(Community_data);
  communityDb = client.db(Community_Data);

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
    const data = await communityDb.collection(collection9).find().toArray();
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
app.post("/api/Emergency/:id/respond", async (req, res) => {
  try {
    const responderName = req.body.responderName?.trim();
    if (!responderName) {
      return res
        .status(400)
        .json({ success: false, error: "responderName required hai" });
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

// ─── START SERVER ────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);

      console.log(`📦 Events Routes:`);
      console.log(`   GET    /api/Events`);
      console.log(`   GET    /api/Events/:id`);
      console.log(`   POST   /api/Events`);
      console.log(`   PUT    /api/Events/:id`);
      console.log(`   DELETE /api/Events/:id`);

      console.log(`\n🚨 Emergency Routes:`);
      console.log(`   GET    /api/Emergency`);
      console.log(`   POST   /api/Emergency`);
      console.log(`   PATCH  /api/Emergency/:id/status`);
      console.log(`   POST   /api/Emergency/:id/respond`);

      console.log(`\n📦 Community Page Routes:`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/complaints`);
      console.log(`   GET    /api/Notice`);
      console.log(`   GET    /api/Directory`);
      console.log(`   GET    /api/community-events`);
      console.log(`   GET    /api/Lost_Found-data`);
      console.log(`   GET    /api/Society_Gallery`);
      console.log(`   GET    /api/Society_Polls`);

      console.log(`\n🛡️ Safety Planner Routes:`);
      console.log(`   POST   /api/plans/generate`);
      console.log(`   GET    /api/plans`);
      console.log(`   GET    /api/plans/:id`);
      console.log(`   PATCH  /api/plans/:id/progress`);
      console.log(`   DELETE /api/plans/:id`);

      console.log(`\n🆘 Personal Safety Routes:`);
      console.log(`   POST   /api/safety/assess`);
      console.log(`   POST   /api/safety/sos\n`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });
