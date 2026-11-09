import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { validLocale } from "@/lib/i18n";
import { ContactOptions } from "@/components/ContactOptions";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!validLocale(locale)) return {};
  return createPageMetadata({
    locale,
    path: "/" + locale + "/contact/",
    title: locale === "en" ? "Contact Angels of Ukraine" : "Контакти «Янголи України»",
    description: locale === "en"
      ? "Contact the Angels of Ukraine project by email, phone call or SMS. Historical contact details are identified as such."
      : "Зв’яжіться з проєктом «Янголи України» електронною поштою, телефоном або SMS. Історичні контакти позначено відповідно.",
    keywords: locale === "en" ? ["contact Angels of Ukraine", "organize memorial event"] : ["контакти Янголи України", "організувати меморіальну акцію"],
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!validLocale(value)) notFound();
  const locale = value as Locale;
  return <section className="content-section narrow-page">
    <header className="page-heading">
      <p className="eyebrow">{locale === "en" ? "Contact · source page 41" : "Зв’язок · сторінка джерела 41"}</p>
      <h1>{locale === "en" ? "A respectful way to reach out." : "Зв’яжіться з нами з повагою."}</h1>
      <p className="lead">{locale === "en" ? "Choose email, a phone call or SMS. The contact details below come from the historical source; their current status has not been independently reconfirmed." : "Оберіть електронну пошту, телефонний дзвінок або SMS. Дані нижче наведено з історичного джерела; їхню актуальність незалежно не підтверджено."}</p>
    </header>
    <ContactOptions locale={locale} />
  </section>;
}
