import mongoose from "mongoose";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment variable for debugging (remove in production)
console.log("MONGODB_URI value:", process.env.MONGODB_URI ? "Found" : "Not found");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/assam";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    console.log("Connecting to MongoDB at:", MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')); // Log URI with hidden credentials
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully to deployed database");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
