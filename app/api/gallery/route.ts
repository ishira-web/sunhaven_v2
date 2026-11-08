import { readdir, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const galleryDirectory = path.join(process.cwd(), "public", "gallery");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function GET() {
  try {
    const filenames = await readdir(galleryDirectory);
    const images = await Promise.all(
      filenames
        .filter((filename) => supportedExtensions.has(path.extname(filename).toLowerCase()))
        .map(async (filename) => {
          const fileStats = await stat(path.join(galleryDirectory, filename));
          if (!fileStats.isFile()) return null;
          return {
            filename,
            url: `/gallery/${encodeURIComponent(filename)}`,
            uploadedAt: fileStats.mtime.toISOString(),
          };
        })
    );

    const existingImages = images.filter((image) => image !== null);
    existingImages.sort((first, second) => second.uploadedAt.localeCompare(first.uploadedAt));
    return NextResponse.json({ images: existingImages }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return NextResponse.json({ images: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    console.error("Get gallery images error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}
