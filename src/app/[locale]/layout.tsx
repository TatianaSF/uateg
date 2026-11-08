import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale, locales, t } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LanguageAttribute } from "@/components/LanguageAttribute";

export const metadata: Metadata = {
  alternates: { languages: { en: "/en/", uk: "/uk/" } },
};

export const dynamicParams = false;

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <div lang={locale}>
    <LanguageAttribute locale={locale} />
    <a className="skip-link" href="#main-content">{locale === "en" ? "Skip to content" : "Перейти до вмісту"}</a>
    <SiteHeader locale={locale} />
    <main id="main-content">{children}</main>
    <SiteFooter locale={locale} />
    <Link className="contact-shortcut" href={`/${locale}/organize/`}>{t(locale, "organizeCta")} <span aria-hidden="true">↗</span></Link>
  </div>;
}
