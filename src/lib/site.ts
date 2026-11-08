export const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://uaTeg.com").replace(/\/$/, "");
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function sitePath(path: string): string {
  return `${basePath}/${path.replace(/^\/+/, "")}`;
}

export function absoluteUrl(path: string): string {
  return new URL(sitePath(path), `${siteOrigin}/`).toString();
}
