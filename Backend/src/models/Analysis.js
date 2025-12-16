import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // 👈 IMPORTANT
    },
    inputType: {
      type: String,
      enum: ["text", "product"]
    },
    inputValue: String,

    result: Object // store full analysis JSON
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
