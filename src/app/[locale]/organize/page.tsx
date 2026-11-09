import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale, t } from "@/lib/i18n";
import { ContactOptions } from "@/components/ContactOptions";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return createPageMetadata({ locale, path: "/" + locale + "/organize/", title: locale === "en" ? "Organize an Angels of Ukraine Memorial Event" : "Організуйте меморіальну акцію «Янголи України»", description: locale === "en" ? "Learn how to prepare a respectful local gathering using the historical source guide, then contact the project by email, phone or SMS." : "Дізнайтеся, як підготувати місцеву акцію з повагою до пам’яті, і зв’яжіться з проєктом електронною поштою, телефоном або SMS.", keywords: locale === "en" ? ["organize Angels of Ukraine event", "public memorial installation Ukraine"] : ["організувати акцію Янголи України", "меморіальна інсталяція"] });
}

export default async function OrganizePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section organize-page">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "For local organizers" : "Для місцевих організаторів"}</p><h1>{locale === "en" ? "Bring the memorial to your city." : "Принесіть меморіал до свого міста."}</h1><p className="lead">{locale === "en" ? "The original invitation asks communities to help keep public attention on the continuing war and its effect on children." : "Оригінальне запрошення закликає громади допомагати привертати увагу до війни, що триває, та її впливу на дітей."}</p><p className="source-ref">{t(locale, "source")} 38–39 · {locale === "en" ? "Translation needs editorial review." : "Переклад потребує редакційної перевірки."}</p></header>
    <div className="organize-hero-media">
      <MediaGallery placements={pagePlacements(5).filter((placement) => placement.assetId === "b2dc6e2bc763a2ceb7e2246d9a03cb1629ffc6dde8e087aadf73e9e093959a61")} locale={locale} label={locale === "en" ? "Original installation photograph · source page 5" : "Оригінальне фото інсталяції · сторінка 5 джерела"} />
      <div className="organize-hero-copy"><p className="eyebrow">{locale === "en" ? "Start with the source" : "Почніть із першоджерела"}</p><h2>{locale === "en" ? "Plan a gathering with care and a local team." : "Плануйте акцію уважно, разом із місцевою командою."}</h2><p>{locale === "en" ? "The original invitation describes a travelling installation and asks communities to coordinate a place, date and the memorial materials." : "В оригінальному запрошенні йдеться про мандрівну інсталяцію та пропонується громадам узгодити місце, дату й меморіальні матеріали."}</p><p className="source-ref">{locale === "en" ? "The photograph is from a separate historical event record (PDF p. 5). It illustrates the installation, not a current organizer offer." : "Фотографію взято з окремого історичного запису про акцію (PDF, с. 5). Вона показує інсталяцію, а не актуальну пропозицію організаторам."}</p><Link prefetch={false} className="text-link" href={`/${locale}/events/banska-bystrica-2025-08-24-p5/`}>{locale === "en" ? "See this source event" : "Переглянути це джерело"} <span aria-hidden="true">→</span></Link></div>
    </div>
    <MediaGallery placements={[...pagePlacements(38), ...pagePlacements(39)]} locale={locale} label={locale === "en" ? "Invitation and requirements in the source" : "Запрошення та вимоги з першоджерела"} />
    <div className="organize-layout"><div className="organize-steps"><h2>{t(locale, "checklist")}</h2>
      <ol><li><strong>{locale === "en" ? "Gather a small local team." : "Зберіть невелику місцеву команду."}</strong><p>{locale === "en" ? "The source asks for a strong desire and a little time to prepare the gathering." : "У джерелі зазначено, що для підготовки потрібні щире бажання та трохи часу."}</p></li>
        <li><strong>{locale === "en" ? "Agree on a suitable place and date." : "Оберіть зручне місце й дату."}</strong><p>{locale === "en" ? "Keep the installation accessible and make room for visitors to pause respectfully." : "Подбайте про доступність інсталяції та простір, де відвідувачі зможуть зупинитися й вшанувати пам’ять."}</p></li>
        <li><strong>{locale === "en" ? "Request the memorial materials." : "Запросіть матеріали для меморіалу."}</strong><p>{locale === "en" ? "The original says the Angels can be mailed or transmitted by an agreed method and that accompanying text is provided." : "В оригіналі сказано, що янголів можуть надіслати поштою або передати узгодженим способом, а також надати супровідний текст."}</p></li>
        <li><strong>{locale === "en" ? "Use careful, source-based communication." : "Спілкуйтеся уважно й спирайтеся на джерела."}</strong><p>{locale === "en" ? "Explain that slide counts are historical figures from the source, and seek permission before using photographs or names." : "Пояснюйте, що числа на слайдах є історичними показниками з джерела, і отримуйте дозвіл перед публікацією фото чи імен."}</p></li></ol>
      <div className="organize-resource-list"><strong>{locale === "en" ? "Before you proceed" : "Перш ніж почати"}</strong><ul><li>{locale === "en" ? "Choose a local team and an accessible place." : "Зберіть місцеву команду й оберіть доступне місце."}</li><li>{locale === "en" ? "Confirm a date before sharing an announcement." : "Погодьте дату перед публікацією анонсу."}</li><li>{locale === "en" ? "Request the installation materials through an approved current contact." : "Запитуйте матеріали через затверджений актуальний канал зв’язку."}</li><li>{locale === "en" ? "Keep historical source figures and photographs clearly attributed." : "Чітко зазначайте джерело історичних чисел і фотографій."}</li></ul><p className="source-ref">{locale === "en" ? "These steps summarize the original invitation on PDF pages 38–39." : "Ці кроки стисло переказують оригінальне запрошення на сторінках 38–39 PDF."}</p></div>
      <p className="method-note">{locale === "en" ? "The source’s wording about the number of angels is time-bound to the event. Do not present it as current verified data." : "Формулювання джерела про кількість янголів прив’язане до часу події. Не подавайте її як актуальні підтверджені дані."}</p>
    </div><aside className="organizer-contact-panel"><h2>{locale === "en" ? "Contact the project" : "Зв’яжіться з проєктом"}</h2><p>{locale === "en" ? "To discuss an event, contact the project directly by email, phone call or SMS." : "Щоб обговорити подію, зв’яжіться з проєктом електронною поштою, телефоном або SMS."}</p><ContactOptions locale={locale} /></aside></div>
  </section>;
}
