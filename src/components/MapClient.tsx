"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { City, Locale } from "@/content/schema";
import { t } from "@/lib/i18n";

const VerifiedMap = dynamic(() => import("./VerifiedMap"), { ssr: false, loading: () => <p className="map-placeholder">Loading map…</p> });

export function MapClient({ cities, locale, countries }: { cities: City[]; locale: Locale; countries: { code: string; name: { en: string; uk: string } }[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const located = cities.filter((city) => city.coordinates);
  const visibleCities = useMemo(() => cities.filter((city) =>
    city.name[locale].toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)) && (country === "all" || city.countryCode === country),
  ), [cities, locale, query, country]);
  return <>
    {located.length > 0 ? <VerifiedMap cities={located} locale={locale} /> : <div className="map-placeholder" role="status"><span className="map-placeholder-icon" aria-hidden="true">⌖</span><p>{t(locale, "mapFallback")}</p><small>{locale === "en" ? "The city index remains available while map locations are reviewed." : "Список міст залишається доступним, поки координати перевіряються."}</small></div>}
    <p className="map-note">{locale === "en" ? "Pins show approximate city locations, not event venues. The city index below remains available if map tiles do not load." : "Позначки вказують приблизне розташування міст, а не місця проведення подій. Список нижче доступний, навіть якщо мапа не завантажиться."}</p>
    <h2 className="section-title">{locale === "en" ? "Browse by city" : "Перегляд за містами"}</h2>
    <div className="map-filters">
      <label>{locale === "en" ? "Search city" : "Пошук міста"}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "Start typing a city" : "Введіть назву міста"} /></label>
      <label>{t(locale, "country")}<select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">{t(locale, "all")}</option>{countries.map((item) => <option key={item.code} value={item.code}>{item.name[locale]}</option>)}</select></label>
    </div>
    <p className="result-count" aria-live="polite">{visibleCities.length} {locale === "en" ? "cities" : "міст"}</p>
    <div className="city-index">{visibleCities.map((city) => <section key={city.id} className="city-index-item">
      <h3>{city.name[locale]}</h3><p>{city.eventIds.length} {locale === "en" ? "documented event(s)" : "задокументовані акції"}</p>
      {city.coordinateSourceUrl && <p className="coordinate-source">{locale === "en" ? "Approximate city point · source:" : "Приблизна точка міста · джерело:"} <a href={city.coordinateSourceUrl} target="_blank" rel="noreferrer">GeoNames <span className="visually-hidden">({city.name[locale]})</span></a></p>}
      <ul>{city.eventIds.map((id) => <li key={id}><Link href={`/${locale}/events/${id}/`}>{locale === "en" ? "Open event" : "Переглянути акцію"} <span aria-hidden="true">↗</span></Link></li>)}</ul>
    </section>)}</div>
  </>;
}
