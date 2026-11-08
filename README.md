# Angels of Ukraine

A bilingual, mobile-first historical archive and organizer guide. The first deployment targets `https://tatianasf.github.io/uateg/` using the GitHub Pages project-site path. The future `uaTeg.com` root domain is not configured yet.

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

`npm run build` runs the Next.js static export and checks the exact authorized original PDF, source-derived image allowlist, archive coverage, localized routes and likely unrelated contact data. `npm run source:migrate` and `python scripts/prepare_public_archive.py` are local source preparation steps requiring files under ignored `source-private/`.

To install the private-source migration tools on a machine with access to the local source files, run `python -m pip install -r requirements-source.txt`.

## Routes

- `/en/`, `/uk/` — home and documented source summary.
- `/{locale}/about/`, `events/`, `events/{slug}/`, `map/`, `timeline/`, `team/`, `organize/`, `contact/`, `privacy/`.
- `/404.html`, `/sitemap.xml`, `/robots.txt` are generated as part of the export.

## Content safety

The public event catalog is in `src/content/events.json`; the deduplicated image catalog and occurrence links are in `src/content/media.json`. The unchanged source PDF and 83 source-derived WebP images are public under `public/`. The 126 image placements map to 41 PDF pages. Temporary contact sheets, page previews, raw inventories and extracted originals remain in ignored `source-private/`. The project owner explicitly authorized publishing historical photos, names and contact data; this does not claim independent third-party consent or rights verification. See `MEDIA_COVERAGE.md`, `SOURCE_COVERAGE.md`, `CITY_COORDINATES.md` and `EDITORIAL_REVIEW.md`.

No organizer form provider is configured, so the guide shows `FORM_NOT_CONFIGURED` and does not claim to send inquiries. Source-listed contact methods are displayed on the Contact page under the project owner's publication authorization.

## Deployment

The manual-only workflow builds with `NEXT_PUBLIC_BASE_PATH=/uateg` and `NEXT_PUBLIC_SITE_URL=https://tatianasf.github.io`. For the future custom domain, use an empty base path and `NEXT_PUBLIC_SITE_URL=https://uaTeg.com`; no DNS or custom-domain configuration is part of this release.
