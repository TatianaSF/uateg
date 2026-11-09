import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cities, countries } from "@/content/repository";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { MapClient } from "@/components/MapClient";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return createPageMetadata({ locale, path: `/${locale}/map/`, title: locale === "en" ? "Memorial Events Map: 25 Cities, 8 Countries" : "Мапа меморіальних акцій: 25 міст, 8 країн", description: locale === "en" ? "Explore the Angels of Ukraine historical archive geographically across 25 cities and 8 countries. Map points show approximate city locations, not event venues." : "Досліджуйте історичний архів «Янголи України» на мапі 25 міст і 8 країн. Позначки показують приблизні точки міст, а не місця проведення акцій.", keywords: locale === "en" ? ["Angels of Ukraine map", "Ukrainian memorial events by city"] : ["мапа Янголи України", "меморіальні акції за містами"] });
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section map-page">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "25 cities · 8 countries" : "25 міст · 8 країн"}</p><h1>{locale === "en" ? "Gatherings across borders" : "Акції в різних країнах"}</h1><p className="lead">{locale === "en" ? "Events are grouped by canonical city while repeated gatherings stay individually linked." : "Події згруповано за канонічними містами, а повторні акції мають окремі посилання."}</p></header>
    <MapClient cities={cities} countries={countries} locale={locale} />
    <p className="source-ref">{locale === "en" ? <>City points are approximate gazetteer locations from <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>; they are not event venues. Map tiles are provided by <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.</> : <>Позначки міст — приблизні точки з довідника <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>, а не місця проведення подій. Мапу надають <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">учасники OpenStreetMap</a>.</>}</p>
  </section>;
}
