import type { Metadata } from "next";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import { HomeLanding } from "@/components/HomeLanding";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return {
    title: locale === "en" ? "Angels of Ukraine · A travelling memorial" : "«Янголи України» · Мандрівний меморіал",
    description: locale === "en" ? "Explore the Angels of Ukraine memorial story, photographs and historical events across eight countries." : "Історія, фотографії та архів меморіальних акцій «Янголи України» у восьми країнах.",
    alternates: { canonical: absoluteUrl(locale === "en" ? "/" : "/uk/"), languages: { en: absoluteUrl("/"), uk: absoluteUrl("/uk/") } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  return <HomeLanding locale={value as Locale} />;
}
