import Link from "next/link";
import type { Event, Locale } from "@/content/schema";
import { localized } from "@/content/repository";
import { formatEventDate } from "@/lib/dates";
import { t } from "@/lib/i18n";
import Image from "next/image";
import { photoForEvent, placementAlt } from "@/lib/media";
import { sitePath } from "@/lib/site";

export function EventCard({ event, locale, compact = false }: { event: Event; locale: Locale; compact?: boolean }) {
  const photo = photoForEvent(event.media);
  const className = `event-card${compact ? " compact-event" : ""}`;
  return <article className={className}>
    <Link className="event-card-link" href={`/${locale}/events/${event.slug}/`} aria-label={`${localized(event.city, locale)} · ${formatEventDate(event, locale)} · ${localized(event.country, locale)}`}>
    <div className="event-card-photo">
      {photo ? <Image src={sitePath(photo.src)} width={photo.width} height={photo.height} sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw" alt={placementAlt(photo.id, event.slug, locale)} unoptimized /> : <div className="event-card-fallback" aria-hidden="true">{localized(event.city, locale)}</div>}
      <small>{event.countryCode}</small>
    </div>
    <div className="event-card-body">
      <p className="eyebrow">{localized(event.country, locale)} · {formatEventDate(event, locale)}</p>
      <h3>{localized(event.city, locale)}</h3>
      <p>{localized(event.description, locale)}</p>
      <div className="card-meta"><span>{t(locale, "source")} {event.sourcePageIds[0]}</span><span>{event.memorialAngelCount} {locale === "en" ? "angels" : "янголів"}</span></div>
    </div>
    </Link>
  </article>;
}
