import { NextRequest } from "next/server";
import { loginPhone } from "@/controllers/login";

export async function POST(req: NextRequest) {
  return loginPhone(req);
}
