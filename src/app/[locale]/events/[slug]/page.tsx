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
import { sitePath } from "@/lib/site";
import { EventCard } from "@/components/EventCard";
import { countryFlag } from "@/lib/country-display";

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
  const flag = countryFlag(event.countryCode);
  const firstPage = event.sourcePageIds[0];
  return <article className="event-detail content-section">
    <nav className="event-detail-breadcrumbs" aria-label={locale === "en" ? "Breadcrumb" : "Навігаційний шлях"}><Link prefetch={false} href={`/${locale}/`}>{locale === "en" ? "Home" : "Головна"}</Link><span aria-hidden="true">/</span><Link prefetch={false} href={`/${locale}/events/`}>{t(locale, "archive")}</Link><span aria-hidden="true">/</span><span aria-current="page">{localized(event.city, locale)}</span></nav>
    <header className="event-detail-heading"><p className="eyebrow"><span aria-hidden="true">{flag ?? ""}</span><span>{localized(event.country, locale)}</span><span aria-hidden="true">·</span><time dateTime={event.dateIsoPartial}>{formatEventDate(event, locale)}</time>{event.datePrecision === "month" && <span>· {t(locale, "monthOnly")}</span>}</p><h1>{localized(event.city, locale)}</h1><p className="lead">{localized(event.description, locale)}</p><p className="event-detail-source-note">{locale === "en" ? `Historical source: PDF page ${firstPage}. Working translation; editorial proofreading is still recommended.` : `Історичне джерело: PDF, сторінка ${firstPage}. Переклад робочий і потребує редакторської вичитки.`}</p></header>
    <div className="event-detail-gallery"><MediaGallery placements={eventPlacements(event.slug)} locale={locale} label={locale === "en" ? "Photographs from this source event" : "Фотографії з цієї акції у джерелі"} /></div>
    <div className="detail-grid">
      <section className="detail-copy"><h2>{locale === "en" ? "Historical description" : "Історичний опис"}</h2><p>{event.historicalDescription[locale]}</p>{event.sourceDiscrepancy && <ReviewNotice locale={locale} className="source-discrepancy">{event.sourceDiscrepancy[locale]}</ReviewNotice>}<details><summary>{locale === "en" ? "Source transcription" : "Транскрипція джерела"}</summary><pre>{event.sourceTranscription}</pre></details><p className="source-ref"><a href={sitePath(`/archive/angels-of-ukraine-source-2025-10-15.pdf#page=${firstPage}`)} target="_blank" rel="noreferrer">{locale === "en" ? `Open original source PDF · page ${firstPage}` : `Відкрити PDF першоджерела · сторінка ${firstPage}`} ↗</a></p></section>
      <aside className="detail-facts"><h2>{locale === "en" ? "Event record" : "Запис події"}</h2><dl><dt>{locale === "en" ? "Place in source" : "Місце у джерелі"}</dt><dd>{event.sourceCityLabel}, {localized(event.country, locale)}</dd><dt>{locale === "en" ? "Date as printed" : "Дату надруковано"}</dt><dd>{event.dateOriginal} {event.datePrecision === "month" ? `· ${t(locale, "monthOnly")}` : ""}</dd><dt>{t(locale, "count")}</dt><dd>{event.memorialAngelCount}</dd><dt>{t(locale, "source")}</dt><dd>{event.sourcePageIds.join(", ")}</dd></dl><p className="method-note">{t(locale, "note")}</p></aside>
    </div>
    {related.length > 0 && <section className="related-events"><h2>{locale === "en" ? "Other gatherings in this city" : "Інші акції в цьому місті"}</h2><div className="event-grid">{related.map((item) => <EventCard key={item.id} event={item} locale={locale} compact />)}</div></section>}
  </article>;
}
