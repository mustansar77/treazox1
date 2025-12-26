import connectDB from "../../../lib/db";
import Withdraw from "../../../models/Withdraw";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const SECRET = process.env.JWT_SECRET || "secret";

// Middleware to verify user
async function verifyUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Token missing");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET);
  if (!decoded.id) throw new Error("Invalid token");
  return decoded;
}

// Middleware to verify admin
async function verifyAdmin(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Token missing");

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET);
  if (!decoded.id || decoded.role !== "admin") throw new Error("Unauthorized: Not admin");
  return decoded;
}

// ======================
// POST create withdraw (user)
// ======================
export async function POST(req) {
  try {
    await connectDB();
    const user = await verifyUser(req);

    const { amount, exchange, network, address } = await req.json();
    if (!amount || !exchange || !network || !address) {
      return NextResponse.json({ message: "All fields required" }, { status: 400 });
    }

    const newWithdraw = await Withdraw.create({
      user: user.id,
      amount,
      exchange,
      network,
      address,
      status: "pending",
    });

    return NextResponse.json({ message: "Withdraw request submitted", withdraw: newWithdraw });
  } catch (err) {
    console.error("POST /withdraws error:", err);
    return NextResponse.json({ message: err.message || "Error creating withdraw" }, { status: 500 });
  }
}

// ======================
// GET all withdraws (admin)
// ======================
export async function GET(req) {
  try {
    await connectDB();
    await verifyAdmin(req);

    const withdraws = await Withdraw.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ withdraws });
  } catch (err) {
    console.error("GET /withdraws error:", err);
    return NextResponse.json({ message: err.message || "Error fetching withdraws" }, { status: 500 });
  }
}

// ======================
// PUT update withdraw status (admin)
// ======================
export async function PUT(req) {
  try {
    await connectDB();
    await verifyAdmin(req);

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ message: "Id and status required" }, { status: 400 });
    if (!["pending", "processing", "completed", "rejected"].includes(status))
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    const withdraw = await Withdraw.findById(id);
    if (!withdraw) return NextResponse.json({ message: "Withdraw not found" }, { status: 404 });

    withdraw.status = status;
    await withdraw.save();

    return NextResponse.json({ message: `Withdraw ${status}`, withdraw });
  } catch (err) {
    console.error("PUT /withdraws error:", err);
    return NextResponse.json({ message: err.message || "Error updating withdraw" }, { status: 500 });
  }
}

// ======================
// DELETE withdraw (admin)
// ======================
export async function DELETE(req) {
  try {
    await connectDB();
    await verifyAdmin(req);

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Id required" }, { status: 400 });

    const withdraw = await Withdraw.findByIdAndDelete(id);
    if (!withdraw) return NextResponse.json({ message: "Withdraw not found" }, { status: 404 });

    return NextResponse.json({ message: "Withdraw deleted" });
  } catch (err) {
    console.error("DELETE /withdraws error:", err);
    return NextResponse.json({ message: err.message || "Error deleting withdraw" }, { status: 500 });
  }
}
