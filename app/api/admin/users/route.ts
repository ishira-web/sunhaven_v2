import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.AGENT];

function authErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (error instanceof Error && error.message === "Forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const session = await requireRole([Role.SUPER_ADMIN]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ createdAt: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ users, currentUserId: session.userId });
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    console.error("Get admin users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([Role.SUPER_ADMIN]);

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid user details" }, { status: 400 });
    }

    const { name, email, password, role } = body as Record<string, unknown>;
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (typeof role !== "string" || !allowedRoles.includes(role as Role)) {
      return NextResponse.json({ error: "A valid access role is required" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: await hashPassword(password),
        role: role as Role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    console.error("Create admin user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
