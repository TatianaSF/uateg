import type { MetadataRoute } from "next";
import { allEvents } from "@/content/repository";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const localizedRoutes = ["about", "events", "map", "timeline", "gallery", "organize", "team", "contact", "privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const homePages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), alternates: { languages: { en: absoluteUrl("/"), uk: absoluteUrl("/uk/") } }, priority: 1 },
    { url: absoluteUrl("/en/"), alternates: { languages: { en: absoluteUrl("/"), uk: absoluteUrl("/uk/") } }, priority: 0.9 },
    { url: absoluteUrl("/uk/"), alternates: { languages: { en: absoluteUrl("/"), uk: absoluteUrl("/uk/") } }, priority: 1 },
  ];
  const pages = ["en", "uk"].flatMap((locale) => localizedRoutes.map((route) => {
    const en = absoluteUrl("/en/" + route + "/");
    const uk = absoluteUrl("/uk/" + route + "/");
    return {
      url: locale === "en" ? en : uk,
      alternates: { languages: { en, uk } },
      priority: ["events", "gallery"].includes(route) ? 0.9 : 0.7,
    };
  }));
  const events = ["en", "uk"].flatMap((locale) => allEvents.map((event) => {
    const en = absoluteUrl("/en/events/" + event.slug + "/");
    const uk = absoluteUrl("/uk/events/" + event.slug + "/");
    return { url: locale === "en" ? en : uk, alternates: { languages: { en, uk } }, priority: 0.6 };
  }));
  return [...homePages, ...pages, ...events];
}
