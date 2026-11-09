import Link from "next/link";
import type { Event, Locale } from "@/content/schema";
import { localized } from "@/content/repository";
import { formatEventDate } from "@/lib/dates";
import { t } from "@/lib/i18n";
import Image from "next/image";
import { photoForEvent, placementAlt } from "@/lib/media";
import { sitePath } from "@/lib/site";
import { countryFlag } from "@/lib/country-display";

export function EventCard({ event, locale, compact = false }: { event: Event; locale: Locale; compact?: boolean }) {
  const photo = photoForEvent(event.media);
  const className = `event-card${compact ? " compact-event" : ""}`;
  return <article className={className}>
    <Link prefetch={false} className="event-card-link" href={`/${locale}/events/${event.slug}/`}>
      <div className="event-card-photo">
        {photo ? <Image src={sitePath(photo.src)} width={photo.width} height={photo.height} sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw" alt={placementAlt(photo.id, event.slug, locale)} unoptimized /> : <div className="event-card-fallback" aria-hidden="true">{localized(event.city, locale)}</div>}
      </div>
      <div className="event-card-body">
        <p className="eyebrow"><span>{countryFlag(event.countryCode) && <span className="country-flag" aria-hidden="true">{countryFlag(event.countryCode)}</span>}{localized(event.country, locale)}</span><span aria-hidden="true">·</span><time dateTime={event.dateIsoPartial}>{formatEventDate(event, locale)}</time></p>
        <h3>{localized(event.city, locale)}</h3>
        <p className="event-card-excerpt">{localized(event.description, locale)}</p>
        <div className="card-meta"><span>{t(locale, "source")} · p. {event.sourcePageIds.join(", ")}</span><span>{event.memorialAngelCount} {locale === "en" ? "angels" : "янголів"}</span><span className="event-card-open" aria-hidden="true">{locale === "en" ? "View story →" : "Переглянути →"}</span></div>
      </div>
    </Link>
  </article>;
}
