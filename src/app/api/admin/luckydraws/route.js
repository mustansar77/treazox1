import connectDB from "../../../../lib/db";
import LuckyDraw from "../../../../models/LuckyDraw";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

// Admin middleware
async function adminMiddleware(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin") throw new Error("Not admin");
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// GET all lucky draws
export async function GET(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const draws = await LuckyDraw.find();
    return NextResponse.json({ draws });
  } catch (err) {
    console.error("GET /luckydraws error:", err.message);
    return NextResponse.json({ message: err.message || "Error fetching lucky draws" }, { status: 500 });
  }
}

// POST create lucky draw
export async function POST(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { buyPrice, winningPrice, participantsLimit, winnersCount, endDate } = await req.json();
    if (!buyPrice || !winningPrice || !participantsLimit || !winnersCount || !endDate) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const draw = await LuckyDraw.create({
      buyPrice,
      winningPrice,
      participantsLimit,
      winnersCount,
      endDate: new Date(endDate),
    });

    return NextResponse.json({ message: "Lucky draw created", draw });
  } catch (err) {
    console.error("POST /luckydraws error:", err.message);
    return NextResponse.json({ message: err.message || "Error creating lucky draw" }, { status: 500 });
  }
}

// PUT update lucky draw
export async function PUT(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id, buyPrice, winningPrice, participantsLimit, winnersCount, endDate } = await req.json();
    const draw = await LuckyDraw.findById(id);
    if (!draw) return NextResponse.json({ message: "Lucky draw not found" }, { status: 404 });

    draw.buyPrice = buyPrice ?? draw.buyPrice;
    draw.winningPrice = winningPrice ?? draw.winningPrice;
    draw.participantsLimit = participantsLimit ?? draw.participantsLimit;
    draw.winnersCount = winnersCount ?? draw.winnersCount;
    draw.endDate = endDate ? new Date(endDate) : draw.endDate;

    await draw.save();
    return NextResponse.json({ message: "Lucky draw updated", draw });
  } catch (err) {
    console.error("PUT /luckydraws error:", err.message);
    return NextResponse.json({ message: err.message || "Error updating lucky draw" }, { status: 500 });
  }
}

// DELETE lucky draw
export async function DELETE(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id } = await req.json();
    const draw = await LuckyDraw.findByIdAndDelete(id);
    if (!draw) return NextResponse.json({ message: "Lucky draw not found" }, { status: 404 });

    return NextResponse.json({ message: "Lucky draw deleted" });
  } catch (err) {
    console.error("DELETE /luckydraws error:", err.message);
    return NextResponse.json({ message: err.message || "Error deleting lucky draw" }, { status: 500 });
  }
}
