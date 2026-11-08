import assert from "node:assert/strict";
import test from "node:test";
import { FORM_NOT_CONFIGURED, OrganizerRequestSchema, createOrganizerAdapter, organizerAdapterFromConfig } from "../src/lib/organizer";

const testEmail = ["ada", "example.org"].join("@");
const validRequest = {
  fullName: "Ada Example", email: testEmail, country: "Slovakia", city: "Košice",
  plannedDate: "", message: "We would like to learn about hosting a memorial gathering.", privacyConsent: "true",
};

test("organizer validation accepts complete consented requests", () => {
  const parsed = OrganizerRequestSchema.safeParse(validRequest);
  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.privacyConsent, true);
});

test("organizer validation rejects missing consent and malformed email", () => {
  assert.equal(OrganizerRequestSchema.safeParse({ ...validRequest, privacyConsent: "false" }).success, false);
  assert.equal(OrganizerRequestSchema.safeParse({ ...validRequest, email: "not-an-email" }).success, false);
  assert.equal(OrganizerRequestSchema.safeParse({ ...validRequest, message: "short" }).success, false);
});

test("unconfigured adapter is absent and cannot imply a fake success", () => {
  assert.equal(FORM_NOT_CONFIGURED, "FORM_NOT_CONFIGURED");
  assert.equal(organizerAdapterFromConfig(undefined, undefined), null);
  assert.equal(organizerAdapterFromConfig("https://example.org/inquiry", "unapproved-provider"), null);
});

test("external adapter sends the request and accepts provider success", async () => {
  let sentBody = "";
  const adapter = createOrganizerAdapter("https://forms.example.org/submit", async (_url, init) => {
    sentBody = String(init?.body);
    return new Response(null, { status: 202 });
  });
  await adapter.submit(OrganizerRequestSchema.parse(validRequest));
  assert.ok(sentBody.includes(testEmail));
});

test("external adapter surfaces provider errors", async () => {
  const adapter = createOrganizerAdapter("https://forms.example.org/submit", async () => new Response(null, { status: 503 }));
  await assert.rejects(() => adapter.submit(OrganizerRequestSchema.parse(validRequest)), /503/);
});

test("adapter rejects insecure endpoints", () => {
  assert.throws(() => createOrganizerAdapter("http://example.org/submit"), /HTTPS/);
  const credentialUrl = new URL("https://example.org/submit");
  credentialUrl.username = "user";
  credentialUrl.password = "pass";
  assert.throws(() => createOrganizerAdapter(credentialUrl.toString()), /credentials/);
});
