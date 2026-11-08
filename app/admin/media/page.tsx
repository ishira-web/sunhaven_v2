"use client";

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Images,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";

interface GalleryImage {
  filename: string;
  url: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/gallery", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load gallery images");
        return data.images as GalleryImage[];
      })
      .then((loadedImages) => {
        if (isMounted) setImages(loadedImages);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load gallery images");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const loadImages = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load gallery images");
      }
      setImages(data.images);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFiles = async (files: FileList | File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setMessage(null);
    let uploadedCount = 0;
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload?folder=gallery&prefix=gallery", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          errors.push(`${file.name}: ${data.error || "Upload failed"}`);
          continue;
        }
        uploadedCount += 1;
      } catch (uploadError) {
        const reason = uploadError instanceof Error ? uploadError.message : "Upload failed";
        errors.push(`${file.name}: ${reason}`);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (uploadedCount > 0) {
      setMessage(`${uploadedCount} ${uploadedCount === 1 ? "image" : "images"} added to the gallery.`);
      await loadImages();
    }
    if (errors.length > 0) setError(errors.join(" "));
    setUploading(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) void handleFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void handleFiles(event.dataTransfer.files);
  };

  const handleDelete = async (image: GalleryImage) => {
    setDeleting(image.filename);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/gallery?filename=${encodeURIComponent(image.filename)}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to remove image");
      setImages((currentImages) => currentImages.filter((item) => item.filename !== image.filename));
      setMessage("Image removed from the gallery.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to remove image");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#cca45b]">
            <Images className="h-4 w-4" />
            Site content
          </p>
          <h1 className="font-cinzel text-3xl font-bold text-white">Media Gallery</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Upload photos here to publish them on the public gallery page.
          </p>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
          {images.length} {images.length === 1 ? "image" : "images"}
        </span>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="rounded-2xl border border-dashed border-[#cca45b]/40 bg-[#0a2118]/70 p-6 sm:p-9"
      >
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#cca45b]/10 text-[#cca45b]">
            {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <UploadCloud className="h-7 w-7" />}
          </div>
          <h2 className="font-cinzel text-xl font-semibold text-white">
            {uploading ? "Uploading images..." : "Add images to your gallery"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Drag and drop photos here, or select files from your device. JPG, PNG, and WebP up to 5 MB each.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#cca45b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0a2118] transition-colors hover:bg-[#d9b46e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            Choose images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </div>

      {message && (
        <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-cinzel text-xl font-semibold text-white">Gallery images</h2>
          <a href="/gallery" target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-wider text-[#cca45b] hover:text-[#d9b46e]">
            View public gallery
          </a>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-slate-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-center">
            <ImageIcon className="mb-3 h-8 w-8 text-slate-500" />
            <p className="font-medium text-slate-200">Your gallery is ready for its first photo</p>
            <p className="mt-1 text-sm text-slate-500">Uploaded images will be displayed on the public site.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <article key={image.filename} className="overflow-hidden rounded-xl border border-white/10 bg-[#0a2118]">
                <div className="relative aspect-[4/3]">
                  <Image src={image.url} alt={image.filename} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{image.filename}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Added {new Date(image.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(image)}
                    disabled={deleting === image.filename}
                    aria-label={`Remove ${image.filename}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                  >
                    {deleting === image.filename ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
