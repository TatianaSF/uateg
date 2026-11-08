import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allEvents } from "@/content/repository";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { EventBrowser } from "@/components/EventBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Historical timeline" : "Історична хронологія", alternates: { canonical: `/${locale}/timeline/`, languages: { en: "/en/timeline/", uk: "/uk/timeline/" } } };
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
