# Public content schema

`src/content/events.json` is parsed at build time by Zod in `src/content/schema.ts`. The `ContentRepository` interface in `src/content/repository.ts` isolates route components from the JSON backend so reviewed files can later be supplied by a static CMS workflow.

Each event record contains:

- stable `id` and `slug`;
- `sourcePageIds`, canonical localized city, original `sourceCityLabel`, country and ISO country code;
- `dateOriginal`, ISO partial date and `datePrecision` (`day`, `month`, `year`, `unknown`);
- the historical memorial angel count printed on the slide;
- bilingual title and concise placeholder description, both with explicit `needs_review` status;
- editorial flags, private archive reference, coordinates (currently `null`), media references (currently empty), and a safe-publication status.

The original English descriptions and full page-level raw text stay in the ignored private source archive. They contain unreviewed personal names and page 41 contacts; they are intentionally not copied into public JSON. `sourcePageIds` and the `archive-page:NN` key connect an event to its private page record without exposing a filesystem path.

## Validation rules

- The public catalog contains exactly 33 records and pages 5–37 exactly once.
- Repeated occurrences in one canonical city are separate events.
- There are 25 canonical cities and 8 ISO-coded countries.
- Month-precision dates remain `YYYY-MM`, with the printed `MM.YYYY` preserved in `dateOriginal`.
- Coordinates and public media remain `null`/empty until verified or approved.
- The public `memorialAngelCount` is always described as a historical source-slide figure, not a current casualty statistic.

Organizer requests are runtime submission data only. They have a Zod input schema and are never checked into content JSON or site assets.
