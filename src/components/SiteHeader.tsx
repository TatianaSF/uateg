"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";
import { LocaleSwitch } from "./LocaleSwitch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}/`;
  const links = [
    ["about", t(locale, "about")], ["events", t(locale, "archive")], ["map", t(locale, "map")],
    ["timeline", t(locale, "timeline")], ["gallery", locale === "en" ? "Gallery" : "Галерея"], ["organize", t(locale, "organize")],
  ] as const;
  return <header className="site-header">
    <div className="header-inner">
      <Link prefetch={false} className="brand" href={`/${locale}/`} aria-label="Angels of Ukraine — home">
        <span className="brand-mark" aria-hidden="true">✳</span><span>Angels of Ukraine</span>
      </Link>
      <nav className="main-nav" aria-label={locale === "en" ? "Main navigation" : "Основна навігація"}>
        {links.map(([path, label]) => {
          const href = `/${locale}/${path}/`;
          const active = pathname === href || pathname.startsWith(href) || (path === "events" && pathname.startsWith(`/${locale}/events/`));
          return <Link prefetch={false} key={path} href={href} aria-current={active ? "page" : undefined}>{label}</Link>;
        })}
      </nav>
      <LocaleSwitch locale={locale} />
    </div>
  </header>;
}
