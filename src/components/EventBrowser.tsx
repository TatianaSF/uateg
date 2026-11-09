"use client";

import { useMemo, useState } from "react";
import type { Event, Locale } from "@/content/schema";
import { localized } from "@/content/repository";
import { filterEvents } from "@/lib/dates";
import { t } from "@/lib/i18n";
import { documentedEventCount } from "@/lib/country-display";
import { EventCard } from "@/components/EventCard";

export function EventBrowser({ events, locale, timeline = false }: { events: Event[]; locale: Locale; timeline?: boolean }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [country, setCountry] = useState("all");
  const ordered = useMemo(() => filterEvents(events, { locale, query, year: year === "all" ? "" : year, countryCode: country === "all" ? "" : country }), [events, locale, query, year, country]);
  const years = [...new Set(events.map((event) => event.dateIsoPartial.slice(0, 4)))].sort().reverse();
  const visible = ordered;
  const timelineGroups = timeline ? [...new Set(visible.map((event) => event.dateIsoPartial.slice(0, 4)))].map((groupYear) => ({
    year: groupYear,
    events: visible.filter((event) => event.dateIsoPartial.startsWith(groupYear)),
  })) : [];
  const timelineOrder = new Map(visible.map((event, index) => [event.id, index + 1]));
  return <>
    <div className="filter-panel" aria-label={timeline ? (locale === "en" ? "Timeline filters" : "Фільтри хронології") : (locale === "en" ? "Archive filters" : "Фільтри архіву")}>
      <label className="search-field"><span>{t(locale, "search")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "e.g. Košice" : "Напр., Кошице"} /></label>
      <label><span>{t(locale, "year")}</span><select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">{t(locale, "all")}</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>{t(locale, "country")}</span><select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">{t(locale, "all")}</option>{[...new Map(events.map((event) => [event.countryCode, event.country])).entries()].map(([code, name]) => <option key={code} value={code}>{localized(name, locale)}</option>)}</select></label>
    </div>
    <p className="result-count" aria-live="polite">{visible.length} {t(locale, "results")}</p>
    {visible.length ? timeline ? <div className="timeline-years">{timelineGroups.map((group) => <section className="timeline-year" key={group.year} aria-labelledby={`timeline-year-${group.year}`}>
      <h2 id={`timeline-year-${group.year}`} className="timeline-year-heading"><span>{group.year}</span><small>{documentedEventCount(group.events.length, locale)}</small></h2>
      <ol className="timeline-list">{group.events.map((event) => <li key={event.id}>
        <span className="timeline-marker" aria-hidden="true">{String(timelineOrder.get(event.id) ?? 0).padStart(2, "0")}</span>
        <EventCard event={event} locale={locale} compact />
      </li>)}</ol>
    </section>)}</div> : <ol className="event-grid">{visible.map((event) => <li key={event.id}><EventCard event={event} locale={locale} compact /></li>)}</ol> : <p className="empty-state">{locale === "en" ? "No events match these filters." : "За цими фільтрами подій не знайдено."}</p>}
  </>;
}
