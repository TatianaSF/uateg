"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Event, Locale } from "@/content/schema";
import { localized } from "@/content/repository";
import { filterEvents, formatEventDate } from "@/lib/dates";
import { t } from "@/lib/i18n";

export function EventBrowser({ events, locale, timeline = false }: { events: Event[]; locale: Locale; timeline?: boolean }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [country, setCountry] = useState("all");
  const ordered = useMemo(() => filterEvents(events, { locale, query, year: year === "all" ? "" : year, countryCode: country === "all" ? "" : country }), [events, locale, query, year, country]);
  const years = [...new Set(events.map((event) => event.dateIsoPartial.slice(0, 4)))].sort().reverse();
  const visible = ordered;
  return <>
    <div className="filter-panel" aria-label={timeline ? (locale === "en" ? "Timeline filters" : "Фільтри хронології") : (locale === "en" ? "Archive filters" : "Фільтри архіву")}>
      <label className="search-field"><span>{t(locale, "search")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "e.g. Košice" : "Напр., Кошице"} /></label>
      <label><span>{t(locale, "year")}</span><select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">{t(locale, "all")}</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>{t(locale, "country")}</span><select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">{t(locale, "all")}</option>{[...new Map(events.map((event) => [event.countryCode, event.country])).entries()].map(([code, name]) => <option key={code} value={code}>{localized(name, locale)}</option>)}</select></label>
    </div>
    <p className="result-count" aria-live="polite">{visible.length} {t(locale, "results")}</p>
    {visible.length ? <ol className={timeline ? "timeline-list" : "event-grid"}>
      {visible.map((event, index) => <li key={event.id}>
        {timeline && <span className="timeline-marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
        <article className="event-card compact-event">
          <div className="event-card-art" aria-hidden="true"><span>✳</span><small>{event.countryCode}</small></div>
          <div className="event-card-body">
            <p className="eyebrow">{localized(event.country, locale)} · {formatEventDate(event, locale)}{event.datePrecision === "month" ? ` · ${t(locale, "monthOnly")}` : ""}</p>
            <h2><Link href={`/${locale}/events/${event.slug}/`}>{localized(event.city, locale)}</Link></h2>
            <p>{localized(event.description, locale)}</p>
            <div className="card-meta"><span>{t(locale, "source")} {event.sourcePageIds[0]}</span><span>{event.memorialAngelCount} {locale === "en" ? "angels" : "янголів"}</span></div>
          </div>
        </article>
      </li>)}
    </ol> : <p className="empty-state">{locale === "en" ? "No events match these filters." : "За цими фільтрами подій не знайдено."}</p>}
  </>;
}
