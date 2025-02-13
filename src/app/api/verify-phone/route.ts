import { NextRequest } from "next/server";
import { verifyPhone } from "@/controllers/login";

export async function POST(req: NextRequest) {
  return verifyPhone(req);
}
