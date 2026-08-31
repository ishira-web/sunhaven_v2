import { PrismaClient, Role, PackageType, InquiryType, InquiryStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { longDayPackages } from "../data/longDayPackages";
import { oneDayPackages } from "../data/oneDayPackages";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create default Super Admin user
  const hashedPassword = await bcrypt.hash("Admin@Sunhaven2026", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sunhavenlanka.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@sunhavenlanka.com",
      passwordHash: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Seed Vehicles
  const vehicles = [
    {
      type: "CAR",
      guests: "1 – 3 Guests",
      luggageCapacity: "3 Bags",
      description: "Ideal for couples or solo travelers seeking comfort and efficiency.",
      image: "/images/car.png",
      ratePerKm: 150,
      basePrice: 8000,
      isActive: true,
      order: 1,
    },
    {
      type: "MINIVAN",
      guests: "4 – 6 Guests",
      luggageCapacity: "6 Bags",
      description: "Perfect for families and small groups with extra luggage space.",
      image: "/images/min-van.jpg",
      ratePerKm: 200,
      basePrice: 12000,
      isActive: true,
      order: 2,
    },
    {
      type: "LUXURY VAN",
      guests: "7 – 12 Guests",
      luggageCapacity: "12 Bags",
      description: "Spacious & comfortable for larger groups with premium amenities.",
      image: "/images/luxury-van.jfif",
      ratePerKm: 300,
      basePrice: 20000,
      isActive: true,
      order: 3,
    },
  ];

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { id: vehicle.type },
      update: vehicle,
      create: {
        id: vehicle.type,
        ...vehicle,
      },
    });
  }
  console.log("✅ Seeded vehicles");

  // Helper to create packages from longDayPackages
  for (const pkg of longDayPackages) {
    const existingPackage = await prisma.package.findUnique({
      where: { slug: pkg.slug },
    });

    if (existingPackage) {
      console.log(`⏭️ Package ${pkg.slug} already exists, skipping...`);
      continue;
    }

    const createdPackage = await prisma.package.create({
      data: {
        slug: pkg.slug,
        type: PackageType.LONG_DAY,
        title: pkg.title,
        durationTag: pkg.durationTag,
        durationNightsDays: pkg.durationNightsDays,
        subtitle: pkg.subtitle,
        overview: pkg.overview,
        idealFor: pkg.idealFor,
        pace: pkg.pace,
        heroImage: pkg.heroImage,
        posterImage: pkg.posterImage,
        isPublished: true,
        isFeatured: false,
        inclusions: pkg.includes,
        exclusions: pkg.excludes,
        whyChoose: pkg.whyChooseThisJourney,
        routeMapStops: {
          create: pkg.routeMapStops.map((stop, index) => ({
            order: index,
            name: stop.name,
            night: stop.night,
            keyHighlight: stop.keyHighlight,
          })),
        },
        highlights: {
          create: pkg.highlights.map((h) => ({
            category: h.category,
            iconName: h.iconName,
            items: h.items,
          })),
        },
        itinerary: {
          create: pkg.itinerary.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            subtitle: day.subtitle,
            stopLocation: day.stopLocation,
            description: day.description,
            overnightStay: day.overnightStay,
            highlights: day.highlights,
            image: day.image,
            imageAlt: day.imageAlt,
          })),
        },
        accommodation: {
          create: {
            title: pkg.accommodation.title,
            description: pkg.accommodation.description,
            hotelTiers: pkg.accommodation.hotelTiers,
          },
        },
        faqs: {
          create: pkg.faqs.map((faq, index) => ({
            question: faq.question,
            answer: faq.answer,
            order: index,
          })),
        },
      },
    });
    console.log(`✅ Created package: ${createdPackage.title}`);
  }

  // Helper to create packages from oneDayPackages
  for (const pkg of oneDayPackages) {
    const existingPackage = await prisma.package.findUnique({
      where: { slug: pkg.slug },
    });

    if (existingPackage) {
      console.log(`⏭️ Package ${pkg.slug} already exists, skipping...`);
      continue;
    }

    // For one-day packages, create a simplified itinerary day
    const createdPackage = await prisma.package.create({
      data: {
        slug: pkg.slug,
        type: PackageType.ONE_DAY,
        title: pkg.title,
        durationTag: pkg.durationTag,
        durationNightsDays: "Full Day",
        subtitle: pkg.subtitle,
        overview: pkg.overview,
        idealFor: pkg.idealFor,
        pace: pkg.pace,
        heroImage: pkg.heroImage,
        posterImage: pkg.posterImage,
        isPublished: true,
        isFeatured: false,
        inclusions: pkg.includes,
        exclusions: pkg.excludes,
        whyChoose: pkg.whyChooseThisJourney,
        routeMapStops: {
          create: pkg.highlights.map((h, index) => ({
            order: index,
            name: h.category,
            night: "Day Trip",
            keyHighlight: h.items[0] || "",
          })),
        },
        highlights: {
          create: pkg.highlights.map((h) => ({
            category: h.category,
            iconName: h.iconName,
            items: h.items,
          })),
        },
        itinerary: {
          create: pkg.itinerary.map((block, index) => ({
            dayNumber: index + 1,
            title: block.title,
            subtitle: block.timeOfDay,
            stopLocation: "Colombo",
            description: block.description,
            overnightStay: "N/A",
            highlights: [],
            image: pkg.heroImage,
            imageAlt: pkg.title,
          })),
        },
        accommodation: {
          create: {
            title: "Not Applicable (Day Tour)",
            description: ["This is a day tour package. No overnight accommodation is included."],
            hotelTiers: [],
          },
        },
        faqs: {
          create: (pkg.faqs || []).map((faq, index) => ({
            question: faq.question,
            answer: faq.answer,
            order: index,
          })),
        },
      },
    });
    console.log(`✅ Created package: ${createdPackage.title}`);
  }

  // Seed default site settings
  const settings = [
    { key: "site_name", value: "SunHaven Lanka" },
    { key: "site_tagline", value: "Private Luxury Journeys in Sri Lanka" },
    { key: "contact_email", value: "info@sunhavenlanka.com" },
    { key: "contact_phone", value: "+94 77 123 4567" },
    { key: "contact_address", value: "Colombo, Sri Lanka" },
    { key: "whatsapp_number", value: "94771234567" },
    { key: "currency", value: "USD" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Seeded site settings");

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });