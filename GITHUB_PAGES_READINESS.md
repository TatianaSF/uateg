# GitHub Pages readiness review

**Status: NO-GO for public release today.** The static site builds and the local route checks pass, but editorial approvals are incomplete and no browser screenshots were captured in this review.

## Verified locally

- Next.js static export (`output: "export"`, trailing slash routes) completed successfully.
- Public artifact: `out/`, **6,985,279 bytes**; source/private file and contact-detail scan passed.
- Export check passed: 82 localized non-home routes, 66 localized event pages, locale homes, root, `404.html`, `sitemap.xml`, `robots.txt` and `.nojekyll`; local links resolved.
- HTTP preview returned 200 for all 88 checked routes; English/Ukrainian language, map notice and disabled organizer channel were checked in the generated HTML.
- Catalog integrity: 33 events, 25 canonical cities and 8 countries. City points are approximate GeoNames populated-place points, not event venues; source citations and OSM tile attribution appear on the map.
- `npm ci`: passed, 0 reported vulnerabilities. npm emitted ESLint peer-range warnings and an `esbuild` install-script approval notice.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: **17 passed, 0 failed**.
- `npm run build`: passed, including the static-export, private-data and route-link checks.
- The deployment workflow is `workflow_dispatch` only and deploys only from `main`; no push, PR or schedule trigger. Add required reviewers to the `github-pages` environment after repository creation if a second-person release gate is desired.

## Not verified in a browser

At the user's direction, no browser screenshots were captured. Desktop/mobile visual review at 320, 390, 768 and 1440 px, interactive language-switch testing, keyboard/screen-reader inspection and Lighthouse were not performed. HTTP and static-export checks do not substitute for those checks.

## Release blockers

- Review translation/editorial copy and source inconsistencies in `EDITORIAL_REVIEW.md`.
- Review candidate images privately; there are **0** approved public photographs. Per-image rights, adult consent, minor safeguarding, privacy/context, event linkage and bilingual alt text remain required.
- Approve the approximate city coordinate list and GeoNames attribution.
- Select and review an organizer form provider and public contact channel; the form is intentionally disabled.
- Select the public repository owner/name, public-repository decision and repository settings.
- Complete browser-based visual/accessibility review and screenshots before publication.
- Review `uaTeg.com` DNS and GitHub Pages domain verification separately; no DNS or Pages settings were changed.

## Local repository state

This folder was initialized locally on branch `main` with an initial commit after staging and ignore/security checks. It has no remote configured. No push or deployment was performed. Private source data, PDFs, build output, dependencies and environment secrets are ignored.

## Next publishing steps

1. Finish the release blockers above and review all staged/public files.
2. Create an empty **public** GitHub repository under the selected owner; do not initialize it with a README, license or `.gitignore`.
3. Add the remote and push only when separately authorized:

   ```powershell
   git remote add origin https://github.com/OWNER/REPOSITORY.git
   git remote -v
   git push -u origin main
   ```

4. Configure a required reviewer for the `github-pages` environment, then set Pages source to GitHub Actions and run `deploy-pages.yml` manually from `main` only after publication is approved.
5. Verify the site and custom-domain prerequisites before entering `uaTeg.com` in Pages settings. DNS stays unchanged until a separately reviewed plan exists.
