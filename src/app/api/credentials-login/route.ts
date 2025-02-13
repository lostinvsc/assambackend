import { NextRequest } from "next/server";
import { credentialsLogin } from "@/controllers/login";

export async function POST(req: NextRequest) {
  return credentialsLogin(req);
}
