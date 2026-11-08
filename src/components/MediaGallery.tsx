import Image from "next/image";
import type { Locale } from "@/content/schema";
import { sitePath } from "@/lib/site";
import { mediaAssets, mediaPlacements, type MediaPlacement } from "@/lib/media";

const assets = new Map(mediaAssets.map((asset) => [asset.id, asset]));

export function MediaGallery({ placements, locale, label, assetTypes = ["photograph", "portrait"] }: { placements: MediaPlacement[]; locale: Locale; label: string; assetTypes?: string[] }) {
  const uniqueByAsset = new Map<string, MediaPlacement[]>();
  for (const placement of placements) {
    const asset = assets.get(placement.assetId);
    if (!asset || !assetTypes.includes(asset.assetType)) continue;
    uniqueByAsset.set(asset.id, [...(uniqueByAsset.get(asset.id) ?? []), placement]);
  }
  if (!uniqueByAsset.size) return null;
  return <section className="media-gallery" aria-label={label}>
    <h2>{label}</h2>
    <div className="media-gallery-grid">{[...uniqueByAsset.entries()].map(([assetId, sourcePlacements]) => {
      const asset = assets.get(assetId);
      if (!asset) return null;
      const item = sourcePlacements[0];
      const repeats = sourcePlacements.length > 1 ? (locale === "en" ? ` · ${sourcePlacements.length} placements` : ` · ${sourcePlacements.length} розміщень`) : "";
      return <figure key={assetId}>
        <Image src={sitePath(asset.src)} width={asset.width} height={asset.height} alt={item.alt[locale]} sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw" unoptimized />
        <figcaption><a href={sitePath(`/archive/angels-of-ukraine-source-2025-10-15.pdf#page=${item.pdfPage}`)} target="_blank" rel="noreferrer">{locale === "en" ? `Source PDF, page ${item.pdfPage}` : `PDF-джерело, сторінка ${item.pdfPage}`}{repeats}</a></figcaption>
      </figure>;
    })}</div>
  </section>;
}

export function pagePlacements(page: number): MediaPlacement[] {
  return mediaPlacements.filter((item) => item.pdfPage === page);
}

export function eventPlacements(slug: string): MediaPlacement[] {
  return mediaPlacements.filter((item) => item.eventSlug === slug);
}
