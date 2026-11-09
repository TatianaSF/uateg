import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allEvents } from "@/content/repository";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { EventBrowser } from "@/components/EventBrowser";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return createPageMetadata({ locale, path: `/${locale}/timeline/`, title: locale === "en" ? "Angels of Ukraine Remembrance Timeline" : "Хронологія пам’яті «Янголи України»", description: locale === "en" ? "Follow the documented Angels of Ukraine memorial events from 2022 to 2025, with source dates and historical context." : "Перегляньте задокументовані меморіальні акції «Янголи України» з 2022 до 2025 року з датами й історичним контекстом.", keywords: locale === "en" ? ["Angels of Ukraine timeline", "Ukrainian memorial chronology"] : ["хронологія Янголи України", "історія меморіальних акцій"] });
}

export default async function TimelinePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section timeline-page">
    <header className="page-heading"><p className="eyebrow">{t(locale, "historyLabel")}</p><h1>{locale === "en" ? "A timeline of remembrance" : "Хронологія вшанування пам’яті"}</h1><p className="lead">{locale === "en" ? "Dates with month-only precision remain month-only. Use the year and country filters to explore the sequence." : "Дати з точністю лише до місяця так і залишаються місячними. Скористайтеся фільтрами року й країни."}</p></header>
    <EventBrowser events={allEvents} locale={locale} timeline />
  </section>;
}
