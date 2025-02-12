import { NextRequest } from "next/server";
import { createUser } from "@/controllers/user";

export async function POST(req: NextRequest) {
  return createUser(req);
}
