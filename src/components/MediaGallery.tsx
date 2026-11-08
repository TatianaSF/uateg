import Image from "next/image";
import mediaData from "@/content/media.json";
import type { Locale } from "@/content/schema";
import { sitePath } from "@/lib/site";

type Placement = (typeof mediaData.placements)[number];
const assets = new Map(mediaData.assets.map((asset) => [asset.id, asset]));

export function MediaGallery({ placements, locale, label }: { placements: Placement[]; locale: Locale; label: string }) {
  if (!placements.length) return null;
  return <section className="media-gallery" aria-label={label}>
    <h2>{label}</h2>
    <div className="media-gallery-grid">{placements.map((item, index) => {
      const asset = assets.get(item.assetId);
      if (!asset) return null;
      return <figure key={`${item.pdfPage}-${item.occurrence}-${index}`}>
        <Image src={sitePath(asset.src)} width={asset.width} height={asset.height} alt={item.alt[locale]} unoptimized />
        <figcaption>{locale === "en" ? `Source PDF, page ${item.pdfPage}` : `PDF-джерело, сторінка ${item.pdfPage}`}</figcaption>
      </figure>;
    })}</div>
  </section>;
}

export function pagePlacements(page: number): Placement[] {
  return mediaData.placements.filter((item) => item.pdfPage === page);
}

export function eventPlacements(slug: string): Placement[] {
  return mediaData.placements.filter((item) => item.eventSlug === slug);
}
