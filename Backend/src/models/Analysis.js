import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    processedReviews: {
      type: [String], // array of hashes or review IDs
      default: [],
    },
    // Firebase UID
    userId: {
      type: String,
      required: false, // guest users allowed
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true, // 🔑 key field
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

    totalSentences: {
      type: Number,
      default: 0,
    },

    insights: {
      reasonsToBuy: [
        {
          word: String,
          count: Number,
        },
      ],
      reasonsToAvoid: [
        {
          word: String,
          count: Number,
        },
      ],
      mixedAspects: [
        {
          word: String,
          count: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Analysis", analysisSchema);
