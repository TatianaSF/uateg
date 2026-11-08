import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/content/schema";
import { allEvents, cities } from "@/content/repository";
import { EventCard } from "@/components/EventCard";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";
import { ReviewNotice } from "@/components/ReviewNotice";
import { MapPreview } from "@/components/MapPreview";
import mediaData from "@/content/media.json";
import { isPhotograph } from "@/lib/media";
import { sitePath } from "@/lib/site";
import { t } from "@/lib/i18n";

export function HomeLanding({ locale }: { locale: Locale }) {
  const originPlacement = pagePlacements(37).find((placement) => {
    const asset = mediaData.assets.find((candidate) => candidate.id === placement.assetId);
    return asset ? isPhotograph(asset) : false;
  });
  const originPhoto = originPlacement ? mediaData.assets.find((asset) => asset.id === originPlacement.assetId) : undefined;
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
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" />{t(locale, "historyLabel")}</p>
        <h1>{locale === "en" ? <>Angels of Ukraine.<br /><em>Memory that travels.</em></> : <>«Янголи України».<br /><em>Пам’ять, що мандрує.</em></>}</h1>
        <p className="hero-lead">{locale === "en" ? "A travelling memorial made by communities, carrying the memory of children killed in Russia’s war against Ukraine from city to city." : "Мандрівний меморіал, створений громадами, несе від міста до міста пам’ять про дітей, загиблих у війні Росії проти України."}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href={`/${locale}/about/`}>{locale === "en" ? "Explore Our Story" : "Дізнатися історію"}</Link>
          <Link className="button button-outline" href={`/${locale}/events/`}>{locale === "en" ? "Explore Events" : "Переглянути події"}</Link>
          <Link className="button button-outline" href={`/${locale}/organize/`}>{t(locale, "organizeCta")}</Link>
        </div>
        <ReviewNotice locale={locale}>{locale === "en" ? "A historical archive based on the 15 October 2025 source PDF. Figures describe that document, not current statistics." : "Історичний архів на основі PDF від 15 жовтня 2025 року. Наведені числа стосуються джерела, а не поточної статистики."}</ReviewNotice>
      </div>
      {originPhoto && originPlacement && <figure className="hero-photo"><Image src={sitePath(originPhoto.src)} width={originPhoto.width} height={originPhoto.height} sizes="(max-width: 699px) 100vw, 50vw" alt={originPlacement.alt[locale]} priority unoptimized /><figcaption>{locale === "en" ? "A gathering in Košice · source page 37" : "Акція в Кошицях · сторінка джерела 37"}</figcaption></figure>}
    </section>

    <section className="stats-band" aria-label={locale === "en" ? "Archive coverage" : "Охоплення архіву"}>
      <p>{locale === "en" ? "The source archive records" : "У джерельному архіві задокументовано"}</p>
      <div className="stats-grid"><div><strong>33</strong><span>{t(locale, "events")}</span></div><div><strong>25</strong><span>{t(locale, "cities")}</span></div><div><strong>8</strong><span>{t(locale, "countries")}</span></div><div><strong>2022–2025</strong><span>{locale === "en" ? "historical coverage" : "роки в джерелі"}</span></div></div>
      <small>{locale === "en" ? "Coverage in the source PDF dated 15 October 2025." : "Охоплення PDF-джерела від 15 жовтня 2025 року."}</small>
    </section>

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
