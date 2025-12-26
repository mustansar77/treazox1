import connectDB from "../../../../lib/db";
import Plan from "../../../../models/Plan";
import { NextResponse } from "next/server";
import { adminMiddleware } from "../../../../middlewares/adminMiddleware";
import mongoose from "mongoose";

// =======================
// GET ALL PLANS (ADMIN)
// =======================
export async function GET(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const plans = await Plan.find();
    return NextResponse.json({ plans });
  } catch (err) {
    console.error("GET /plans error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error fetching plans" },
      { status: 500 }
    );
  }
}

// =======================
// CREATE PLAN (ADMIN)
// =======================
export async function POST(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { totalPrice, duration, dailyEarning } = await req.json();
    if (!totalPrice || !duration || !dailyEarning)
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );

    const newPlan = await Plan.create({ totalPrice, duration, dailyEarning });
    return NextResponse.json({ message: "Plan created", plan: newPlan });
  } catch (err) {
    console.error("POST /plans error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error creating plan" },
      { status: 500 }
    );
  }
}

// =======================
// UPDATE PLAN (ADMIN)
// =======================
export async function PUT(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id, totalPrice, duration, dailyEarning } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await Plan.findById(id);
    if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

    plan.totalPrice = totalPrice ?? plan.totalPrice;
    plan.duration = duration ?? plan.duration;
    plan.dailyEarning = dailyEarning ?? plan.dailyEarning;

    await plan.save();
    return NextResponse.json({ message: "Plan updated", plan });
  } catch (err) {
    console.error("PUT /plans error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error updating plan" },
      { status: 500 }
    );
  }
}

// =======================
// DELETE PLAN (ADMIN)
// =======================
export async function DELETE(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await Plan.findByIdAndDelete(id);
    if (!plan) return NextResponse.json({ message: "Plan not found" }, { status: 404 });

    return NextResponse.json({ message: "Plan deleted" });
  } catch (err) {
    console.error("DELETE /plans error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error deleting plan" },
      { status: 500 }
    );
  }
}
