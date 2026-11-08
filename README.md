# Angels of Ukraine

A bilingual, mobile-first historical archive and organizer guide built for a static GitHub Pages deployment at `uaTeg.com`.

## Local development

Requirements: Node.js 20.9+ (Node 24 is used in CI), npm, and Python 3.11+.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000/`. The root is a language-choice page. The site routes are `/en/` and `/uk/`.

After `npm run build`, preview the static export in a second terminal:

```powershell
python -m http.server 8765 --directory out
```

Visit `http://127.0.0.1:8765/`, `/en/` or `/uk/`. For visual review, check 320, 390, 768 and 1440 CSS pixel widths. Keep screenshots in a review-only folder and check them before release.

## Validation

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` runs the Next.js static export and then scans `out/` for private filenames, likely email addresses and phone numbers. `npm run source:migrate` is a local-only migration step and requires the ignored `source-private/` source files plus PyMuPDF and Pillow.

To install the private-source migration tools on a machine with access to the local source files, run `python -m pip install -r requirements-source.txt`.

## Routes

- `/en/`, `/uk/` — home and documented source summary.
- `/{locale}/about/`, `events/`, `events/{slug}/`, `map/`, `timeline/`, `team/`, `organize/`, `contact/`, `privacy/`.
- `/404.html`, `/sitemap.xml`, `/robots.txt` are generated as part of the export.

## Content safety

Public content is a reduced, reviewed-safe projection in `src/content/events.json`. Raw source text, original PDF, page previews and extracted media belong only in `/source-private/`, which is excluded by `.gitignore`. Public photographs and people/contact details remain unpublished pending explicit review. A private contact sheet and per-image manifest are under ignored `/source-private/media-review/`. `scripts/approved_public_media.txt` permits only Leaflet's UI icon files; new raster assets require an explicit reviewed-output path. Current public text is marked for editorial or translation review. See `SOURCE_COVERAGE.md`, `CITY_COORDINATES.md` and `EDITORIAL_REVIEW.md`.

No organizer form provider or public contact channel is approved for this release, so the guide shows `FORM_NOT_CONFIGURED` and does not claim to send inquiries.

## Deployment

See [`GITHUB_PAGES_DEPLOYMENT.md`](GITHUB_PAGES_DEPLOYMENT.md). The export writes to `out/`; no live deployment, DNS change or GitHub repository has been performed from this workspace.
