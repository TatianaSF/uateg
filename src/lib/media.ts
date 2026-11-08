import mediaData from "@/content/media.json";
import type { Locale } from "@/content/schema";

export const mediaAssets = mediaData.assets;
export const mediaPlacements = mediaData.placements;
const mediaById = new Map(mediaAssets.map((asset) => [asset.id, asset]));

export type MediaAsset = (typeof mediaData.assets)[number];
export type MediaPlacement = (typeof mediaData.placements)[number];

export function isPhotograph(asset: MediaAsset): boolean {
  return asset.assetType === "photograph" || asset.assetType === "portrait";
}

export function photoForEvent(mediaIds: string[]): MediaAsset | undefined {
  return mediaIds.map((id) => mediaById.get(id)).find((asset): asset is MediaAsset => Boolean(asset && isPhotograph(asset)));
}

export function placementAlt(assetId: string, eventSlug: string, locale: Locale): string {
  return mediaPlacements.find((placement) => placement.assetId === assetId && placement.eventSlug === eventSlug)?.alt[locale]
    ?? mediaById.get(assetId)?.alt[locale]
    ?? "";
}
