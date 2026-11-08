import eventData from "./events.json";
import cityCoordinateData from "./city-coordinates.json";
import { CityCoordinatesSchema, EventsSchema, type Event, type Locale, type LocalizedEvent } from "./schema";

const events = EventsSchema.parse(eventData) as Event[];
const sourcePages = events.map((event) => event.sourcePageIds[0]).sort((a, b) => a - b);
const expectedPages = Array.from({ length: 33 }, (_, index) => index + 5);
if (JSON.stringify(sourcePages) !== JSON.stringify(expectedPages)) throw new Error("Event records must map to source pages 5–37 exactly once.");
if (new Set(events.map((event) => event.id)).size !== 33) throw new Error("Event IDs must be unique.");
if (new Set(events.map((event) => event.canonicalCityId)).size !== 25) throw new Error("Expected 25 canonical cities.");
if (new Set(events.map((event) => event.countryCode)).size !== 8) throw new Error("Expected 8 source countries.");

export interface ContentRepository {
  getAllEvents(): Event[];
  getEventBySlug(slug: string): Event | undefined;
  getEventsForLocale(locale: Locale): LocalizedEvent[];
}

export class JsonContentRepository implements ContentRepository {
  getAllEvents() {
    return events;
  }

  getEventBySlug(slug: string) {
    return events.find((event) => event.slug === slug);
  }

  getEventsForLocale(locale: Locale): LocalizedEvent[] {
    return events.map((event) => ({
      ...event,
      city: event.city[locale],
      country: event.country[locale],
      title: event.title[locale],
      description: event.description[locale],
    }));
  }
}

export const contentRepository: ContentRepository = new JsonContentRepository();
export const allEvents = contentRepository.getAllEvents();
export const localized = <T extends { en: string; uk: string }>(value: T, locale: Locale) => value[locale];

const cityCoordinates = new Map(CityCoordinatesSchema.parse(cityCoordinateData).map((record) => [record.id, record]));

export const cities = [...new Map(allEvents.map((event) => [event.city.en, {
  id: event.canonicalCityId,
  name: event.city,
  countryCode: event.countryCode,
  countryId: event.countryCode,
  coordinates: cityCoordinates.get(event.canonicalCityId)?.coordinates ?? null,
  coordinateSourceUrl: cityCoordinates.get(event.canonicalCityId)?.coordinateSourceUrl ?? null,
  eventIds: allEvents.filter((other) => other.city.en === event.city.en).map((other) => other.id),
}])).values()];

export const countries = [...new Map(allEvents.map((event) => [event.countryCode, {
  code: event.countryCode,
  name: event.country,
  cityIds: cities.filter((city) => city.countryCode === event.countryCode).map((city) => city.id),
}])).values()];
