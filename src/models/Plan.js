import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true, // in days
    },
    dailyEarning: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite error in Next.js
export default mongoose.models.Plan || mongoose.model("Plan", planSchema);
