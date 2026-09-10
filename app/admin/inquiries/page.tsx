"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Users,
  Hotel,
  DollarSign,
  Utensils,
  Sparkles,
  Globe,
  Package as PackageIcon,
  Plus,
  Send,
  Lock,
  Edit3,
  Check,
  History,
  Car,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  country: string | null;
  travelDates: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  duration: string | null;
  passengers: string | null;
  pax: number | null;
  adults: number | null;
  children: number | null;
  rooms: number | null;
  hotelCategory: string[] | null;
  mealPlan: string[] | null;
  budget: string | null;
  interests: string[] | null;
  customPlaces: string[] | null;
  specialRequests: string | null;
  quotePrice: string | null;
  quoteDetails: string | null;
  replyContent: string | null;
  repliedAt: string | null;
  internalNotes: string | null;
  packageId: string | null;
  package: { id: string; title: string; slug: string } | null;
  assignedTo: { name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const POPULAR_DESTINATIONS = [
  "Sigiriya",
  "Kandy",
  "Ella",
  "Galle",
  "Nuwara Eliya",
  "Yala National Park",
  "Mirissa",
  "Colombo",
  "Bentota",
  "Trincomalee",
  "Anuradhapura",
  "Polonnaruwa",
  "Dambulla",
  "Horton Plains",
  "Udawalawe",
  "Jaffna",
];

const HOTEL_CATEGORIES = ["Boutique", "5-Star", "4-Star", "3-Star", "Budget"];
const MEAL_PLANS = ["BB", "HB", "FB"];
const statusOptions = ["PENDING", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"];
const typeOptions = ["TRIP_PLANNER", "CUSTOM_TOUR", "AIRPORT_TRANSFER", "DIRECT_INQUIRY"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [availablePackages, setAvailablePackages] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "quote_reply">("overview");

  // Quotation editor state inside modal
  const [quotePrice, setQuotePrice] = useState("");
  const [quotePlaces, setQuotePlaces] = useState<string[]>([]);
  const [quoteHotelCat, setQuoteHotelCat] = useState<string[]>([]);
  const [quoteMealPlan, setQuoteMealPlan] = useState<string[]>([]);
  const [quotePackageId, setQuotePackageId] = useState("");
  const [customPlaceInput, setCustomPlaceInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingQuote, setSendingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState<string | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/admin/inquiries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();

    // Fetch packages for quote dropdown
    fetch("/api/packages?published=true")
      .then((res) => (res.ok ? res.json() : { packages: [] }))
      .then((data) => {
        if (data.packages && Array.isArray(data.packages)) {
          setAvailablePackages(data.packages);
        }
      })
      .catch(() => {});
  }, [pagination.page, search, statusFilter, typeFilter]);

  // Sync quotation form when an inquiry is selected
  useEffect(() => {
    if (selectedInquiry) {
      setQuotePrice(selectedInquiry.quotePrice || selectedInquiry.budget || "$2,450 USD");
      setQuotePlaces(
        selectedInquiry.customPlaces && Array.isArray(selectedInquiry.customPlaces)
          ? [...selectedInquiry.customPlaces]
          : ["Sigiriya", "Kandy", "Ella", "Galle"]
      );
      setQuoteHotelCat(
        selectedInquiry.hotelCategory && Array.isArray(selectedInquiry.hotelCategory)
          ? [...selectedInquiry.hotelCategory]
          : ["5-Star", "Boutique"]
      );
      setQuoteMealPlan(
        selectedInquiry.mealPlan && Array.isArray(selectedInquiry.mealPlan)
          ? [...selectedInquiry.mealPlan]
          : ["HB"]
      );
      setQuotePackageId(selectedInquiry.packageId || "");
      setEmailSubject(
        `Your Private Sri Lanka Tour Proposal & Quote - SunHaven Lanka`
      );

      // Pre-fill template
      const datesStr =
        selectedInquiry.arrivalDate && selectedInquiry.departureDate
          ? `${selectedInquiry.arrivalDate} to ${selectedInquiry.departureDate}`
          : selectedInquiry.travelDates || "Upcoming Travel Dates";

      const defaultMsg =
`Dear ${selectedInquiry.name},

Warm greetings from SunHaven Lanka Tours!

Thank you for contacting us regarding your upcoming holiday to Sri Lanka. We are delighted to share your tailored itinerary proposal and official quotation.

Your Journey Highlights:
• Private Chauffeur-Driven Luxury AC Vehicle throughout the tour
• Dedicated English-speaking certified chauffeur guide
• Handpicked luxury boutique & star accommodation with breakfast & dinner included
• Sightseeing, entrance tickets assistance, and scenic train arrangements
• 24/7 dedicated concierge assistance during your stay in Sri Lanka

Please review the quote and let us know if you would like to adjust any stops or accommodation styles. We look forward to creating an unforgettable journey for you!

Warm regards,
SunHaven Lanka Concierge Team`;

      setEmailMessage(selectedInquiry.replyContent || defaultMsg);
      setQuoteSuccess(null);
      setQuoteError(null);
    }
  }, [selectedInquiry]);

  const handleNotesChange = async (inquiryId: string, notes: string) => {
    try {
      await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, internalNotes: notes }),
      });
      fetchInquiries();
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const handleSendQuotationEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setQuoteError(null);
    setQuoteSuccess(null);
    setSendingQuote(true);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotePrice,
          customPlaces: quotePlaces,
          hotelCategory: quoteHotelCat,
          mealPlan: quoteMealPlan,
          packageId: quotePackageId || null,
          subject: emailSubject,
          messageContent: emailMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send quotation email");
      }

      setQuoteSuccess(
        `Quotation email successfully dispatched to ${selectedInquiry.email}! Status automatically marked as QUOTED.`
      );

      // Update local state
      if (data.inquiry) {
        setSelectedInquiry(data.inquiry);
      }
      fetchInquiries();
    } catch (err: any) {
      setQuoteError(err.message || "Could not dispatch quotation email.");
    } finally {
      setSendingQuote(false);
    }
  };

  const togglePlace = (place: string) => {
    setQuotePlaces((prev) =>
      prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]
    );
  };

  const addCustomPlace = () => {
    if (customPlaceInput.trim()) {
      const trimmed = customPlaceInput.trim();
      if (!quotePlaces.includes(trimmed)) {
        setQuotePlaces((prev) => [...prev, trimmed]);
      }
      setCustomPlaceInput("");
    }
  };

  const toggleHotel = (cat: string) => {
    setQuoteHotelCat((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleMeal = (plan: string) => {
    setQuoteMealPlan((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const applyTemplate = (type: "luxury" | "standard" | "day" | "transfer") => {
    if (!selectedInquiry) return;
    if (type === "transfer") {
      setEmailMessage(
`Dear ${selectedInquiry.name},

Warm greetings from SunHaven Lanka Tours.

Thank you for requesting a private chauffeur vehicle and transfer service in Sri Lanka.

Transfer Service Details:
• Private Air-Conditioned Vehicle with dedicated English-speaking certified chauffeur
• Route: ${selectedInquiry.customPlaces && selectedInquiry.customPlaces.length > 0 ? selectedInquiry.customPlaces.join(" ➔ ") : "Private Airport Transfer"}
• Meet & Greet Service with Flight Tracking & Airport Assistance
• All Highway / Expressway Tolls, Parking Fees, and Fuel Included

Total Quoted Price: ${quotePrice}

To confirm this transfer reservation, simply reply to this email or reach us on WhatsApp.

Warm regards,
SunHaven Lanka Chauffeur Concierge`);
    } else if (type === "luxury") {
      setEmailMessage(
`Dear ${selectedInquiry.name},

Warm greetings from SunHaven Lanka Tours.

We are delighted to present your Ultra-Luxury Bespoke Proposal for Sri Lanka.

Package Inclusions:
• Private Mercedes-Benz / Luxury Van with English-speaking executive chauffeur
• 5-Star Luxury & Heritage Boutique accommodations
• Gourmet Half-Board dining arrangements
• Fast-track airport meet & greet concierge
• Curated private excursions & VIP scenic tea train reservations

Total Quoted Price: ${quotePrice}

Please let us know if you wish to confirm or adjust any itinerary details.

Warmest regards,
SunHaven Lanka Private Travel Concierge`);
    } else if (type === "day") {
      setEmailMessage(
`Dear ${selectedInquiry.name},

Thank you for choosing SunHaven Lanka for your private day tour.

Excursion Details:
• Private Chauffeur & Air-Conditioned Vehicle (Pick-up & Drop-off included)
• All highway tolls, fuel, and parking included
• Flexible sightseeing stops: ${quotePlaces.join(", ")}

Total Quoted Price: ${quotePrice}

Please reply to this email to confirm your preferred pick-up time and location.

Best regards,
SunHaven Lanka Tours`);
    } else {
      setEmailMessage(
`Dear ${selectedInquiry.name},

Warm greetings from SunHaven Lanka Tours!

Thank you for reaching out to us. We have reviewed your travel wishes and prepared a comprehensive private itinerary proposal.

Proposed Route: ${quotePlaces.join(" → ")}
Accommodation Style: ${quoteHotelCat.join(", ")}
Meal Plan: ${quoteMealPlan.join(", ")}
Total Quoted Package Price: ${quotePrice}

Please feel free to ask any questions or request adjustments. We are excited to host you in Sri Lanka!

Warm regards,
SunHaven Lanka Team`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "CONTACTED":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "QUOTED":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "CONFIRMED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TRIP_PLANNER: "Trip Planner",
      CUSTOM_TOUR: "Custom Tour",
      AIRPORT_TRANSFER: "Airport Transfer",
      DIRECT_INQUIRY: "Direct Package Inquiry",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl font-bold text-white">Tour Inquiries & Quotations</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review traveler inquiries, customize tour parameters, and email branded quotations with automatic status updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/inquiry"
            target="_blank"
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#07160f] bg-[#cca45b] hover:bg-[#e0b86c] rounded-xl transition shadow-md"
          >
            + Public Inquiry Form
          </Link>
        </div>
      </div>

      {/* Quick Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setTypeFilter("");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            typeFilter === ""
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "bg-[#0a2118] border border-white/10 text-slate-300 hover:text-white"
          }`}
        >
          All Inquiries
        </button>

        <button
          onClick={() => {
            setTypeFilter("AIRPORT_TRANSFER");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
            typeFilter === "AIRPORT_TRANSFER"
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "bg-[#0a2118] border border-white/10 text-[#cca45b] hover:border-[#cca45b]"
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>🚗 Vehicle & Airport Transfers</span>
        </button>

        <button
          onClick={() => {
            setTypeFilter("DIRECT_INQUIRY");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
            typeFilter === "DIRECT_INQUIRY"
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "bg-[#0a2118] border border-white/10 text-slate-300 hover:text-white"
          }`}
        >
          <PackageIcon className="w-3.5 h-3.5" />
          <span>🌴 Tour Packages</span>
        </button>

        <button
          onClick={() => {
            setTypeFilter("TRIP_PLANNER");
            setPagination((p) => ({ ...p, page: 1 }));
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${
            typeFilter === "TRIP_PLANNER"
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "bg-[#0a2118] border border-white/10 text-slate-300 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Trip Planner</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search by traveler name, email, phone, country, route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin mx-auto" />
            <p className="text-xs text-slate-400 mt-2 font-cinzel">Loading inquiry leads...</p>
          </div>
        ) : inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Traveler & Contact</th>
                  <th className="p-4">Dates & Group</th>
                  <th className="p-4 hidden md:table-cell">Tour Package</th>
                  <th className="p-4 hidden lg:table-cell">Quote / Budget</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => {
                  const arrival = inquiry.arrivalDate || "";
                  const departure = inquiry.departureDate || "";
                  const paxDisplay = inquiry.pax
                    ? `${inquiry.pax} Pax (${inquiry.adults || 0} Ad, ${inquiry.children || 0} Ch)`
                    : inquiry.passengers || "2 Adults";

                  return (
                    <tr
                      key={inquiry.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm"
                    >
                      {/* Traveler info */}
                      <td className="p-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {inquiry.name}
                          {inquiry.country && (
                            <span className="text-[11px] font-normal text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                              {inquiry.country}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {inquiry.email}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#cca45b]" /> {inquiry.phone}
                        </div>
                      </td>

                      {/* Dates & Group */}
                      <td className="p-4">
                        <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#cca45b]" />
                          {arrival && departure
                            ? `${arrival} → ${departure}`
                            : inquiry.travelDates || "Flexible Dates"}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {paxDisplay}
                          {inquiry.rooms && ` • ${inquiry.rooms} Rms`}
                        </div>
                      </td>

                      {/* Tour / Package / Vehicle */}
                      <td className="p-4 hidden md:table-cell">
                        {inquiry.type === "AIRPORT_TRANSFER" ? (
                          <div>
                            <div className="text-xs font-bold text-[#cca45b] flex items-center gap-1.5">
                              <Car className="w-3.5 h-3.5 text-emerald-400" />
                              Airport Transfer & Chauffeur
                            </div>
                            {inquiry.customPlaces && inquiry.customPlaces.length > 0 ? (
                              <span className="text-[11px] text-emerald-300 font-mono block mt-1">
                                {inquiry.customPlaces.join(" ➔ ")}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Private Chauffeur Vehicle
                              </span>
                            )}
                          </div>
                        ) : inquiry.package ? (
                          <div className="text-xs font-semibold text-[#cca45b]">
                            {inquiry.package.title}
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-slate-300">
                            Tailor-Made Custom Tour
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                          {getTypeLabel(inquiry.type)}
                        </span>
                      </td>

                      {/* Quote / Budget */}
                      <td className="p-4 hidden lg:table-cell">
                        {inquiry.quotePrice ? (
                          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg w-fit">
                            <DollarSign className="w-3.5 h-3.5" />
                            Quoted: {inquiry.quotePrice}
                          </div>
                        ) : inquiry.budget ? (
                          <div className="text-xs font-medium text-slate-300 flex items-center gap-1">
                            Budget: {inquiry.budget}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Not quoted yet</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setActiveTab("quote_reply");
                              setShowDetails(true);
                            }}
                            className="px-3 py-1.5 bg-[#cca45b] text-[#07160f] font-bold text-xs rounded-lg hover:bg-[#e0b86c] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply & Quote</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setActiveTab("overview");
                              setShowDetails(true);
                            }}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 hover:text-white transition-colors font-medium cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">No inquiries found</h3>
            <p className="text-slate-400 text-sm">Inquiries from the website will appear here in real-time.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED MODAL WITH EMAIL QUOTATION WORKFLOW */}
      {showDetails && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0a2118] border border-[#cca45b]/40 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Top Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a2118]/95 backdrop-blur-md z-20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                      selectedInquiry.status
                    )}`}
                  >
                    {selectedInquiry.status}
                  </span>
                  <span className="text-xs text-[#cca45b] font-medium">
                    {getTypeLabel(selectedInquiry.type)}
                  </span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {selectedInquiry.name}
                  {selectedInquiry.country && (
                    <span className="text-sm font-normal text-slate-400">({selectedInquiry.country})</span>
                  )}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-[#05110b] p-1 rounded-xl border border-emerald-950/80">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                      activeTab === "overview"
                        ? "bg-[#cca45b] text-[#07160f] shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Inquiry Details
                  </button>
                  <button
                    onClick={() => setActiveTab("quote_reply")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                      activeTab === "quote_reply"
                        ? "bg-[#cca45b] text-[#07160f] shadow"
                        : "text-[#cca45b] hover:text-white"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Quote</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedInquiry(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-lg transition-colors cursor-pointer ml-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Customer Contact Details (LOCKED) */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#cca45b] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#cca45b]" /> Customer Contact Profile (Locked)
                      </h3>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                        Customer Submissions Unaltered
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">Full Name</span>
                        <strong className="text-white">{selectedInquiry.name}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">Email Address</span>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-[#cca45b] hover:underline"
                        >
                          {selectedInquiry.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">WhatsApp / Phone</span>
                        <strong className="text-white">{selectedInquiry.phone}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-0.5">Country</span>
                        <strong className="text-white">{selectedInquiry.country || "Not specified"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Travel Requirements & Setup */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#cca45b] flex items-center gap-1.5 border-b border-emerald-950/60 pb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#cca45b]" /> Travel Dates & Group Composition
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Arrival Date (To SL)</span>
                        <strong className="text-white font-medium">
                          {selectedInquiry.arrivalDate || selectedInquiry.travelDates || "Flexible"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Departure Date</span>
                        <strong className="text-white font-medium">
                          {selectedInquiry.departureDate || "Flexible"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Total Pax Breakdown</span>
                        <strong className="text-white font-medium">
                          {selectedInquiry.pax
                            ? `${selectedInquiry.pax} (${selectedInquiry.adults || 0} Ad, ${selectedInquiry.children || 0} Ch)`
                            : selectedInquiry.passengers || "2 Pax"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Rooms Required</span>
                        <strong className="text-white font-medium">
                          {selectedInquiry.rooms ? `${selectedInquiry.rooms} Room(s)` : "1 Room"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation & Custom Places */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#cca45b] flex items-center gap-1.5 border-b border-emerald-950/60 pb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#cca45b]" /> Style, Preferences & Places
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Hotel Category</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedInquiry.hotelCategory && Array.isArray(selectedInquiry.hotelCategory) && selectedInquiry.hotelCategory.length > 0 ? (
                            selectedInquiry.hotelCategory.map((cat) => (
                              <span key={cat} className="px-2.5 py-0.5 bg-[#cca45b]/15 border border-[#cca45b]/30 text-[#cca45b] rounded-lg text-xs font-medium">
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Meal Plan</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedInquiry.mealPlan && Array.isArray(selectedInquiry.mealPlan) && selectedInquiry.mealPlan.length > 0 ? (
                            selectedInquiry.mealPlan.map((plan) => (
                              <span key={plan} className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-medium">
                                {plan}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Target Budget</span>
                        <strong className="text-emerald-400 font-semibold">{selectedInquiry.budget || "Not specified"}</strong>
                      </div>
                    </div>

                    {/* Custom Places */}
                    {selectedInquiry.customPlaces && Array.isArray(selectedInquiry.customPlaces) && selectedInquiry.customPlaces.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] text-slate-400 block mb-1">Customer Requested Places</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInquiry.customPlaces.map((place) => (
                            <span key={place} className="px-2.5 py-1 bg-[#cca45b]/20 border border-[#cca45b]/50 text-[#cca45b] rounded-lg text-xs font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Special Requests */}
                  {selectedInquiry.specialRequests && (
                    <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#cca45b] block">
                        Customer Notes & Special Requests
                      </label>
                      <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedInquiry.specialRequests}
                      </p>
                    </div>
                  )}

                  {/* Previous Quotation History if already quoted */}
                  {selectedInquiry.repliedAt && (
                    <div className="bg-purple-950/30 border border-purple-800/60 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                          <History className="w-4 h-4" /> Last Quoted on {new Date(selectedInquiry.repliedAt).toLocaleString()}
                        </h4>
                        <span className="text-sm font-bold text-emerald-400">
                          {selectedInquiry.quotePrice}
                        </span>
                      </div>
                      {selectedInquiry.replyContent && (
                        <p className="text-xs text-slate-300 bg-[#07160f]/90 p-3 rounded-xl whitespace-pre-wrap font-mono">
                          {selectedInquiry.replyContent}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Internal Notes */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#cca45b] block">
                      Internal Staff Notes
                    </label>
                    <textarea
                      value={selectedInquiry.internalNotes || ""}
                      onChange={(e) => handleNotesChange(selectedInquiry.id, e.target.value)}
                      rows={2}
                      className="w-full bg-[#05110b] border border-white/15 focus:border-[#cca45b] rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                      placeholder="Add internal notes for staff..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("quote_reply")}
                      className="px-6 py-3 bg-[#cca45b] text-[#07160f] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#e0b86c] transition-all flex items-center gap-2 shadow-lg shadow-[#cca45b]/20"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Prepare & Email Official Quote</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: QUOTATION & EMAIL REPLY COMPOSER */}
              {activeTab === "quote_reply" && (
                <form onSubmit={handleSendQuotationEmail} className="space-y-6">
                  {quoteSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <div>{quoteSuccess}</div>
                    </div>
                  )}

                  {quoteError && (
                    <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm">
                      {quoteError}
                    </div>
                  )}

                  {/* Locked Traveler Contact Card */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Lock className="w-3 h-3 text-[#cca45b]" /> Recipient Client
                      </div>
                      <strong className="text-white text-base">{selectedInquiry.name}</strong>{" "}
                      <span className="text-xs text-slate-400">({selectedInquiry.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status upon send:</span>
                      <span className="px-2.5 py-0.5 bg-purple-950/80 border border-purple-700 text-purple-300 font-bold text-xs rounded-full">
                        ➔ Will auto-set to QUOTED
                      </span>
                    </div>
                  </div>

                  {/* Editable Section: Price, Places, Package, Accommodation */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#cca45b] flex items-center gap-1.5 border-b border-emerald-950/60 pb-2">
                      <Edit3 className="w-3.5 h-3.5 text-[#cca45b]" /> 1. Customize Quotation & Itinerary Route
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Quoted Price */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Official Quoted Price ($ USD) <span className="text-[#cca45b]">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. $2,450 USD"
                            value={quotePrice}
                            onChange={(e) => setQuotePrice(e.target.value)}
                            className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-emerald-300 font-bold focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Linked Package */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Assigned Tour Package
                        </label>
                        <div className="relative">
                          <PackageIcon className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                          <select
                            value={quotePackageId}
                            onChange={(e) => setQuotePackageId(e.target.value)}
                            className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                          >
                            <option value="">100% Custom Tailor-Made Private Tour</option>
                            {availablePackages.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Places / Destination Stops (Editable) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                          Itinerary Stops / Must-Visit Places ({quotePlaces.length} selected)
                        </label>
                        <span className="text-[11px] text-[#cca45b]">Click to add/remove</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {POPULAR_DESTINATIONS.map((place) => {
                          const active = quotePlaces.includes(place);
                          return (
                            <button
                              key={place}
                              type="button"
                              onClick={() => togglePlace(place)}
                              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                                active
                                  ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b] font-semibold"
                                  : "bg-[#05110b] border-emerald-950/80 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              {active ? "✓ " : "+ "}
                              {place}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Place adder */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type other stop / location..."
                          value={customPlaceInput}
                          onChange={(e) => setCustomPlaceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomPlace();
                            }
                          }}
                          className="flex-1 bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={addCustomPlace}
                          className="px-4 py-2 bg-[#cca45b]/15 border border-[#cca45b]/40 text-[#cca45b] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#cca45b]/30 transition cursor-pointer"
                        >
                          + Add Stop
                        </button>
                      </div>

                      {quotePlaces.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-emerald-950/60">
                          {quotePlaces.map((place) => (
                            <span
                              key={place}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#cca45b]/20 border border-[#cca45b]/50 text-[#cca45b] text-xs font-semibold rounded-lg"
                            >
                              <MapPin className="w-3 h-3" />
                              {place}
                              <button
                                type="button"
                                onClick={() => togglePlace(place)}
                                className="hover:text-white transition cursor-pointer ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hotel Category & Meal Plan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Accommodation Style
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {HOTEL_CATEGORIES.map((cat) => {
                            const active = quoteHotelCat.includes(cat);
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => toggleHotel(cat)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                                  active
                                    ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b] font-semibold"
                                    : "bg-[#05110b] border-emerald-950/80 text-slate-400"
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Meal Plan
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {MEAL_PLANS.map((plan) => {
                            const active = quoteMealPlan.includes(plan);
                            return (
                              <button
                                key={plan}
                                type="button"
                                onClick={() => toggleMeal(plan)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                                  active
                                    ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b] font-semibold"
                                    : "bg-[#05110b] border-emerald-950/80 text-slate-400"
                                }`}
                              >
                                {plan}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Composer & Message */}
                  <div className="bg-[#07160f] border border-emerald-950/80 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-950/60 pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#cca45b] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#cca45b]" /> 2. Branded Email Message & Proposal
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400 text-[11px]">Quick Templates:</span>
                        <button
                          type="button"
                          onClick={() => applyTemplate("transfer")}
                          className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] transition font-medium"
                        >
                          🚗 Transfer Quote
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate("luxury")}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px] transition"
                        >
                          Luxury
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate("standard")}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px] transition"
                        >
                          Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTemplate("day")}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px] transition"
                        >
                          Day Tour
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Email Subject Line <span className="text-[#cca45b]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Personalized Proposal Content & Itinerary Notes <span className="text-[#cca45b]">*</span>
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        className="w-full bg-[#05110b] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl p-3.5 text-sm text-white font-sans focus:outline-none transition-colors leading-relaxed"
                        placeholder="Write proposal text..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-xs text-slate-400">
                      💡 Clicking Send will email <strong className="text-white">{selectedInquiry.email}</strong> and automatically transition status to <strong className="text-purple-400">QUOTED</strong>.
                    </p>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setActiveTab("overview")}
                        className="px-5 py-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={sendingQuote}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#cca45b]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                      >
                        {sendingQuote ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Email Quote...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Quotation & Email Client</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}