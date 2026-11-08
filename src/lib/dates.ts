import type { Event, Locale } from "@/content/schema";

export function formatEventDate(event: Event, locale: Locale) {
  if (event.datePrecision === "unknown") return locale === "en" ? "Date not stated" : "Дату не вказано";
  if (event.datePrecision === "month") {
    const [year, month] = event.dateIsoPartial.split("-").map(Number);
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
  }
  if (event.datePrecision === "year") return event.dateIsoPartial.slice(0, 4);
  const [year, month, day] = event.dateIsoPartial.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

export const sortEventsChronologically = (events: Event[]) => [...events].sort((a, b) => a.dateIsoPartial.localeCompare(b.dateIsoPartial) || a.sourcePageIds[0] - b.sourcePageIds[0]);

export function filterEvents(events: Event[], filters: { locale: Locale; query?: string; year?: string; countryCode?: string }) {
  const query = (filters.query ?? "").trim().toLocaleLowerCase(filters.locale);
  return sortEventsChronologically(events).filter((event) => {
    const textMatch = !query || `${event.city[filters.locale]} ${event.country[filters.locale]} ${event.sourceCityLabel}`.toLocaleLowerCase(filters.locale).includes(query);
    return textMatch && (!filters.year || event.dateIsoPartial.startsWith(filters.year)) && (!filters.countryCode || event.countryCode === filters.countryCode);
  });
}
