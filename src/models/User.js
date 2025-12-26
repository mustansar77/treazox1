import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: true }, // always fetchable for login
    referralCode: { type: String, unique: true, sparse: true },
    walletInfo: { type: Number, default: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// ✅ Hash password automatically before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Generate referral code if not provided
  if (!this.referralCode) {
    this.referralCode =
      "REF" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
});

// ✅ Match password method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
