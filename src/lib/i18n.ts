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
    coordinatesPending: "Location review pending", checklist: "Before you organize", formOff: "FORM_NOT_CONFIGURED — no application form is active yet.",
    noContact: "A public contact address has not been approved. Please use the preparation checklist below and keep your inquiry draft until an official channel is published.",
    reviewBanner: "Editorial review pending", rightsPending: "Photograph permissions are still under review. No source photographs are shown here.",
    back: "Back to archive", privacyConsent: "I agree to the privacy notice for an organizer inquiry.",
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
    coordinatesPending: "Перевірка місць триває", checklist: "Перш ніж організовувати", formOff: "FORM_NOT_CONFIGURED — форму звернення ще не налаштовано.",
    noContact: "Публічну контактну адресу ще не погоджено. Скористайтеся списком підготовки нижче та збережіть чернетку звернення до появи офіційного каналу.",
    reviewBanner: "Очікує редакційної перевірки", rightsPending: "Дозволи на фотографії ще перевіряються. Фотографії з джерела тут не показано.",
    back: "До архіву", privacyConsent: "Я погоджуюся з повідомленням про приватність для звернення організатора.",
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
