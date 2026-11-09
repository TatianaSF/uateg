import assert from "node:assert/strict";
import test from "node:test";
import { countryFlag, documentedEventCount } from "../src/lib/country-display";

test("all eight source countries have Unicode flags and unknown countries remain safe", () => {
  assert.deepEqual(["SK", "PL", "CA", "DE", "CY", "SE", "GB", "MT"].map(countryFlag), ["🇸🇰", "🇵🇱", "🇨🇦", "🇩🇪", "🇨🇾", "🇸🇪", "🇬🇧", "🇲🇹"]);
  assert.equal(countryFlag("xx"), undefined);
});

test("event counts are localized with correct Ukrainian plural forms", () => {
  assert.equal(documentedEventCount(1, "en"), "1 documented event");
  assert.equal(documentedEventCount(2, "en"), "2 documented events");
  assert.equal(documentedEventCount(1, "uk"), "1 задокументована акція");
  assert.equal(documentedEventCount(3, "uk"), "3 задокументовані акції");
  assert.equal(documentedEventCount(5, "uk"), "5 задокументованих акцій");
  assert.equal(documentedEventCount(21, "uk"), "21 задокументована акція");
  assert.equal(documentedEventCount(22, "uk"), "22 задокументовані акції");
});
