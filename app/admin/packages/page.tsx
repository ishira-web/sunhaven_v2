"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Package {
  id: string;
  slug: string;
  type: string;
  title: string;
  durationTag: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  _count: { inquiries: number };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      if (typeFilter) params.set("type", typeFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/packages?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [pagination.page, search, typeFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPackages();
      } else {
        alert("Failed to delete package");
      }
    } catch (error) {
      console.error("Failed to delete package:", error);
      alert("Failed to delete package");
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (pkg: Package) => {
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !pkg.isPublished }),
      });
      if (res.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  const handleToggleFeatured = async (pkg: Package) => {
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !pkg.isFeatured }),
      });
      if (res.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error("Failed to update package:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl font-bold text-white">Tour Packages</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your tour packages and itineraries</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#cca45b] text-[#0a2118] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Package
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="LONG_DAY">Multi-Day Tours</option>
              <option value="ONE_DAY">Day Tours</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="bg-[#07160f] border border-white/15 focus:border-[#cca45b] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
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
        ) : packages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Package</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Type</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Duration</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Featured</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Inquiries</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Order</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{pkg.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{pkg.slug}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pkg.type === "LONG_DAY" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                        {pkg.type === "LONG_DAY" ? "Multi-Day" : "Day Tour"}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-slate-300">{pkg.durationTag}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${pkg.isPublished ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}
                      >
                        {pkg.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(pkg)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${pkg.isFeatured ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}
                      >
                        {pkg.isFeatured ? "✓ Featured" : "Not Featured"}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-300">{pkg._count.inquiries}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-300">{pkg.order}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          className="p-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="p-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deleting === pkg.id}
                          className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
            <Package className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">No packages found</h3>
            <p className="text-slate-400 text-sm mb-4">Get started by creating your first tour package</p>
            <Link
              href="/admin/packages/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#cca45b] text-[#0a2118] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Package
            </Link>
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
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}