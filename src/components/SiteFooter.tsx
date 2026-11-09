import Link from "next/link";
import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  return <footer className="site-footer"><div className="footer-inner">
    <Link prefetch={false} className="footer-brand" href={`/${locale}/`}>Angels of Ukraine</Link>
    <p>{t(locale, "tagline")}</p>
    <nav aria-label={locale === "en" ? "Footer navigation" : "Навігація внизу сторінки"}>
      <Link prefetch={false} href={`/${locale}/team/`}>{t(locale, "team")}</Link>
      <Link prefetch={false} href={`/${locale}/contact/`}>{t(locale, "contact")}</Link>
      <Link prefetch={false} href={`/${locale}/gallery/`}>{locale === "en" ? "Gallery" : "Галерея"}</Link>
      <Link prefetch={false} href={`/${locale}/privacy/`}>{t(locale, "privacy")}</Link>
    </nav>
    <small>© Angels of Ukraine · {t(locale, "historyLabel")}</small>
  </div></footer>;
}
