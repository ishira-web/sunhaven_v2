import { notFound } from "next/navigation";
import { experiencesData, getExperienceBySlug } from "@/data/experiencesData";
import ExperienceDetailView from "@/components/ExperienceDetailView";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return experiencesData.map((exp) => ({
    slug: exp.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperienceBySlug(slug);

  if (!exp) {
    return {
      title: "Experience Not Found | SunHaven Lanka",
    };
  }

  return {
    title: `${exp.title} | Private Sri Lanka Experiences | SunHaven Lanka`,
    description: exp.tagline,
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  return <ExperienceDetailView experience={experience} />;
}
