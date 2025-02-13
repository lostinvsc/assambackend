import { NextRequest } from "next/server";
import { verifyOTP } from "@/controllers/signup";

export async function POST(req: NextRequest) {
  return verifyOTP(req);
}
