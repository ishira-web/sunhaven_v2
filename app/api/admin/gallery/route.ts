import { unlink } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

const galleryDirectory = path.join(process.cwd(), "public", "gallery");
const allowedFilename = /^[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$/i;

export async function DELETE(request: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const filename = request.nextUrl.searchParams.get("filename");
    if (!filename || !allowedFilename.test(filename)) {
      return NextResponse.json({ error: "Invalid gallery image" }, { status: 400 });
    }

    await unlink(path.join(galleryDirectory, filename));
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }

    console.error("Delete gallery image error:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
