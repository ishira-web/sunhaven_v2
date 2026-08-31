# SunHaven Lanka — Backend, MySQL Database, Migration & Admin Dashboard Plan

## 1. Project Overview & Architectural Vision
This document details the full implementation plan for developing the backend, MySQL database with automated migrations and seeders, local asset storage (`public/uploads`), and a luxury-themed Admin Dashboard for **SunHaven Lanka** (`sunhaven-v2`).

### Core Design Philosophy:
- **Unified Next.js 16 App Router Architecture**: Clean separation between public-facing marketing pages and the protected `/admin` portal.
- **Type-Safe Relational Data with Prisma ORM**: Automatic schema migrations, relational modeling, and seeders.
- **Local File Uploads (Option A)**: Uploads saved to `public/uploads/` with unique filenames, served directly without external cloud dependencies.
- **Resilient Hybrid Fallback**: Frontend queries MySQL with instant fallback to static TS data if the database is temporarily offline.

---

## 2. Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) + React 19 | Frontend & Server Actions / API Route Handlers |
| **Database** | MySQL 8.0+ | Relational data persistence |
| **ORM & Migrations** | Prisma ORM (`@prisma/client`, `prisma`) | Automated schema migrations, queries, and type safety |
| **Authentication** | `jose` (JWT) + `bcryptjs` + HTTP-only Cookies | Secure token-based session management for Admin portal |
| **Image Storage** | Local Node.js FS (`public/uploads/`) | Direct local file upload handler with MIME validation |
| **Icons & UI** | Lucide React, Tailwind CSS | Consistent luxury dark-gold styling |

### Required Packages:
```bash
npm install @prisma/client bcryptjs jose
npm install -D prisma @types/bcryptjs
```

---

## 3. Database Schema Design (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ADMIN
  AGENT
}

enum PackageType {
  LONG_DAY
  ONE_DAY
}

enum InquiryType {
  TRIP_PLANNER
  CUSTOM_TOUR
  AIRPORT_TRANSFER
  DIRECT_INQUIRY
}

enum InquiryStatus {
  PENDING
  CONTACTED
  QUOTED
  CONFIRMED
  CANCELLED
}

// 1. Admin Users & Staff
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  role         Role      @default(ADMIN)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  assignedInquiries Inquiry[]
}

// 2. Tour Packages
model Package {
  id                 String               @id @default(cuid())
  slug               String               @unique
  type               PackageType          @default(LONG_DAY)
  title              String
  durationTag        String
  durationNightsDays String
  subtitle           String
  overview           Json                 // Array of paragraphs: string[]
  idealFor           String
  pace               String
  heroImage          String
  posterImage        String?
  isPublished        Boolean              @default(true)
  isFeatured         Boolean              @default(false)
  priceFrom          Float?
  order              Int                  @default(0)
  
  // Relations
  routeMapStops      PackageRouteStop[]
  highlights         PackageHighlight[]
  itinerary          ItineraryDay[]
  accommodation      PackageAccommodation?
  faqs               PackageFAQ[]
  inclusions         Json                 // Array of string: string[]
  exclusions         Json                 // Array of string: string[]
  whyChoose          Json?                // { title, paragraphs: [], bulletPoints: [] }
  
  inquiries          Inquiry[]
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
}

// 3. Itinerary Days (Multi-day & Day Tours)
model ItineraryDay {
  id            String    @id @default(cuid())
  packageId     String
  dayNumber     Int
  title         String
  subtitle      String?
  stopLocation  String
  description   Json      // string[]
  overnightStay String
  highlights    Json?     // string[]
  image         String
  imageAlt      String?
  
  package       Package   @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@index([packageId])
}

// 4. Tour Route Map Stops
model PackageRouteStop {
  id           String   @id @default(cuid())
  packageId    String
  order        Int      @default(0)
  name         String
  night        String
  keyHighlight String

  package      Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@index([packageId])
}

// 5. Tour Highlights
model PackageHighlight {
  id        String   @id @default(cuid())
  packageId String
  category  String
  iconName  String
  items     Json     // string[]

  package   Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@index([packageId])
}

// 6. Tour Accommodation
model PackageAccommodation {
  id          String   @id @default(cuid())
  packageId   String   @unique
  title       String
  description Json     // string[]
  hotelTiers  Json     // Array of { name: string, desc: string }

  package     Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)
}

// 7. Tour FAQs
model PackageFAQ {
  id        String   @id @default(cuid())
  packageId String
  question  String   @db.Text
  answer    String   @db.Text
  order     Int      @default(0)

  package   Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)

  @@index([packageId])
}

// 8. Inquiries & Booking Leads
model Inquiry {
  id              String        @id @default(cuid())
  type            InquiryType   @default(TRIP_PLANNER)
  name            String
  email           String
  phone           String
  country         String?
  travelDates     String?
  duration        String?
  passengers      String?
  interests       Json?         // string[]
  specialRequests String?       @db.Text
  
  packageId       String?
  package         Package?      @relation(fields: [packageId], references: [id], onDelete: SetNull)

  status          InquiryStatus @default(PENDING)
  internalNotes   String?       @db.Text
  assignedToId    String?
  assignedTo      User?         @relation(fields: [assignedToId], references: [id], onDelete: SetNull)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([status])
  @@index([packageId])
}

