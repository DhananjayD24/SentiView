import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    // Firebase UID
    userId: {
      type: String,
      required: false, // guest users allowed
      index: true,
    },

    platform: {
      type: String,
      enum: ["amazon", "flipkart"],
      required: true,
    },

    product: {
      name: { type: String },
      url: { type: String },
    },

    summaryCounts: {
      type: Object,
      required: true,
    },

    aspectSummary: {
      type: Object,
      required: true,
    },

    severityAnalysis: {
      type: Object,
      required: true,
    },

    insights: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analysis", analysisSchema);
