import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const extensionByType: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    const extension = extensionByType[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folderParam = req.nextUrl.searchParams.get("folder") || "uploads";
    // Sanitize folder path: allow alphanumeric, underscore, hyphen; block .. directory traversal
    const cleanFolder = folderParam.replace(/[^a-zA-Z0-9_\-]/g, "") || "uploads";

    const targetDir = path.join(process.cwd(), "public", cleanFolder);
    await mkdir(targetDir, { recursive: true });

    const prefixParam = req.nextUrl.searchParams.get("prefix") || (cleanFolder.includes("vehicle") ? "vehicle" : "upload");
    const prefix = prefixParam.replace(/[^a-zA-Z0-9_-]/g, "") || "upload";
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extension}`;
    const filePath = path.join(targetDir, filename);

    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/${cleanFolder}/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}