import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Collection ke naam (apne Atlas ke hisaab se badal sakte ho)
const COL = {
  complaints: "Complaints-data",
  business: "Business-data",
  notices: "Notices-data",
  events: "Events",
  lostFound: "Lost_Found-data",
  gallery: "Society_Gallery",
  polls: "Society Polls/Voting Collection",
  emergency: "Emergency",
  directory: "Directory",
  feedback: "Feedback-data",
};

// Ek query fail ho to poora dashboard na ruke
const safe = async (fn, fallback) => {
  try {
    return await fn();
  } catch (err) {
    console.error("❌ Stats query fail:", err.message);
    return fallback;
  }
};

const pick = (d, keys) => {
  for (const k of keys) if (d?.[k]) return String(d[k]);
  return "";
};

// Recent list ke liye chhota, saaf item (poora document bahar nahi bhejte)
const slim = (d, titleKeys, subKeys) => ({
  id: String(d._id),
  title: pick(d, titleKeys).slice(0, 120) || "Untitled",
  sub: pick(d, subKeys).slice(0, 160),
  status: d.status ? String(d.status) : "",
  tag: d.urgency ? String(d.urgency) : "",
  rating: typeof d.rating === "number" ? d.rating : null,
  at: d.createdAt || d.date || (typeof d._id?.getTimestamp === "function" ? d._id.getTimestamp() : null),
});

// GET /api/stats
router.get("/", async (req, res) => {
  const db = req.app.locals.communityDb;
  if (!db) return res.status(503).json({ message: "Database abhi ready nahi hai" });

  const count = (name, filter = {}) => safe(() => db.collection(name).countDocuments(filter), 0);
  const recent = (name, filter = {}, n = 5) =>
    safe(() => db.collection(name).find(filter).sort({ _id: -1 }).limit(n).toArray(), []);

  const [
    usersByRole,
    complaintsTotal,
    complaintsByStatus,
    business,
    notices,
    events,
    lostFound,
    gallery,
    polls,
    directory,
    emergencyActive,
    emergencyResolved,
    feedbackAgg,
    recentComplaints,
    recentEmergencies,
    recentFeedback,
  ] = await Promise.all([
    safe(
      () =>
        User.aggregate([{ $group: { _id: { $ifNull: ["$role", "user"] }, n: { $sum: 1 } } }]),
      []
    ),
    count(COL.complaints),
    safe(
      () =>
        db
          .collection(COL.complaints)
          .aggregate([
            {
              $group: {
                _id: { $toLower: { $toString: { $ifNull: ["$status", "pending"] } } },
                n: { $sum: 1 },
              },
            },
          ])
          .toArray(),
      []
    ),
    count(COL.business),
    count(COL.notices),
    count(COL.events),
    count(COL.lostFound),
    count(COL.gallery),
    count(COL.polls),
    count(COL.directory, { isProfileComplete: { $ne: false } }),
    count(COL.emergency, { status: "active" }),
    count(COL.emergency, { status: "resolved" }),
    safe(
      () =>
        db
          .collection(COL.feedback)
          .aggregate([{ $group: { _id: null, avg: { $avg: "$rating" }, n: { $sum: 1 } } }])
          .toArray(),
      []
    ),
    recent(COL.complaints),
    recent(COL.emergency, { status: "active" }),
    recent(COL.feedback),
  ]);

  const roles = Object.fromEntries(usersByRole.map((r) => [r._id, r.n]));
  const byStatus = Object.fromEntries(complaintsByStatus.map((r) => [r._id, r.n]));
  const fb = feedbackAgg[0] || { n: 0, avg: null };

  res.json({
    users: {
      residents: roles.user || 0,
      volunteers: roles.volunteer || 0,
      admins: roles.admin || 0,
      total: Object.values(roles).reduce((a, b) => a + b, 0),
    },
    complaints: { total: complaintsTotal, byStatus },
    emergency: {
      active: emergencyActive,
      resolved: emergencyResolved,
      total: emergencyActive + emergencyResolved,
    },
    feedback: {
      total: fb.n,
      avgRating: typeof fb.avg === "number" ? Math.round(fb.avg * 10) / 10 : null,
    },
    counts: { business, notices, events, lostFound, gallery, polls, directory },
    recent: {
      complaints: recentComplaints.map((d) =>
        slim(d, ["title", "subject", "complaint", "issue", "name"], ["description", "category", "location"])
      ),
      emergencies: recentEmergencies.map((d) =>
        slim(d, ["title", "emergencyType", "name"], ["location", "description"])
      ),
      feedback: recentFeedback.map((d) =>
        slim(d, ["message", "comment", "feedback", "text", "title"], ["name", "email", "category"])
      ),
    },
    updatedAt: new Date(),
  });
});

export default router;