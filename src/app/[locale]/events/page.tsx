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
  return createPageMetadata({ locale, path: `/${locale}/events/`, title: locale === "en" ? "Documented Event Archive" : "Архів задокументованих подій", description: locale === "en" ? "Explore 33 documented Angels of Ukraine memorial events by date, city and country, with historical source references." : "Перегляньте 33 задокументовані меморіальні акції «Янголи України» за датою, містом і країною з посиланнями на історичні джерела.", keywords: locale === "en" ? ["Angels of Ukraine event archive", "documented memorial events Ukraine"] : ["архів акцій Янголи України", "задокументовані меморіальні акції"] });
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
