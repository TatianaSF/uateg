import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { ReviewNotice } from "@/components/ReviewNotice";

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
    <header className="page-heading"><p className="eyebrow">{locale === "en" ? "People and permissions" : "Люди та дозволи"}</p><h1>{locale === "en" ? "Made possible by many hands." : "Створено руками багатьох людей."}</h1><p className="lead">{locale === "en" ? "The original source includes the names and roles of the initiative’s originators. Their names and portraits will be added only after publication approval." : "У першоджерелі наведено імена та ролі авторок ініціативи. Імена й портрети буде додано лише після погодження публікації."}</p></header>
    <div className="team-placeholder"><div className="team-placeholder-mark" aria-hidden="true">✳</div><div><p className="eyebrow">{locale === "en" ? "Source page 40" : "Сторінка джерела 40"}</p><h2>{locale === "en" ? "Originators and coordination" : "Авторки та координація"}</h2><p>{locale === "en" ? "Roles are preserved in the private source archive. Public profiles are awaiting individual consent." : "Ролі збережено у приватному архіві джерела. Публічні профілі очікують на індивідуальну згоду."}</p></div></div>
    <ReviewNotice locale={locale}>{locale === "en" ? "Profile publication approval is pending." : "Очікується дозвіл на публікацію профілів."}</ReviewNotice>
  </section>;
}
