import { NextRequest } from "next/server";
import { loginUser } from "@/controllers/login";

export async function POST(req: NextRequest) {
  return loginUser(req);
}
