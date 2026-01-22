import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    investorType: { type: String, required: true },
    activity: { type: String, required: true },
    city: { type: String, required: true },
    timeline: { type: String, required: true },
    visas: { type: Number, default: 0 },

    supports: {
      bankSupport: { type: Boolean, default: false },
      accountingSupport: { type: Boolean, default: false },
      vroSupport: { type: Boolean, default: false },
    },

    estimate: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      timelineText: { type: String, required: true },
      recommendedSetup: { type: String, required: true },
      suggestedCity: { type: String, required: true },
    },

    aiReply: { type: String, default: "" },

    source: { type: String, default: "ksa-cost-calculator" },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);
