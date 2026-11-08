import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Contact" : "Контакти", alternates: { canonical: `/${locale}/contact/`, languages: { en: "/en/contact/", uk: "/uk/contact/" } } };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section narrow-page"><header className="page-heading"><p className="eyebrow">{locale === "en" ? "Contact" : "Зв’язок"}<span className="source-tag">{locale === "en" ? "Source page 41" : "Сторінка джерела 41"}</span></p><h1>{locale === "en" ? "A respectful way to reach out." : "Зв’яжіться з нами з повагою."}</h1><p className="lead">{locale === "en" ? "Personal phone numbers and email addresses appear on the original final page. They are preserved in the private archive but withheld from this website until their owners approve publication." : "На останній сторінці оригіналу наведено особисті номери телефонів та електронні адреси. Їх збережено у приватному архіві, але не опубліковано на сайті без згоди власників."}</p></header><div className="form-not-configured"><strong>{locale === "en" ? "Public contact channel not configured" : "Публічний канал зв’язку не налаштовано"}</strong><p>{locale === "en" ? "No unapproved contact information is displayed. The organizer page includes a preparation checklist." : "Неузгоджені контактні дані не показуються. На сторінці організаторів є список підготовки."}</p></div></section>;
}
