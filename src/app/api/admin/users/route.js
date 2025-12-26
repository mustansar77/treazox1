import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

// Simple admin middleware for route handler
async function adminMiddleware(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role !== "admin") throw new Error("Not admin");
    return decoded; // user info
  } catch (err) {
    throw new Error("Invalid token");
  }
}

export async function GET(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const users = await User.find().select("-password");
    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET /users error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error fetching users" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { fullName, email, phone, password, role } = await req.json();
    if (!fullName || !email || !phone || !password)
      return NextResponse.json({ message: "All fields required" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, email, phone, password: hashedPassword, role: role || "user" });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("POST /users error:", err.message);
    return NextResponse.json({ message: err.message || "Error creating user" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id, fullName, email, phone, role } = await req.json();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();
    return NextResponse.json({ message: "User updated", user });
  } catch (err) {
    console.error("PUT /users error:", err.message);
    return NextResponse.json({ message: err.message || "Error updating user" }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    await connectDB();
    await adminMiddleware(req);

    const { id } = await req.json();

    // Use findByIdAndDelete instead of remove()
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE /users error:", err.message);
    return NextResponse.json(
      { message: err.message || "Error deleting user" },
      { status: 500 }
    );
  }
}
