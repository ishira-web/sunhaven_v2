"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Users,
  Briefcase,
  DollarSign,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  X,
  Save,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Plane,
  Upload,
  UploadCloud,
  ImageIcon,
} from "lucide-react";

interface Vehicle {
  id: string;
  type: string;
  guests: string;
  luggageCapacity: string | null;
  description: string;
  image: string;
  ratePerKm: number | null;
  basePrice: number | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Inquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  arrivalDate: string | null;
  travelDates: string | null;
  passengers: string | null;
  pax: number | null;
  customPlaces: string[] | null;
  specialRequests: string | null;
  status: string;
  quotePrice: string | null;
  createdAt: string;
}

const PRESET_IMAGES = [
  { label: "Sedan Car", url: "/images/car.png" },
  { label: "Comfort Minivan", url: "/images/min-van.jpg" },
  { label: "Luxury Van", url: "/images/luxury-van.jfif" },
];

const DEFAULT_FLEET = [
  {
    type: "CAR",
    guests: "1 – 3 Guests",
    luggageCapacity: "2 Large Bags",
    description: "Ideal for couples, solo travelers & private executive airport transfers.",
    image: "/images/car.png",
    ratePerKm: 0.65,
    basePrice: 45.0,
    isActive: true,
    order: 1,
  },
  {
    type: "MINIVAN",
    guests: "4 – 6 Guests",
    luggageCapacity: "4 Large Bags",
    description: "Spacious seating perfect for families and small private groups.",
    image: "/images/min-van.jpg",
    ratePerKm: 0.85,
    basePrice: 65.0,
    isActive: true,
    order: 2,
  },
  {
    type: "LUXURY VAN",
    guests: "7 – 12 Guests",
    luggageCapacity: "8 Large Bags",
    description: "Executive high-roof luxury van with maximum legroom and luggage space.",
    image: "/images/luxury-van.jfif",
    ratePerKm: 1.15,
    basePrice: 95.0,
    isActive: true,
    order: 3,
  },
];

