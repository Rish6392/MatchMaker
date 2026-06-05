import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    matchedProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    score: Number,

    explanation: String,

    sent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Match ||
  mongoose.model("Match", MatchSchema);