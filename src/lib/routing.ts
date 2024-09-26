import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function forward(request: NextRequest, baseUrl: string) {
  const endpoint = `${baseUrl}${request.nextUrl.pathname}`;
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
  } else if (request.method !== "GET" && request.body) {
    body = request.body;
  }

  const response = await fetch(endpoint, { method, headers, body });

  return new NextResponse(response.body, {
    status: response.status,
  });
}

export async function forwardWithAuth(request: NextRequest, baseUrl: string) {
  const session = await auth();
  const accountId = session?.user?.id;

  if (!accountId) return NextResponse.redirect("/sign-in");

  const endpoint = `${baseUrl}${request.nextUrl.pathname}?accountId=${accountId}`;
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

  const response = await fetch(endpoint, { method, headers, body });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
