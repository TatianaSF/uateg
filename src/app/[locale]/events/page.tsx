import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allEvents } from "@/content/repository";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { EventBrowser } from "@/components/EventBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Historical event archive" : "Архів історичних акцій", alternates: { canonical: `/${locale}/events/`, languages: { en: "/en/events/", uk: "/uk/events/" } } };
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section archive-page">
    <header className="page-heading"><p className="eyebrow">{t(locale, "historyLabel")}</p><h1>{locale === "en" ? "The event archive" : "Архів подій"}</h1><p className="lead">{locale === "en" ? "Explore every documented gathering. Recurring events in the same city remain separate records." : "Переглядайте всі задокументовані акції. Повторні події в одному місті збережено окремими записами."}</p></header>
    <p className="method-note">{t(locale, "note")}</p>
    <EventBrowser events={allEvents} locale={locale} />
  </section>;
}
