import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { fullName, email, phone, password, referralCode } = await req.json();

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password, // plain password, Mongoose pre-save hook will hash it
      referralCode: referralCode || undefined,
    });

    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
