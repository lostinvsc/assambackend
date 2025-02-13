import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/application_model";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS Preflight Requests
const handleOptionsRequest = () => new NextResponse(null, { status: 204, headers: corsHeaders });

// Create Application
export const createApplication = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method === "OPTIONS") return handleOptionsRequest();

  try {
    await connectDB();
    
    const body = await req.json(); // Fix: Await the JSON parsing

    // Validate required fields (Add field validation if necessary)

    const newApplication = await Application.create(body); // Fix: Pass `body` directly

    return NextResponse.json(
      { message: "Application submitted", data: newApplication },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500, headers: corsHeaders }
    );
  }
};

// Get All Applications
export const getApplications = async (req: NextRequest): Promise<NextResponse> => { // Fix: Accept `req` parameter
  if (req.method === "OPTIONS") return handleOptionsRequest(); // Fix: Ensure OPTIONS request is handled

  try {
    await connectDB();
    const applications = await Application.find();
    return NextResponse.json({ data: applications }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500, headers: corsHeaders }
    );
  }
};

// Update Application Status
export const updateApplicationStatus = async (req: NextRequest): Promise<NextResponse> => {
  if (req.method === "OPTIONS") return handleOptionsRequest();

  try {
    await connectDB();
    const { applicationId, status } = await req.json(); // Fix: Await JSON parsing

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Application ID and status are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Status updated successfully", data: updatedApplication },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500, headers: corsHeaders }
    );
  }
};
