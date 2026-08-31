import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (type) where.type = type;
    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        include: {
          _count: { select: { inquiries: true } },
        },
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      prisma.package.count({ where }),
    ]);

    return NextResponse.json({
      packages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin packages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const body = await request.json();
    const {
      slug,
      type,
      title,
      durationTag,
      durationNightsDays,
      subtitle,
      overview,
      idealFor,
      pace,
      heroImage,
      posterImage,
      isPublished,
      isFeatured,
      priceFrom,
      order,
      inclusions,
      exclusions,
      whyChoose,
      routeMapStops,
      highlights,
      itinerary,
      accommodation,
      faqs,
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Slug and title are required" },
        { status: 400 }
      );
    }

    const existingPackage = await prisma.package.findUnique({ where: { slug } });
    if (existingPackage) {
      return NextResponse.json(
        { error: "A package with this slug already exists" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        slug,
        type: type || "LONG_DAY",
        title,
        durationTag,
        durationNightsDays,
        subtitle,
        overview: overview || [],
        idealFor,
        pace,
        heroImage,
        posterImage,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
        priceFrom,
        order: order || 0,
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        whyChoose,
        routeMapStops: {
          create: (routeMapStops || []).map((stop: Record<string, unknown>, index: number) => ({
            order: stop.order || index,
            name: stop.name,
            night: stop.night,
            keyHighlight: stop.keyHighlight,
          })),
        },
        highlights: {
          create: (highlights || []).map((h: Record<string, unknown>) => ({
            category: h.category,
            iconName: h.iconName,
            items: h.items || [],
          })),
        },
        itinerary: {
          create: (itinerary || []).map((day: Record<string, unknown>) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            subtitle: day.subtitle,
            stopLocation: day.stopLocation,
            description: day.description || [],
            overnightStay: day.overnightStay,
            highlights: day.highlights,
            image: day.image,
            imageAlt: day.imageAlt,
          })),
        },
        accommodation: accommodation
          ? {
              create: {
                title: accommodation.title,
                description: accommodation.description || [],
                hotelTiers: accommodation.hotelTiers || [],
              },
            }
          : undefined,
        faqs: {
          create: (faqs || []).map((faq: Record<string, unknown>, index: number) => ({
            question: faq.question,
            answer: faq.answer,
            order: faq.order || index,
          })),
        },
      },
      include: {
        routeMapStops: true,
        highlights: true,
        itinerary: true,
        accommodation: true,
        faqs: true,
      },
    });

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}