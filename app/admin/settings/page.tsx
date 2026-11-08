"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Check,
  Globe,
  Loader2,
  Phone,
  Save,
  Search,
  Share2,
} from "lucide-react";

type SettingsValues = Record<string, string>;
type SettingsField = {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
  multiline?: boolean;
};

const settingsSections: {
  title: string;
  description: string;
  icon: typeof Globe;
  fields: SettingsField[];
}[] = [
  {
    title: "Site information",
    description: "Basic details used to identify your business.",
    icon: Globe,
    fields: [
      { key: "siteName", label: "Site name", placeholder: "SunHaven Lanka" },
      { key: "siteTagline", label: "Tagline", placeholder: "Private Journeys, Made Personal." },
      {
        key: "siteDescription",
        label: "Site description",
        placeholder: "A short description of your business",
        multiline: true,
      },
    ],
  },
  {
    title: "Contact details",
    description: "Contact information displayed to your guests.",
    icon: Phone,
    fields: [
      { key: "contactEmail", label: "Contact email", placeholder: "concierge@example.com", type: "email" },
      { key: "contactPhone", label: "Phone number", placeholder: "+94 77 123 4567", type: "tel" },
      { key: "whatsappNumber", label: "WhatsApp number", placeholder: "94771234567", type: "tel" },
      { key: "contactAddress", label: "Business address", placeholder: "Colombo, Sri Lanka" },
      {
        key: "bookingNotificationEmail",
        label: "Booking notification email",
        placeholder: "bookings@example.com",
        type: "email",
      },
    ],
  },
  {
    title: "Social links",
    description: "Links to your official social media profiles.",
    icon: Share2,
    fields: [
      { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/your-profile", type: "url" },
      { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/your-page", type: "url" },
      { key: "youtubeUrl", label: "YouTube URL", placeholder: "https://youtube.com/@your-channel", type: "url" },
    ],
  },
  {
    title: "Search appearance",
    description: "Default metadata for search results and link previews.",
    icon: Search,
    fields: [
      { key: "metaTitle", label: "Default page title", placeholder: "SunHaven Lanka | Private Luxury Journeys" },
      {
        key: "metaDescription",
        label: "Default meta description",
        placeholder: "Describe your website for search engines",
        multiline: true,
      },
    ],
  },
];

const defaultSettings: SettingsValues = {
  siteName: "SunHaven Lanka",
  siteTagline: "Private Journeys, Made Personal.",
  siteDescription: "",
  contactEmail: "concierge@sunhavenlanka.com",
  contactPhone: "+94 77 123 4567",
  whatsappNumber: "94771234567",
  contactAddress: "Colombo 03 & Galle Fort, Sri Lanka",
  bookingNotificationEmail: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  metaTitle: "SunHaven Lanka | Private Luxury Journeys in Sri Lanka",
  metaDescription:
    "Private luxury journeys across a paradise island of timeless culture, stunning nature and unforgettable experiences.",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsValues>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/admin/settings")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load settings");
        return data.settings as SettingsValues;
      })
      .then((loadedSettings) => {
        if (isMounted) setSettings((current) => ({ ...current, ...loadedSettings }));
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load settings");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save settings");
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={saveSettings} className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#cca45b]">
            Admin preferences
          </p>
          <h1 className="font-cinzel text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your site information, contact details, and social links.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#cca45b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0a2118] transition-colors hover:bg-[#d9b46e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your settings have been saved.
        </p>
      )}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center text-sm text-slate-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading settings...
        </div>
      ) : (
        <div className="space-y-5">
          {settingsSections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/10 bg-[#0a2118]/70 p-5 sm:p-7">
              <div className="mb-6 flex items-start gap-3 border-b border-white/10 pb-5">
                <div className="rounded-xl bg-[#cca45b]/10 p-2.5 text-[#cca45b]">
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-cinzel text-lg font-semibold text-white">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{section.description}</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <label key={field.key} className={`block ${field.multiline ? "sm:col-span-2" : ""}`}>
                    <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
                    {field.multiline ? (
                      <textarea
                        value={settings[field.key] ?? ""}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#cca45b] focus:outline-none"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={settings[field.key] ?? ""}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border border-white/10 bg-[#07160f] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-[#cca45b] focus:outline-none"
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!loading && (
        <div className="flex justify-end pb-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#cca45b] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0a2118] transition-colors hover:bg-[#d9b46e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      )}
    </form>
  );
}
