"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import eventData from "@/content/events.json";
import mediaData from "@/content/media.json";
import type { Locale } from "@/content/schema";
import { sitePath } from "@/lib/site";

type View = "photos" | "graphics";
type EventRecord = (typeof eventData)[number];
const eventBySlug = new Map(eventData.map((event) => [event.slug, event]));
const placementsByAsset = new Map<string, (typeof mediaData.placements)[number][]>();
for (const placement of mediaData.placements) placementsByAsset.set(placement.assetId, [...(placementsByAsset.get(placement.assetId) ?? []), placement]);
const pageNumbers = Array.from({ length: 41 }, (_, index) => index + 1);
const eventName = (event: EventRecord, locale: Locale) => `${event.city[locale]} · ${event.dateOriginal}`;
const sourceTypes = new Set(["emblem", "logo", "document-graphic", "qr-code"]);

export function PhotoArchive({ locale }: { locale: Locale }) {
  const [view, setView] = useState<View>("photos");
  const [country, setCountry] = useState("all");
  const [city, setCity] = useState("all");
  const [year, setYear] = useState("all");
  const [eventSlug, setEventSlug] = useState("all");
  const [sourcePage, setSourcePage] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const dialogWasOpen = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const countries = [...new Map(eventData.map((event) => [event.countryCode, event.country[locale]])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], locale));
  const cities = [...new Set(eventData.map((event) => event.city[locale]))].sort((a, b) => a.localeCompare(b, locale));
  const years = [...new Set(eventData.map((event) => event.dateIsoPartial.slice(0, 4)))].sort().reverse();

  const filtered = useMemo(() => mediaData.assets.filter((asset) => {
    const isPhoto = asset.assetType === "photograph" || asset.assetType === "portrait";
    if (view === "photos" ? !isPhoto : !sourceTypes.has(asset.assetType)) return false;
    const references = placementsByAsset.get(asset.id) ?? [];
    return references.some((placement) => {
      if (sourcePage !== "all" && placement.pdfPage !== Number(sourcePage)) return false;
      const event = placement.eventSlug ? eventBySlug.get(placement.eventSlug) : undefined;
      if (eventSlug !== "all" && placement.eventSlug !== eventSlug) return false;
      if (country !== "all" && event?.countryCode !== country) return false;
      if (city !== "all" && event?.city[locale] !== city) return false;
      if (year !== "all" && !event?.dateIsoPartial.startsWith(year)) return false;
      return true;
    });
  }), [view, country, city, year, eventSlug, sourcePage, locale]);

  const selectedIndex = selectedId ? filtered.findIndex((asset) => asset.id === selectedId) : -1;
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : undefined;

  useEffect(() => {
    if (!selected) {
      if (dialogWasOpen.current) {
        dialogWasOpen.current = false;
        requestAnimationFrame(() => returnFocus.current?.focus());
      }
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialogWasOpen.current = true;
    closeButton.current?.focus();
  }, [selected, selectedIndex, filtered]);

  const resetFilters = () => {
    setCountry("all"); setCity("all"); setYear("all"); setEventSlug("all"); setSourcePage("all");
  };

  return <>
    <div className="gallery-mode-switch" role="group" aria-label={locale === "en" ? "Gallery view" : "Режим галереї"}>
      <button type="button" aria-pressed={view === "photos"} onClick={() => { setView("photos"); setSelectedId(null); }}>{locale === "en" ? "Photographs" : "Фотографії"}<span>{mediaData.assets.filter((asset) => asset.assetType === "photograph" || asset.assetType === "portrait").length}</span></button>
      <button type="button" aria-pressed={view === "graphics"} onClick={() => { setView("graphics"); setSelectedId(null); }}>{locale === "en" ? "Source graphics" : "Графіка з джерела"}<span>{mediaData.assets.filter((asset) => sourceTypes.has(asset.assetType)).length}</span></button>
    </div>
    <div className="photo-filters" aria-label={locale === "en" ? "Photo filters" : "Фільтри галереї"}>
      <label>{locale === "en" ? "Country" : "Країна"}<select value={country} onChange={(event) => setCountry(event.target.value)}><option value="all">{locale === "en" ? "All countries" : "Усі країни"}</option>{countries.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
      <label>{locale === "en" ? "City" : "Місто"}<select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">{locale === "en" ? "All cities" : "Усі міста"}</option>{cities.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label>{locale === "en" ? "Year" : "Рік"}<select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">{locale === "en" ? "All years" : "Усі роки"}</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>{locale === "en" ? "Event" : "Подія"}<select value={eventSlug} onChange={(event) => setEventSlug(event.target.value)}><option value="all">{locale === "en" ? "All events" : "Усі події"}</option>{eventData.map((event) => <option key={event.slug} value={event.slug}>{eventName(event, locale)}</option>)}</select></label>
      <label>{locale === "en" ? "Source PDF page" : "Сторінка PDF"}<select value={sourcePage} onChange={(event) => setSourcePage(event.target.value)}><option value="all">{locale === "en" ? "All pages" : "Усі сторінки"}</option>{pageNumbers.map((page) => <option key={page} value={page}>{page}</option>)}</select></label>
    </div>
    <div className="gallery-results"><p className="result-count" aria-live="polite">{filtered.length} {view === "photos" ? (locale === "en" ? "unique photographs" : "унікальних фотографій") : (locale === "en" ? "source graphics" : "графічних матеріалів")}</p><button type="button" className="text-button" onClick={resetFilters}>{locale === "en" ? "Clear filters" : "Очистити фільтри"}</button></div>
    {filtered.length ? <div className="photo-archive-grid">{filtered.map((asset) => {
      const references = placementsByAsset.get(asset.id) ?? [];
      const associatedEvents = [...new Map(references.flatMap((placement) => {
        const event = placement.eventSlug ? eventBySlug.get(placement.eventSlug) : undefined;
        return event ? [[event.slug, event] as const] : [];
      })).values()];
      return <article className="photo-archive-card" key={asset.id}>
        <button className="photo-open-button" type="button" aria-haspopup="dialog" onClick={(event) => { returnFocus.current = event.currentTarget; setSelectedId(asset.id); }} aria-label={`${locale === "en" ? "Open image" : "Відкрити зображення"}: ${asset.alt[locale]}`}>
          <Image src={sitePath(asset.src)} width={asset.width} height={asset.height} alt={asset.alt[locale]} sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 25vw" unoptimized />
        </button>
        <div className="photo-archive-card-copy"><p className="photo-source-pages">{[...new Set(references.map((item) => item.pdfPage))].sort((a, b) => a - b).map((page) => <a key={page} href={sitePath(`/archive/angels-of-ukraine-source-2025-10-15.pdf#page=${page}`)} target="_blank" rel="noreferrer">PDF · {page}</a>)}</p>
          {associatedEvents.length > 0 && <ul>{associatedEvents.map((event) => <li key={event.slug}><Link prefetch={false} href={`/${locale}/events/${event.slug}/`}>{locale === "en" ? event.city.en : event.city.uk} · {event.dateOriginal}</Link></li>)}</ul>}
          {references.length > 1 && <small>{locale === "en" ? `This asset appears ${references.length} times in the source.` : `Цей файл повторюється в джерелі ${references.length} разів.`}</small>}
        </div>
      </article>;
    })}</div> : <p className="empty-state">{locale === "en" ? "No images match these filters." : "За цими фільтрами зображень не знайдено."}</p>}
    {selected && <dialog ref={dialogRef} className="photo-lightbox" aria-labelledby="photo-lightbox-title" onCancel={(event) => { event.preventDefault(); setSelectedId(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); setSelectedId(filtered[(selectedIndex + 1) % filtered.length]?.id ?? null); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length]?.id ?? null); }
    }}>
        <div className="photo-lightbox-toolbar"><p id="photo-lightbox-title">{locale === "en" ? `Image ${selectedIndex + 1} of ${filtered.length}` : `Зображення ${selectedIndex + 1} з ${filtered.length}`}</p><button type="button" ref={closeButton} onClick={() => setSelectedId(null)}>{locale === "en" ? "Close" : "Закрити"}<span aria-hidden="true"> ×</span></button></div>
        <Image src={sitePath(selected.src)} width={selected.width} height={selected.height} alt={selected.alt[locale]} sizes="100vw" unoptimized />
        <p className="photo-lightbox-caption">{selected.alt[locale]}</p>
        <p className="photo-lightbox-source"><span>{locale === "en" ? "Source PDF pages:" : "Сторінки PDF-джерела:"} {[...new Set((placementsByAsset.get(selected.id) ?? []).map((placement) => placement.pdfPage))].sort((a, b) => a - b).join(", ")}</span><a href={sitePath(`/archive/angels-of-ukraine-source-2025-10-15.pdf#page=${(placementsByAsset.get(selected.id) ?? [])[0]?.pdfPage ?? 1}`)} target="_blank" rel="noreferrer">{locale === "en" ? "Open original page" : "Відкрити сторінку PDF"}</a></p>
        <div className="photo-lightbox-nav"><button type="button" aria-label={locale === "en" ? "Previous image (left arrow)" : "Попереднє зображення (стрілка ліворуч)"} onClick={() => setSelectedId(filtered[(selectedIndex - 1 + filtered.length) % filtered.length]?.id ?? null)}>{locale === "en" ? "Previous image" : "Попереднє"}</button><button type="button" aria-label={locale === "en" ? "Next image (right arrow)" : "Наступне зображення (стрілка праворуч)"} onClick={() => setSelectedId(filtered[(selectedIndex + 1) % filtered.length]?.id ?? null)}>{locale === "en" ? "Next image" : "Наступне"}</button></div>
      </dialog>
    }
  </>;
}
