import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const published = searchParams.get("published");

    if (slug) {
      const pkg = await prisma.package.findUnique({
        where: { slug },
        include: {
          routeMapStops: { orderBy: { order: "asc" } },
          highlights: true,
          itinerary: { orderBy: { dayNumber: "asc" } },
          accommodation: true,
          faqs: { orderBy: { order: "asc" } },
        },
      });

      if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
      }

      return NextResponse.json({ package: pkg });
    }

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (featured === "true") where.isFeatured = true;
    if (published !== "false") where.isPublished = true;

    const packages = await prisma.package.findMany({
      where,
      include: {
        routeMapStops: { orderBy: { order: "asc" } },
        highlights: true,
        itinerary: { orderBy: { dayNumber: "asc" } },
        accommodation: true,
        faqs: { orderBy: { order: "asc" } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Get packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}