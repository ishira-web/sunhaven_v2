import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuotationEmail } from "@/lib/mail";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      subject,
      quotePrice,
      messageContent,
      customPlaces,
      hotelCategory,
      mealPlan,
      packageId,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    if (!messageContent || !quotePrice) {
      return NextResponse.json(
        { error: "Quote price and reply message content are required" },
        { status: 400 }
      );
    }

    // 1. Fetch inquiry with package info
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        package: { select: { id: true, title: true, slug: true } },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const finalSubject =
      subject || `Your Private Sri Lanka Tour Proposal & Quote - SunHaven Lanka`;
    const finalPlaces = Array.isArray(customPlaces)
      ? customPlaces
      : (inquiry.customPlaces as string[]) || [];
    const finalHotelCat = Array.isArray(hotelCategory)
      ? hotelCategory
      : (inquiry.hotelCategory as string[]) || [];
    const finalMealPlan = Array.isArray(mealPlan)
      ? mealPlan
      : (inquiry.mealPlan as string[]) || [];

    // Safely resolve package title if changed
    let finalPackageTitle = inquiry.package?.title || "Custom Tailor-Made Private Tour";
    let validPackageId = inquiry.packageId;

    if (packageId !== undefined) {
      if (packageId && packageId.trim() !== "") {
        const pkg = await prisma.package.findFirst({
          where: {
            OR: [{ id: packageId.trim() }, { slug: packageId.trim() }],
          },
          select: { id: true, title: true },
        });
        if (pkg) {
          validPackageId = pkg.id;
          finalPackageTitle = pkg.title;
        }
      } else {
        validPackageId = null;
        finalPackageTitle = "100% Custom Tailor-Made Private Tour";
      }
    }

    // 2. Dispatch the luxury HTML email
    const emailResult = await sendQuotationEmail({
      toEmail: inquiry.email,
      travelerName: inquiry.name,
      subject: finalSubject,
      quotePrice,
      packageTitle: finalPackageTitle,
      travelDates:
        inquiry.arrivalDate && inquiry.departureDate
          ? `${inquiry.arrivalDate} to ${inquiry.departureDate}`
          : inquiry.travelDates || "Flexible Dates",
      pax: inquiry.pax || inquiry.passengers || 2,
      rooms: inquiry.rooms || 1,
      hotelCategory: finalHotelCat,
      mealPlan: finalMealPlan,
      customPlaces: finalPlaces,
      messageContent,
    });

    // 3. Update database record: Automatically set status = "QUOTED"
    const now = new Date();

    try {
      const updated = await prisma.inquiry.update({
        where: { id },
        data: {
          status: "QUOTED",
          quotePrice: String(quotePrice),
          replyContent: String(messageContent),
          repliedAt: now,
          customPlaces: finalPlaces,
          hotelCategory: finalHotelCat,
          mealPlan: finalMealPlan,
          packageId: validPackageId,
        },
        include: {
          package: { select: { id: true, title: true, slug: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      });

      return NextResponse.json({
        success: true,
        inquiry: updated,
        emailResult,
      });
    } catch {
      // Direct raw SQL update fallback if in-memory Prisma client hasn't reloaded the schema
      await prisma.$executeRaw`
        UPDATE \`Inquiry\`
        SET
          \`status\` = 'QUOTED',
          \`quotePrice\` = ${String(quotePrice)},
          \`replyContent\` = ${String(messageContent)},
          \`repliedAt\` = ${now},
          \`customPlaces\` = ${JSON.stringify(finalPlaces)},
          \`hotelCategory\` = ${JSON.stringify(finalHotelCat)},
          \`mealPlan\` = ${JSON.stringify(finalMealPlan)},
          \`packageId\` = ${validPackageId},
          \`updatedAt\` = ${now}
        WHERE \`id\` = ${id}
      `;

      return NextResponse.json({
        success: true,
        inquiry: {
          ...inquiry,
          status: "QUOTED",
          quotePrice: String(quotePrice),
          replyContent: String(messageContent),
          repliedAt: now,
          customPlaces: finalPlaces,
          hotelCategory: finalHotelCat,
          mealPlan: finalMealPlan,
        },
        emailResult,
      });
    }
  } catch (error) {
    console.error("Admin inquiry email reply error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email quotation" },
      { status: 500 }
    );
  }
}
