# GitHub Pages release and QA report

**Deployment: SUCCESS.** First public release is available at `https://tatianasf.github.io/uateg/`.

## Release record

- Public repository: `https://github.com/TatianaSF/uateg` (`main`).
- Deployed commit: `dfc75a5b605de70ea243b4c29de8bc7ace019abd`.
- Workflow run: `42523993421` — build and deploy jobs completed successfully.
- Pages publishing source: GitHub Actions; workflow is `workflow_dispatch` only and deployment is restricted to `main`.
- Export size: **75,468,058 bytes**. Repository Git objects before transfer: **63.57 MiB**.
- Original PDF: public and byte-identical to the source, **55,077,592 bytes**. GitHub accepted the push with its documented >50 MiB warning; file remains below the 100 MiB hard block.
- Public catalog: 33 events, 25 canonical cities, 8 countries, English and Ukrainian, 83 unique WebP assets and all 126 placements across 41 PDF pages.

## Validation results

- `npm ci`: **PASS**, 354 packages installed, 0 reported vulnerabilities. npm warned that `esbuild` install scripts are not approved by its current allow-scripts configuration; Next build and CI build both completed successfully.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS**, no warnings or errors.
- `npm test`: **PASS**, 17 passed, 0 failed.
- `npm run build` with `/uateg` path and GitHub Pages origin: **PASS**; 90 static pages generated.
- Public data scan: **PASS**; only the exact owner-authorized PDF, source WebPs and contacts are allowed; no private source folder or unrelated contact details found.
- Media coverage: **PASS**, 83/83 assets, 126/126 placements, all 41 source pages and source PDF SHA-256 verified.
- Export route/link checks: **PASS**, 82 localized non-home routes including 66 event pages, locale homes, root, 404, sitemap, robots and `.nojekyll`.
- Local HTTP preview: **PASS**, 82/82 checked pages and PDF route returned 200.
- Live HTTPS: **PASS**, 169/169 checks returned 200: 85 routes, 83 image files and source PDF HEAD. This verifies reachability, not visual layout.

## Visual review not verified

No public-site screenshots, viewport inspection at 320/390/768/1440 px, Lighthouse report, keyboard review or interactive map/language-switch browser test were captured. The user-selected exact Chrome profile `TatianaSF.com` was not connected; the available profile label `TatianaSFcom` did not match and was not used. Direct HTTP verification is not a substitute for browser QA.

## Historical/editorial notes

- Source discrepancies remain visible and documented: p13 event-date/content mismatch; p8/p9 figures 591/593; source city spellings and month-only dates. Ukrainian translation needs editorial proofreading.
- Source photographs, profiles and contacts were published under the project owner's explicit authorization. This does not claim independent third-party consent, copyright review, current contact verification or QR destination verification.
- Organizer form stays disabled; it does not simulate a successful submission. The contact page provides the source-listed method.
- Map points are approximate city locations from cited GeoNames records, not event venues; city index remains available if map tiles fail.
- No `uaTeg.com` custom domain, DNS records or CNAME were configured.

## Next steps

1. Connect the exact `TatianaSF.com` Chrome profile and review the published site at the four target viewport widths; capture screenshots and verify map interaction, language switching and keyboard access.
2. Proofread the Ukrainian translations and decide how to annotate the documented source discrepancies.
3. When ready for the future root domain, configure `uaTeg.com` in repository Pages settings, review existing DNS first, then add only the GitHub Pages records required by the official domain guide. Switch build configuration to an empty `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL=https://uaTeg.com`; do not add a `CNAME` for the current project-site release.
