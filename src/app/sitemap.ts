import type { MetadataRoute } from "next";
import { allEvents } from "@/content/repository";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/about/", "/events/", "/map/", "/timeline/", "/team/", "/organize/", "/contact/", "/privacy/", "/gallery/"];
  const locales = ["en", "uk"] as const;
  const pages = locales.flatMap((locale) => fixed.map((path) => {
    const suffix = path || "/";
    const englishHome = locale === "en" && path === "";
    return {
      url: absoluteUrl(englishHome ? "/" : `/${locale}${suffix}`),
      alternates: { languages: { en: absoluteUrl(englishHome || path === "" ? "/" : `/en${suffix}`), uk: absoluteUrl(`/uk${suffix}`) } },
    };
  }));
  const events = locales.flatMap((locale) => allEvents.map((event) => {
    const route = `/events/${event.slug}/`;
    return {
      url: absoluteUrl(`/${locale}${route}`),
      alternates: { languages: { en: absoluteUrl(`/en${route}`), uk: absoluteUrl(`/uk${route}`) } },
    };
  }));
  return [...pages, ...events];
}
