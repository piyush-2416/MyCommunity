import mongoose from "mongoose";

// NOTE: nested object mein "type" naam ka field mat rakho (Mongoose use alag samajhta hai),
// isliye community type ke liye "kind" use kiya hai.
const planSchema = new mongoose.Schema(
  {
    community: {   
      name: { type: String, required: true },
      kind: { type: String, required: true },
      households: { type: Number, required: true },
      location: { type: String, default: "" },
    },
    risks: [String],
    vulnerable: [String],
    resources: [String],
    notes: { type: String, default: "" },

    plan: { type: mongoose.Schema.Types.Mixed, required: true }, // AI ka banaya plan
    done: { type: [String], default: [] }, // tick kiye hue checklist item ids
    fallback: { type: Boolean, default: false }, // AI fail hua to true
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
