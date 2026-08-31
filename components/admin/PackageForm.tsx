"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Check,
  Wand2,
} from "lucide-react";

export interface ItineraryDayForm {
  dayNumber: number;
  title: string;
  subtitle?: string;
  stopLocation: string;
  description: string[];
  overnightStay: string;
  highlights?: string[];
  image: string;
  imageAlt?: string;
}

export interface RouteStopForm {
  order: number;
  name: string;
  night: string;
  keyHighlight: string;
}

export interface HighlightCategoryForm {
  category: string;
  iconName: string;
  items: string[];
}

export interface HotelTierForm {
  name: string;
  desc: string;
}

export interface FAQForm {
  question: string;
  answer: string;
  order: number;
}

export interface PackageFormData {
  id?: string;
  slug: string;
  type: "LONG_DAY" | "ONE_DAY";
  title: string;
  durationTag: string;
  durationNightsDays: string;
  subtitle: string;
  overview: string[];
  idealFor: string;
  pace: string;
  heroImage: string;
  posterImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  priceFrom?: number | string;
  order: number;
  routeMapStops: RouteStopForm[];
  highlights: HighlightCategoryForm[];
  itinerary: ItineraryDayForm[];
  inclusions: string[];
  exclusions: string[];
  accommodation?: {
    title: string;
    description: string[];
    hotelTiers: HotelTierForm[];
  };
  faqs: FAQForm[];
  whyChoose?: {
    title: string;
    paragraphs: string[];
    bulletPoints: string[];
  };
}

interface PackageFormProps {
  initialData?: Partial<PackageFormData>;
  isEdit?: boolean;
}

