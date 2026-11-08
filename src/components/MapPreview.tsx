"use client";

import dynamic from "next/dynamic";
import type { City, Locale } from "@/content/schema";

const InteractiveMap = dynamic(() => import("@/components/VerifiedMap"), { ssr: false, loading: () => <p className="map-placeholder">Loading map…</p> });

export function MapPreview({ cities, locale }: { cities: City[]; locale: Locale }) {
  return <div className="home-map-preview">
    {cities.length ? <InteractiveMap cities={cities} locale={locale} /> : <p role="status">{locale === "en" ? "Map preview is unavailable." : "Попередній перегляд мапи недоступний."}</p>}
  </div>;
}
