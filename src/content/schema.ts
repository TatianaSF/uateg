import { z } from "zod";

export const LocaleSchema = z.enum(["en", "uk"]);
export type Locale = z.infer<typeof LocaleSchema>;

const LocalizedTextSchema = z.object({ en: z.string().min(1), uk: z.string().min(1) });
export const EventSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  sourcePageIds: z.array(z.number().int().min(1).max(41)).min(1),
  city: LocalizedTextSchema,
  sourceCityLabel: z.string().min(1),
  country: LocalizedTextSchema,
  countryCode: z.string().length(2),
  canonicalCityId: z.string().min(1),
  dateOriginal: z.string().min(1),
  dateIsoPartial: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/),
  datePrecision: z.enum(["day", "month", "year", "unknown"]),
  memorialAngelCount: z.number().int().nonnegative(),
  memorialCountContext: z.string().min(1),
  personIds: z.array(z.string()),
  organizationIds: z.array(z.string()),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  translationStatus: z.object({ en: z.string(), uk: z.string() }),
  editorialFlags: z.array(z.string()),
  rawArchiveRef: z.string().regex(/^archive-page:\d{2}$/),
  coordinates: z.tuple([z.number(), z.number()]).nullable(),
  coordinateSourceUrl: z.string().url().nullable(),
  media: z.array(z.string()),
  publicationStatus: z.string(),
  sourceTranscription: z.string(),
  historicalDescription: z.object({ en: z.string(), uk: z.string() }),
  sourceDiscrepancy: z.object({ en: z.string(), uk: z.string() }).optional(),
}).superRefine((event, context) => {
  if (Boolean(event.coordinates) !== Boolean(event.coordinateSourceUrl)) {
    context.addIssue({ code: "custom", path: ["coordinateSourceUrl"], message: "Coordinates and a citation must be supplied together." });
  }
});

export const EventsSchema = z.array(EventSchema).length(33);
export const CityCoordinatesSchema = z.array(z.object({
  id: z.string().min(1),
  coordinates: z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]),
  coordinateSourceUrl: z.string().url(),
  geoNamesId: z.string().regex(/^\d+$/),
  featureCode: z.string().min(3),
  countryCode: z.string().length(2),
})).length(25);
export type Event = z.infer<typeof EventSchema>;
export type LocalizedEvent = Omit<Event, "city" | "country" | "title" | "description"> & {
  city: string;
  country: string;
  title: string;
  description: string;
};

export type City = {
  id: string;
  name: { en: string; uk: string };
  countryCode: string;
  countryId: string;
  coordinates: [number, number] | null;
  coordinateSourceUrl: string | null;
  eventIds: string[];
};

export type Country = {
  code: string;
  name: { en: string; uk: string };
  cityIds: string[];
};

export type Media = {
  id: string;
  sourcePageId: number;
  originalAssetHash: string;
  webVariants: string[];
  alt: { en: string; uk: string };
  approvedForPublicDisplay: boolean;
  rightsApprovalStatus: "pending" | "approved" | "rejected";
};

export type Person = { id: string; attribution: string; sourcePageIds: number[]; approvedForPublicDisplay: boolean };
export type Organization = { id: string; attribution: string; sourcePageIds: number[]; approvedForPublicDisplay: boolean };
export type SourcePage = { pageIndex: number; rawExtractRef: string; privateMediaRefs: string[]; websiteRoutes: string[] };
