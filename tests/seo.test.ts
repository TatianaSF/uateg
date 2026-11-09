import assert from "node:assert/strict";
import test from "node:test";
import { createPageMetadata } from "../src/lib/seo";

test("page metadata links each language to the correct canonical and alternate routes", () => {
  const english = createPageMetadata({ locale: "en", path: "/en/events/", title: "Documented Event Archive", description: "Explore documented events." });
  assert.equal(english.alternates?.canonical, "https://uateg.com/en/events/");
  assert.deepEqual(english.alternates?.languages, {
    en: "https://uateg.com/en/events/",
    uk: "https://uateg.com/uk/events/",
    "x-default": "https://uateg.com/",
  });
  assert.equal(english.openGraph?.url, "https://uateg.com/en/events/");
  assert.match(JSON.stringify(english.twitter), /summary_large_image/);
  assert.match(JSON.stringify(english.robots), /"index":true/);
});

test("localized homepage uses the selected search snippet copy and site canonical", () => {
  const ukrainian = createPageMetadata({ locale: "uk", path: "/uk/", title: "Angels of Ukraine | Архів мандрівного меморіалу", description: "Український опис.", absoluteTitle: true });
  assert.deepEqual(ukrainian.title, { absolute: "Angels of Ukraine | Архів мандрівного меморіалу" });
  assert.equal(ukrainian.alternates?.canonical, "https://uateg.com/uk/");
  assert.equal(ukrainian.openGraph?.locale, "uk_UA");
  assert.equal(ukrainian.description, "Український опис.");
});
