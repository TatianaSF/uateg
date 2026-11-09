import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import Link from "next/link";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";
import { sitePath } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "About the memorial" : "Про меморіал", alternates: { canonical: `/${locale}/about/`, languages: { en: "/en/about/", uk: "/uk/about/" } } };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <article className="editorial-page">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "The project" : "Проєкт"}</p><h1>{locale === "en" ? "Remembering, together." : "Пам’ятаємо разом."}</h1><p className="lead">{locale === "en" ? "Angels of Ukraine is a memorial installation intended to draw continuing public attention to the war and the children it has taken from Ukraine." : "«Янголи України» — меморіальна інсталяція, покликана привертати постійну увагу суспільства до війни та дітей, яких вона забрала в України."}</p></header>
    <div className="editorial-columns"><section><h2>{locale === "en" ? "The first angels" : "Перші янголи"}<span className="source-tag">{t(locale, "source")} 37</span></h2><p>{locale === "en" ? "The source tells that the first gathering took place in Košice on 1 June 2022. Ukrainian women who had found refuge in Slovakia crocheted 243 angels from yellow and blue thread and hung them in the city centre." : "За джерелом, перша акція відбулася в Кошицях 1 червня 2022 року. Українки, які знайшли прихисток у Словаччині, зв’язали гачком 243 янголи з жовтої та синьої ниток і розмістили їх у центрі міста."}<span className="translation-mark">{locale === "en" ? "Translation and editorial copy need review." : "Переклад і редакційний текст потребують перевірки."}</span></p></section>
      <section><h2>{locale === "en" ? "What the angels mean" : "Що символізують янголи"}<span className="source-tag">{t(locale, "source")} 4, 38</span></h2><p>{locale === "en" ? "In the original invitation, each blue and yellow angel represents a Ukrainian child who will not grow up and live the life they should have had. The installation is a remembrance, not a live count." : "В оригінальному запрошенні кожен синьо-жовтий янгол уособлює українську дитину, яка не виросте й не проживе життя, що мало на неї чекати. Інсталяція є вшануванням пам’яті, а не поточним підрахунком."}</p></section>
      <section><h2>{locale === "en" ? "A travelling archive" : "Мандрівний архів"}</h2><p>{locale === "en" ? "The 2025 source PDF documents 33 event pages across 25 canonical cities and 8 countries, from June 2022 to August 2025. It is a dated historical source and does not claim to be complete today." : "PDF-джерело 2025 року документує 33 сторінки акцій у 25 канонічних містах і 8 країнах — від червня 2022 до серпня 2025 року. Це історичне джерело з конкретною датою, а не повний актуальний перелік."}</p><p><a href={sitePath("/archive/angels-of-ukraine-source-2025-10-15.pdf")} download>{locale === "en" ? "Download the original 41-page source PDF" : "Завантажити оригінальний PDF (41 сторінка)"}</a></p></section>
      <MediaGallery placements={[...pagePlacements(1), ...pagePlacements(2), ...pagePlacements(3), ...pagePlacements(4)]} locale={locale} label={locale === "en" ? "The memorial in its source pages" : "Меморіал на сторінках джерела"} />
    </div>
    <nav className="editorial-actions" aria-label={locale === "en" ? "More about the project" : "Детальніше про проєкт"}>
      <Link prefetch={false} className="button button-primary" href={`/${locale}/team/`}>{locale === "en" ? "People behind the initiative" : "Люди, які створили ініціативу"} <span aria-hidden="true">→</span></Link>
      <Link prefetch={false} className="button button-outline" href={`/${locale}/contact/`}>{locale === "en" ? "Historical contact details" : "Історичні контакти"}</Link>
      <p className="source-context-note">{locale === "en" ? "Source page references and the original PDF are preserved throughout this archive. Translation is a working project copy and benefits from fluent editorial proofreading." : "Посилання на сторінки джерела й оригінальний PDF збережено в архіві. Переклад є робочою версією проєкту та потребує вичитування редактором-носієм мови."}</p>
    </nav>
  </article>;
}
