import type { Metadata } from "next";
import { HomeLanding } from "@/components/HomeLanding";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Angels of Ukraine · A travelling memorial",
  description: "Explore the Angels of Ukraine memorial story, photographs and historical events across eight countries.",
  alternates: { canonical: absoluteUrl("/"), languages: { en: absoluteUrl("/"), uk: absoluteUrl("/uk/") } },
};

export default function EntryPage() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader locale="en" /><main id="main-content"><HomeLanding locale="en" /></main><SiteFooter locale="en" /></>;
}
