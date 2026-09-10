"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Car,
  Plane,
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  X,
  Send,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface VehicleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicleType?: string;
}

interface VehicleOption {
  id: string;
  type: string;
  name: string;
  capacity: string;
  luggage: string;
  image: string;
  description: string;
  ratePerKm?: number | null;
  basePrice?: number | null;
}

const DEFAULT_VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: "CAR",
    type: "CAR",
    name: "Luxury Sedan / Car",
    capacity: "1 – 3 Guests",
    luggage: "2 Large Bags",
    image: "/images/car.png",
    description: "Ideal for couples, solo travelers & business executives.",
  },
  {
    id: "MINIVAN",
    type: "MINIVAN",
    name: "Comfort Minivan",
    capacity: "4 – 6 Guests",
    luggage: "4 Large Bags",
    image: "/images/min-van.jpg",
    description: "Spacious seating perfect for families and small groups.",
  },
  {
    id: "LUXURY VAN",
    type: "LUXURY VAN",
    name: "Executive Luxury Van",
    capacity: "7 – 12 Guests",
    luggage: "8 Large Bags",
    image: "/images/luxury-van.jfif",
    description: "Ultimate luxury & legroom for groups with heavy luggage.",
  },
  {
    id: "COACH",
    type: "COACH",
    name: "Mini Coach / Bus",
    capacity: "13 – 25 Guests",
    luggage: "15+ Bags",
    image: "/images/luxury-van.jfif",
    description: "Full-size private AC coach for large tourist groups & events.",
  },
];

const SERVICE_TYPES = [
  { id: "AIRPORT_PICKUP", label: "Airport Arrival Pick-up (BIA ➔ Destination)" },
  { id: "AIRPORT_DROPOFF", label: "Airport Departure Drop-off (Hotel ➔ BIA)" },
  { id: "ROUND_TRIP", label: "Round-Trip Airport Transfer" },
  { id: "DAILY_CHAUFFEUR", label: "Private Chauffeur Daily Tour Hire" },
];

