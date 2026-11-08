import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { allEvents, cities, countries } from "../src/content/repository";
import { filterEvents, formatEventDate, sortEventsChronologically } from "../src/lib/dates";

test("source catalog has 33 distinct event records across 25 cities and 8 countries", () => {
  assert.equal(allEvents.length, 33);
  assert.equal(new Set(allEvents.map((event) => event.id)).size, 33);
  assert.equal(cities.length, 25);
  assert.equal(countries.length, 8);
});

test("source event pages map one-to-one to pages 5 through 37", () => {
  assert.deepEqual(allEvents.map((event) => event.sourcePageIds[0]).sort((a, b) => a - b), Array.from({ length: 33 }, (_, index) => index + 5));
  assert.ok(allEvents.every((event) => event.rawArchiveRef.startsWith("archive-page:")));
});

test("coverage report accounts for all 41 original pages", () => {
  const report = readFileSync(new URL("../SOURCE_COVERAGE.md", import.meta.url), "utf8");
  for (let page = 1; page <= 41; page += 1) assert.match(report, new RegExp(`\\| ${page} \\|`));
});

test("repeated cities preserve separate records and individual links", () => {
  const kosice = allEvents.filter((event) => event.city.en === "Košice");
  assert.equal(kosice.length, 5);
  assert.equal(new Set(kosice.map((event) => event.id)).size, 5);
});

test("locales are complete and event dates retain source precision", () => {
  assert.ok(allEvents.every((event) => event.title.en && event.title.uk && event.description.en && event.description.uk));
  const monthEvents = allEvents.filter((event) => event.datePrecision === "month");
  assert.equal(monthEvents.length, 6);
  assert.ok(monthEvents.every((event) => /^\d{4}-\d{2}$/.test(event.dateIsoPartial)));
  assert.ok(monthEvents.every((event) => /^\d{1,2}\.\d{4}$/.test(event.dateOriginal)));
  assert.ok(formatEventDate(monthEvents[0], "en").length > 0);
  assert.ok(!formatEventDate(monthEvents[0], "en").includes("1,"));
});

test("source photography is linked to its event pages while map points remain city-level", () => {
  const media = JSON.parse(readFileSync(new URL("../src/content/media.json", import.meta.url), "utf8")) as { assets: { id: string }[]; placements: { pdfPage: number }[] };
  const assetIds = new Set(media.assets.map((asset) => asset.id));
  assert.equal(media.assets.length, 83);
  assert.equal(media.placements.length, 126);
  assert.ok(allEvents.every((event) => event.coordinates === null));
  assert.ok(allEvents.some((event) => event.media.length > 0));
  assert.ok(allEvents.every((event) => event.media.every((assetId) => assetIds.has(assetId))));
  assert.ok(cities.every((city) => city.coordinates !== null));
});

test("all canonical cities have approximate, cited GeoNames points", () => {
  assert.ok(cities.every((city) => city.coordinates && city.coordinateSourceUrl?.startsWith("https://www.geonames.org/")));
  assert.ok(cities.every((city) => city.coordinates !== null && city.coordinates[0] >= -90 && city.coordinates[0] <= 90));
  assert.ok(cities.every((city) => city.coordinates !== null && city.coordinates[1] >= -180 && city.coordinates[1] <= 180));
  assert.ok(cities.every((city) => city.eventIds.length > 0));
});

test("chronological ordering is stable for equal partial dates", () => {
  const ordered = sortEventsChronologically(allEvents);
  assert.deepEqual(ordered.map((event) => event.dateIsoPartial), [...ordered.map((event) => event.dateIsoPartial)].sort());
  assert.equal(ordered.at(-1)?.dateIsoPartial, "2025-08-24");
});

test("search, year and country filters are deterministic", () => {
  const result = filterEvents(allEvents, { locale: "en", query: "Košice", year: "2022", countryCode: "SK" });
  assert.equal(result.length, 2);
  assert.ok(result.every((event) => event.city.en === "Košice" && event.dateIsoPartial.startsWith("2022-") && event.countryCode === "SK"));
});

test("catalog includes each of the eight source countries", () => {
  assert.deepEqual(countries.map((country) => country.code).sort(), ["CA", "CY", "DE", "GB", "MT", "PL", "SE", "SK"]);
});

test("responsive styles include phone, tablet, desktop and reduced-motion rules", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /@media \(min-width: 700px\)/);
  assert.match(css, /@media \(min-width: 1100px\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
