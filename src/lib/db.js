import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI="mongodb+srv://staricdigital_db_user:D7gt2gAsEFwahFrp@treazoxbe.l8ercl3.mongodb.net/?appName=treazoxbe"

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in your .env file");
}

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
