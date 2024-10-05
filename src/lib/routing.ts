import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function forwardWithAuth(request: NextRequest, baseUrl: string) {
  try {
    const session = await auth();
    const accountId = session?.user?.id;

    if (!accountId) return NextResponse.redirect("/sign-in");

    const url = new URL(`${baseUrl}${request.nextUrl.pathname}`);
    url.searchParams.set("accountId", accountId);

    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const headers = new Headers();
    const method = request.method;
    let body: BodyInit | undefined;

    const contentType = request.headers.get("content-type");
    if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else if (contentType?.includes("application/json")) {
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      headers.set("Content-Type", "application/json");
    }
    const response = await fetch(url.toString(), { method, headers, body });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    throw error;
  }
}