// 9. Vehicles / Fleet Management
model Vehicle {
  id              String   @id @default(cuid())
  type            String   // CAR, MINIVAN, LUXURY VAN, COACH
  guests          String   // e.g. "1 – 3 Guests"
  luggageCapacity String?  // e.g. "3 Bags"
  description     String
  image           String
  ratePerKm       Float?
  basePrice       Float?
  isActive        Boolean  @default(true)
  order           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// 10. Site Settings (Key-Value)
model SiteSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  updatedAt DateTime @updatedAt
}
```

---

## 4. Local Image Upload Handler (`/public/uploads`)

### Workflow:
1. Store uploaded files in `public/uploads/`.
2. Generate sanitized, timestamped unique names: `tour-[timestamp]-[random].[ext]`.
3. Validate MIME types (`image/jpeg`, `image/png`, `image/webp`).
4. Return relative web path: `/uploads/filename.webp`.

### API Implementation: `app/api/admin/upload/route.ts`
```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const filename = `tour-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

---

## 5. Migration & Data Seeding Strategy

### Step 1: Initialize Database & Run Migration
```bash
npx prisma migrate dev --name init
```

### Step 2: Automated Seeder (`prisma/seed.ts`)
- Imports static arrays from `data/longDayPackages.ts` and `data/oneDayPackages.ts`.
- Loops through and inserts packages with nested relations (`itinerary`, `highlights`, `routeMapStops`, `accommodation`, `faqs`).
- Inserts vehicles (`Car`, `Minivan`, `Luxury Van`).
- Creates default Super Admin user:
  - Email: `admin@sunhavenlanka.com`
  - Password: `Admin@Sunhaven2026` (hashed via `bcryptjs`).

### Step 3: Run Seeder
```bash
npx prisma db seed
```

---

## 6. Authentication & Protected Admin Routes

1. **Password Hashing**: `bcryptjs.hash(password, 12)`
2. **Session Token**: Signed JWT with `jose` stored in `sunhaven_admin_token` (HTTP-only, Secure, SameSite=Strict).
3. **Route Guard Middleware (`middleware.ts`)**:
   - Blocks `/admin/*` (except `/admin/login`) if token is missing or invalid.
   - Blocks `/api/admin/*` for unauthenticated requests.

---

## 7. Admin Dashboard UI Structure (`/app/admin`)

The Admin Dashboard will feature a luxury dark theme matching SunHaven (`#07160f` background, `#cca45b` gold accents, clean cards, and responsive tables).

### Admin Pages Layout:
```
app/
└── admin/
    ├── layout.tsx             # Sidebar, top navigation, search, user profile menu
    ├── login/page.tsx         # Secure admin login form
    ├── page.tsx               # Dashboard overview (metrics, recent leads, quick actions)
    ├── inquiries/page.tsx     # Inquiries pipeline & booking leads manager
    ├── packages/
    │   ├── page.tsx           # Tour packages table (publish/feature toggle, search)
    │   ├── new/page.tsx       # Package creation wizard
    │   └── [id]/edit/page.tsx # Full package editor + multi-day itinerary builder
    ├── vehicles/page.tsx      # Fleet management (rates, vehicle specs)
    ├── media/page.tsx         # Media gallery & image uploader
    └── settings/page.tsx      # Admin users, password reset, site contact details
```

### Key UI Features:
1. **Overview Dashboard**:
   - Total Leads, Pending Inquiries, Active Packages, Vehicles Fleet stats.
   - Quick inquiry status pipeline (Pending -> Contacted -> Quoted -> Confirmed).
2. **Inquiries Manager**:
   - Filter by status (Pending, Contacted, Confirmed, Cancelled).
   - WhatsApp Direct Action (1-click chat with prefilled response template).
   - Staff Internal Notes & Status updater.
3. **Tour Package Editor**:
   - Live image preview & local uploader.
   - Dynamic Multi-Day Itinerary Day Adder (reorder, add/remove days with photos).
   - Highlights, Accommodation, FAQs, Inclusions & Exclusions list editors.

---

## 8. Frontend Form Integration

Connect existing components to the new backend API:
1. **`TripPlannerModal.tsx`**: Submits to `POST /api/inquiries` with `type: "TRIP_PLANNER"`.
2. **`CustomTourRequestBanner.tsx`**: Submits to `POST /api/inquiries` with `type: "CUSTOM_TOUR"`.
3. **`AirportTransfersSection.tsx`**: Submits to `POST /api/inquiries` with `type: "AIRPORT_TRANSFER"`.
4. **Dynamic Packages Page (`app/packages/[slug]/page.tsx`)**: Fetches from Database API with seamless static fallback.

---

## 9. Execution Steps Summary

1. **Setup Prisma & MySQL**: Install dependencies, write `prisma/schema.prisma`, configure `.env`.
2. **Execute Migration & Seeder**: Create tables, seed existing packages and default admin.
3. **Build Auth & Middleware**: Implement login API, JWT handler, and route protector.
4. **Build Local Upload Route**: Implement `POST /api/admin/upload` saving to `public/uploads/`.
5. **Build Admin Dashboard UI**: Develop `/admin` layout, inquiries manager, package editor, and fleet manager.
6. **Connect Public Forms**: Hook up `TripPlannerModal` and inquiry forms to MySQL.
7. **Verify & Test**: Test end-to-end booking, image upload, package editing, and mobile responsiveness.
