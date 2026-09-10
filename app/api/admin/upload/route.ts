import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
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

    const ext = path.extname(file.name) || ".jpg";
    const prefix = req.nextUrl.searchParams.get("prefix") || (cleanFolder.includes("vehicle") ? "vehicle" : "upload");
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(targetDir, filename);

    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/${cleanFolder}/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}