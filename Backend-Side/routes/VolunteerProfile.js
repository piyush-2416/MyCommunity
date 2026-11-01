import express from "express";

const DIRECTORY_COLLECTION = "Directory";
const router = express.Router();

const getCol = (req) => req.app.locals.communityDb.collection(DIRECTORY_COLLECTION);

// Purane directory records ke paas userId nahi hota, isliye sparse index
let indexReady = false;
async function ensureIndex(col) {
  if (indexReady) return;
  await col.createIndex({ userId: 1 }, { unique: true, sparse: true });
  indexReady = true;
}

const isComplete = (d) => Boolean(d.role && d.department && d.phone);

// Profile nahi hai to khali record bana do
async function getOrCreate(req) {
  const col = getCol(req);
  await ensureIndex(col);
  const userId = String(req.user._id);

  await col.updateOne(
    { userId },
    {
      $setOnInsert: {
        userId,
        name: req.user.name,
        role: "",
        department: "",
        phone: req.user.phone || "",
        available: true,
        availableTime: "",
        description: "",
        image: "",
        isProfileComplete: false,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
  return col.findOne({ userId });
}

// 10 digit mobile: galat ho to null
function cleanPhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

// GET /api/volunteer/profile
router.get("/", async (req, res) => {
  try {
    res.json(await getOrCreate(req));
  } catch (err) {
    console.error("❌ Volunteer profile load error:", err.message);
    res.status(500).json({ message: "Profile load nahi ho paya" });
  }
});

// PUT /api/volunteer/profile
router.put("/", async (req, res) => {
  try {
    const b = req.body ?? {};
    const role = String(b.role ?? "").trim();
    const department = String(b.department ?? "").trim();
    const availableTime = String(b.availableTime ?? "").trim();
    const description = String(b.description ?? "").trim();
    const image = String(b.image ?? "").trim();
    const phone = cleanPhone(b.phone);
    const available = b.available === true || b.available === "true";

    if (role.length < 2 || role.length > 60) {
      return res.status(400).json({ message: "Role 2 se 60 letters ka ho (jaise Plumber, Secretary)" });
    }
    if (department.length < 2 || department.length > 60) {
      return res.status(400).json({ message: "Department 2 se 60 letters ka ho (jaise Maintenance)" });
    }
    if (!phone) {
      return res.status(400).json({ message: "Sahi 10 digit ka mobile number daalo" });
    }
    if (availableTime.length > 80) {
      return res.status(400).json({ message: "Timing 80 characters se chhoti ho" });
    }
    if (description.length > 300) {
      return res.status(400).json({ message: "Description 300 characters se chhoti ho" });
    }
    if (image && !/^https?:\/\/\S+$/i.test(image)) {
      return res.status(400).json({ message: "Image ka link http:// ya https:// se shuru ho" });
    }
    if (image.length > 500) {
      return res.status(400).json({ message: "Image ka link bahut lamba hai" });
    }

    await getOrCreate(req); // record pakka maujood ho

    const updates = {
      name: req.user.name,
      role,
      department,
      phone,
      available,
      availableTime,
      description,
      image,
      updatedAt: new Date(),
    };
    updates.isProfileComplete = isComplete(updates);

    const col = getCol(req);
    await col.updateOne({ userId: String(req.user._id) }, { $set: updates });
    res.json(await col.findOne({ userId: String(req.user._id) }));
  } catch (err) {
    console.error("❌ Volunteer profile save error:", err.message);
    res.status(500).json({ message: "Profile save nahi ho paya" });
  }
});

export default router;