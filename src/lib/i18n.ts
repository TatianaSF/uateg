import type { Locale } from "@/content/schema";

export const locales: Locale[] = ["en", "uk"];
export const validLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const copy = {
  en: {
    home: "Home", about: "About", archive: "Archive", map: "Map", timeline: "Timeline",
    team: "Team", organize: "Organize", contact: "Contact", privacy: "Privacy",
    tagline: "A travelling memorial, held with care.", explore: "Explore the archive", organizeCta: "Organize in your city",
    stats: "This source archive documents", events: "events", cities: "cities", countries: "countries",
    historyLabel: "Historical archive, 2022–2025", note: "Counts shown on event pages are historical figures printed on that event slide; they are not current or independently verified casualty statistics.",
    featured: "From the archive", allEvents: "View all events", source: "Source page", count: "Angels shown on source slide",
    search: "Search by city or country", year: "Year", country: "Country", city: "City", all: "All", results: "events found",
    monthOnly: "Month only in source", mapFallback: "No event coordinates have been verified yet. The grouped city index below keeps every event available without guessing locations.",
    coordinatesPending: "Location review pending", checklist: "Before you organize",
    reviewBanner: "Editorial review pending", rightsPending: "Source photographs appear in the gallery with their PDF page references.",
    back: "Back to archive",
  },
  uk: {
    home: "Головна", about: "Про проєкт", archive: "Архів", map: "Мапа", timeline: "Хронологія",
    team: "Команда", organize: "Організувати", contact: "Контакти", privacy: "Приватність",
    tagline: "Мандрівний меморіал, створений із турботою.", explore: "Переглянути архів", organizeCta: "Організувати у своєму місті",
    stats: "У цьому джерельному архіві задокументовано", events: "акцій", cities: "міст", countries: "країн",
    historyLabel: "Історичний архів, 2022–2025", note: "Числа на сторінках подій — це історичні показники з відповідного слайда. Вони не є поточною чи незалежно підтвердженою статистикою загиблих.",
    featured: "З архіву", allEvents: "Усі події", source: "Сторінка джерела", count: "Янголів на слайді джерела",
    search: "Пошук за містом або країною", year: "Рік", country: "Країна", city: "Місто", all: "Усі", results: "подій знайдено",
    monthOnly: "У джерелі вказано лише місяць", mapFallback: "Перевірених координат подій поки немає. Нижче наведено список за містами, щоб не вгадувати місця.",
    coordinatesPending: "Перевірка місць триває", checklist: "Перш ніж організовувати",
    reviewBanner: "Очікує редакційної перевірки", rightsPending: "Фотографії з джерела наведено в галереї з посиланнями на сторінки PDF.",
    back: "До архіву",
  },
} as const;

export type CopyKey = keyof typeof copy.en;
export const t = (locale: Locale, key: CopyKey) => copy[locale][key];

export const cityUk: Record<string, string> = {
  "Banská Bystrica": "Банська Бистриця", Warsaw: "Варшава", "Prešov": "Пряшів", "Košice": "Кошице",
  Toronto: "Торонто", "Montréal": "Монреаль", "Québec City": "Квебек", Edmonton: "Едмонтон", Winnipeg: "Вінніпег",
  Bratislava: "Братислава", Kežmarok: "Кежмарок", Sliema: "Сліма", Valletta: "Валлетта", Stockholm: "Стокгольм",
  Uppsala: "Уппсала", Newbury: "Ньюбері", Berlin: "Берлін", Leipzig: "Лейпциг", Potsdam: "Потсдам",
  Shrewsbury: "Шрусбері", "Cleobury Mortimer": "Клебері-Мортімер", Ludlow: "Ладлоу", Limassol: "Лімасол",
  Larnaca: "Ларнака", Žilina: "Жиліна",
};
