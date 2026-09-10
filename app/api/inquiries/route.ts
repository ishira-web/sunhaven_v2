import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      name,
      email,
      phone,
      country,
      travelDates,
      arrivalDate,
      departureDate,
      duration,
      passengers,
      pax,
      adults,
      children,
      rooms,
      hotelCategory,
      mealPlan,
      budget,
      interests,
      customPlaces,
      specialRequests,
      packageId,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Safely resolve packageId by id or slug to prevent Foreign Key constraint failures
    let validPackageId: string | null = null;
    if (packageId && typeof packageId === "string" && packageId.trim() !== "") {
      try {
        const existingPkg = await prisma.package.findFirst({
          where: {
            OR: [
              { id: packageId.trim() },
              { slug: packageId.trim() },
            ],
          },
          select: { id: true },
        });
        if (existingPkg) {
          validPackageId = existingPkg.id;
        }
      } catch {
        validPackageId = null;
      }
    }

    const validTypes = ["TRIP_PLANNER", "CUSTOM_TOUR", "AIRPORT_TRANSFER", "DIRECT_INQUIRY"];
    const inquiryType = type && validTypes.includes(type) ? type : "TRIP_PLANNER";

    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const cleanTravelDates = travelDates || (arrivalDate && departureDate ? `${arrivalDate} to ${departureDate}` : null);
    const cleanPassengers = passengers ? String(passengers) : pax ? `${pax} Pax` : null;
    const cleanPax = pax && !isNaN(Number(pax)) ? Number(pax) : null;
    const cleanAdults = adults !== undefined && adults !== null && !isNaN(Number(adults)) ? Number(adults) : null;
    const cleanChildren = children !== undefined && children !== null && !isNaN(Number(children)) ? Number(children) : null;
    const cleanRooms = rooms && !isNaN(Number(rooms)) ? Number(rooms) : null;
    const cleanHotelCat = Array.isArray(hotelCategory) ? hotelCategory : hotelCategory ? [hotelCategory] : [];
    const cleanMealPlan = Array.isArray(mealPlan) ? mealPlan : mealPlan ? [mealPlan] : [];
    const cleanInterests = Array.isArray(interests) ? interests : interests ? [interests] : [];
    const cleanCustomPlaces = Array.isArray(customPlaces) ? customPlaces : customPlaces ? [customPlaces] : [];

    try {
      // Try standard Prisma client create
      const inquiry = await (prisma.inquiry as any).create({
        data: {
          type: inquiryType,
          name: String(name).trim(),
          email: String(email).trim(),
          phone: String(phone).trim(),
          country: country ? String(country).trim() : null,
          travelDates: cleanTravelDates,
          arrivalDate: arrivalDate ? String(arrivalDate) : null,
          departureDate: departureDate ? String(departureDate) : null,
          duration: duration ? String(duration) : null,
          passengers: cleanPassengers,
          pax: cleanPax,
          adults: cleanAdults,
          children: cleanChildren,
          rooms: cleanRooms,
          hotelCategory: cleanHotelCat,
          mealPlan: cleanMealPlan,
          budget: budget ? String(budget) : null,
          interests: cleanInterests,
          customPlaces: cleanCustomPlaces,
          specialRequests: specialRequests ? String(specialRequests) : null,
          packageId: validPackageId,
        },
      });

      return NextResponse.json({ success: true, inquiry });
    } catch (createErr: any) {
      console.warn("Direct raw SQL insert fallback:", createErr?.message);

      // Direct MySQL insert fallback if in-memory client has not yet reloaded schema
      await prisma.$executeRaw`
        INSERT INTO \`Inquiry\` (
          \`id\`, \`type\`, \`name\`, \`email\`, \`phone\`, \`country\`,
          \`travelDates\`, \`arrivalDate\`, \`departureDate\`, \`duration\`,
          \`passengers\`, \`pax\`, \`adults\`, \`children\`, \`rooms\`,
          \`hotelCategory\`, \`mealPlan\`, \`budget\`, \`interests\`,
          \`customPlaces\`, \`specialRequests\`, \`packageId\`, \`status\`,
          \`createdAt\`, \`updatedAt\`
        ) VALUES (
          ${id},
          ${inquiryType},
          ${String(name).trim()},
          ${String(email).trim()},
          ${String(phone).trim()},
          ${country ? String(country).trim() : null},
          ${cleanTravelDates},
          ${arrivalDate ? String(arrivalDate) : null},
          ${departureDate ? String(departureDate) : null},
          ${duration ? String(duration) : null},
          ${cleanPassengers},
          ${cleanPax},
          ${cleanAdults},
          ${cleanChildren},
          ${cleanRooms},
          ${JSON.stringify(cleanHotelCat)},
          ${JSON.stringify(cleanMealPlan)},
          ${budget ? String(budget) : null},
          ${JSON.stringify(cleanInterests)},
          ${JSON.stringify(cleanCustomPlaces)},
          ${specialRequests ? String(specialRequests) : null},
          ${validPackageId},
          'PENDING',
          ${now},
          ${now}
        )
      `;

      return NextResponse.json({
        success: true,
        inquiry: {
          id,
          type: inquiryType,
          name,
          email,
          phone,
          status: "PENDING",
        },
      });
    }
  } catch (error: any) {
    console.error("Inquiry creation error:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    });
    return NextResponse.json(
      { error: error?.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}