export default function PackageForm({ initialData, isEdit = false }: PackageFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "itinerary" | "route" | "highlights" | "inclusions" | "hotels_faqs">("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingDayIdx, setUploadingDayIdx] = useState<number | null>(null);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkTabScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkTabScroll();
    window.addEventListener("resize", checkTabScroll);
    return () => window.removeEventListener("resize", checkTabScroll);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 240;
      tabsContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkTabScroll, 350);
    }
  };

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      }
      setTimeout(checkTabScroll, 350);
    }
  }, [activeTab]);

  // Clean empty state for new package creation
  const emptyState: PackageFormData = {
    slug: "",
    type: "LONG_DAY",
    title: "",
    durationTag: "",
    durationNightsDays: "",
    subtitle: "",
    overview: [""],
    idealFor: "",
    pace: "",
    heroImage: "",
    posterImage: "",
    isPublished: true,
    isFeatured: false,
    priceFrom: "",
    order: 0,
    routeMapStops: [],
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    accommodation: {
      title: "",
      description: [""],
      hotelTiers: [],
    },
    faqs: [],
    whyChoose: {
      title: "",
      paragraphs: [],
      bulletPoints: [],
    },
  };

  // Sample Template Preset for quick filling
  const sampleTemplate: PackageFormData = {
    slug: "sample-tour-package",
    type: "LONG_DAY",
    title: "Scenic Highlights of Sri Lanka",
    durationTag: "10 DAYS / 9 NIGHTS",
    durationNightsDays: "09 Nights / 10 Days",
    subtitle: "A gentle voyage through ancient UNESCO cities, tea estates, and golden southern beaches.",
    overview: [
      "Discover the jewel of the Indian Ocean with our signature handcrafted private tour.",
      "Experience timeless heritage, private wildlife safaris, scenic hill country train rides, and relaxing coastal resorts.",
    ],
    idealFor: "Couples, Families, Culture & Wildlife Enthusiasts",
    pace: "Relaxed & Leisurely",
    heroImage: "/images/coastal_haven_galle.jpg",
    posterImage: "",
    isPublished: true,
    isFeatured: false,
    priceFrom: 1450,
    order: 0,
    routeMapStops: [
      { order: 0, name: "Negombo", night: "Night 1", keyHighlight: "Coastal Gateway & Lagoon Walk" },
      { order: 1, name: "Sigiriya", night: "Night 2-3", keyHighlight: "Lion Rock Fortress & Village Safari" },
      { order: 2, name: "Kandy", night: "Night 4-5", keyHighlight: "Temple of Tooth & Botanical Gardens" },
      { order: 3, name: "Nuwara Eliya", night: "Night 6", keyHighlight: "Tea Estates & Scenic Blue Train" },
      { order: 4, name: "Galle", night: "Night 7-9", keyHighlight: "Historic Dutch Fort & Beachfront Sunset" },
    ],
    highlights: [
      {
        category: "Heritage & Culture",
        iconName: "Crown",
        items: ["UNESCO Sigiriya Rock Fortress climb", "Temple of the Sacred Tooth Relic in Kandy"],
      },
      {
        category: "Scenic Nature & Tea",
        iconName: "Compass",
        items: ["Scenic Blue Train journey through tea hills", "Private tea estate factory visit"],
      },
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival in Sri Lanka & Coastal Gateway Negombo",
        subtitle: "Warm Ceylon Welcome & Relaxation",
        stopLocation: "Negombo",
        overnightStay: "Negombo Beach Resort",
        image: "/images/stop_negombo.jpg",
        description: [
          "Ayubowan! Arrive at Bandaranaike International Airport (CMB) where you will be warmly received by your dedicated SunHaven chauffeur-guide.",
          "Enjoy a short transfer to your coastal hotel in Negombo. Spend the afternoon unwinding by the pool or taking a gentle sunset stroll along the beach.",
        ],
        highlights: ["VIP Airport Meet & Greet", "Chilled king coconut welcome drink", "Beachfront dinner"],
      },
    ],
    inclusions: [
      "Airport Meet & Greet service with cold towels & assistance",
      "Private Air-Conditioned Luxury Vehicle throughout the entire journey",
      "Professional, Certified English-Speaking Chauffeur-Guide",
      "All Airport Pickups & Drop-offs",
      "All Government Taxes & Highway Tolls",
      "Complimentary Bottled Mineral Water throughout the tour",
      "Selected accommodation according to your preferred category",
      "Daily Breakfast at all hotels",
    ],
    exclusions: [
      "International airfare & flight tickets",
      "Sri Lanka Electronic Travel Authorization (ETA Visa Fees)",
      "Entrance fees to monuments & UNESCO sites not specified",
      "Personal expenses, laundry, and alcoholic beverages",
      "Gratuities and tips for guides and drivers",
    ],
    accommodation: {
      title: "Handpicked Luxury Boutique Hotels & Heritage Resorts",
      description: [
        "Every property in this itinerary has been personally curated by the SunHaven team for exceptional hospitality, scenic locations, and premium comfort.",
      ],
      hotelTiers: [
        { name: "5-Star Luxury & Heritage", desc: "Heritance Kandalama, Grand Hotel Nuwara Eliya, Jetwing Lighthouse" },
        { name: "4-Star Boutique Comfort", desc: "Aliya Resort & Spa, Cinnamon Citadel Kandy, Radisson Blu Galle" },
      ],
    },
    faqs: [
      {
        question: "Can this itinerary be customized to our specific dates and interests?",
        answer: "Yes, absolutely! Every SunHaven package is 100% tailor-made. We can adjust the duration, add or remove destinations, and upgrade hotel categories according to your exact preferences.",
        order: 0,
      },
      {
        question: "What vehicle is provided for this journey?",
        answer: "You will travel in a private, late-model air-conditioned luxury car or minivan with ample luggage capacity.",
        order: 1,
      },
    ],
    whyChoose: {
      title: "Why Choose This Handcrafted Journey?",
      paragraphs: [
        "Designed to offer a seamless blend of Sri Lanka's cultural wonders, breathtaking hill country landscapes, and coastal tranquility without rushing.",
      ],
      bulletPoints: [
        "100% Private, flexible pace tailored to you",
        "Dedicated Chauffeur-Guide with deep local insights",
        "Handpicked accommodation with high service standards",
        "24/7 dedicated local concierge support",
      ],
    },
  };

  // Form State - Clean by default for new packages, or uses initialData for edit
  const [formData, setFormData] = useState<PackageFormData>(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      return {
        ...emptyState,
        ...initialData,
        overview: initialData.overview && initialData.overview.length > 0 ? initialData.overview : [""],
        routeMapStops: initialData.routeMapStops || [],
        highlights: initialData.highlights || [],
        itinerary: initialData.itinerary || [],
        inclusions: initialData.inclusions || [],
        exclusions: initialData.exclusions || [],
        faqs: initialData.faqs || [],
      };
    }
    return emptyState;
  });

  const loadSampleTemplate = () => {
    if (confirm("Load sample template data? This will fill the form with sample tour information.")) {
      setFormData(sampleTemplate);
    }
  };

  // Auto generate slug from title
  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Image Upload Helper
  const handleFileUpload = async (file: File, target: "hero" | "poster" | { dayIdx: number }) => {
    const data = new FormData();
    data.append("file", file);

    try {
      if (target === "hero") setUploadingHero(true);
      else if (target === "poster") setUploadingPoster(true);
      else setUploadingDayIdx(target.dayIdx);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const result = await res.json();
      const fileUrl = result.url;

      if (target === "hero") {
        setFormData((prev) => ({ ...prev, heroImage: fileUrl }));
      } else if (target === "poster") {
        setFormData((prev) => ({ ...prev, posterImage: fileUrl }));
      } else {
        setFormData((prev) => {
          const updatedItinerary = [...prev.itinerary];
          updatedItinerary[target.dayIdx] = {
            ...updatedItinerary[target.dayIdx],
            image: fileUrl,
          };
          return { ...prev, itinerary: updatedItinerary };
        });
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingHero(false);
      setUploadingPoster(false);
      setUploadingDayIdx(null);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Please provide a Package Title.");
      setActiveTab("basic");
      setLoading(false);
      return;
    }

    if (!formData.slug.trim()) {
      setError("Please provide a URL Slug.");
      setActiveTab("basic");
      setLoading(false);
      return;
    }

    if (!formData.heroImage.trim()) {
      setError("Please provide a Hero Image URL or upload an image.");
      setActiveTab("basic");
      setLoading(false);
      return;
    }

    try {
      const url = isEdit && initialData?.id
        ? `/api/admin/packages/${initialData.id}`
        : "/api/admin/packages";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        ...formData,
        priceFrom: formData.priceFrom ? parseFloat(String(formData.priceFrom)) : null,
        order: parseInt(String(formData.order), 10) || 0,
        overview: formData.overview.filter((p) => p.trim().length > 0),
        inclusions: formData.inclusions.filter((i) => i.trim().length > 0),
        exclusions: formData.exclusions.filter((e) => e.trim().length > 0),
        itinerary: formData.itinerary.map((day, idx) => ({
          ...day,
          dayNumber: idx + 1,
          description: day.description.filter((d) => d.trim().length > 0),
          highlights: day.highlights?.filter((h) => h.trim().length > 0) || [],
        })),
        routeMapStops: formData.routeMapStops.map((stop, idx) => ({
          ...stop,
          order: idx,
        })),
        faqs: formData.faqs.map((faq, idx) => ({
          ...faq,
          order: idx,
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save package");
      }

      setSuccess(isEdit ? "Package updated successfully!" : "Package created successfully!");
      setTimeout(() => {
        router.push("/admin/packages");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Helper Array Managers
  const addOverviewParagraph = () => {
    setFormData((prev) => ({ ...prev, overview: [...prev.overview, ""] }));
  };

  const removeOverviewParagraph = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      overview: prev.overview.filter((_, i) => i !== idx),
    }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          dayNumber: prev.itinerary.length + 1,
          title: `Day ${prev.itinerary.length + 1}: New Destination`,
          subtitle: "Explore & Discover",
          stopLocation: "Destination",
          overnightStay: "Selected Hotel",
          image: "/images/tea_country_estate.jpg",
          description: ["Detailed description of activities and highlights for this day."],
          highlights: ["Key Activity 1", "Key Activity 2"],
        },
      ],
    }));
  };

  const removeItineraryDay = (idx: number) => {
    if (formData.itinerary.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== idx),
    }));
  };

  const moveItineraryDay = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formData.itinerary.length) return;

    setFormData((prev) => {
      const items = [...prev.itinerary];
      const temp = items[idx];
      items[idx] = items[targetIdx];
      items[targetIdx] = temp;
      return { ...prev, itinerary: items };
    });
  };

  const addRouteStop = () => {
    setFormData((prev) => ({
      ...prev,
      routeMapStops: [
        ...prev.routeMapStops,
        {
          order: prev.routeMapStops.length,
          name: "New Stop",
          night: `Night ${prev.routeMapStops.length + 1}`,
          keyHighlight: "Main Attraction",
        },
      ],
    }));
  };

  const removeRouteStop = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      routeMapStops: prev.routeMapStops.filter((_, i) => i !== idx),
    }));
  };

  const addInclusion = () => {
    setFormData((prev) => ({ ...prev, inclusions: [...prev.inclusions, ""] }));
  };

  const removeInclusion = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== idx),
    }));
  };

  const addExclusion = () => {
    setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, ""] }));
  };

  const removeExclusion = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== idx),
    }));
  };

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: "",
          answer: "",
          order: prev.faqs.length,
        },
      ],
    }));
  };

  const removeFAQ = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx),
    }));
  };

  const addHotelTier = () => {
    if (!formData.accommodation) return;
    setFormData((prev) => ({
      ...prev,
      accommodation: {
        ...prev.accommodation!,
        hotelTiers: [...prev.accommodation!.hotelTiers, { name: "Boutique Tier", desc: "Hotel recommendations" }],
      },
    }));
  };

  const removeHotelTier = (idx: number) => {
    if (!formData.accommodation) return;
    setFormData((prev) => ({
      ...prev,
      accommodation: {
        ...prev.accommodation!,
        hotelTiers: prev.accommodation!.hotelTiers.filter((_, i) => i !== idx),
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-950/60 pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/packages")}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#cca45b] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tour Packages
          </button>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-semibold text-slate-100 flex items-center gap-3">
            {isEdit ? "Edit Tour Package" : "Create New Tour Package"}
            <span className="text-xs font-sans px-2.5 py-1 rounded-full bg-[#cca45b]/10 text-[#cca45b] border border-[#cca45b]/30">
              {formData.type === "LONG_DAY" ? "Multi-Day Tour" : "1-Day Excursion"}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isEdit && (
            <button
              type="button"
              onClick={loadSampleTemplate}
              className="px-3.5 py-2 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 hover:bg-[#cca45b]/20 rounded-lg border border-[#cca45b]/30 transition flex items-center gap-1.5"
              title="Quick fill with sample tour template"
            >
              <Wand2 className="w-3.5 h-3.5" /> Load Sample Template
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/admin/packages")}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-lg transition-all shadow-lg shadow-[#cca45b]/20 flex items-center gap-2 font-semibold disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {isEdit ? "Update Package" : "Save & Publish"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-start gap-3">
          <Check className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
          <div className="text-sm">{success}</div>
        </div>
      )}

      {/* Navigation Tabs with Scroll Arrows */}
      <div className="relative flex items-center gap-1 sm:gap-2 bg-[#071610]/70 p-1.5 rounded-xl border border-emerald-950/70 shadow-inner">
        <button
          type="button"
          onClick={() => scrollTabs("left")}
          className="p-2 sm:p-2.5 rounded-lg bg-[#0b1e16] border border-emerald-900/60 text-slate-400 hover:text-[#cca45b] hover:border-[#cca45b]/50 hover:bg-emerald-950/80 active:scale-95 transition-all shrink-0 shadow-sm"
          title="Scroll tab bar left"
          aria-label="Scroll tab bar left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={tabsContainerRef}
          onScroll={checkTabScroll}
          className="flex overflow-x-auto scroll-smooth scrollbar-none gap-2 py-0.5 px-0.5 flex-1"
        >
          {[
            { id: "basic", label: "1. Basic Details & Media", icon: Layers },
            { id: "itinerary", label: `2. Multi-Day Itinerary (${formData.itinerary.length} Days)`, icon: Calendar },
            { id: "route", label: `3. Route Stops (${formData.routeMapStops.length})`, icon: MapPin },
            { id: "highlights", label: "4. Tour Highlights", icon: Sparkles },
            { id: "inclusions", label: "5. Inclusions & Exclusions", icon: CheckCircle2 },
            { id: "hotels_faqs", label: "6. Hotels & FAQs", icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg transition-all border shrink-0 ${
                  isActive
                    ? "border-[#cca45b] text-[#cca45b] bg-[#cca45b]/10 shadow-sm font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-emerald-950/40 hover:border-emerald-900/40"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollTabs("right")}
          className="p-2 sm:p-2.5 rounded-lg bg-[#0b1e16] border border-emerald-900/60 text-slate-400 hover:text-[#cca45b] hover:border-[#cca45b]/50 hover:bg-emerald-950/80 active:scale-95 transition-all shrink-0 shadow-sm"
          title="Scroll tab bar right"
          aria-label="Scroll tab bar right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* TAB 1: Basic Details & Media */}
      {activeTab === "basic" && (
        <div className="space-y-8">
          {/* Main Info Card */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-cinzel font-semibold text-slate-100 flex items-center gap-2 border-b border-emerald-950/60 pb-3">
              <Layers className="w-5 h-5 text-[#cca45b]" /> Package General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tour Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Tour Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as "LONG_DAY" | "ONE_DAY",
                      durationTag: e.target.value === "ONE_DAY" ? "1 DAY TOUR" : prev.durationTag,
                    }))
                  }
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                >
                  <option value="LONG_DAY">Multi-Day Journey (Long Day Package)</option>
                  <option value="ONE_DAY">Single-Day Excursion (One Day Package)</option>
                </select>
              </div>

              {/* Package Order */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Display Order / Priority
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="0 (Lower shows first)"
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Tour Package Title *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="e.g. Relaxed 09 Nights / 10 Days Private Tour"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-3 py-2 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-xl hover:bg-[#cca45b]/20 flex items-center gap-1.5 transition"
                    title="Generate slug from title"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> Auto Slug
                  </button>
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  URL Slug * (Unique)
                </label>
                <div className="flex items-center bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus-within:border-[#cca45b]">
                  <span className="text-slate-500 mr-1">/packages/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="bg-transparent text-slate-100 flex-1 focus:outline-none"
                    placeholder="relaxed-09-nights-10-days-tour"
                    required
                  />
                </div>
              </div>

              {/* Price From */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Starting Price (USD $)
                </label>
                <input
                  type="number"
                  value={formData.priceFrom || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priceFrom: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. 1450 (Optional)"
                />
              </div>

              {/* Duration Tag */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Duration Badge Tag
                </label>
                <input
                  type="text"
                  value={formData.durationTag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, durationTag: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. 10 DAYS / 9 NIGHTS"
                />
              </div>

              {/* Duration Nights Days */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Duration Text (Nights / Days)
                </label>
                <input
                  type="text"
                  value={formData.durationNightsDays}
                  onChange={(e) => setFormData((prev) => ({ ...prev, durationNightsDays: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. 09 Nights / 10 Days"
                />
              </div>

              {/* Pace */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Pace
                </label>
                <input
                  type="text"
                  value={formData.pace}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pace: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. Relaxed & Leisurely"
                />
              </div>

              {/* Ideal For */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Ideal For
                </label>
                <input
                  type="text"
                  value={formData.idealFor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idealFor: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. Couples, Honeymooners, Families"
                />
              </div>

              {/* Subtitle */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Subtitle / Tagline
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                  placeholder="e.g. A gentle, enriching voyage through ancient UNESCO cities, mist-veiled tea estates, and golden southern beaches."
                />
              </div>

              {/* Visibility Toggles */}
              <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-5 h-5 rounded bg-[#07160f] border-emerald-800 text-[#cca45b] focus:ring-[#cca45b]"
                  />
                  <span className="text-sm font-medium text-slate-200">Publish Immediately (Visible on website)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded bg-[#07160f] border-emerald-800 text-[#cca45b] focus:ring-[#cca45b]"
                  />
                  <span className="text-sm font-medium text-[#cca45b]">Feature on Homepage Hero/Highlights</span>
                </label>
              </div>
            </div>
          </div>

          {/* Media & Images Card */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-cinzel font-semibold text-slate-100 flex items-center gap-2 border-b border-emerald-950/60 pb-3">
              <ImageIcon className="w-5 h-5 text-[#cca45b]" /> Hero & Poster Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hero Image */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Hero Banner Image *
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-emerald-950/80 flex items-center justify-center group">
                  {formData.heroImage ? (
                    <Image
                      src={formData.heroImage}
                      alt="Hero preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No image uploaded</p>
                    </div>
                  )}
                  {uploadingHero && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-[#cca45b] animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, heroImage: e.target.value }))}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="/images/... or URL"
                  />
                  <label className="px-3 py-2 text-xs font-medium text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "hero");
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Poster Image (Optional) */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Poster / Card Image (Optional)
                </label>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-emerald-950/80 flex items-center justify-center group">
                  {formData.posterImage ? (
                    <Image
                      src={formData.posterImage}
                      alt="Poster preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">Fallback to Hero Image</p>
                    </div>
                  )}
                  {uploadingPoster && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-[#cca45b] animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.posterImage || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, posterImage: e.target.value }))}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="e.g. /images/... (Optional)"
                  />
                  <label className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5 transition border border-slate-700">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "poster");
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Paragraphs */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
              <h2 className="text-lg font-cinzel font-semibold text-slate-100">
                Tour Overview Paragraphs
              </h2>
              <button
                type="button"
                onClick={addOverviewParagraph}
                className="px-3 py-1.5 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-lg hover:bg-[#cca45b]/20 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Paragraph
              </button>
            </div>

            <div className="space-y-3">
              {formData.overview.map((para, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-xs text-slate-500 font-mono mt-3 w-6">{idx + 1}.</span>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...formData.overview];
                      updated[idx] = e.target.value;
                      setFormData((prev) => ({ ...prev, overview: updated }));
                    }}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="Write a descriptive overview paragraph for this tour..."
                  />
                  {formData.overview.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOverviewParagraph(idx)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition mt-1"
                      title="Remove paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multi-Day Itinerary Builder */}
      {activeTab === "itinerary" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#0b1e16]/80 border border-emerald-950/60 p-4 rounded-2xl">
            <div>
              <h2 className="text-base font-cinzel font-semibold text-slate-100">
                Itinerary Days Timeline ({formData.itinerary.length} Days)
              </h2>
              <p className="text-xs text-slate-400">
                Build the day-by-day journey. Reorder or upload photos for each day.
              </p>
            </div>
            <button
              type="button"
              onClick={addItineraryDay}
              className="px-4 py-2 text-sm font-semibold text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Day {formData.itinerary.length + 1}
            </button>
          </div>

          <div className="space-y-6">
            {formData.itinerary.length === 0 ? (
              <div className="bg-[#0b1e16]/60 border border-dashed border-emerald-950 rounded-2xl p-12 text-center space-y-4">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <div>
                  <h3 className="font-cinzel text-base text-slate-200">No Itinerary Days Added</h3>
                  <p className="text-xs text-slate-400 mt-1">Start by adding Day 1 of your tour schedule.</p>
                </div>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="px-4 py-2 text-xs font-semibold text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl inline-flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Day 1
                </button>
              </div>
            ) : (
              formData.itinerary.map((day, idx) => (
              <div
                key={idx}
                className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 space-y-6 transition hover:border-emerald-800/60"
              >
                {/* Day Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#cca45b] text-[#07160f] font-bold text-xs rounded-lg font-cinzel shadow">
                      DAY {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-200 truncate max-w-md">
                      {day.title || `Day ${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItineraryDay(idx, "up")}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.itinerary.length - 1}
                      onClick={() => moveItineraryDay(idx, "down")}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
                        title="Delete Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Day Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[idx].title = e.target.value;
                        setFormData((prev) => ({ ...prev, itinerary: updated }));
                      }}
                      className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="e.g. Arrival in Sri Lanka & Coastal Negombo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Day Subtitle / Theme
                    </label>
                    <input
                      type="text"
                      value={day.subtitle || ""}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[idx].subtitle = e.target.value;
                        setFormData((prev) => ({ ...prev, itinerary: updated }));
                      }}
                      className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="e.g. Warm Welcome & Beachside Serenity"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Stop Location *
                    </label>
                    <input
                      type="text"
                      value={day.stopLocation}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[idx].stopLocation = e.target.value;
                        setFormData((prev) => ({ ...prev, itinerary: updated }));
                      }}
                      className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="e.g. Negombo / Sigiriya"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Overnight Stay
                    </label>
                    <input
                      type="text"
                      value={day.overnightStay}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[idx].overnightStay = e.target.value;
                        setFormData((prev) => ({ ...prev, itinerary: updated }));
                      }}
                      className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="e.g. Negombo Beachfront Hotel"
                    />
                  </div>

                  {/* Day Image Preview & Uploader */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Day Feature Photo
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-black/40 border border-emerald-950/80 shrink-0">
                        {day.image ? (
                          <Image
                            src={day.image}
                            alt="Day preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        {uploadingDayIdx === idx && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-[#cca45b] animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={day.image}
                            onChange={(e) => {
                              const updated = [...formData.itinerary];
                              updated[idx].image = e.target.value;
                              setFormData((prev) => ({ ...prev, itinerary: updated }));
                            }}
                            className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                            placeholder="/images/... or URL"
                          />
                          <label className="px-3 py-2 text-xs font-medium text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl cursor-pointer flex items-center gap-1.5 transition">
                            <Upload className="w-3.5 h-3.5" /> Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, { dayIdx: idx });
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day Description List */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Day Description & Itinerary Activities
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...formData.itinerary];
                          updated[idx].description = [...updated[idx].description, ""];
                          setFormData((prev) => ({ ...prev, itinerary: updated }));
                        }}
                        className="text-xs text-[#cca45b] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Paragraph
                      </button>
                    </div>

                    {day.description.map((desc, dIdx) => (
                      <div key={dIdx} className="flex gap-2 items-center">
                        <textarea
                          rows={2}
                          value={desc}
                          onChange={(e) => {
                            const updated = [...formData.itinerary];
                            updated[idx].description[dIdx] = e.target.value;
                            setFormData((prev) => ({ ...prev, itinerary: updated }));
                          }}
                          className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                          placeholder="Describe the activity, transfers, or experiences for this day..."
                        />
                        {day.description.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.itinerary];
                              updated[idx].description = updated[idx].description.filter((_, i) => i !== dIdx);
                              setFormData((prev) => ({ ...prev, itinerary: updated }));
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Day Highlights Tags */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      Day Key Highlights (Comma separated tags)
                    </label>
                    <input
                      type="text"
                      value={(day.highlights || []).join(", ")}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[idx].highlights = e.target.value.split(",").map((s) => s.trim());
                        setFormData((prev) => ({ ...prev, itinerary: updated }));
                      }}
                      className="w-full bg-[#07160f] border border-emerald-950/80 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="e.g. VIP Airport Meet, Sigiriya Climb, Tea Tasting"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      )}

      {/* TAB 3: Route Stops */}
      {activeTab === "route" && (
        <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <div>
              <h2 className="text-lg font-cinzel font-semibold text-slate-100">
                Route Map Stops & Destinations
              </h2>
              <p className="text-xs text-slate-400">
                These stops populate the visual route map at the top of the package page.
              </p>
            </div>
            <button
              type="button"
              onClick={addRouteStop}
              className="px-3 py-1.5 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-lg hover:bg-[#cca45b]/20 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Stop
            </button>
          </div>

          <div className="space-y-4">
            {formData.routeMapStops.length === 0 ? (
              <div className="bg-[#07160f] border border-dashed border-emerald-950 rounded-xl p-8 text-center space-y-3">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No route map stops added yet.</p>
                <button
                  type="button"
                  onClick={addRouteStop}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-lg inline-flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Stop
                </button>
              </div>
            ) : (
              formData.routeMapStops.map((stop, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-[#07160f] p-4 rounded-xl border border-emerald-950/80">
                  <span className="w-6 h-6 rounded-full bg-[#cca45b]/20 text-[#cca45b] flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                    <input
                      type="text"
                      value={stop.name}
                      onChange={(e) => {
                        const updated = [...formData.routeMapStops];
                        updated[idx].name = e.target.value;
                        setFormData((prev) => ({ ...prev, routeMapStops: updated }));
                      }}
                      className="bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="Stop Name (e.g. Kandy)"
                    />
                    <input
                      type="text"
                      value={stop.night}
                      onChange={(e) => {
                        const updated = [...formData.routeMapStops];
                        updated[idx].night = e.target.value;
                        setFormData((prev) => ({ ...prev, routeMapStops: updated }));
                      }}
                      className="bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="Duration (e.g. Night 3-4)"
                    />
                    <input
                      type="text"
                      value={stop.keyHighlight}
                      onChange={(e) => {
                        const updated = [...formData.routeMapStops];
                        updated[idx].keyHighlight = e.target.value;
                        setFormData((prev) => ({ ...prev, routeMapStops: updated }));
                      }}
                      className="bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                      placeholder="Key Highlight (e.g. Temple of Tooth)"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRouteStop(idx)}
                    className="text-rose-400 hover:text-rose-300 p-2 hover:bg-rose-950/30 rounded-lg transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Tour Highlights */}
      {activeTab === "highlights" && (
        <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <div>
              <h2 className="text-lg font-cinzel font-semibold text-slate-100">
                Tour Highlight Categories
              </h2>
              <p className="text-xs text-slate-400">
                Key curated experiences grouped by categories (e.g. Heritage, Wildlife, Hill Country).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  highlights: [
                    ...prev.highlights,
                    { category: "New Experience", iconName: "Sparkles", items: ["Experience item 1", "Experience item 2"] },
                  ],
                }));
              }}
              className="px-3 py-1.5 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-lg hover:bg-[#cca45b]/20 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="space-y-6">
            {formData.highlights.length === 0 ? (
              <div className="bg-[#07160f] border border-dashed border-emerald-950 rounded-xl p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No highlight categories added yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      highlights: [
                        { category: "Heritage & Culture", iconName: "Crown", items: ["Experience item 1"] },
                      ],
                    }));
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-lg inline-flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Category
                </button>
              </div>
            ) : (
              formData.highlights.map((cat, idx) => (
              <div key={idx} className="bg-[#07160f] p-5 rounded-xl border border-emerald-950/80 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => {
                        const updated = [...formData.highlights];
                        updated[idx].category = e.target.value;
                        setFormData((prev) => ({ ...prev, highlights: updated }));
                      }}
                      className="bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b] font-semibold"
                      placeholder="Category (e.g. Wildlife & Safaris)"
                    />
                    <select
                      value={cat.iconName}
                      onChange={(e) => {
                        const updated = [...formData.highlights];
                        updated[idx].iconName = e.target.value;
                        setFormData((prev) => ({ ...prev, highlights: updated }));
                      }}
                      className="bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    >
                      <option value="Crown">Crown (Heritage & Royalty)</option>
                      <option value="Compass">Compass (Navigation & Adventure)</option>
                      <option value="Sparkles">Sparkles (Luxury & Exclusivity)</option>
                      <option value="Camera">Camera (Scenic & Photography)</option>
                      <option value="MapPin">MapPin (Destinations & Landmarks)</option>
                    </select>
                  </div>

                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          highlights: prev.highlights.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="text-rose-400 hover:text-rose-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Items in category */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Highlight Bullet Items (One per line or comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={cat.items.join("\n")}
                    onChange={(e) => {
                      const updated = [...formData.highlights];
                      updated[idx].items = e.target.value.split("\n").filter((i) => i.trim().length > 0);
                      setFormData((prev) => ({ ...prev, highlights: updated }));
                    }}
                    className="w-full bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="Enter each highlight on a new line..."
                  />
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      )}

      {/* TAB 5: Inclusions & Exclusions */}
      {activeTab === "inclusions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inclusions */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
              <h2 className="text-base font-cinzel font-semibold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Package Inclusions
              </h2>
              <button
                type="button"
                onClick={addInclusion}
                className="text-xs text-[#cca45b] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.inclusions.map((inc, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => {
                      const updated = [...formData.inclusions];
                      updated[idx] = e.target.value;
                      setFormData((prev) => ({ ...prev, inclusions: updated }));
                    }}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="e.g. Private Luxury AC Vehicle"
                  />
                  {formData.inclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclusion(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
              <h2 className="text-base font-cinzel font-semibold text-rose-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" /> Package Exclusions
              </h2>
              <button
                type="button"
                onClick={addExclusion}
                className="text-xs text-[#cca45b] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {formData.exclusions.map((exc, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={exc}
                    onChange={(e) => {
                      const updated = [...formData.exclusions];
                      updated[idx] = e.target.value;
                      setFormData((prev) => ({ ...prev, exclusions: updated }));
                    }}
                    className="flex-1 bg-[#07160f] border border-emerald-950/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="e.g. International airfare"
                  />
                  {formData.exclusions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExclusion(idx)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Hotels & FAQs */}
      {activeTab === "hotels_faqs" && (
        <div className="space-y-8">
          {/* Accommodation Tiers */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
              <div>
                <h2 className="text-lg font-cinzel font-semibold text-slate-100">
                  Accommodation Tiers
                </h2>
                <p className="text-xs text-slate-400">
                  Hotel categories and sample properties included in this package.
                </p>
              </div>
              <button
                type="button"
                onClick={addHotelTier}
                className="px-3 py-1.5 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-lg hover:bg-[#cca45b]/20 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Hotel Tier
              </button>
            </div>

            <div className="space-y-4">
              {formData.accommodation?.hotelTiers.map((tier, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-[#07160f] p-4 rounded-xl border border-emerald-950/80">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => {
                      const updated = [...(formData.accommodation?.hotelTiers || [])];
                      updated[idx].name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        accommodation: { ...prev.accommodation!, hotelTiers: updated },
                      }));
                    }}
                    className="w-full sm:w-1/3 bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b] font-semibold"
                    placeholder="Tier Name (e.g. Luxury 5★)"
                  />
                  <input
                    type="text"
                    value={tier.desc}
                    onChange={(e) => {
                      const updated = [...(formData.accommodation?.hotelTiers || [])];
                      updated[idx].desc = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        accommodation: { ...prev.accommodation!, hotelTiers: updated },
                      }));
                    }}
                    className="flex-1 w-full bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="Sample Hotels (e.g. Heritance Kandalama, Jetwing Lighthouse)"
                  />
                  {formData.accommodation && formData.accommodation.hotelTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHotelTier(idx)}
                      className="text-rose-400 hover:text-rose-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-[#0b1e16]/80 border border-emerald-950/60 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
              <div>
                <h2 className="text-lg font-cinzel font-semibold text-slate-100">
                  Tour Frequently Asked Questions (FAQs)
                </h2>
                <p className="text-xs text-slate-400">
                  Custom questions and answers specific to this tour.
                </p>
              </div>
              <button
                type="button"
                onClick={addFAQ}
                className="px-3 py-1.5 text-xs font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-lg hover:bg-[#cca45b]/20 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {formData.faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#07160f] p-5 rounded-xl border border-emerald-950/80 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...formData.faqs];
                        updated[idx].question = e.target.value;
                        setFormData((prev) => ({ ...prev, faqs: updated }));
                      }}
                      className="flex-1 bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b] font-medium"
                      placeholder="Question: e.g. Can we adjust the start date or add an extra night in Galle?"
                    />
                    {formData.faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFAQ(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...formData.faqs];
                      updated[idx].answer = e.target.value;
                      setFormData((prev) => ({ ...prev, faqs: updated }));
                    }}
                    className="w-full bg-[#0b1e16] border border-emerald-950/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#cca45b]"
                    placeholder="Answer to the question..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-emerald-950/60">
        <button
          type="button"
          onClick={() => router.push("/admin/packages")}
          className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 text-sm font-bold text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl transition-all shadow-xl shadow-[#cca45b]/20 flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Package...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {isEdit ? "Update Package" : "Publish Tour Package"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
