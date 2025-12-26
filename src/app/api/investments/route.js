import connectDB from "../../../lib/db";
import Investment from "../../../models/Investment";
import Plan from "../../../models/Plan";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const SECRET = process.env.JWT_SECRET || "wertyuiopsdfghjkzxcvbnmpoiuytrewasdfghjkmnbvcx";

// Middleware to verify user token
async function verifyUser(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);

    if (!decoded.id) throw new Error("Invalid token");
    if (decoded.role !== "user") throw new Error("Unauthorized: Not a user");

    return decoded; // { id, role }
  } catch (err) {
    console.error("verifyUser error:", err.message);
    throw new Error("Invalid token");
  }
}

// ======================
// POST create new investment (User must be logged in)
// ======================
export async function POST(req) {
  try {
    await connectDB();

    // Authenticate user
    const user = await verifyUser(req);

    if (!user || !mongoose.Types.ObjectId.isValid(user.id)) {
      return NextResponse.json({ message: "Invalid user token" }, { status: 401 });
    }

    // Get data from frontend
    const { planId, transactionId, exchange } = await req.json();
    if (!planId || !transactionId || !exchange) {
      return NextResponse.json({ message: "Plan ID, transaction ID, and exchange are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

    // Create new investment
    const newInvestment = await Investment.create({
      user: user.id,
      plan: plan._id,
      price: plan.totalPrice,
      duration: plan.duration,
      dailyEarning: plan.dailyEarning,
      transactionId,
      exchange,
      status: "processing",
    });

    // Populate user and plan for response
    const populatedInvestment = await Investment.findById(newInvestment._id)
      .populate("user", "fullName email")
      .populate("plan", "totalPrice duration dailyEarning")
      .lean();

    return NextResponse.json({
      message: "Investment submitted successfully",
      investment: populatedInvestment,
    });

  } catch (err) {
    console.error("POST /investments error:", err);
    return NextResponse.json({ message: err.message || "Error creating investment" }, { status: 500 });
  }
}

// ======================
// GET all investments (Admin only)
// ======================
export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id || decoded.role !== "admin") throw new Error("Not admin");

    const investments = await Investment.find()
      .populate("user", "fullName email")
      .populate("plan", "totalPrice duration dailyEarning")
      .lean();

    return NextResponse.json({ investments });
  } catch (err) {
    console.error("GET /investments error:", err.message);
    return NextResponse.json({ message: err.message || "Error fetching investments" }, { status: 500 });
  }
}

// ======================
// PUT update investment status (Admin only)
// ======================
export async function PUT(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id || decoded.role !== "admin") throw new Error("Not admin");

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ message: "Id and status required" }, { status: 400 });
    if (!["approved", "rejected"].includes(status)) return NextResponse.json({ message: "Invalid status" }, { status: 400 });

    const investment = await Investment.findById(id);
    if (!investment) return NextResponse.json({ message: "Investment not found" }, { status: 404 });

    investment.status = status;
    await investment.save();

    return NextResponse.json({ message: `Investment ${status}`, investment });
  } catch (err) {
    console.error("PUT /investments error:", err.message);
    return NextResponse.json({ message: err.message || "Error updating investment" }, { status: 500 });
  }
}

// ======================
// DELETE investment (Admin only)
// ======================
export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    if (!decoded.id || decoded.role !== "admin") throw new Error("Not admin");

    const { id } = await req.json();
    const investment = await Investment.findByIdAndDelete(id);
    if (!investment) return NextResponse.json({ message: "Investment not found" }, { status: 404 });

    return NextResponse.json({ message: "Investment deleted" });
  } catch (err) {
    console.error("DELETE /investments error:", err.message);
    return NextResponse.json({ message: err.message || "Error deleting investment" }, { status: 500 });
  }
}
