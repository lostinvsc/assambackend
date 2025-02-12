import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/application_model";

// Define Application Interface
export interface IApplication {
  fullName: string;
  age: number;
  phoneNo: string;
  gender: string;
  occupation: string;
  address: string;
  category: string;
  area: string;
  remarks: string;
  documenturl: string;
  status: string;
  notification: boolean;
}

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Adjust in production
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle CORS Preflight Requests
const handleOptionsRequest = () => new NextResponse(null, { status: 204, headers: corsHeaders });

// Create Application
export const createApplication = async (req: Request): Promise<NextResponse> => {
  if (req.method === "OPTIONS") return handleOptionsRequest();

  try {
    await connectDB();
    const body: Partial<IApplication> = await req.json();

    // Validate required fields
    const requiredFields: (keyof IApplication)[] = [
      "fullName",
      "age",
      "phoneNo",
      "gender",
      "occupation",
      "address",
      "category",
      "area",
      "remarks",
      "documenturl",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Ensure notification defaults to true if not provided
    const newApplication = await Application.create({
      ...body,
      notification: body.notification ?? true,
    });

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
export const getApplications = async (): Promise<NextResponse> => {
  if (new Request("").method === "OPTIONS") return handleOptionsRequest();

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
export const updateApplicationStatus = async (req: Request): Promise<NextResponse> => {
  if (req.method === "OPTIONS") return handleOptionsRequest();

  try {
    await connectDB();
    const { applicationId, status } = await req.json();

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

// Update Notification Status
export const updateNotification = async (req: Request): Promise<NextResponse> => {
  if (req.method === "OPTIONS") return handleOptionsRequest();

  try {
    await connectDB();
    const { applicationId, notification } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (typeof notification !== "boolean") {
      return NextResponse.json(
        { error: "Invalid notification value" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { notification },
      { new: true }
    );

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { success: true, message: "Notification updated successfully", application: updatedApplication },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: (error as Error).message },
      { status: 500, headers: corsHeaders }
    );
  }
};
