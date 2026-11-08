"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Images, Loader2 } from "lucide-react";

interface GalleryImage {
  filename: string;
  url: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load gallery images");
        setImages(data.images);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load gallery images");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#07160f] text-slate-100">
      <Header />
      <main className="min-h-[70vh] px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#cca45b]">
              <Images className="h-4 w-4" />
              Moments from the island
            </p>
            <h1 className="font-cinzel text-4xl font-bold text-white sm:text-5xl">Sri Lanka, in pictures</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Explore the places, people, and moments that make every SunHaven journey unforgettable.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading gallery...
            </div>
          ) : error ? (
            <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
              {error}
            </p>
          ) : images.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-center">
              <Images className="mb-4 h-10 w-10 text-[#cca45b]/70" />
              <h2 className="font-cinzel text-xl font-semibold text-white">Gallery coming soon</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                We are gathering moments from across the island. Please visit again soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <figure key={image.filename} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0a2118]">
                  <Image
                    src={image.url}
                    alt={`Sri Lanka travel gallery photo ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
