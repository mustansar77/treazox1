import mongoose from "mongoose";

const LuckyDrawSchema = new mongoose.Schema(
  {
    buyPrice: { type: Number, required: true },
    winningPrice: { type: Number, required: true },
    participantsLimit: { type: Number, required: true },
    winnersCount: { type: Number, required: true },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    winners: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        wonAt: { type: Date, default: Date.now },
      },
    ],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false }, // prevent multiple winner selection
  },
  { timestamps: true }
);

// ---------------------
// Helper function to select winners
// ---------------------
export async function selectWinners(draw) {
  if (!draw || draw.isCompleted || draw.participants.length === 0) return null;

  // Shuffle participants randomly
  const shuffled = [...draw.participants].sort(() => 0.5 - Math.random());
  const winners = shuffled
    .slice(0, Math.min(draw.winnersCount, shuffled.length))
    .map((p) => ({ userId: p.userId }));

  draw.winners = winners;
  draw.isCompleted = true; // mark as completed
  await draw.save();

  return draw;
}

export default mongoose.models.LuckyDraw ||
  mongoose.model("LuckyDraw", LuckyDrawSchema);
