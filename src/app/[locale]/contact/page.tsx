import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Contact" : "Контакти", alternates: { canonical: `/${locale}/contact/`, languages: { en: "/en/contact/", uk: "/uk/contact/" } } };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section narrow-page"><header className="page-heading"><p className="eyebrow">{locale === "en" ? "Contact · source page 41" : "Зв’язок · сторінка джерела 41"}</p><h1>{locale === "en" ? "A respectful way to reach out." : "Зв’яжіться з нами з повагою."}</h1><p className="lead">{locale === "en" ? "The project owner has authorized publication of these historical contact details from the source. Their current status has not been independently reconfirmed." : "Власник проєкту дозволив опублікувати ці історичні контактні дані з першоджерела. Їхню актуальність незалежно не підтверджено."}</p></header><div className="contact-list"><p><a href="tel:+421940261128">+421 940 261 128</a></p><p><a href="tel:+421904020704">+421 904 020 704</a></p><p><a href="mailto:peshterianu@gmail.com">peshterianu@gmail.com</a></p><p><a href="mailto:mitsonata4@gmail.com">mitsonata4@gmail.com</a></p><p>{locale === "en" ? "Follow promotions on Facebook and Instagram" : "Стежте за анонсами у Facebook та Instagram"}</p><p>#AnjeliUkrajiny · #ЯнголиУкраїни</p><small>{locale === "en" ? "The organizer inquiry form is not configured; no submission is simulated." : "Форму для організаторів не налаштовано; сайт не імітує надсилання звернення."}</small></div><MediaGallery placements={pagePlacements(41)} locale={locale} label={locale === "en" ? "Source page image and QR code" : "Зображення та QR-код зі сторінки джерела"} /></section>;
}
