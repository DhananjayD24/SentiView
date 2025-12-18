import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    // Firebase UID (NOT MongoDB ObjectId)
    userId: {
      type: String,
      required: false, // guest users allowed
      index: true,
    },

    inputType: {
      type: String,
      enum: ["text", "product"],
      required: true,
    },

    inputValue: {
      type: String,
      required: true,
    },

    // Full analysis result JSON
    result: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Analysis", analysisSchema);
