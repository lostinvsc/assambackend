import dotenv from "dotenv";
dotenv.config()
import { connectDB } from "@/lib/db";
import Staff from "@/models/staff_data";
import { NextResponse } from "next/server";
import twilio from "twilio";
import User from "@/models/user";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL||"redis://localhost:6379");


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
export const requestOtp = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phone } = await req.json();

    // Validate mobile number
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find staff by mobile number
    const staff = await Staff.findOne({ phone });

    if (!staff) {
      return NextResponse.json(
        { error: "Mobile number not registered" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if already signed up
    if (staff.signed_up) {
      return NextResponse.json(
        { error: "This Mobile number have already generated credentials" },
        { status: 409, headers: corsHeaders }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    const formattedPhone = `+91${phone}`;
    
    await redis.setex(formattedPhone, 300, otp);

    // Send OTP via Twilio

    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });
  
    console.log(otp)

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500, headers: corsHeaders }
    );
  }
};

const handleOptionsRequest = () => new NextResponse(null, { status: 204, headers: corsHeaders });

export const verifyOTP = async (req: Request) => {
  if (req.method === "OPTIONS") return handleOptionsRequest();
  try {
    var { phone, otp,password,username } = await req.json();

    const formattedPhone = `+91${phone}`;
 

    if (!phone || !otp) return NextResponse.json({ message: "Phone and OTP are required" }, { status: 400, headers: corsHeaders });
 
  
    const storedOTP = await redis.get(formattedPhone);
    // console.log("verified otp is :", storedOTP);
        if (storedOTP == otp) {

      const token = `token-${formattedPhone}-${Date.now()}`;

      const user=await User.create({phone,username,password})
     await Staff.findOneAndUpdate({phone},{signed_up:true});
      return NextResponse.json({ message: "OTP verified successfully! Signup complete.",token,user:user }, { status: 200, headers: corsHeaders });
    }

    return NextResponse.json({ message: "Invalid OTP" }, { status: 400, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ message: `Error verifying OTP` }, { status: 500, headers: corsHeaders });
  }
};
