import { notFound } from "next/navigation";
import { getPackageBySlug as getLongDayPackage, longDayPackages } from "@/data/longDayPackages";
import { getOneDayPackageBySlug as getOneDayPackage, oneDayPackages } from "@/data/oneDayPackages";
import PackageDetailView from "@/components/PackageDetailView";
import OneDayPackageDetailView from "@/components/OneDayPackageDetailView";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const longDayPaths = longDayPackages.map((pkg) => ({
    slug: pkg.slug,
  }));
  const oneDayPaths = oneDayPackages.map((pkg) => ({
    slug: pkg.slug,
  }));
  return [...longDayPaths, ...oneDayPaths];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const longPkg = getLongDayPackage(slug);
  const oneDayPkg = getOneDayPackage(slug);
  const pkg = longPkg || oneDayPkg;

  if (!pkg) {
    return {
      title: "Package Not Found | SunHaven Lanka",
    };
  }

  return {
    title: `${pkg.title} | SunHaven Lanka`,
    description: pkg.subtitle,
  };
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const longPkg = getLongDayPackage(slug);
  if (longPkg) {
    return <PackageDetailView pkg={longPkg} />;
  }

  const oneDayPkg = getOneDayPackage(slug);
  if (oneDayPkg) {
    return <OneDayPackageDetailView pkg={oneDayPkg} />;
  }

  notFound();
}
