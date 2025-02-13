import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Staff from "@/models/staff_data";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Create new staff member
export const createStaff = async (req: Request): Promise<NextResponse> => {
  try {
    // Handle CORS preflight request
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    await connectDB();
    const { phone } = await req.json();

    // Validation
    if (!phone) {
      return NextResponse.json(
        { error: "phone Number required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if phone number or username already exists
    const existingStaff = await Staff.findOne({
       phone
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: "Mobile number already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    // Create new staff
    const newStaff = await Staff.create({ phone });

    return NextResponse.json(
      { message: "Staff created successfully", data: newStaff },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500, headers: corsHeaders }
    );
  }
};
