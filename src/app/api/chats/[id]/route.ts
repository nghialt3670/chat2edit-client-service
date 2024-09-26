import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  const accountId = session?.user?.id;

  if (!accountId) return NextResponse.json({}, {});
}
