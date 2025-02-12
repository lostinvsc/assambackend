import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Staff from "@/models/staff_data";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Controller to create a new user
export const createUser = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phoneNumber, username, password } = await req.json();
    const mobileNumber = phoneNumber;

    // Validate phone number
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400, headers: corsHeaders });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409, headers: corsHeaders });
    }

    // Check if username is unique (if provided)
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409, headers: corsHeaders });
      }
    }

    // Create new user
    const newUser = new User({ mobileNumber, username, password });
    await newUser.save();

    // Update Staff record if found
    await Staff.findOneAndUpdate({ phoneNumber: newUser.mobileNumber }, { signed_up: true });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500, headers: corsHeaders }
    );
  }
};
