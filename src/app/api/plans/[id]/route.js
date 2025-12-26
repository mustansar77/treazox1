import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import Plan from "../../../../models/Plan";
import { adminMiddleware } from "../../../../middlewares/adminMiddleware";

// =======================
//      GET SINGLE PLAN (PUBLIC)
// =======================
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await Plan.findById(id);
    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// =======================
//      UPDATE PLAN (ADMIN)
// =======================
export async function PUT(req, { params }) {
  try {
    await connectDB();
    await adminMiddleware(req); // 🔐 ADMIN CHECK

    const { id } = params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
    }

    const plan = await Plan.findById(id);
    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    plan.totalPrice = body.totalPrice ?? plan.totalPrice;
    plan.duration = body.duration ?? plan.duration;
    plan.dailyEarning = body.dailyEarning ?? plan.dailyEarning;

    await plan.save();

    return NextResponse.json({ message: "Plan updated successfully", plan });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unauthorized" },
      { status: error.message?.includes("Admin") ? 403 : 401 }
    );
  }
}

// =======================
//      DELETE PLAN (ADMIN)
// =======================
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await adminMiddleware(req);

    // Force string & trim
    const id = String(params.id).trim();
if (!mongoose.Types.ObjectId.isValid(id)) {
  return NextResponse.json({ message: "Invalid plan ID" }, { status: 400 });
}
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan deleted successfully", plan: deletedPlan });
  } catch (error) {
    console.error("DELETE PLAN ERROR:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}