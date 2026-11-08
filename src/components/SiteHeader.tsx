import Link from "next/link";
import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const links = [
    ["about", t(locale, "about")], ["events", t(locale, "archive")], ["map", t(locale, "map")],
    ["timeline", t(locale, "timeline")], ["gallery", locale === "en" ? "Gallery" : "Галерея"], ["organize", t(locale, "organize")],
  ] as const;
  return <header className="site-header">
    <div className="header-inner">
      <Link className="brand" href={`/${locale}/`} aria-label="Angels of Ukraine — home">
        <span className="brand-mark" aria-hidden="true">✳</span><span>Angels of Ukraine</span>
      </Link>
      <nav className="main-nav" aria-label={locale === "en" ? "Main navigation" : "Основна навігація"}>
        {links.map(([path, label]) => <Link key={path} href={`/${locale}/${path}/`}>{label}</Link>)}
      </nav>
      <LocaleSwitch locale={locale} />
    </div>
  </header>;
}
