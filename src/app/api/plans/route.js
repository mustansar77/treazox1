import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Plan from "../../../models/Plan";
import { adminMiddleware } from "../../../middlewares/adminMiddleware";

// =======================
//      CREATE PLAN (ADMIN)
// =======================
export async function POST(req) {
  try {
    await connectDB();

    const adminCheck = await adminMiddleware(req);
    if (adminCheck instanceof NextResponse) return adminCheck;

    const body = await req.json();
    let { totalPrice, duration, dailyEarning } = body;

    totalPrice = Number(totalPrice);
    duration = Number(duration);
    dailyEarning = Number(dailyEarning);

    if (!totalPrice || !duration || !dailyEarning) {
      return NextResponse.json(
        { message: "All fields are required and must be numbers" },
        { status: 400 }
      );
    }

    const existing = await Plan.findOne({ totalPrice, duration, dailyEarning });
    if (existing) {
      return NextResponse.json(
        { message: "Plan already exists" },
        { status: 400 }
      );
    }

    const plan = await Plan.create({ totalPrice, duration, dailyEarning });

    return NextResponse.json(
      { message: "Plan created successfully", plan },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// =======================
//      GET ALL PLANS (PUBLIC)
// =======================
export async function GET() {
  try {
    await connectDB();
    const plans = await Plan.find().sort({ createdAt: 1 });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// =======================
//      DELETE ALL PLANS (ADMIN)
// =======================
export async function DELETE(req) {
  try {
    await connectDB();

    const adminCheck = await adminMiddleware(req);
    if (adminCheck instanceof NextResponse) return adminCheck;

    await Plan.deleteMany({});
    return NextResponse.json({ message: "All plans deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
