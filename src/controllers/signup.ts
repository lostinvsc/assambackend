import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Staff from "@/models/staff_data";
import twilio from "twilio";

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

// Initialize Twilio Client
const client = twilio(accountSid, authToken);

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup Controller
export const signup = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phoneNumber } = await req.json();

    // Validate mobile number
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find staff by mobile number
    const staff = await Staff.findOne({ phoneNumber });

    if (!staff) {
      return NextResponse.json(
        { error: "Mobile number not registered" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if already signed up
    if (staff.signed_up) {
      return NextResponse.json(
        { error: "Already signed up" },
        { status: 409, headers: corsHeaders }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for signup is: ${otp}`,
      messagingServiceSid: "MG5121cf9ca4ba837b88a363fe629a89e4",
      to: `+91${phoneNumber}`, // Assuming Indian numbers, modify as needed
    });

    return NextResponse.json(
      { message: "OTP sent successfully", otp },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500, headers: corsHeaders }
    );
  }
};
