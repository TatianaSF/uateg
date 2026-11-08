import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoArchive } from "@/components/PhotoArchive";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return {
    title: locale === "en" ? "Photo archive" : "Фотоархів",
    description: locale === "en" ? "Browse photographs and source graphics from the Angels of Ukraine historical archive." : "Переглядайте фотографії та графічні матеріали з історичного архіву «Янголи України»." ,
    alternates: { canonical: absoluteUrl(`/${locale}/gallery/`), languages: { en: absoluteUrl("/en/gallery/"), uk: absoluteUrl("/uk/gallery/") } },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section gallery-page">
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "The source archive · 41 pages" : "Архів першоджерела · 41 сторінка"}</p><h1>{locale === "en" ? "Photographs & source materials" : "Фотографії та матеріали джерела"}</h1><p className="lead">{locale === "en" ? "Browse 71 photographs and 12 graphics, with links back to their original PDF pages and related events." : "Перегляньте 71 фотографію та 12 графічних матеріалів із посиланнями на сторінки PDF та пов’язані події."}</p><p className="source-ref">{locale === "en" ? "Source images are reproduced from the project archive; their original context and page references are preserved." : "Зображення відтворено з архіву проєкту зі збереженням контексту та посилань на сторінки."}</p></header>
    <PhotoArchive locale={locale} />
  </section>;
}
