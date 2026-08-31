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
      duration,
      passengers,
      interests,
      specialRequests,
      packageId,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        type: type || "TRIP_PLANNER",
        name,
        email,
        phone,
        country,
        travelDates,
        duration,
        passengers,
        interests: interests || [],
        specialRequests,
        packageId: packageId || null,
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}