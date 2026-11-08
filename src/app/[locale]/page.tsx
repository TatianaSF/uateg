import Link from "next/link";
import type { Metadata } from "next";
import { allEvents } from "@/content/repository";
import type { Locale } from "@/content/schema";
import { EventCard } from "@/components/EventCard";
import { ReviewNotice } from "@/components/ReviewNotice";
import { validLocale, t } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Image from "next/image";
import { pagePlacements } from "@/components/MediaGallery";
import { sitePath } from "@/lib/site";
import mediaData from "@/content/media.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return {
    title: locale === "en" ? "A travelling memorial and historical archive" : "Мандрівний меморіал та історичний архів",
    description: locale === "en" ? "Explore the documented Angels of Ukraine memorial events and find a careful guide to organizing." : "Перегляньте задокументовані акції «Янголи України» та ознайомтеся з посібником для організаторів.",
    alternates: { canonical: `/${locale}/`, languages: { en: "/en/", uk: "/uk/" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!validLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const featured = [allEvents[0], allEvents[1], allEvents[allEvents.length - 1]];
  const originPhoto = pagePlacements(37)[0];
  const originAsset = originPhoto ? mediaData.assets.find((asset) => asset.id === originPhoto.assetId) : undefined;
  return <>
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" />{t(locale, "historyLabel")}</p>
        <h1>{locale === "en" ? <>A quiet reminder.<br /><em>A shared promise.</em></> : <>Тихе нагадування.<br /><em>Спільна обіцянка.</em></>}</h1>
        <p className="hero-lead">{locale === "en" ? "Angels of Ukraine is a travelling memorial installation and a living record of communities who gathered to remember children lost to Russia’s war against Ukraine." : "«Янголи України» — мандрівна меморіальна інсталяція та літопис громад, які збиралися вшанувати пам’ять дітей, загиблих через російську агресію проти України."}</p>
        <div className="hero-actions"><Link className="button button-primary" href={`/${locale}/events/`}>{t(locale, "explore")}</Link><Link className="button button-outline" href={`/${locale}/organize/`}>{t(locale, "organizeCta")}</Link></div>
        <ReviewNotice locale={locale}>{locale === "en" ? "Historical material is published with page references. Ukrainian translations and source discrepancies remain under editorial review." : "Історичні матеріали опубліковано з посиланнями на сторінки. Українські переклади й розбіжності джерела ще перевіряються редакційно."}</ReviewNotice>
      </div>
      {originAsset && originPhoto && <figure className="hero-photo"><Image src={sitePath(originAsset.src)} width={originAsset.width} height={originAsset.height} alt={originPhoto.alt[locale]} priority unoptimized /><figcaption>{locale === "en" ? "The first gathering in Košice · source page 37" : "Перша акція в Кошицях · сторінка джерела 37"}</figcaption></figure>}
    </section>
    <section className="stats-band" aria-label={locale === "en" ? "Archive summary" : "Підсумок архіву"}>
      <p>{t(locale, "stats")}</p><div className="stats-grid"><div><strong>33</strong><span>{t(locale, "events")}</span></div><div><strong>25</strong><span>{t(locale, "cities")}</span></div><div><strong>8</strong><span>{t(locale, "countries")}</span></div></div>
      <small>{locale === "en" ? "Source PDF dated 15 October 2025; not a live or complete current count." : "PDF-джерело датовано 15 жовтня 2025 року; це не поточний і не повний актуальний підрахунок."}</small>
    </section>
    <section className="content-section intro-section">
      <div><p className="eyebrow">{locale === "en" ? "How it began" : "Як усе почалося"}</p><h2>{locale === "en" ? "A first gathering in Košice" : "Перша акція в Кошицях"}</h2></div>
      <div className="intro-copy"><p>{locale === "en" ? "The source describes the first event on 1 June 2022 in Košice, Slovakia. Ukrainian women who had found refuge there crocheted 243 blue and yellow angels, which were hung in the city centre." : "У джерелі описано першу акцію 1 червня 2022 року в Кошицях, Словаччина. Українки, які знайшли там прихисток, зв’язали гачком 243 синьо-жовті янголи, розміщені в центрі міста."}</p><p className="source-ref">{t(locale, "source")} 37 · {locale === "en" ? "Translation needs editorial review." : "Переклад потребує редакційної перевірки."}</p><Link className="text-link" href={`/${locale}/about/`}>{locale === "en" ? "Read the project story" : "Історія проєкту"} <span aria-hidden="true">→</span></Link></div>
    </section>
    <section className="content-section featured-section">
      <div className="section-heading"><div><p className="eyebrow">{t(locale, "featured")}</p><h2>{locale === "en" ? "A journey across communities" : "Подорож громадами"}</h2></div><Link className="text-link" href={`/${locale}/events/`}>{t(locale, "allEvents")} <span aria-hidden="true">→</span></Link></div>
      <div className="event-grid featured-grid">{featured.map((event) => <EventCard key={event.id} event={event} locale={locale} />)}</div>
      <p className="method-note">{t(locale, "note")}</p>
    </section>
    <section className="organize-band"><div><p className="eyebrow">{locale === "en" ? "For local communities" : "Для місцевих громад"}</p><h2>{locale === "en" ? "Carry the remembrance to your city." : "Принесіть пам’ять до свого міста."}</h2><p>{locale === "en" ? "A practical guide built from the original invitation and requirements in the source." : "Практичний посібник на основі запрошення та вимог з першоджерела."}</p></div><Link className="button button-primary" href={`/${locale}/organize/`}>{t(locale, "organizeCta")} <span aria-hidden="true">↗</span></Link></section>
  </>;
}
