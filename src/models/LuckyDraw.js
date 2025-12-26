import mongoose from "mongoose";

const LuckyDrawSchema = new mongoose.Schema(
  {
    buyPrice: { type: Number, required: true }, // Price to join
    winningPrice: { type: Number, required: true }, // Total prize
    participantsLimit: { type: Number, required: true }, // Max participants
    winnersCount: { type: Number, required: true }, // Number of winners
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    winners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true }, // 4-5 days from start
  },
  { timestamps: true }
);

export default mongoose.models.LuckyDraw || mongoose.model("LuckyDraw", LuckyDrawSchema);
