import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, requireRole } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id },
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
  } catch (error) {
    console.error("Get package error:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;
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

    const existingPackage = await prisma.package.findUnique({ where: { id } });
    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (slug && slug !== existingPackage.slug) {
      const slugExists = await prisma.package.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "A package with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: {
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
        routeMapStops: routeMapStops
          ? {
              deleteMany: {},
              create: routeMapStops.map((stop: Record<string, unknown>, index: number) => ({
                order: stop.order || index,
                name: stop.name,
                night: stop.night,
                keyHighlight: stop.keyHighlight,
              })),
            }
          : undefined,
        highlights: highlights
          ? {
              deleteMany: {},
              create: highlights.map((h: Record<string, unknown>) => ({
                category: h.category,
                iconName: h.iconName,
                items: h.items || [],
              })),
            }
          : undefined,
        itinerary: itinerary
          ? {
              deleteMany: {},
              create: itinerary.map((day: Record<string, unknown>) => ({
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
            }
          : undefined,
        accommodation: accommodation
          ? {
              upsert: {
                create: {
                  title: accommodation.title,
                  description: accommodation.description || [],
                  hotelTiers: accommodation.hotelTiers || [],
                },
                update: {
                  title: accommodation.title,
                  description: accommodation.description || [],
                  hotelTiers: accommodation.hotelTiers || [],
                },
              },
            }
          : undefined,
        faqs: faqs
          ? {
              deleteMany: {},
              create: faqs.map((faq: Record<string, unknown>, index: number) => ({
                question: faq.question,
                answer: faq.answer,
                order: faq.order || index,
              })),
            }
          : undefined,
      },
      include: {
        routeMapStops: true,
        highlights: true,
        itinerary: true,
        accommodation: true,
        faqs: true,
      },
    });

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const { id } = await params;

    const existingPackage = await prisma.package.findUnique({ where: { id } });
    if (!existingPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    await prisma.package.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}