import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { OrganizerInquiry } from "@/components/OrganizerInquiry";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "Organize a memorial event" : "Організувати меморіальну акцію", alternates: { canonical: `/${locale}/organize/`, languages: { en: "/en/organize/", uk: "/uk/organize/" } } };
}

export default async function OrganizePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section organize-page">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "For local organizers" : "Для місцевих організаторів"}</p><h1>{locale === "en" ? "Bring the memorial to your city." : "Принесіть меморіал до свого міста."}</h1><p className="lead">{locale === "en" ? "The original invitation asks communities to help keep public attention on the continuing war and its effect on children." : "Оригінальне запрошення закликає громади допомагати привертати увагу до війни, що триває, та її впливу на дітей."}</p><p className="source-ref">{t(locale, "source")} 38–39 · {locale === "en" ? "Translation needs editorial review." : "Переклад потребує редакційної перевірки."}</p></header>
    <div className="organize-layout"><div className="organize-steps"><h2>{t(locale, "checklist")}</h2>
      <ol><li><strong>{locale === "en" ? "Gather a small local team." : "Зберіть невелику місцеву команду."}</strong><p>{locale === "en" ? "The source asks for a strong desire and a little time to prepare the gathering." : "У джерелі зазначено, що для підготовки потрібні щире бажання та трохи часу."}</p></li>
        <li><strong>{locale === "en" ? "Agree on a suitable place and date." : "Оберіть зручне місце й дату."}</strong><p>{locale === "en" ? "Keep the installation accessible and make room for visitors to pause respectfully." : "Подбайте про доступність інсталяції та простір, де відвідувачі зможуть зупинитися й вшанувати пам’ять."}</p></li>
        <li><strong>{locale === "en" ? "Request the memorial materials." : "Запросіть матеріали для меморіалу."}</strong><p>{locale === "en" ? "The original says the Angels can be mailed or transmitted by an agreed method and that accompanying text is provided." : "В оригіналі сказано, що янголів можуть надіслати поштою або передати узгодженим способом, а також надати супровідний текст."}</p></li>
        <li><strong>{locale === "en" ? "Use careful, source-based communication." : "Спілкуйтеся уважно й спирайтеся на джерела."}</strong><p>{locale === "en" ? "Explain that slide counts are historical figures from the source, and seek permission before using photographs or names." : "Пояснюйте, що числа на слайдах є історичними показниками з джерела, і отримуйте дозвіл перед публікацією фото чи імен."}</p></li></ol>
      <p className="method-note">{locale === "en" ? "The source’s wording about the number of angels is time-bound to the event. Do not present it as current verified data." : "Формулювання джерела про кількість янголів прив’язане до часу події. Не подавайте її як актуальні підтверджені дані."}</p>
    </div><aside className="organizer-contact-panel"><h2>{locale === "en" ? "Prepare an inquiry" : "Підготуйте звернення"}</h2><p>{locale === "en" ? "You may draft your city, country, possible date and questions while a public contact channel is being approved." : "Поки погоджується публічний канал зв’язку, підготуйте місто, країну, можливу дату й запитання."}</p><OrganizerInquiry locale={locale} /></aside></div>
  </section>;
}