export default function VehiclesAdminPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "inquiries">("fleet");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleInquiries, setVehicleInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState("");
  const [formGuests, setFormGuests] = useState("");
  const [formLuggage, setFormLuggage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formRatePerKm, setFormRatePerKm] = useState<string>("");
  const [formBasePrice, setFormBasePrice] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOrder, setFormOrder] = useState<number>(1);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/admin/vehicles?limit=50");
      if (res.ok) {
        const data = await res.json();
        if (data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles);
        } else {
          // If empty, auto-seed default fleet to provide instant working experience
          for (const item of DEFAULT_FLEET) {
            await fetch("/api/admin/vehicles", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
          }
          const retryRes = await fetch("/api/admin/vehicles?limit=50");
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            setVehicles(retryData.vehicles || []);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch fleet vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries?type=AIRPORT_TRANSFER&limit=50");
      if (res.ok) {
        const data = await res.json();
        setVehicleInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error("Failed to fetch vehicle inquiries:", err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchVehicles();
      fetchVehicleInquiries();
    });
  }, []);

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setFormType("");
    setFormGuests("");
    setFormLuggage("");
    setFormDescription("");
    setFormImage("");
    setFormRatePerKm("");
    setFormBasePrice("");
    setFormIsActive(true);
    setFormOrder(vehicles.length + 1);
    setFormError(null);
    setUploadError(null);
    setUploadingImage(false);
    setIsDragging(false);
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormType(vehicle.type);
    setFormGuests(vehicle.guests);
    setFormLuggage(vehicle.luggageCapacity || "");
    setFormDescription(vehicle.description);
    setFormImage(vehicle.image);
    setFormRatePerKm(vehicle.ratePerKm ? vehicle.ratePerKm.toString() : "");
    setFormBasePrice(vehicle.basePrice ? vehicle.basePrice.toString() : "");
    setFormIsActive(vehicle.isActive);
    setFormOrder(vehicle.order);
    setFormError(null);
    setUploadError(null);
    setUploadingImage(false);
    setIsDragging(false);
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setUploadError("Invalid format. Please select a JPG, PNG, or WebP photo.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image is too large. Maximum file size is 5MB.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload?folder=vehicle_images&prefix=vehicle", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Image upload failed");
      }

      const result = await res.json();
      setFormImage(result.url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formType.trim() || !formGuests.trim() || !formDescription.trim() || !formImage.trim()) {
      setFormError("Type, guests, description, and image URL are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type: formType.trim().toUpperCase(),
        guests: formGuests.trim(),
        luggageCapacity: formLuggage.trim(),
        description: formDescription.trim(),
        image: formImage.trim(),
        ratePerKm: formRatePerKm ? parseFloat(formRatePerKm) : null,
        basePrice: formBasePrice ? parseFloat(formBasePrice) : null,
        isActive: formIsActive,
        order: Number(formOrder) || 0,
      };

      if (editingVehicle) {
        const res = await fetch(`/api/admin/vehicles/${editingVehicle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update vehicle");
        }
      } else {
        const res = await fetch("/api/admin/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create vehicle");
        }
      }

      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save vehicle details");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle from the fleet?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchVehicles();
      }
    } catch (err) {
      console.error("Failed to delete vehicle:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.type.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase()) ||
      v.guests.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
        ? v.isActive
        : !v.isActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl font-bold text-white">Chauffeur Fleet & Vehicle Inquiries</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your private luxury transfer fleet and view incoming vehicle & transfer booking inquiries.
          </p>
        </div>

        {activeTab === "fleet" && (
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#cca45b]/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Fleet Vehicle</span>
          </button>
        )}
      </div>

      {/* Main Tabs: Fleet Vehicles vs Vehicle Booking Inquiries */}
      <div className="flex bg-[#0a2118] p-1.5 rounded-2xl border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab("fleet")}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
            activeTab === "fleet"
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Fleet Vehicles ({vehicles.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("inquiries");
            fetchVehicleInquiries();
          }}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
            activeTab === "inquiries"
              ? "bg-[#cca45b] text-[#07160f] shadow-md shadow-[#cca45b]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Vehicle Inquiries & Transfers ({vehicleInquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: FLEET VEHICLES */}
      {activeTab === "fleet" && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bg-[#0a2118] border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search by vehicle model, type, or capacity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active in Fleet</option>
                  <option value="INACTIVE">Hidden / Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fleet Grid Cards */}
          {loading ? (
            <div className="p-16 text-center bg-[#0a2118] border border-white/10 rounded-2xl">
              <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin mx-auto" />
              <p className="text-xs text-slate-400 mt-2 font-cinzel">Loading fleet vehicles...</p>
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`bg-[#0a2118] border rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:border-[#cca45b]/60 ${
                    vehicle.isActive ? "border-white/10" : "border-rose-900/40 opacity-70"
                  }`}
                >
                  {/* Image Banner */}
                  <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.type}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-md ${
                          vehicle.isActive
                            ? "bg-emerald-950/90 text-emerald-400 border-emerald-700"
                            : "bg-rose-950/90 text-rose-400 border-rose-800"
                        }`}
                      >
                        {vehicle.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
                      <span className="text-[11px] text-slate-300">Order: #{vehicle.order}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#cca45b]" />
                        {vehicle.type}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="bg-[#07160f] border border-white/5 p-2.5 rounded-xl flex items-center gap-2 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-[#cca45b]" />
                          <span>{vehicle.guests}</span>
                        </div>
                        <div className="bg-[#07160f] border border-white/5 p-2.5 rounded-xl flex items-center gap-2 text-slate-300">
                          <Briefcase className="w-3.5 h-3.5 text-[#cca45b]" />
                          <span>{vehicle.luggageCapacity || "2 Bags"}</span>
                        </div>
                      </div>

                      {/* Pricing Overview */}
                      {(vehicle.basePrice || vehicle.ratePerKm) && (
                        <div className="mt-3 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-300 font-semibold">
                          {vehicle.basePrice && <span>Base: ${vehicle.basePrice.toFixed(2)}</span>}
                          {vehicle.ratePerKm && <span>Rate: ${vehicle.ratePerKm.toFixed(2)}/km</span>}
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenEdit(vehicle)}
                        className="px-4 py-2 bg-white/5 hover:bg-[#cca45b] text-slate-300 hover:text-[#07160f] rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Vehicle</span>
                      </button>

                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        disabled={deletingId === vehicle.id}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                        title="Delete Vehicle"
                      >
                        {deletingId === vehicle.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-[#0a2118] border border-white/10 rounded-2xl">
              <Car className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">No fleet vehicles found</h3>
              <p className="text-slate-400 text-sm mb-4">Add your private vehicles to display in the transfers section.</p>
              <button
                onClick={handleOpenCreate}
                className="px-6 py-2.5 bg-[#cca45b] text-[#07160f] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0b86c] transition shadow-md"
              >
                + Add Vehicle Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VEHICLE & TRANSFER INQUIRIES */}
      {activeTab === "inquiries" && (
        <div className="bg-[#0a2118] border border-white/10 rounded-3xl overflow-hidden shadow-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-[#cca45b]" />
                Recent Vehicle & Airport Transfer Inquiries
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Incoming private chauffeur and transfer bookings submitted from the website
              </p>
            </div>

            <Link
              href="/admin/inquiries?type=AIRPORT_TRANSFER"
              className="text-xs text-[#cca45b] hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Manage in Inquiries Hub</span>
              <span>→</span>
            </Link>
          </div>

          {inquiriesLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin mx-auto" />
              <p className="text-xs text-slate-400 mt-2 font-cinzel">Loading transfer inquiries...</p>
            </div>
          ) : vehicleInquiries.length > 0 ? (
            <div className="space-y-3">
              {vehicleInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-[#07160f] border border-emerald-950/80 hover:border-[#cca45b]/50 rounded-2xl p-4 sm:p-5 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#cca45b]/20 text-[#cca45b] border border-[#cca45b]/40 flex items-center gap-1">
                        <Car className="w-3 h-3" /> Airport Transfer / Chauffeur
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800">
                        {inq.status}
                      </span>
                      {inq.quotePrice && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800">
                          Quoted: {inq.quotePrice}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-bold text-white text-base">{inq.name}</h4>
                      {inq.country && (
                        <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          {inq.country}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#cca45b]" /> {inq.email}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" /> {inq.phone}
                      </span>
                    </div>

                    {/* Route Details */}
                    {inq.customPlaces && inq.customPlaces.length > 0 && (
                      <div className="text-xs font-semibold text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#cca45b] shrink-0" />
                        <span>Route: {inq.customPlaces.join(" ➔ ")}</span>
                      </div>
                    )}

                    {/* Schedule & Pax */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#cca45b]" />
                        <span>{inq.travelDates || inq.arrivalDate || "Flexible Date"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{inq.passengers || `${inq.pax || 2} Pax`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/inquiries`}
                      className="px-4 py-2 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Quote & Reply</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Car className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-cinzel text-base font-bold text-white mb-1">No vehicle inquiries yet</h3>
              <p className="text-xs text-slate-400">Transfers booked through the website booking form will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0a2118] border border-[#cca45b]/40 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a2118]/95 backdrop-blur-md z-20">
              <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-[#cca45b]" />
                {editingVehicle ? `Edit ${editingVehicle.type}` : "Add New Fleet Vehicle"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-lg transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Vehicle Type / Model <span className="text-[#cca45b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAR, MINIVAN, LUXURY VAN, COACH, SUV"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white uppercase focus:outline-none transition-colors"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Guests Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Passenger Capacity <span className="text-[#cca45b]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 – 3 Guests"
                    value={formGuests}
                    onChange={(e) => setFormGuests(e.target.value)}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Luggage Capacity */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Large Bags"
                    value={formLuggage}
                    onChange={(e) => setFormLuggage(e.target.value)}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Base Transfer Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 45.00"
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(e.target.value)}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Rate Per KM */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Rate per KM ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.65"
                    value={formRatePerKm}
                    onChange={(e) => setFormRatePerKm(e.target.value)}
                    className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Hidden File Input for Native OS Browser */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploadingImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                  e.target.value = "";
                }}
              />

              {/* Drag & Drop Upload Zone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Vehicle Photo <span className="text-[#cca45b]">*</span>
                  </label>
                  {formImage && (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  )}
                </div>

                {/* Dropzone Container */}
                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!formImage && !uploadingImage) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`relative rounded-2xl transition-all duration-200 overflow-hidden ${
                    isDragging
                      ? "border-2 border-dashed border-[#cca45b] bg-[#cca45b]/15 scale-[1.01] shadow-xl shadow-[#cca45b]/20"
                      : formImage
                      ? "border border-white/15 bg-[#07160f]"
                      : "border-2 border-dashed border-white/20 hover:border-[#cca45b]/70 bg-[#07160f]/60 hover:bg-[#07160f] cursor-pointer"
                  }`}
                >
                  {/* Uploading Spinner Overlay */}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30 p-4 text-center">
                      <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin" />
                      <div>
                        <p className="text-sm font-bold text-white">Saving vehicle image...</p>
                        <p className="text-xs text-[#cca45b] mt-0.5 font-mono">public/vehicle_images</p>
                      </div>
                    </div>
                  )}

                  {/* Drag Active Glow Overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-[#0a2118]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-[#cca45b]/20 border border-[#cca45b] flex items-center justify-center text-[#cca45b] animate-bounce">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <p className="text-sm font-bold text-[#cca45b]">Drop vehicle image to upload</p>
                      <p className="text-xs text-slate-300">Will be stored in /vehicle_images</p>
                    </div>
                  )}

                  {formImage ? (
                    /* Image Preview Card */
                    <div className="p-4">
                      <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center mb-3 group">
                        <Image
                          src={formImage}
                          alt="Vehicle preview"
                          fill
                          className="object-contain p-3"
                          unoptimized
                        />
                        {/* Hover hint */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                          <UploadCloud className="w-6 h-6 text-[#cca45b]" />
                          <span className="text-xs text-slate-200 font-medium">Drag & drop another photo to replace</span>
                        </div>
                      </div>

                      {/* Path & Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                        <div className="truncate text-xs text-slate-400 max-w-[260px]" title={formImage}>
                          <span className="text-slate-500 font-mono">Location:</span>{" "}
                          <span className="text-slate-300 font-mono text-[11px]">{formImage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-[#cca45b] hover:bg-[#d9b46e] text-[#07160f] rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#cca45b]/20"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select New File</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormImage("");
                              setUploadError(null);
                            }}
                            className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty Dropzone Card */
                    <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#cca45b]/10 border border-[#cca45b]/30 flex items-center justify-center text-[#cca45b] mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-white mb-1">
                        Drag & drop vehicle photo here
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        or{" "}
                        <span className="text-[#cca45b] font-semibold underline underline-offset-2">
                          browse from your computer
                        </span>
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
                        <span>PNG, JPG, WebP</span>
                        <span>•</span>
                        <span>Max 5MB</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">/public/vehicle_images</span>
                      </div>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}

                {/* Quick Presets & Optional Manual URL */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400">Standard Presets:</span>
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setFormImage(preset.url);
                          setUploadError(null);
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#cca45b] rounded-lg border border-white/10 text-xs transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    className="text-slate-500 hover:text-slate-400 text-[11px] underline cursor-pointer"
                  >
                    {showManualUrl ? "Hide URL input" : "Enter custom URL instead"}
                  </button>
                </div>

                {showManualUrl && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="Paste image URL (optional)"
                      value={formImage}
                      onChange={(e) => {
                        setFormImage(e.target.value);
                        setUploadError(null);
                      }}
                      className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Vehicle Description <span className="text-[#cca45b]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe vehicle features, comfort, and chauffeur service..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-xl p-3.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-[#07160f] rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#cca45b] accent-[#cca45b] cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-medium text-slate-200 cursor-pointer">
                  Active in Fleet (Visible on public booking form & transfers section)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-[#cca45b] hover:bg-[#e0b86c] text-[#07160f] font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#cca45b]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingVehicle ? "Save Changes" : "Create Vehicle"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
