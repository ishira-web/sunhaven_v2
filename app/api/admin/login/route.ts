import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSession } from "@/lib/auth";
import { checkRateLimit, resetRateLimit, sweepIfDue } from "@/lib/rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const IP_LIMIT = 10;
const EMAIL_LIMIT = 5;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: "Too many attempts. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export async function POST(request: NextRequest) {
  try {
    sweepIfDue(WINDOW_MS);

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const normalizedEmail = String(email).toLowerCase();

    const ipCheck = checkRateLimit(`login:ip:${ip}`, IP_LIMIT, WINDOW_MS);
    if (!ipCheck.allowed) return tooManyRequests(ipCheck.retryAfterSeconds);

    const emailCheck = checkRateLimit(
      `login:email:${normalizedEmail}`,
      EMAIL_LIMIT,
      WINDOW_MS
    );
    if (!emailCheck.allowed) return tooManyRequests(emailCheck.retryAfterSeconds);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    resetRateLimit(`login:ip:${ip}`);
    resetRateLimit(`login:email:${normalizedEmail}`);

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
