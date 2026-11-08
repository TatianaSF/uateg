import Link from "next/link";
import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  return <footer className="site-footer"><div className="footer-inner">
    <Link className="footer-brand" href={`/${locale}/`}>Angels of Ukraine</Link>
    <p>{t(locale, "tagline")}</p>
    <nav aria-label={locale === "en" ? "Footer navigation" : "Навігація внизу сторінки"}>
      <Link href={`/${locale}/team/`}>{t(locale, "team")}</Link>
      <Link href={`/${locale}/contact/`}>{t(locale, "contact")}</Link>
      <Link href={`/${locale}/privacy/`}>{t(locale, "privacy")}</Link>
    </nav>
    <small>© Angels of Ukraine · {t(locale, "historyLabel")}</small>
  </div></footer>;
}
