import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPageMetadata } from "../src/lib/seo";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("header, footer, loading and 404 use the direct approved raster logo asset", () => {
  for (const path of [
    "../src/components/SiteHeader.tsx",
    "../src/components/SiteFooter.tsx",
    "../src/app/not-found.tsx",
    "../src/app/[locale]/loading.tsx",
  ]) {
    assert.match(read(path), /src="\/icon-512\.png"/, `${path} should use the direct PNG logo`);
    assert.doesNotMatch(read(path), /angel-option-a\.svg/);
  }
});

test("branding SVG files are self-contained and do not reference external resources", () => {
  for (const path of ["../public/brand/angel-option-a.svg", "../src/app/icon.svg"]) {
    const svg = read(path);
    assert.match(svg, /data:image\/png;base64,/);
    assert.doesNotMatch(svg, /(?:href|src)="(?:https?:|\/)/i);
    assert.match(svg, /Crocheted Angel/);
  }
});

test("manifest only declares installed square PNG icons with valid non-maskable purposes", () => {
  const manifest = JSON.parse(read("../public/site.webmanifest")) as { icons: Array<{ src: string; sizes: string; type: string; purpose: string }> };
  assert.deepEqual(manifest.icons.map(({ sizes }) => sizes), ["192x192", "512x512"]);
  for (const icon of manifest.icons) {
    assert.equal(icon.type, "image/png");
    assert.equal(icon.purpose, "any");
    assert.match(icon.src, /^\/icon-(192|512)\.png$/);
  }
});

test("approved raster outputs have the exact required dimensions", () => {
  const expected: Record<string, [number, number]> = {
    "favicon-16x16.png": [16, 16],
    "favicon-32x32.png": [32, 32],
    "favicon-48x48.png": [48, 48],
    "apple-touch-icon.png": [180, 180],
    "icon-192.png": [192, 192],
    "icon-512.png": [512, 512],
    "social-card.png": [1200, 630],
  };
  for (const [name, [width, height]] of Object.entries(expected)) {
    const png = readFileSync(new URL(`../public/${name}`, import.meta.url));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${name} should be PNG`);
    assert.equal(png.readUInt32BE(16), width, `${name} width`);
    assert.equal(png.readUInt32BE(20), height, `${name} height`);
  }
});

test("page SEO uses a versioned PNG social preview with correct Open Graph dimensions and type", () => {
  const metadata = createPageMetadata({ locale: "en", path: "/en/", title: "Angels of Ukraine", description: "A memorial archive." });
  const openGraph = metadata.openGraph as { images?: Array<{ url: string | URL; width?: number; height?: number; type?: string }> };
  const twitter = metadata.twitter as unknown as { images?: string[]; card?: string };
  const image = openGraph.images?.[0];
  assert.equal(typeof image, "object");
  if (typeof image !== "object") throw new Error("Expected an Open Graph image object");
  assert.match(String(image.url), /^https:\/\/uateg\.com\/social-card\.png\?v=[a-f0-9]{10}$/);
  assert.equal(image.width, 1200);
  assert.equal(image.height, 630);
  assert.equal(image.type, "image/png");
  assert.deepEqual(twitter.images, [String(image.url)]);
  assert.equal(twitter.card, "summary_large_image");
});
