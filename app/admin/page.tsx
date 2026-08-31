"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Package,
  Truck,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Settings,
} from "lucide-react";

interface Stats {
  totalInquiries: number;
  pendingInquiries: number;
  activePackages: number;
  totalVehicles: number;
  recentInquiries: Inquiry[];
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  packageId: string | null;
  package?: { title: string; slug: string } | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#cca45b] font-cinzel text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      icon: Mail,
      color: "text-[#cca45b]",
      bg: "bg-[#cca45b]/20",
      href: "/admin/inquiries",
    },
    {
      name: "Pending Inquiries",
      value: stats?.pendingInquiries || 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      href: "/admin/inquiries?status=PENDING",
    },
    {
      name: "Active Packages",
      value: stats?.activePackages || 0,
      icon: Package,
      color: "text-green-400",
      bg: "bg-green-500/20",
      href: "/admin/packages",
    },
    {
      name: "Fleet Vehicles",
      value: stats?.totalVehicles || 0,
      icon: Truck,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      href: "/admin/vehicles",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cinzel text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your SunHaven Lanka operations</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/packages/new"
            className="px-4 py-2 bg-[#cca45b] text-[#0a2118] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#d9b46e] transition-colors flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            New Package
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            View Inquiries
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group">
            <div className="bg-[#0a2118] border border-white/10 rounded-2xl p-6 hover:border-[#cca45b]/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">{stat.name}</p>
                  <p className="font-cinzel text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-[#0a2118] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-cinzel text-xl font-bold text-white">Recent Inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="text-xs font-bold uppercase tracking-wider text-[#cca45b] hover:text-[#d9b46e] transition-colors flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {stats?.recentInquiries?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Inquiry</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Type</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Package</th>
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInquiries.slice(0, 5).map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/inquiries/${inquiry.id}`} className="font-medium text-white hover:text-[#cca45b] transition-colors">
                        {inquiry.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-0.5">{inquiry.email}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-xs text-slate-300 capitalize">{getTypeLabel(inquiry.type).toLowerCase()}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {inquiry.package ? (
                        <Link href={`/admin/packages/${inquiry.package.slug}/edit`} className="text-xs text-slate-300 hover:text-[#cca45b] transition-colors">
                          {inquiry.package.title}
                        </Link>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">No inquiries yet</h3>
            <p className="text-slate-400 text-sm">New inquiries will appear here</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/packages/new"
          className="bg-[#0a2118] border border-white/10 rounded-2xl p-6 hover:border-[#cca45b]/30 transition-all group"
        >
          <div className="w-12 h-12 bg-[#cca45b]/20 border border-[#cca45b]/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6 text-[#cca45b]" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-1">Create Package</h3>
          <p className="text-xs text-slate-400">Add a new tour package</p>
        </Link>

        <Link
          href="/admin/vehicles"
          className="bg-[#0a2118] border border-white/10 rounded-2xl p-6 hover:border-[#cca45b]/30 transition-all group"
        >
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Truck className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-1">Manage Fleet</h3>
          <p className="text-xs text-slate-400">Update vehicle rates & specs</p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-[#0a2118] border border-white/10 rounded-2xl p-6 hover:border-[#cca45b]/30 transition-all group"
        >
          <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Settings className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="font-cinzel text-lg font-bold text-white mb-1">Site Settings</h3>
          <p className="text-xs text-slate-400">Configure contact & branding</p>
        </Link>
      </div>
    </div>
  );
}