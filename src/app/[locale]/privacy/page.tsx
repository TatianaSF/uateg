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
    {locale === "en" ? <div className="prose"><h2>Static site</h2><p>This site is a static archive. It does not set analytics cookies or store visitor profiles.</p><h2>Organizer inquiries</h2><p>The organizer form is not active in this build. If a form provider is added later, the site will explain what is collected, where the provider processes it, and how long submissions are retained before the form is enabled.</p><h2>Source material</h2><p>The original source includes personal contact information and photographs. These remain outside the public website unless the relevant owners approve publication.</p><h2>Contact</h2><p>No public contact address has been approved for this release.</p></div> : <div className="prose"><h2>Статичний сайт</h2><p>Цей сайт є статичним архівом. Він не встановлює аналітичні файли cookie й не зберігає профілі відвідувачів.</p><h2>Звернення організаторів</h2><p>Форма організатора в цій версії не активна. Якщо згодом буде підключено сервіс форм, до її запуску сайт пояснить, які дані збираються, де їх обробляє сервіс і скільки часу зберігає звернення.</p><h2>Матеріали джерела</h2><p>Оригінальне джерело містить особисті контакти та фотографії. Їх не опубліковано на сайті без згоди відповідних власників.</p><h2>Зв’язок</h2><p>Для цієї версії публічну контактну адресу не погоджено.</p></div>}
  </article>;
}
