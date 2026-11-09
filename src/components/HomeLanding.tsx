import Link from "next/link";
import type { Locale } from "@/content/schema";
import { allEvents, cities } from "@/content/repository";
import { EventCard } from "@/components/EventCard";
import { ClassicHero } from "@/components/ClassicHero";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";
import { MapPreview } from "@/components/MapPreview";
import { t } from "@/lib/i18n";

export function HomeLanding({ locale }: { locale: Locale }) {
  const featured = [
    allEvents.find((event) => event.countryCode === "CA"),
    allEvents.find((event) => event.countryCode === "DE"),
    allEvents.find((event) => event.countryCode === "CY"),
  ].filter((event) => event !== undefined);
  const mapCountryOrder = ["SK", "PL", "CA", "DE", "CY", "SE", "GB", "MT"];
  const mapCities = mapCountryOrder.flatMap((code) => {
    const city = cities.find((item) => item.countryCode === code && item.coordinates);
    return city ? [city] : [];
  });

  return <>
    <ClassicHero locale={locale} />
    <p className="classic-hero-provenance content-section">{locale === "en" ? "The hero image is a symbolic AI-generated scene, not an archival event photograph. Statistics describe the source PDF dated 15 October 2025." : "Зображення на головному екрані — символічна сцена, створена ШІ, а не архівна фотографія події. Статистика взята з PDF-джерела від 15 жовтня 2025 року."}</p>

    <section className="content-section mission-section">
      <div><p className="eyebrow">{locale === "en" ? "A shared act of remembrance" : "Спільне вшанування пам’яті"}</p><h2>{locale === "en" ? "Small handmade angels. A message carried across borders." : "Маленькі рукотворні янголи. Послання, що долає кордони."}</h2></div>
      <div className="intro-copy"><p>{locale === "en" ? "The source describes Angels of Ukraine as a travelling memorial installation and an invitation for communities to keep attention on the war and its effect on children. Each gathering adds a place and a moment to that shared record." : "У джерелі «Янголи України» описані як мандрівна меморіальна інсталяція та заклик громад привертати увагу до війни й її впливу на дітей. Кожна акція додає до спільного літопису своє місце й час."}</p><Link className="text-link" href={`/${locale}/about/`}>{locale === "en" ? "Explore the project story" : "Історія проєкту"} <span aria-hidden="true">→</span></Link></div>
    </section>

    <section className="content-section origin-section">
      <div className="origin-copy"><p className="eyebrow">{locale === "en" ? "How it began · 1 June 2022" : "Початок · 1 червня 2022 року"}</p><h2>{locale === "en" ? "243 blue and yellow angels in Košice" : "243 синьо-жовті янголи в Кошицях"}</h2><p>{locale === "en" ? "The source says Ukrainian women who had found refuge in Slovakia crocheted 243 angels for the first gathering. The installation was displayed in the city centre and then began its journey." : "За джерелом, українки, які знайшли прихисток у Словаччині, зв’язали гачком 243 янголи для першої акції. Інсталяцію розмістили в центрі міста, звідки розпочалася її подорож."}</p><p className="source-ref">{t(locale, "source")} 37</p><Link className="text-link" href={`/${locale}/events/kosice-2022-06-01-p37/`}>{locale === "en" ? "View the first event" : "Переглянути першу акцію"} <span aria-hidden="true">→</span></Link></div>
      <MediaGallery placements={pagePlacements(37)} locale={locale} label={locale === "en" ? "From the first gathering" : "З першої акції"} />
    </section>

    <section className="content-section featured-section">
      <div className="section-heading"><div><p className="eyebrow">{locale === "en" ? "The memorial journey" : "Подорож меморіалу"}</p><h2>{locale === "en" ? "Remembered in many communities" : "Пам’ятають у різних громадах"}</h2></div><Link className="text-link" href={`/${locale}/events/`}>{t(locale, "allEvents")} <span aria-hidden="true">→</span></Link></div>
      <div className="event-grid featured-grid">{featured.map((event) => <EventCard key={event.id} event={event} locale={locale} />)}</div>
      <p className="method-note">{t(locale, "note")}</p>
    </section>

    <section className="content-section photo-preview-section">
      <div className="section-heading"><div><p className="eyebrow">{locale === "en" ? "From the original archive" : "З оригінального архіву"}</p><h2>{locale === "en" ? "Photographs from the journey" : "Фотографії з подорожі"}</h2></div><Link className="text-link" href={`/${locale}/gallery/`}>{locale === "en" ? "Open the full photo gallery" : "Відкрити фотогалерею"} <span aria-hidden="true">→</span></Link></div>
      <MediaGallery placements={[...pagePlacements(5), ...pagePlacements(17), ...pagePlacements(23), ...pagePlacements(37)]} locale={locale} label={locale === "en" ? "Selected source photographs" : "Вибрані фотографії з джерела"} />
    </section>

    <section className="content-section reach-section">
      <div className="section-heading"><div><p className="eyebrow">{locale === "en" ? "A memorial across borders" : "Меморіал без кордонів"}</p><h2>{locale === "en" ? "Eight countries in the source archive" : "Вісім країн у джерельному архіві"}</h2></div><Link className="text-link" href={`/${locale}/map/`}>{locale === "en" ? "Explore the interactive map" : "Інтерактивна мапа"} <span aria-hidden="true">→</span></Link></div>
      <MapPreview cities={mapCities} locale={locale} />
      <p className="map-note">{locale === "en" ? "Markers show approximate city locations rather than event venues." : "Позначки вказують приблизне розташування міст, а не місця проведення подій."}</p>
    </section>

    <section className="organize-band"><div><p className="eyebrow">{locale === "en" ? "For local communities" : "Для місцевих громад"}</p><h2>{locale === "en" ? "Carry the remembrance to your city." : "Принесіть пам’ять до свого міста."}</h2><p>{locale === "en" ? "Explore the original invitation and practical notes for organizing a memorial gathering." : "Ознайомтеся з оригінальним запрошенням і порадами для організації меморіальної акції."}</p></div><Link className="button button-primary" href={`/${locale}/organize/`}>{t(locale, "organizeCta")} <span aria-hidden="true">↗</span></Link></section>
  </>;
}
