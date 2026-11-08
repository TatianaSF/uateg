import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allEvents, contentRepository, localized } from "@/content/repository";
import { validLocale, t } from "@/lib/i18n";
import type { Locale } from "@/content/schema";
import { formatEventDate } from "@/lib/dates";
import { ReviewNotice } from "@/components/ReviewNotice";
import { MediaGallery, eventPlacements } from "@/components/MediaGallery";
import { absoluteUrl } from "@/lib/site";
import { EventCard } from "@/components/EventCard";

export function generateStaticParams() { return allEvents.map((event) => ({ slug: event.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!validLocale(locale)) return {};
  const event = contentRepository.getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${localized(event.city, locale)} · ${formatEventDate(event, locale)}`,
    description: localized(event.description, locale),
    alternates: {
      canonical: absoluteUrl(`/${locale}/events/${slug}/`),
      languages: { en: absoluteUrl(`/en/events/${slug}/`), uk: absoluteUrl(`/uk/events/${slug}/`) },
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!validLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const event = contentRepository.getEventBySlug(slug);
  if (!event) notFound();
  const related = allEvents.filter((item) => item.id !== event.id && item.city.en === event.city.en).slice(0, 3);
  return <article className="event-detail content-section">
    <Link className="back-link" href={`/${locale}/events/`}>← {t(locale, "back")}</Link>
    <header className="event-detail-heading"><p className="eyebrow">{localized(event.country, locale)} · {formatEventDate(event, locale)}{event.datePrecision === "month" ? ` · ${t(locale, "monthOnly")}` : ""}</p><h1>{localized(event.city, locale)}</h1><p className="lead">{localized(event.description, locale)}</p><ReviewNotice locale={locale} /></header>
    <MediaGallery placements={eventPlacements(event.slug)} locale={locale} label={locale === "en" ? "Photographs from the source page" : "Фотографії зі сторінки джерела"} />
    <div className="detail-grid">
      <aside className="detail-facts"><h2>{locale === "en" ? "Event record" : "Запис події"}</h2><dl><dt>{locale === "en" ? "Place in source" : "Місце у джерелі"}</dt><dd>{event.sourceCityLabel}, {localized(event.country, locale)}</dd><dt>{locale === "en" ? "Date as printed" : "Дату надруковано"}</dt><dd>{event.dateOriginal} {event.datePrecision === "month" ? `· ${t(locale, "monthOnly")}` : ""}</dd><dt>{t(locale, "count")}</dt><dd>{event.memorialAngelCount}</dd><dt>{t(locale, "source")}</dt><dd>{event.sourcePageIds.join(", ")}</dd></dl><p className="method-note">{t(locale, "note")}</p></aside></div>
    <section className="detail-copy"><h2>{locale === "en" ? "Historical description" : "Історичний опис"}</h2><p>{event.historicalDescription[locale]}</p>{event.sourceDiscrepancy && <ReviewNotice locale={locale}>{event.sourceDiscrepancy[locale]}</ReviewNotice>}<details><summary>{locale === "en" ? "Source transcription" : "Транскрипція джерела"}</summary><pre>{event.sourceTranscription}</pre></details><p className="source-ref">{locale === "en" ? "Original source page" : "Сторінка першоджерела"}: {event.sourcePageIds.join(", ")}</p></section>
    {related.length > 0 && <section className="related-events"><h2>{locale === "en" ? "Other gatherings in this city" : "Інші акції в цьому місті"}</h2><div className="event-grid">{related.map((item) => <EventCard key={item.id} event={item} locale={locale} compact />)}</div></section>}
  </article>;
}
