import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(request: Request) {
  await clearSession();

  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL("/admin/login", request.url), 303);
  }

  return NextResponse.json({ success: true });
}