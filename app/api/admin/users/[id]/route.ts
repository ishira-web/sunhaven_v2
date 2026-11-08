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

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole([Role.SUPER_ADMIN]);
    const { id } = await context.params;
    const body: unknown = await request.json();

    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid user details" }, { status: 400 });
    }

    const data: { name?: string; email?: string; passwordHash?: string; role?: Role } = {};

    if ("name" in body) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      data.name = body.name.trim();
    }
    if ("email" in body) {
      if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
      }
      data.email = body.email.trim().toLowerCase();
    }
    if ("password" in body) {
      if (typeof body.password !== "string" || body.password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      data.passwordHash = await hashPassword(body.password);
    }
    if ("role" in body) {
      if (typeof body.role !== "string" || !allowedRoles.includes(body.role as Role)) {
        return NextResponse.json({ error: "A valid access role is required" }, { status: 400 });
      }
      if (id === session.userId && body.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "You cannot remove your own super admin access" }, { status: 400 });
      }
      data.role = body.role as Role;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No user details were provided" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (
      existingUser.role === Role.SUPER_ADMIN &&
      data.role &&
      data.role !== Role.SUPER_ADMIN &&
      (await prisma.user.count({ where: { role: Role.SUPER_ADMIN } })) <= 1
    ) {
      return NextResponse.json({ error: "The last super admin cannot be demoted" }, { status: 409 });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    console.error("Update admin user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole([Role.SUPER_ADMIN]);
    const { id } = await context.params;

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot remove your own account" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (
      user.role === Role.SUPER_ADMIN &&
      (await prisma.user.count({ where: { role: Role.SUPER_ADMIN } })) <= 1
    ) {
      return NextResponse.json({ error: "The last super admin cannot be removed" }, { status: 409 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    console.error("Delete admin user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
