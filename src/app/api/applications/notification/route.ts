import {updateNotification } from "@/controllers/applications_controller";
import { NextResponse } from "next/server";


export const PUT = async (req: Request) => {
  return await updateNotification(req);
};
