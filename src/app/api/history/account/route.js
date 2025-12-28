import connectDB from "../../../../lib/db";
import Deposit from "../../../../models/Deposit";
import Withdraw from "../../../../models/Withdraw";
import Investment from "../../../../models/Investment";
import Plan from "../../../../models/Plan"; // ✅ Import Plan model
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET = process.env.JWT_SECRET || "secret";

export async function GET(req) {
  try {
    await connectDB();

    /* ================= GET TOKEN FROM COOKIE ================= */
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    /* ================= FETCH DATA ================= */

    const deposits = await Deposit.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const investments = await Investment.find({ user: userId })
      .populate("plan") // ✅ Plan is now imported, populate will work
      .sort({ createdAt: -1 })
      .lean();

    const withdraws = await Withdraw.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    /* ================= NORMALIZE DATA ================= */

    const depositHistory = deposits.map((d) => ({
      type: "Deposit",
      amount: d.totalAmount || d.amount,
      plan: "-", // Deposits don't have a plan
      status: d.status,
      date: d.createdAt,
    }));

    const investmentHistory = investments.map((i) => ({
      type: "Plan Activated",
      amount: i.price,
      plan: i.plan?.name || "N/A",
      status: i.status || "Active",
      date: i.createdAt,
    }));

    const withdrawHistory = withdraws.map((w) => ({
      type: "Withdraw",
      amount: w.netAmount || w.amount,
      plan: "-",
      status: w.status,
      date: w.createdAt,
    }));

    /* ================= MERGE & SORT ================= */

    const history = [
      ...depositHistory,
      ...investmentHistory,
      ...withdrawHistory,
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return NextResponse.json({ success: true, history });

  } catch (error) {
    console.error("ACCOUNT HISTORY ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
