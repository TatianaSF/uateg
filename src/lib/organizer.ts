import { z } from "zod";

export const OrganizerRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().min(1).max(100),
  plannedDate: z.string().max(20).optional().default(""),
  message: z.string().trim().min(10).max(4000),
  privacyConsent: z.preprocess((value) => value === "true" || value === true, z.boolean().refine(Boolean, "Consent is required")),
});

export type OrganizerRequest = z.infer<typeof OrganizerRequestSchema>;
export type OrganizerFormAdapter = { submit(request: OrganizerRequest): Promise<void> };
export const FORM_NOT_CONFIGURED = "FORM_NOT_CONFIGURED" as const;

export function createOrganizerAdapter(endpoint: string, fetcher: typeof fetch = fetch): OrganizerFormAdapter {
  const url = new URL(endpoint);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Form endpoint must be an HTTPS URL without embedded credentials");
  return {
    async submit(request) {
      const parsed = OrganizerRequestSchema.parse(request);
      const response = await fetcher(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) throw new Error(`Organizer provider returned ${response.status}`);
    },
  };
}

export function organizerAdapterFromConfig(endpoint?: string, provider?: string, fetcher: typeof fetch = fetch) {
  if (!endpoint || provider !== "approved-external-provider") return null;
  return createOrganizerAdapter(endpoint, fetcher);
}
