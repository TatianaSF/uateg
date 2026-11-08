"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/content/schema";
import { basePath } from "@/lib/site";

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const logicalPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  const target = (next: Locale) => logicalPath.replace(/^\/(en|uk)(?=\/|$)/, `/${next}`);
  return <div className="locale-switch" aria-label="Language / Мова">
    <Link href={target("en")} lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
    <span aria-hidden="true">·</span>
    <Link href={target("uk")} lang="uk" aria-current={locale === "uk" ? "page" : undefined}>UK</Link>
  </div>;
}
