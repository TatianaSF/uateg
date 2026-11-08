import type { MetadataRoute } from "next";
import { allEvents } from "@/content/repository";

const base = "https://uaTeg.com";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/about/", "/events/", "/map/", "/timeline/", "/team/", "/organize/", "/contact/", "/privacy/"];
  const locales = ["en", "uk"] as const;
  const pages = locales.flatMap((locale) => fixed.map((path) => {
    const suffix = path || "/";
    return {
      url: `${base}/${locale}${suffix}`,
      alternates: { languages: { en: `${base}/en${suffix}`, uk: `${base}/uk${suffix}` } },
    };
  }));
  const events = locales.flatMap((locale) => allEvents.map((event) => {
    const route = `/events/${event.slug}/`;
    return {
      url: `${base}/${locale}${route}`,
      alternates: { languages: { en: `${base}/en${route}`, uk: `${base}/uk${route}` } },
    };
  }));
  return [...pages, ...events];
}
