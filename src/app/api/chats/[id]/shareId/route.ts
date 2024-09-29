import { NextRequest } from "next/server";
import { forwardWithAuth } from "@/lib/routing";
import ENV from "@/lib/env";

export async function POST(request: NextRequest) {
  return forwardWithAuth(request, ENV.BACKEND_API_BASE_URL);
}

export async function DELETE(request: NextRequest) {
  return forwardWithAuth(request, ENV.BACKEND_API_BASE_URL);
}
