import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { JWTPayload } from "./lib/auth";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET environment variable is required and must be at least 32 characters long"
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

const protectedPaths = ["/admin", "/api/admin"];
const publicPaths = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If already authenticated and trying to access /admin/login, redirect directly to /admin
  if (pathname === "/admin/login") {
    const token = request.cookies.get("sunhaven_admin_token")?.value;
    if (token) {
      const session = await verifyToken(token);
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!isProtectedPath || isPublicPath) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("sunhaven_admin_token")?.value;

  if (!token) {
    // Redirect to login for page routes, return 401 for API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const session = await verifyToken(token);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add user info to headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.userId);
  requestHeaders.set("x-user-email", session.email);
  requestHeaders.set("x-user-role", session.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
