import type { Metadata } from "next";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { HomeLanding } from "@/components/HomeLanding";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return locale === "en"
    ? createPageMetadata({ locale, path: "/", title: "Angels of Ukraine | Travelling Memorial Archive", description: "Explore the Angels of Ukraine memorial story, photographs and documented events across eight countries. A public archive and platform for future organizers.", keywords: ["Angels of Ukraine memorial", "travelling memorial archive", "Ukrainian children remembrance", "documented memorial events"], absoluteTitle: true })
    : createPageMetadata({ locale, path: "/uk/", title: "Angels of Ukraine | Архів мандрівного меморіалу", description: "Досліджуйте історію меморіалу Angels of Ukraine, фотографії та задокументовані події у восьми країнах. Публічний архів і платформа для майбутніх організаторів.", keywords: ["Янголи України", "мандрівний меморіал", "пам’ять про українських дітей", "архів меморіальних акцій"], absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  return <HomeLanding locale={value as Locale} />;
}