export default function VehicleBookingModal({
  isOpen,
  onClose,
  initialVehicleType = "CAR",
}: VehicleBookingModalProps) {
  const [fleetVehicles, setFleetVehicles] = useState<VehicleOption[]>(DEFAULT_VEHICLE_OPTIONS);
  const [loadingFleet, setLoadingFleet] = useState(false);
  const [serviceType, setServiceType] = useState("AIRPORT_PICKUP");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [pickupLocation, setPickupLocation] = useState("Bandaranaike International Airport (BIA / CMB)");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [flightNumber, setFlightNumber] = useState("");
  const [pax, setPax] = useState(2);
  const [luggage, setLuggage] = useState(2);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      try {
        setLoadingFleet(true);
        const res = await fetch("/api/vehicles");
        if (res.ok) {
          const data = await res.json();
          if (data.vehicles && data.vehicles.length > 0 && isMounted) {
            const mapped: VehicleOption[] = data.vehicles.map((v: any) => ({
              id: v.id || v.type,
              type: v.type,
              name:
                v.type === "CAR"
                  ? "Luxury Sedan / Car"
                  : v.type === "MINIVAN"
                  ? "Comfort Minivan"
                  : v.type === "LUXURY VAN"
                  ? "Executive Luxury Van"
                  : v.type,
              capacity: v.guests || "1 – 4 Guests",
              luggage: v.luggageCapacity || "Standard Luggage",
              image: v.image || "/images/car.png",
              description: v.description || "",
              ratePerKm: v.ratePerKm,
              basePrice: v.basePrice,
            }));
            setFleetVehicles(mapped);

            // Match initial vehicle type or preserve current
            if (initialVehicleType) {
              const match = mapped.find(
                (v) =>
                  v.type.toLowerCase() === initialVehicleType.toLowerCase() ||
                  v.name.toLowerCase().includes(initialVehicleType.toLowerCase()) ||
                  (v.id && v.id.toLowerCase() === initialVehicleType.toLowerCase())
              );
              if (match) {
                setVehicleType(match.type);
                return;
              }
            }

            // Fallback to first vehicle if current selection not found
            setVehicleType((current) => {
              const exists = mapped.some((m) => m.type.toLowerCase() === current.toLowerCase());
              return exists ? current : mapped[0].type;
            });
          }
        }
      } catch (err) {
        console.error("Failed to load fleet vehicles in modal:", err);
      } finally {
        if (isMounted) setLoadingFleet(false);
      }
    };

    fetchVehicles();
    return () => {
      isMounted = false;
    };
  }, [isOpen, initialVehicleType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide your WhatsApp or phone number.");
      return;
    }
    if (!pickupLocation.trim()) {
      setError("Please provide a pick-up location.");
      return;
    }
    if (!dropoffLocation.trim()) {
      setError("Please provide a drop-off destination.");
      return;
    }
    if (!transferDate) {
      setError("Please select the transfer date.");
      return;
    }

    setSubmitting(true);

    try {
      const selectedVehicleObj = fleetVehicles.find(
        (v) =>
          v.type.toLowerCase() === vehicleType.toLowerCase() ||
          v.id.toLowerCase() === vehicleType.toLowerCase()
      );
      const vehicleName = selectedVehicleObj
        ? selectedVehicleObj.name || selectedVehicleObj.type
        : vehicleType;

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "AIRPORT_TRANSFER",
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim() || "Not specified",
          arrivalDate: transferDate,
          departureDate: transferDate,
          travelDates: `${transferDate} at ${pickupTime}`,
          pax: Number(pax),
          passengers: `${pax} Pax • ${luggage} Luggage`,
          customPlaces: [pickupLocation.trim(), dropoffLocation.trim()],
          specialRequests: `[VEHICLE & TRANSFER INQUIRY]
Service Type: ${serviceType}
Vehicle: ${vehicleName}
Route: Pick-up at "${pickupLocation.trim()}" ➔ Drop-off at "${dropoffLocation.trim()}"
Date & Time: ${transferDate} at ${pickupTime}
Flight Number: ${flightNumber.trim() || "N/A"}
Luggage Bags: ${luggage}
Notes/Add-ons: ${specialRequests.trim() || "None"}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit transfer inquiry");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Vehicle inquiry submission error:", err);
      setError(err.message || "Failed to submit vehicle transfer inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl bg-[#081a13] border border-[#cca45b]/40 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl text-slate-100 my-auto max-h-[92vh] overflow-y-auto scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-[#cca45b] text-slate-300 hover:text-[#081a13] flex items-center justify-center transition-all shadow-md z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 border-b border-emerald-950/80 pb-5">
          <div className="inline-flex items-center gap-2 bg-[#cca45b]/15 border border-[#cca45b]/30 px-3.5 py-1 rounded-full mb-2">
            <Car className="w-3.5 h-3.5 text-[#cca45b]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#cca45b] uppercase">
              SunHaven Chauffeur Fleet
            </span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
            Vehicle & Airport Transfer Booking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Book private luxury airport transfers, VIP chauffeur pickups, and island-wide vehicle hire with meet & greet service.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#cca45b]/20 border border-[#cca45b] rounded-full flex items-center justify-center mx-auto text-[#cca45b] shadow-[0_0_20px_rgba(204,164,91,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Transfer Request Received!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-semibold">{name}</span>. Your vehicle booking details have been registered. Our transfer dispatch concierge is preparing your official confirmation quote and will email you at <span className="text-[#cca45b] font-semibold">{email}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-[#cca45b] text-[#081a13] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition shadow-lg shadow-[#cca45b]/20 cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* 1. SELECT VEHICLE */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-950/60 pb-2">
                <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4" /> 1. Select Vehicle Fleet
                </h3>
                <span className="text-[11px] text-slate-400">All vehicles include private AC chauffeur</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {loadingFleet && fleetVehicles.length === 0 ? (
                  <div className="col-span-full py-8 text-center flex flex-col items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#cca45b] animate-spin mb-2" />
                    <span className="text-xs text-slate-400">Loading fleet vehicles...</span>
                  </div>
                ) : (
                  fleetVehicles.map((v) => {
                    const isSelected = vehicleType.toUpperCase() === v.type.toUpperCase();
                    return (
                      <div
                        key={v.id || v.type}
                        onClick={() => setVehicleType(v.type)}
                        className={`rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#cca45b]/15 border-[#cca45b] shadow-[0_0_15px_rgba(204,164,91,0.25)] ring-1 ring-[#cca45b]"
                            : "bg-[#07160f] border-emerald-950/90 hover:border-[#cca45b]/50 text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-black/40">
                            <Image
                              src={v.image || "/images/car.png"}
                              alt={v.name || v.type}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="object-contain p-1.5"
                              unoptimized
                            />
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wide text-white">
                            {v.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#cca45b] font-medium mt-1">
                            <Users className="w-3 h-3" /> {v.capacity}
                          </div>
                          {v.luggage && (
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <Briefcase className="w-3 h-3" /> {v.luggage}
                            </div>
                          )}
                          {v.description && (
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                              {v.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {v.basePrice ? `From $${v.basePrice}` : "Fleet Chauffeur"}
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? "text-[#cca45b]" : "text-slate-500"}`}>
                            {isSelected ? "Selected ✓" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. TRANSFER LOGISTICS */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <MapPin className="w-4 h-4" /> 2. Transfer Route & Schedule
              </h3>

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Service Type <span className="text-[#cca45b]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICE_TYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setServiceType(st.id);
                        if (st.id === "AIRPORT_PICKUP") {
                          setPickupLocation("Bandaranaike International Airport (BIA / CMB)");
                        } else if (st.id === "AIRPORT_DROPOFF") {
                          setDropoffLocation("Bandaranaike International Airport (BIA / CMB)");
                        }
                      }}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition ${
                        serviceType === st.id
                          ? "bg-[#cca45b]/20 border-[#cca45b] text-[#cca45b]"
                          : "bg-[#07160f] border-emerald-950/90 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route: Pick-up & Drop-off */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pick-up Location <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. BIA Airport / Colombo Hotel"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Drop-off Destination <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kandy, Sigiriya, Bentota, Galle, Ella..."
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Date, Time, Flight, Pax */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Transfer Date <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pick-up Time <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Flight No. (Optional)
                  </label>
                  <div className="relative">
                    <Plane className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. UL 504 / EK 652"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Passengers / Bags
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={pax}
                      onChange={(e) => setPax(Number(e.target.value))}
                      className="bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      {Array.from({ length: 25 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} Pax
                        </option>
                      ))}
                    </select>

                    <select
                      value={luggage}
                      onChange={(e) => setLuggage(Number(e.target.value))}
                      className="bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} Bags
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CONTACT DETAILS */}
            <div className="bg-[#0b2118]/80 border border-emerald-950/80 rounded-2xl p-5 space-y-4">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-[#cca45b] uppercase tracking-wider flex items-center gap-2 border-b border-emerald-950/60 pb-2">
                <User className="w-4 h-4" /> 3. Contact & Passenger Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Lead Passenger Name <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp / Phone <span className="text-[#cca45b]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#cca45b] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Country of Residence
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. United Kingdom"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Special Add-ons & Requests (Child Safety Seat, Surfboard Rack, Wheelchair Accessible)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Need child booster seat, surfboard rack, extra luggage space..."
                  className="w-full bg-[#07160f] border border-emerald-950/90 focus:border-[#cca45b] rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Inclusions & Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>All highway tolls, fuel, parking, and meet & greet included</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-4 bg-[#cca45b] hover:bg-[#e0b86c] text-[#081a13] font-bold text-xs sm:text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#cca45b]/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONFIRMING TRANSFER...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>CONFIRM VEHICLE BOOKING INQUIRY</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
