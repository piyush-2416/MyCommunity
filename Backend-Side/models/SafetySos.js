import mongoose from "mongoose";

// Har SOS ka record (Community-data database ke "Safety-sos" collection mein)
const sosSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" }, // 10 digit, sirf tab jab sahi number diya ho
    message: { type: String, required: true },

    // Location optional hai (user ne permission na di ho to ye field hi nahi banegi)
    coords: {
      lat: Number,
      lng: Number,
      accuracy: Number, // meters
    },

    level: { type: String, enum: ["caution", "danger", "emergency"], default: "emergency" },
    reason: { type: String, enum: ["button", "timer", "check"], default: "button" },
    communityAlerted: { type: Boolean, default: false }, // Emergency page par bhi gaya ya nahi
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "Safety-sos",
  }
);

sosSchema.index({ createdAt: -1 });

export default mongoose.model("SafetySos", sosSchema);
