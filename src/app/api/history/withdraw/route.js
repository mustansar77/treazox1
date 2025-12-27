import connectDB from "../../../../lib/db";
import Withdraw from "../../../../models/Withdraw";
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
// GET: Withdraw History
// ======================
export async function GET(req) {
  try {
    await connectDB();
    const user = await verifyToken(req, "user");

    const withdraws = await Withdraw.find({ user: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ withdraws });
  } catch (err) {
    console.error("GET /history/withdraw error:", err.message);
    return NextResponse.json(
      { message: err.message || "Failed to fetch withdraw history" },
      { status: 500 }
    );
  }
}
