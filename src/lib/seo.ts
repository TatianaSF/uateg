import type { Metadata } from "next";
import type { Locale } from "@/content/schema";
import { absoluteUrl } from "@/lib/site";

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  absoluteTitle?: boolean;
};

export function createPageMetadata({ locale, path, title, description, keywords, absoluteTitle = false }: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const base = path === "/" ? "" : path.replace(/^\/(?:en|uk)(?=\/)/, "");
  const englishPath = base === "" ? "/" : `/en${base}`;
  const ukrainianPath = base === "" ? "/uk/" : `/uk${base}`;
  const languages = {
    en: absoluteUrl(englishPath),
    uk: absoluteUrl(ukrainianPath),
    "x-default": absoluteUrl("/"),
  };
  const socialImage = {
    url: absoluteUrl("/social-card.svg"),
    width: 1200,
    height: 630,
    alt: locale === "en" ? "Angels of Ukraine travelling memorial archive" : "Архів мандрівного меморіалу «Янголи України»",
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical, languages },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: {
      type: "website",
      siteName: "Angels of Ukraine",
      title,
      description,
      url: canonical,
      locale: locale === "en" ? "en_US" : "uk_UA",
      alternateLocale: [locale === "en" ? "uk_UA" : "en_US"],
      images: [socialImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
  };
}
