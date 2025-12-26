import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // fetch password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        walletInfo: user.walletInfo,
      },
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
