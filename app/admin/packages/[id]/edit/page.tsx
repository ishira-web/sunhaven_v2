"use client";

import React, { useEffect, useState, use } from "react";
import PackageForm, { PackageFormData } from "@/components/admin/PackageForm";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

export default function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = use(params);
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackage() {
      try {
        const res = await fetch(`/api/admin/packages/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load package details");
        }
        const data = await res.json();
        setPackageData(data.package);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading package");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPackage();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#cca45b] animate-spin" />
        <p className="text-sm text-slate-400 font-cinzel">Loading package details...</p>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-cinzel font-semibold text-slate-100">Package Not Found</h2>
        <p className="text-sm text-slate-400">{error || "Could not retrieve package data."}</p>
        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#cca45b] bg-[#cca45b]/10 border border-[#cca45b]/30 rounded-xl hover:bg-[#cca45b]/20 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <PackageForm initialData={packageData} isEdit={true} />
    </div>
  );
}
