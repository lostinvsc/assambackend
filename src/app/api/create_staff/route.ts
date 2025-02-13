import { NextRequest } from "next/server";
import { createStaff } from "@/controllers/staff_data";

export async function POST(req: NextRequest) {
  return createStaff(req);
}
