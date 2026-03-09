import mongoose from "mongoose";

const calculatorLeadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      index: true,
    },

    mobile: {
      type: String,
    },

    investorType: {
      type: String,
    },

    activity: {
      type: String,
      index: true,
    },

    city: {
      type: String,
    },

    timeline: {
      type: String,
    },

    visas: {
      type: Number,
      default: 0,
    },

    bankSupport: Boolean,
    accountingSupport: Boolean,
    vroSupport: Boolean,

    // AI prediction
    estimatedMinCost: Number,
    estimatedMaxCost: Number,
    recommendedSetup: String,

    aiReport: String,

    source: {
      type: String,
      default: "ksa-calculator",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CalculatorLead", calculatorLeadSchema);