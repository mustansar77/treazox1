import connectDB from "../../../../lib/db";
import LuckyDraw from "../../../../models/LuckyDraw";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

async function verifyToken(req, requiredRole = "user") {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized: Token missing");
  try {
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id) throw new Error("Invalid token");
    if (requiredRole && decoded.role !== requiredRole)
      throw new Error(`Unauthorized: Not ${requiredRole}`);
    return decoded;
  } catch (err) {
    console.error("verifyToken error:", err.message);
    throw new Error("Invalid token");
  }
}

// POST join lucky draw
export async function POST(req, { params }) {
  try {
    await connectDB();
    const user = await verifyToken(req, "user");

    const { id } = params; // Draw ID from URL
    const draw = await LuckyDraw.findById(id);
    if (!draw) return NextResponse.json({ message: "Lucky draw not found" }, { status: 404 });

    const now = new Date();
    if (now > new Date(draw.endDate)) return NextResponse.json({ message: "Draw has ended" }, { status: 400 });
    if (draw.participants.some(p => p.userId.toString() === user.id)) return NextResponse.json({ message: "You already joined" }, { status: 400 });
    if (draw.participants.length >= draw.participantsLimit) return NextResponse.json({ message: "Draw is full" }, { status: 400 });

    draw.participants.push({ userId: user.id });
    await draw.save();

    return NextResponse.json({ message: "Participation successful", draw });
  } catch (err) {
    console.error("POST /luckydraws/join error:", err.message);
    return NextResponse.json({ message: err.message || "Error joining lucky draw" }, { status: 500 });
  }
}
