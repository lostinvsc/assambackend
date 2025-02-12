import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import twilio from "twilio";

// Twilio Setup 
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// CORS Setup
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to specific origin in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loginUser = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phoneNumber, username, password } = await req.json();
    const mobileNumber = phoneNumber;

    // Case 1: Login via OTP (Phone Number)
    if (mobileNumber) {
      const user = await User.findOne({ mobileNumber });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
      }

      // Generate and send OTP
      const generatedOTP = generateOTP();
      await twilioClient.messages.create({
        body: `Your OTP for login is: ${generatedOTP}`,
        messagingServiceSid: "MG5121cf9ca4ba837b88a363fe629a89e4",
        to: `+91${mobileNumber}`,
      });

      console.log(generatedOTP);

      return NextResponse.json(
        { message: "OTP sent to your phone number", otp: generatedOTP, user },
        { status: 200, headers: corsHeaders }
      );
    }

    // Case 2: Login via Username & Password
    if (username && password) {
      const user = await User.findOne({ username });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
      }

      if (user.password !== password) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401, headers: corsHeaders });
      }

      return NextResponse.json(
        { message: "Login successful via username & password", user },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Invalid request. Provide either mobileNumber or username & password." },
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500, headers: corsHeaders });
  }
};
