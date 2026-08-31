import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalInquiries, pendingInquiries, activePackages, totalVehicles, recentInquiries] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "PENDING" } }),
      prisma.package.count({ where: { isPublished: true } }),
      prisma.vehicle.count({ where: { isActive: true } }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          package: { select: { id: true, title: true, slug: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalInquiries,
      pendingInquiries,
      activePackages,
      totalVehicles,
      recentInquiries,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}