import assert from "node:assert/strict";
import test from "node:test";
import { CLASSIC_ARCHIVE_TOTALS, getClassicHeroCards } from "@/lib/classic-hero";

test("Classic Hero archive totals stay grounded in the 2025 source archive", () => {
  assert.deepEqual(CLASSIC_ARCHIVE_TOTALS, [
    { key: "events", value: 33 },
    { key: "cities", value: 25 },
    { key: "countries", value: 8 },
  ]);
});

test("all five Classic Hero cards have localized titles and existing routes", () => {
  const expected = {
    en: [
      ["The Archive", "/en/events/"], ["Timeline", "/en/timeline/"], ["The Map", "/en/map/"],
      ["Gallery", "/en/gallery/"], ["Organize an Event", "/en/organize/"],
    ],
    uk: [
      ["Архів", "/uk/events/"], ["Хронологія", "/uk/timeline/"], ["Мапа", "/uk/map/"],
      ["Галерея", "/uk/gallery/"], ["Організувати акцію", "/uk/organize/"],
    ],
  } as const;

  for (const locale of ["en", "uk"] as const) {
    const cards = getClassicHeroCards(locale);
    assert.equal(cards.length, 5);
    assert.deepEqual(cards.map(({ title, href }) => [title, href]), expected[locale]);
    assert.ok(cards.every((card) => card.description.length > 0));
  }
});
