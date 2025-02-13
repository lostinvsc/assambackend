import { NextRequest } from "next/server";
import { requestOtp } from "@/controllers/signup";

export async function POST(req: NextRequest) {
  return requestOtp(req);
}
