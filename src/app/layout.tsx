import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { siteOrigin, basePath, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${basePath}/`, `${siteOrigin}/`),
  title: { default: "Angels of Ukraine", template: "%s · Angels of Ukraine" },
  description: "A bilingual historical archive and organizer guide for the Angels of Ukraine memorial initiative.",
  openGraph: { type: "website", siteName: "Angels of Ukraine", images: [absoluteUrl("/social-card.svg")] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
