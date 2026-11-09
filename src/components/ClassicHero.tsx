import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/content/schema";
import { CLASSIC_ARCHIVE_TOTALS, getClassicHeroCards, type ClassicHeroCardKey } from "@/lib/classic-hero";
import { sitePath } from "@/lib/site";

const cardIcons: Record<ClassicHeroCardKey, ReactNode> = {
  archive: <><path d="M3 5.5c3.8-1.5 7-.9 9 1.2v14c-2-2.1-5.2-2.7-9-1.2z" /><path d="M21 5.5c-3.8-1.5-7-.9-9 1.2v14c2-2.1 5.2-2.7 9-1.2z" /></>,
  timeline: <><path d="M5 17 12 7l7 10" /><circle cx="5" cy="17" r="2.2" /><circle cx="12" cy="7" r="2.2" /><circle cx="19" cy="17" r="2.2" /></>,
  map: <><path d="M20 10c0 5.1-8 11-8 11S4 15.1 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" /></>,
  organize: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1.5A5.5 5.5 0 0 1 8.5 13h1A5.5 5.5 0 0 1 15 18.5V20" /><path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a4.8 4.8 0 0 1 4 4.7V20" /></>,
};

const heroCopy = {
  en: {
    label: "A PUBLIC MEMORIAL PROJECT",
    headingFirst: "Remembering,",
    headingSecond: "together.",
    description: "A travelling memorial installation to honour Ukrainian children whose lives were taken by war.",
    statsLabel: "Historical archive coverage",
    statNames: ["events", "cities", "countries"],
    navigationLabel: "Explore the archive",
    artAlt: "Symbolic AI-created scene, not an archival photograph: a girl seen from behind in a Ukrainian flag, a crocheted memorial angel, flowering branches and a cathedral.",
  },
  uk: {
    label: "ПУБЛІЧНИЙ МЕМОРІАЛЬНИЙ ПРОЄКТ",
    headingFirst: "Пам’ятаємо",
    headingSecond: "разом.",
    description: "Мандрівна меморіальна інсталяція на вшанування українських дітей, чиї життя забрала війна.",
    statsLabel: "Охоплення історичного архіву",
    statNames: ["акцій", "міст", "країн"],
    navigationLabel: "Переглянути архів",
    artAlt: "Символічна сцена, створена ШІ, а не архівна світлина: дівчинка зі спини в українському прапорі, в’язаний меморіальний янгол, квітучі гілки та собор.",
  },
} satisfies Record<Locale, {
  label: string;
  headingFirst: string;
  headingSecond: string;
  description: string;
  statsLabel: string;
  statNames: string[];
  navigationLabel: string;
  artAlt: string;
}>;

export function ClassicHero({ locale }: { locale: Locale }) {
  const copy = heroCopy[locale];
  const cards = getClassicHeroCards(locale);

  return <section className="classic-hero" aria-labelledby="classic-hero-title">
    <figure className="classic-hero-art">
      <picture>
        <source media="(max-width: 600px)" srcSet={sitePath("images/hero/classic-hero-mobile.webp")} />
        <img src={sitePath("images/hero/classic-hero-wide.webp")} width="1600" height="900" alt={copy.artAlt} fetchPriority="high" />
      </picture>
    </figure>
    <div className="classic-hero-shade" aria-hidden="true" />
    <div className="classic-hero-body">
      <div className="classic-hero-copy">
        <p className="classic-hero-label">{copy.label}</p>
        <h1 id="classic-hero-title"><span>{copy.headingFirst}</span><span>{copy.headingSecond}</span></h1>
        <p className="classic-hero-description">{copy.description}</p>
      </div>
      <div className="classic-hero-stats" role="group" aria-label={copy.statsLabel}>
        {CLASSIC_ARCHIVE_TOTALS.map((stat, index) => <div className="classic-hero-stat" key={stat.key}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {index === 0 && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>}
            {index === 1 && <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
            {index === 2 && <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M5.5 6.5h13M5.5 17.5h13" /></>}
          </svg>
          <span className="classic-hero-stat-value">{stat.value}</span>
          <span className="classic-hero-stat-name">{copy.statNames[index]}</span>
        </div>)}
      </div>
      <nav className="classic-hero-cards" aria-label={copy.navigationLabel}>
        {cards.map((card) => <Link prefetch={false} className={`classic-hero-card${card.key === "organize" ? " classic-hero-card-organize" : ""}`} href={card.href} key={card.key}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{cardIcons[card.key]}</svg>
          <span className="classic-hero-card-title">{card.title}</span>
          <span className="classic-hero-card-description">{card.description}</span>
          {card.key === "organize" && <span className="classic-hero-card-arrow" aria-hidden="true">→</span>}
        </Link>)}
      </nav>
    </div>
  </section>;
}
