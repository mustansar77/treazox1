import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  dailyEarning: { type: Number, required: true },
  transactionId: { type: String, required: true },
  exchange: { type: String, required: true }, // <-- Make sure this line exists
  status: { type: String, enum: ["processing", "approved", "rejected"], default: "processing" },
}, { timestamps: true });

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
