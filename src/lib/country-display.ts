import type { Locale } from "@/content/schema";

const FLAGS: Record<string, string> = {
  SK: "🇸🇰",
  PL: "🇵🇱",
  CA: "🇨🇦",
  DE: "🇩🇪",
  CY: "🇨🇾",
  SE: "🇸🇪",
  GB: "🇬🇧",
  MT: "🇲🇹",
};

export function countryFlag(code: string): string | undefined {
  return FLAGS[code.toUpperCase()];
}

export function documentedEventCount(count: number, locale: Locale): string {
  if (locale === "en") return `${count} documented ${count === 1 ? "event" : "events"}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const noun = mod10 === 1 && mod100 !== 11 ? "задокументована акція"
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "задокументовані акції"
      : "задокументованих акцій";
  return `${count} ${noun}`;
}
