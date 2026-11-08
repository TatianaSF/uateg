import Link from "next/link";
import type { Event, Locale } from "@/content/schema";
import { localized } from "@/content/repository";
import { formatEventDate } from "@/lib/dates";
import { t } from "@/lib/i18n";

export function EventCard({ event, locale }: { event: Event; locale: Locale }) {
  return <article className="event-card">
    <div className="event-card-art" aria-hidden="true"><span>✳</span><small>{event.countryCode}</small></div>
    <div className="event-card-body">
      <p className="eyebrow">{localized(event.country, locale)} · {formatEventDate(event, locale)}</p>
      <h3><Link href={`/${locale}/events/${event.slug}/`}>{localized(event.city, locale)}</Link></h3>
      <p>{localized(event.description, locale)}</p>
      <div className="card-meta"><span>{t(locale, "source")} {event.sourcePageIds[0]}</span><span>{event.memorialAngelCount} {locale === "en" ? "angels" : "янголів"}</span></div>
    </div>
  </article>;
}
