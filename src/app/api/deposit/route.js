import connectDB from "../../../lib/db";
import Deposit from "../../../models/Deposit";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "wertyuiopsdfghjkzxcvbnmpoiuytrewasdfghjkmnbvcx";

// ======================
// Verify JWT and role
// ======================
async function verifyToken(req, requiredRole = "user") {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id) throw new Error("Invalid token");
    if (requiredRole && decoded.role !== requiredRole) throw new Error(`Unauthorized: Not ${requiredRole}`);
    return decoded; // { id, role }
  } catch (err) {
    console.error("verifyToken error:", err.message);
    throw new Error("Invalid token");
  }
}

// ======================
// POST: create new deposit (user)
// ======================
export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyToken(req, "user");

    const { amount, exchange, trxId } = await req.json();
    if (!amount || !exchange || !trxId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedExchange =
      typeof exchange === "string" ? JSON.parse(exchange) : exchange;

    const fee = Number(((amount * 5) / 100).toFixed(2)); // 5% fee
    const totalAmount = Number((amount + fee).toFixed(2));

    const newDeposit = await Deposit.create({
      user: user.id,
      amount,
      fee,
      totalAmount,
      exchange: parsedExchange,
      trxId,
      status: "pending",
    });

    const populatedDeposit = await Deposit.findById(newDeposit._id)
      .populate("user", "fullName email")
      .lean();

    return NextResponse.json({
      message: "Deposit submitted successfully",
      deposit: populatedDeposit,
    });
  } catch (err) {
    console.error("POST /deposit error:", err);
    return NextResponse.json(
      { message: err.message || "Error creating deposit" },
      { status: 500 }
    );
  }
}

// ======================
// GET: all deposits (admin only)
// ======================
export async function GET(req) {
  try {
    await connectDB();
    await verifyToken(req, "admin");

    const deposits = await Deposit.find()
      .populate("user", "fullName email")
      .lean();

    const normalized = deposits.map((d) => {
      if (d.totalAmount && d.fee !== undefined) return d;

      const fee = Number(((d.amount * 5) / 100).toFixed(2));
      return {
        ...d,
        fee,
        totalAmount: Number((d.amount + fee).toFixed(2)),
      };
    });

    return NextResponse.json({ deposits: normalized });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Error fetching deposits" },
      { status: 500 }
    );
  }
}

// ======================
// PUT: update deposit status (admin only)
// ======================
export async function PUT(req) {
  try {
    await connectDB();
    await verifyToken(req, "admin");

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ message: "Id and status required" }, { status: 400 });
    if (!["approved", "rejected"].includes(status)) return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    const deposit = await Deposit.findById(id);
    if (!deposit) return NextResponse.json({ message: "Deposit not found" }, { status: 404 });

    // Update status
    deposit.status = status;

    // ✅ Ensure required fields exist to prevent validation error
    if (deposit.fee === undefined) deposit.fee = Number(((deposit.amount * 5) / 100).toFixed(2));
    if (deposit.totalAmount === undefined) deposit.totalAmount = Number((deposit.amount + deposit.fee).toFixed(2));

    await deposit.save();

    return NextResponse.json({ message: `Deposit ${status}`, deposit });
  } catch (err) {
    console.error("PUT /deposits error:", err.message);
    return NextResponse.json({ message: err.message || "Error updating deposit" }, { status: 500 });
  }
}

// ======================
// DELETE: remove deposit (admin only)
// ======================
export async function DELETE(req) {
  try {
    await connectDB();
    await verifyToken(req, "admin");

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Id required" }, { status: 400 });

    const deposit = await Deposit.findByIdAndDelete(id);
    if (!deposit) return NextResponse.json({ message: "Deposit not found" }, { status: 404 });

    return NextResponse.json({ message: "Deposit deleted" });
  } catch (err) {
    console.error("DELETE /deposits error:", err.message);
    return NextResponse.json({ message: err.message || "Error deleting deposit" }, { status: 500 });
  }
}
