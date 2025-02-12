import { createApplication, getApplications,updateApplicationStatus } from "@/controllers/applications_controller";
import { NextResponse } from "next/server";

// POST request
export const POST = async (req: Request) => {
  return await createApplication(req);
};

// GET request
export const GET = async () => {
  return await getApplications();
};
// PUT request for status update
export const PUT = async (req: Request) => {
  return await updateApplicationStatus(req);
};
