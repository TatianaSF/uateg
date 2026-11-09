# Angels of Ukraine

A bilingual, mobile-first historical archive and organizer guide. The current published build targets `https://tatianasf.github.io/uateg/`; root-domain migration to `https://uateg.com/` is prepared. GitHub account domain verification and apex DNS setup are complete; repository Pages configuration, deployment, and certificate verification remain. See `DOMAIN_MIGRATION.md`.

## Local development

Requirements: Node.js 20.9+ (Node 24 is used in CI), npm, and Python 3.11+.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000/`. The root is the English homepage; `/en/` and `/uk/` provide the dedicated language routes.

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

The deployment workflow remains manual-only. It builds for the apex domain with an empty `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL=https://uateg.com`, and safely stops before build/deploy until GitHub reports `uateg.com` as the repository custom domain and the protected domain state as `verified`. The account-level domain verification and Cloudflare DNS preflight are complete; configure the repository Pages custom domain only after the root-domain export passes. See `DOMAIN_MIGRATION.md` for the live preflight and rollback reference.
