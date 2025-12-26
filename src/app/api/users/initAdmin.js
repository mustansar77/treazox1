import connectDB from "../../lib/db";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  const { fullName, email, phone, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Create new admin
  const admin = await User.create({
    fullName,
    email,
    phone,
    password, // will be hashed automatically
    role: "admin",
  });

  res.status(201).json({
    message: "Admin created successfully",
    admin: {
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  });
}
