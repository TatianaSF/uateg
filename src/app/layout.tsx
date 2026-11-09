import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { siteOrigin, basePath, absoluteUrl } from "@/lib/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}/#organization`,
      name: "Angels of Ukraine",
      url: siteOrigin,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/angel-option-a.svg") },
      description: "A travelling memorial and bilingual historical archive documenting Angels of Ukraine events.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      name: "Angels of Ukraine",
      url: siteOrigin,
      inLanguage: ["en", "uk"],
      publisher: { "@id": `${siteOrigin}/#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(`${basePath}/`, `${siteOrigin}/`),
  title: { default: "Angels of Ukraine | Travelling Memorial Archive", template: "%s | Angels of Ukraine" },
  description: "Explore the Angels of Ukraine memorial story, photographs and documented events across eight countries. A public archive and platform for future organizers.",
  applicationName: "Angels of Ukraine",
  category: "history",
  manifest: absoluteUrl("/site.webmanifest"),
  icons: {
    icon: [
      { url: absoluteUrl("/favicon.png"), type: "image/png", sizes: "110x115" },
      { url: absoluteUrl("/brand/angel-option-a.svg"), type: "image/svg+xml", sizes: "any" },
    ],
    apple: [{ url: absoluteUrl("/apple-touch-icon.png"), type: "image/png", sizes: "110x115" }],
  },
  openGraph: { type: "website", siteName: "Angels of Ukraine", locale: "en_US", images: [{ url: absoluteUrl("/social-card.svg"), width: 1200, height: 630, alt: "Angels of Ukraine travelling memorial archive" }] },
  twitter: { card: "summary_large_image", images: [absoluteUrl("/social-card.svg")] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} /></body></html>;
}
