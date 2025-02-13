import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import twilio from "twilio";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL||"redis://localhost:6379");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// CORS Setup
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change to specific origin in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const loginPhone = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phone } = await req.json();


    // Case 1: Login via OTP (Phone Number)
    if (phone) {
      const user = await User.findOne({ phone });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
      }

      // Generate and send OTP
      const otp = generateOTP();

      const formattedPhone = `+91${phone}`;
      await redis.setex(formattedPhone, 300, otp);
      await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      // console.log(otp)

      return NextResponse.json(
        { message: "OTP sent to your phone number",phone,otp },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Invalid request. Provide either phone or username & password." },
      { status: 400, headers: corsHeaders }
    );

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500, headers: corsHeaders });
  }
};


const handleOptionsRequest = () => new NextResponse(null, { status: 204, headers: corsHeaders });

export const verifyPhone = async (req: Request) => {
  if (req.method === "OPTIONS") return handleOptionsRequest();
  try {
    const { phone, otp } = await req.json();

    const formattedPhone = `+91${phone}`;
 

    if (!phone || !otp) return NextResponse.json({ message: "Phone and OTP are required" }, { status: 400, headers: corsHeaders });
    const storedOTP = await redis.get(formattedPhone);

    if ( storedOTP == otp) {
      
      const token = `token-${formattedPhone}-${Date.now()}`;

    const user=await User.findOne({phone});
    if(user){
      return NextResponse.json({ message: "OTP verified successfully! Signup complete.",token,user:user }, { status: 200, headers: corsHeaders });
    }
    return NextResponse.json({ message: "User doesnt exist" }, { status: 400, headers: corsHeaders });

    }

    return NextResponse.json({ message: "Invalid OTP" }, { status: 400, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ message: `Error verifying OTP` }, { status: 500, headers: corsHeaders });
  }
};


export const credentialsLogin = async (req: Request) => {
  if (req.method === "OPTIONS") return handleOptionsRequest();
  try {
    const { username,password } = await req.json();


 
const user=await User.findOne({username,password});
    

   
    if(user){
      return NextResponse.json({ message: "Login success",user:user }, { status: 200, headers: corsHeaders });
    }
    
    return NextResponse.json({ message:"Invalid credentials" }, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    return NextResponse.json({ message: `Error` }, { status: 500, headers: corsHeaders });
  }
};

