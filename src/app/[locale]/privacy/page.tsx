import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Privacy notice" : "Повідомлення про приватність", alternates: { canonical: `/${locale}/privacy/`, languages: { en: "/en/privacy/", uk: "/uk/privacy/" } } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <article className="content-section narrow-page"><header className="page-heading"><p className="eyebrow">{locale === "en" ? "Privacy" : "Приватність"}</p><h1>{locale === "en" ? "Your information stays yours." : "Ваша інформація належить вам."}</h1></header>
    {locale === "en" ? <div className="prose"><h2>Static site</h2><p>This site is a static archive. It does not set analytics cookies or store visitor profiles.</p><h2>Organizer inquiries</h2><p>The organizer form is not active. The Contact page lists the historical contact details from the source; current availability has not been independently reconfirmed.</p><h2>Source material</h2><p>The project owner authorized publication of the original PDF, photographs, names and contact details. This publication does not claim independent third-party consent or copyright verification.</p><h2>Contact</h2><p>See the Contact page for source-listed details.</p></div> : <div className="prose"><h2>Статичний сайт</h2><p>Цей сайт є статичним архівом. Він не встановлює аналітичні файли cookie й не зберігає профілі відвідувачів.</p><h2>Звернення організаторів</h2><p>Форма організатора не активна. На сторінці «Контакти» наведено історичні дані з джерела; їхню актуальність незалежно не підтверджено.</p><h2>Матеріали джерела</h2><p>Власник проєкту дозволив оприлюднення оригінального PDF, фотографій, імен і контактів. Публікація не означає незалежної перевірки згод третіх осіб або авторських прав.</p><h2>Зв’язок</h2><p>Дивіться сторінку «Контакти».</p></div>}
  </article>;
}
