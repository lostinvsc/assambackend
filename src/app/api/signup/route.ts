import { NextRequest } from "next/server";
import { signup } from "@/controllers/signup";

export async function POST(req: NextRequest) {
  return signup(req);
}
