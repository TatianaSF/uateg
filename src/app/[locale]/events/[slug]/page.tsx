import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allEvents, contentRepository, localized } from "@/content/repository";
import { validLocale, t } from "@/lib/i18n";
import type { Locale } from "@/content/schema";
import { formatEventDate } from "@/lib/dates";
import { ReviewNotice } from "@/components/ReviewNotice";

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
      canonical: `/${locale}/events/${slug}/`,
      languages: { en: `/en/events/${slug}/`, uk: `/uk/events/${slug}/` },
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
    <div className="detail-grid"><section className="detail-art" aria-label={t(locale, "rightsPending")}><div className="detail-art-symbol" aria-hidden="true">✳</div><p>{t(locale, "rightsPending")}</p><small>{locale === "en" ? "Source page image reference" : "Посилання на зображення у джерелі"}: {event.sourcePageIds[0]}</small></section>
      <aside className="detail-facts"><h2>{locale === "en" ? "Event record" : "Запис події"}</h2><dl><dt>{locale === "en" ? "Place in source" : "Місце у джерелі"}</dt><dd>{event.sourceCityLabel}, {localized(event.country, locale)}</dd><dt>{locale === "en" ? "Date as printed" : "Дату надруковано"}</dt><dd>{event.dateOriginal} {event.datePrecision === "month" ? `· ${t(locale, "monthOnly")}` : ""}</dd><dt>{t(locale, "count")}</dt><dd>{event.memorialAngelCount}</dd><dt>{t(locale, "source")}</dt><dd>{event.sourcePageIds.join(", ")}</dd></dl><p className="method-note">{t(locale, "note")}</p></aside></div>
    <section className="detail-copy"><h2>{locale === "en" ? "A note from the archive" : "Примітка до архіву"}</h2><p>{locale === "en" ? "The source description is preserved in the private local archive while names, contact details and unapproved image content are withheld from this public build. An editorially reviewed public summary can replace this placeholder later." : "Опис джерела збережено в локальному приватному архіві. Імена, контакти та неузгоджені зображення приховано у цій публічній версії. Згодом цей текст можна замінити редакційно перевіреним описом."}</p></section>
    {related.length > 0 && <section className="related-events"><h2>{locale === "en" ? "Other gatherings in this city" : "Інші акції в цьому місті"}</h2><ul>{related.map((item) => <li key={item.id}><Link href={`/${locale}/events/${item.slug}/`}>{formatEventDate(item, locale)} · {localized(item.city, locale)}</Link></li>)}</ul></section>}
  </article>;
}
