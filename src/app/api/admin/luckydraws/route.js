import connectDB from "../../../../lib/db";
// import LuckyDraw from "../../../../models/LuckyDraw";
import LuckyDraw, { selectWinners } from "../../../../models/LuckyDraw";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

// ======================
// Verify JWT and role
// ======================
async function verifyToken(req, requiredRole = "user") {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Unauthorized: Token missing");

  try {
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id) throw new Error("Invalid token");
    if (requiredRole && decoded.role !== requiredRole)
      throw new Error(`Unauthorized: Not ${requiredRole}`);
    return decoded; // { id, role }
  } catch (err) {
    console.error("verifyToken error:", err.message);
    throw new Error("Invalid token");
  }
}

// ======================
// Automatically pick winners for ended draws
// ======================
async function announceWinners(draw) {
  // 1. Already completed → do nothing
  if (draw.isCompleted) return;

  // 2. Not enough participants yet → do nothing
  if (draw.participants.length < draw.participantsLimit) return;

  // 3. Pick winners only once when full
  await selectWinners(draw);
}

// ======================
// GET all lucky draws
// ======================
export async function GET(req) {
  try {
    await connectDB();
    await verifyToken(req);

    let draws = await LuckyDraw.find()
      .populate("participants.userId", "fullName email")
      .populate("winners.userId", "fullName email");

    for (let draw of draws) {
      // Announce winners only for full draws
      await announceWinners(draw);
    }

    // Re-fetch to include winners after update
    draws = await LuckyDraw.find()
      .populate("participants.userId", "fullName email")
      .populate("winners.userId", "fullName email");

    return NextResponse.json({ draws });
  } catch (err) {
    console.error("GET /luckydraws error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error fetching lucky draws" },
      { status: 500 }
    );
  }
}


// ======================
// POST: Join lucky draw
// ======================
export async function POST(req) {
  try {
    await connectDB();
    const user = await verifyToken(req, "user");

    const { drawId } = await req.json();
    if (!drawId)
      return NextResponse.json({ message: "drawId is required" }, { status: 400 });

    const draw = await LuckyDraw.findById(drawId);
    if (!draw)
      return NextResponse.json({ message: "Lucky draw not found" }, { status: 404 });

    const now = new Date();
    if (now > new Date(draw.endDate))
      return NextResponse.json({ message: "Draw has ended" }, { status: 400 });
    if (draw.participants.some((p) => p.userId.toString() === user.id))
      return NextResponse.json({ message: "You already joined" }, { status: 400 });
    if (draw.participants.length >= draw.participantsLimit)
      return NextResponse.json({ message: "Draw is full" }, { status: 400 });

    draw.participants.push({ userId: user.id });
    await draw.save();

    return NextResponse.json({ message: "Participation successful", draw });
  } catch (err) {
    console.error("POST /luckydraws join error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error joining lucky draw" },
      { status: 500 }
    );
  }
}

// ======================
// Admin POST (create lucky draw)
// ======================
export async function ADMIN_POST(req) {
  try {
    await connectDB();
    const admin = await verifyToken(req, "admin");

    const { buyPrice, winningPrice, participantsLimit, winnersCount } = await req.json();
    if (!buyPrice || !winningPrice || !participantsLimit || !winnersCount) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after start

    const draw = await LuckyDraw.create({
      buyPrice,
      winningPrice,
      participantsLimit,
      winnersCount,
      startDate,
      endDate,
    });

    return NextResponse.json({ message: "Lucky draw created", draw });
  } catch (err) {
    console.error("ADMIN_POST /luckydraws error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error creating lucky draw" },
      { status: 500 }
    );
  }
}
