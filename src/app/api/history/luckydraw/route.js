import connectDB from "../../../../lib/db";
import LuckyDraw from "../../../../models/LuckyDraw";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "wertyuiopsdfghjkzxcvbnmpoiuytrewasdfghjkmnbvcx";

// ======================
async function verifyToken(req, requiredRole = "user") {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET);
  if (!decoded.id) throw new Error("Invalid token");
  if (decoded.role !== requiredRole) throw new Error("Unauthorized");

  return decoded;
}

// ======================
// GET: Lucky Draw Win History
// ======================
export async function GET(req) {
  try {
    await connectDB();
    const user = await verifyToken(req, "user");

    const wins = await LuckyDraw.find({
      "winners.userId": user.id,
    }).lean();

    return NextResponse.json({ wins });
  } catch (err) {
    console.error("GET /history/lucky-draw error:", err.message);
    return NextResponse.json(
      { message: err.message || "Failed to fetch lucky draw history" },
      { status: 500 }
    );
  }
}
