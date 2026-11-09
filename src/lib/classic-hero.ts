import type { Locale } from "@/content/schema";

export const CLASSIC_ARCHIVE_TOTALS = [
  { key: "events", value: 33 },
  { key: "cities", value: 25 },
  { key: "countries", value: 8 },
] as const;

export type ClassicHeroCardKey = "archive" | "timeline" | "map" | "gallery" | "organize";

export function getClassicHeroCards(locale: Locale) {
  const copy = locale === "en"
    ? [
        ["archive", "The Archive", "All documented events"],
        ["timeline", "Timeline", "From 2022 to 2025"],
        ["map", "The Map", "Events across the world"],
        ["gallery", "Gallery", "Photos, people, places"],
        ["organize", "Organize an Event", "Bring Angels of Ukraine to your city"],
      ]
    : [
        ["archive", "Архів", "Усі задокументовані акції"],
        ["timeline", "Хронологія", "Від 2022 до 2025 року"],
        ["map", "Мапа", "Акції в різних країнах"],
        ["gallery", "Галерея", "Фотографії, люди, місця"],
        ["organize", "Організувати акцію", "Принесіть «Янголів України» до свого міста"],
      ];

  return copy.map(([key, title, description]) => ({
    key: key as ClassicHeroCardKey,
    title,
    description,
    href: `/${locale}/${key === "archive" ? "events" : key === "organize" ? "organize" : key}/`,
  }));
}
