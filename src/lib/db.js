import mongoose from "mongoose";
import User from "../models/User"; // import your User model

const MONGO_URI =
  "mongodb+srv://staricdigital_db_user:D7gt2gAsEFwahFrp@treazoxbe.l8ercl3.mongodb.net/?appName=treazoxbe";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in your .env file");
}

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then(async (mongoose) => {
      console.log("MongoDB connected");

      // 🔹 Initialize Admin if not exists
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists) {
        const adminData = {
          fullName: "Super Admin",
          email: "admin@treazox.com",
          phone: "1234567890",
          password: "Admin@123", // default password, can be changed later
          role: "admin",
        };
        await User.create(adminData);
        console.log("Admin initialized:", adminData.email);
      }

      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
