"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { City, Locale } from "@/content/schema";
import { t } from "@/lib/i18n";
import { allEvents, localized } from "@/content/repository";
import { countryFlag, documentedEventCount } from "@/lib/country-display";

const VerifiedMap = dynamic(() => import("./VerifiedMap"), { ssr: false, loading: () => <p className="map-placeholder map-loading-placeholder">Loading map…</p> });

export function MapClient({ cities, locale, countries }: { cities: City[]; locale: Locale; countries: { code: string; name: { en: string; uk: string } }[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const visibleCities = useMemo(() => cities.filter((city) =>
    city.name[locale].toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)) && (country === "all" || city.countryCode === country),
  ), [cities, locale, query, country]);
  const visibleLocatedCities = useMemo(() => visibleCities.filter((city) => city.coordinates), [visibleCities]);
  const countryName = (code: string) => countries.find((item) => item.code === code)?.name[locale] ?? code;
  return <>
    {visibleLocatedCities.length > 0 ? <VerifiedMap cities={visibleLocatedCities} locale={locale} /> : <div className="map-placeholder" role="status"><span className="map-placeholder-icon" aria-hidden="true">⌖</span><p>{visibleCities.length ? t(locale, "mapFallback") : (locale === "en" ? "No cities match these filters." : "Міст за цими фільтрами не знайдено.")}</p><small>{locale === "en" ? "The city index remains available while map locations are reviewed." : "Список міст залишається доступним, поки координати перевіряються."}</small></div>}
    <p className="map-note">{locale === "en" ? "Pins show approximate city locations, not event venues. Nearby cities share a cluster; activate it to zoom in. The city index below remains available if map tiles do not load." : "Позначки вказують приблизне розташування міст, а не місця проведення подій. Близькі міста об’єднані в кластер: активуйте його, щоб збільшити мапу. Список нижче доступний, навіть якщо мапа не завантажиться."}</p>
    <h2 className="section-title">{locale === "en" ? "Browse by city" : "Перегляд за містами"}</h2>
    <div className="map-filters">
      <label>{locale === "en" ? "Search city" : "Пошук міста"}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "Start typing a city" : "Введіть назву міста"} /></label>
      <label>{t(locale, "country")}<select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">{t(locale, "all")}</option>{countries.map((item) => <option key={item.code} value={item.code}>{item.name[locale]}</option>)}</select></label>
    </div>
    <p className="result-count" aria-live="polite">{visibleCities.length} {locale === "en" ? "cities" : "міст"}</p>
    <div className="city-index">{visibleCities.map((city) => <section key={city.id} className="city-index-item">
      <p className="city-country"><span aria-hidden="true">{countryFlag(city.countryCode) ?? ""}</span> {countryName(city.countryCode)}</p>
      <h3>{city.name[locale]}</h3><p>{documentedEventCount(city.eventIds.length, locale)}</p>
      {city.coordinateSourceUrl && <p className="coordinate-source">{locale === "en" ? "Approximate city point · source:" : "Приблизна точка міста · джерело:"} <a href={city.coordinateSourceUrl} target="_blank" rel="noreferrer">GeoNames <span className="visually-hidden">({city.name[locale]})</span></a></p>}
      <ul>{city.eventIds.map((id) => {
        const event = allEvents.find((item) => item.id === id);
        if (!event) return null;
        return <li key={id}><Link prefetch={false} href={`/${locale}/events/${event.slug}/`}><time dateTime={event.dateIsoPartial}>{event.dateOriginal}</time><span aria-hidden="true"> · </span>{localized(event.title, locale)} <span aria-hidden="true">↗</span></Link></li>;
      })}</ul>
    </section>)}</div>
  </>;
}
