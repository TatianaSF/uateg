# uaTeg.com migration status

Audit date: 2026-11-09 (Europe/Budapest)

## Live status

- Repository: `TatianaSF/uateg`, branch `main`, Pages published from GitHub Actions.
- Custom domain: `uateg.com`; account-level protected-domain state: `verified`.
- HTTPS certificate: `approved` for `uateg.com`; HTTPS enforcement: enabled.
- Live URL: `https://uateg.com/`.
- Current root-domain migration commit: `a9ee4c0c791a62b34f567f08af91f6e54ab894be` (a small accessibility/mobile navigation fix is being validated for the next manual deployment).
- Workflow: [GitHub Pages deployment](https://github.com/TatianaSF/uateg/actions/workflows/deploy-pages.yml), manual dispatch only and gated on the verified custom domain.

## DNS records

- Authoritative DNS: Cloudflare (`ed.ns.cloudflare.com`, `janet.ns.cloudflare.com`); Cloudflare proxying is disabled for Pages records.
- Four apex A records retained: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- Four apex AAAA records retained: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- GitHub account verification TXT retained at `_github-pages-challenge-TatianaSF.uateg.com`.
- Added `www` CNAME to `TatianaSF.github.io` (DNS-only) after confirming no pre-existing `www` record. GitHub recommends this alongside an apex custom domain and documents automatic redirects to the configured canonical domain.
- Existing three MX records, SPF, DKIM (`cf2024-1._domainkey`), DMARC, and all four apex A records were preserved.
- The private source inventory is saved at `source-private/domain-migration/dns-inventory-final-2026-11-09.json`; initial and intermediate inventories are also retained in that git-ignored directory.
- Domain verification challenge value is intentionally not copied into tracked files.

## Deployment and validation

- Root-domain Next.js export uses an empty `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL=https://uateg.com`.
- Last verified domain migration deployment: run `42590921837`, commit `a9ee4c0c791a62b34f567f08af91f6e54ab894be`; build and deploy jobs passed.
- All 89 static HTML routes and five extra endpoints (English/Ukrainian roots, sitemap, robots, source PDF) were requested from the live domain: 94 checked, no failures. The PDF returned `200` for HEAD; it remains the previously approved public archive asset.
- `http://uateg.com/` and `https://tatianasf.github.io/uateg/` both returned `301` to `https://uateg.com/` after HTTPS enforcement.
- `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (17/17), `npm audit --audit-level=moderate` (0 vulnerabilities), and `npm run build` passed on 2026-11-09. Static export checks confirmed 83 media assets, 126 placements across all 41 source pages, all 33 events illustrated, 84 localized non-home routes, and local links resolving.
- Lighthouse live mobile run: Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100; one accessibility audit failed because event cards overrode their full visible label. That defect is fixed in the pending deployment. Lighthouse did not report a performance score.

## Current QA changes

- The latest screenshots revealed the final navigation item was partially clipped at 320px. Mobile navigation now wraps instead of horizontally clipping.
- Event-card `aria-label` overrides were removed so accessible names include all visible card text.
- The above changes passed typecheck, lint, all 17 tests, dependency audit, static build/export checks. A new manual Pages workflow run is required to publish these changes; it has not yet been dispatched.
- Browser screenshot outputs were shown in the QA session, but Chrome MCP denied saving screenshot files because its filesystem allowlist does not include the repository path.

## Rollback

The prior working root-domain code is preserved at commit `a9ee4c0c791a62b34f567f08af91f6e54ab894be`. To roll back a later frontend change, revert only that change, run the manual deployment workflow, and verify the custom domain. To revert the domain migration itself, clear the repository Custom domain, restore the prior `/uateg` build configuration, deploy manually, and verify `https://tatianasf.github.io/uateg/`. Do not remove MX, SPF, DKIM, DMARC, apex A/AAAA, or the GitHub ownership TXT during rollback.

Official references: [GitHub custom domain and www DNS guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-your-custom-domain-for-your-github-pages-site), [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).
