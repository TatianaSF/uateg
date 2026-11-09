import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  path: "/",
  title: "Angels of Ukraine | Travelling Memorial Archive",
  description: "Explore the Angels of Ukraine memorial story, photographs and documented events across eight countries. A public archive and platform for future organizers.",
  keywords: ["Angels of Ukraine memorial", "travelling memorial archive", "Ukrainian children remembrance", "documented memorial events"],
  absoluteTitle: true,
});

export default function EntryPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader locale="en" /><main id="main-content"><HomeLanding locale="en" /></main><SiteFooter locale="en" /></>;
}
