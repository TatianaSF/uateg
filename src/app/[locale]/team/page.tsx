import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { MediaGallery, pagePlacements } from "@/components/MediaGallery";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return { title: locale === "en" ? "People behind the initiative" : "Люди, які створили ініціативу", alternates: { canonical: `/${locale}/team/`, languages: { en: "/en/team/", uk: "/uk/team/" } } };
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "People behind the initiative · source page 40" : "Люди, які створили ініціативу · сторінка джерела 40"}</p><h1>{locale === "en" ? "Made possible by many hands." : "Створено руками багатьох людей."}</h1><p className="lead">{locale === "en" ? "The source names the initiative’s originators and coordinator. Publication here is authorized by the project owner; independent third-party consent and image-rights verification are not claimed." : "У джерелі вказані авторка ідеї та координаторка ініціативи. Публікацію на сайті дозволив власник проєкту; незалежна перевірка згоди третіх осіб і прав на зображення не заявляється."}</p></header>
    <MediaGallery placements={pagePlacements(40)} locale={locale} label={locale === "en" ? "Founders in the source archive" : "Авторки в архівному джерелі"} />
    <div className="team-placeholder"><div><p className="eyebrow">{locale === "en" ? "Source page 40" : "Сторінка джерела 40"}</p><h2>Nataliia Mitso</h2><p>{locale === "en" ? "Author of the idea of visualization of Ukrainian angel-children." : "Авторка ідеї візуалізації українських янголят-дітей."}</p></div><div><h2>Svitlana Peshterianu</h2><p>{locale === "en" ? "Coordinator and co-author." : "Координаторка та співавторка."}</p></div></div>
  </section>;
}
