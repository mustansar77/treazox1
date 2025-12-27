import mongoose from "mongoose";

const withdrawSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },        // 10% fee
    netAmount: { type: Number, required: true }, // amount after fee
    exchange: { type: String, required: true },
    network: { type: String, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.models.Withdraw || mongoose.model("Withdraw", withdrawSchema);
export default Withdraw;
