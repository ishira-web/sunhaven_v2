"use client";

import React, { useEffect, useState } from "react";
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
  duration: string | null;
  passengers: string | null;
  interests: string[] | null;
  specialRequests: string | null;
  internalNotes: string | null;
  packageId: string | null;
  package: { title: string; slug: string } | null;
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

const statusOptions = ["PENDING", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"];
const typeOptions = ["TRIP_PLANNER", "CUSTOM_TOUR", "AIRPORT_TRANSFER", "DIRECT_INQUIRY"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

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
  }, [pagination.page, search, statusFilter, typeFilter]);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setUpdating(inquiryId);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inquiryId, status: newStatus }),
      });
      if (res.ok) {
        fetchInquiries();
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

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
      DIRECT_INQUIRY: "Direct Inquiry",
    };
    return labels[type] || type;
  };

  const getWhatsAppLink = (inquiry: Inquiry) => {
    const message = `Hello ${inquiry.name}, thank you for your interest in SunHaven Lanka! We've received your ${getTypeLabel(inquiry.type).toLowerCase()} inquiry and will get back to you shortly.`;
    return `https://wa.me/${inquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl font-bold text-white">Inquiries</h1>
          <p className="text-slate-400 text-sm mt-1">Manage booking leads & customer inquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{getTypeLabel(type)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin mx-auto" />
          </div>
        ) : inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Inquiry</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Type</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Package</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{inquiry.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {inquiry.email}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {inquiry.phone}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-slate-300 capitalize">{getTypeLabel(inquiry.type).toLowerCase()}</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        disabled={updating === inquiry.id}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cca45b]/50`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {inquiry.package ? (
                        <span className="text-xs text-slate-300">{inquiry.package.title}</span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-400">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppLink(inquiry)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => { setSelectedInquiry(inquiry); setShowDetails(true); }}
                          className="p-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">No inquiries found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0a2118] border border-[#cca45b]/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold text-white">Inquiry Details</h2>
              <button onClick={() => { setShowDetails(false); setSelectedInquiry(null); }} className="p-2 text-slate-400 hover:text-white transition-colors">×</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Name</label>
                  <p className="text-white">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Email</label>
                  <p className="text-white">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Phone</label>
                  <p className="text-white">{selectedInquiry.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Type</label>
                  <p className="text-white capitalize">{getTypeLabel(selectedInquiry.type).toLowerCase()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Country</label>
                  <p className="text-white">{selectedInquiry.country || "—"}</p>
                </div>
              </div>

              {selectedInquiry.travelDates && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Travel Dates</label>
                  <p className="text-white">{selectedInquiry.travelDates}</p>
                </div>
              )}

              {selectedInquiry.duration && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Duration</label>
                  <p className="text-white">{selectedInquiry.duration}</p>
                </div>
              )}

              {selectedInquiry.passengers && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Passengers</label>
                  <p className="text-white">{selectedInquiry.passengers}</p>
                </div>
              )}

              {selectedInquiry.interests && selectedInquiry.interests.length > 0 && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.interests.map((interest) => (
                      <span key={interest} className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedInquiry.specialRequests && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Special Requests</label>
                  <p className="text-white whitespace-pre-wrap">{selectedInquiry.specialRequests}</p>
                </div>
              )}

              {selectedInquiry.package && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Package</label>
                  <p className="text-white">{selectedInquiry.package.title}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[#cca45b] block mb-1">Internal Notes</label>
                <textarea
                  value={selectedInquiry.internalNotes || ""}
                  onChange={(e) => handleNotesChange(selectedInquiry.id, e.target.value)}
                  rows={3}
                  className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  placeholder="Add internal notes..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <a
                  href={getWhatsAppLink(selectedInquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 py-2.5 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply via WhatsApp
                </a>
                <button
                  onClick={() => { setShowDetails(false); setSelectedInquiry(null); }}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}