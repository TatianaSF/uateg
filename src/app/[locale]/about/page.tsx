import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { ReviewNotice } from "@/components/ReviewNotice";

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
      <section><h2>{locale === "en" ? "A travelling archive" : "Мандрівний архів"}</h2><p>{locale === "en" ? "The 2025 source PDF documents 33 event pages across 25 canonical cities and 8 countries, from June 2022 to August 2025. It is a dated historical source and does not claim to be complete today." : "PDF-джерело 2025 року документує 33 сторінки акцій у 25 канонічних містах і 8 країнах — від червня 2022 до серпня 2025 року. Це історичне джерело з конкретною датою, а не повний актуальний перелік."}</p></section>
      <ReviewNotice locale={locale}>{locale === "en" ? "Source references are available on event pages. Translation, city naming and the source anomalies are documented for review." : "Посилання на джерело наведені на сторінках подій. Переклади, назви міст і розбіжності джерела задокументовано для перевірки."}</ReviewNotice>
    </div>
  </article>;
}
