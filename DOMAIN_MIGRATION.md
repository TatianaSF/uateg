# uaTeg.com migration status

Audit date: 2026-11-09 (Europe/Budapest)

## Current published state

- Repository: `TatianaSF/uateg`, branch `main`, GitHub Actions workflow deployment.
- Last verified published commit: `ba813d0d86ac37693e83beec25512058f3653f67`.
- Current Pages URL: `https://tatianasf.github.io/uateg/`.
- Repository Pages API currently reports `cname: null`, `https_enforced: true`, and no certificate or protected-domain state. The HTTPS flag currently applies to the GitHub Pages URL; it does not establish an HTTPS certificate for `uateg.com`.
- Current deployment builds with `NEXT_PUBLIC_BASE_PATH=/uateg` and `NEXT_PUBLIC_SITE_URL=https://tatianasf.github.io`.

## DNS preflight

- Registrar and authoritative DNS: Cloudflare, with `ed.ns.cloudflare.com` and `janet.ns.cloudflare.com`.
- The Cloudflare zone is active and was readable through the configured API token.
- Apex A records already match GitHub's four documented Pages addresses: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
- Four official GitHub Pages AAAA records were added after the initial inventory: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, and `2606:50c0:8003::153`. They are DNS-only. No apex CAA, `www`, or wildcard record was found.
- Existing mail/authentication records were preserved: three Cloudflare MX records, apex SPF TXT, `_dmarc` TXT, and `cf2024-1._domainkey` TXT.
- The only DNS changes were those four AAAA records and GitHub's exact domain verification TXT at `_github-pages-challenge-TatianaSF.uateg.com`. GitHub confirmed `Successfully verified uateg.com`; the verification TXT must be retained. MX, SPF, DKIM, DMARC, and the four existing A records were preserved. The initial full backup is at `source-private/domain-migration/dns-inventory-2026-11-09.json`; the current 15-record snapshot is at `source-private/domain-migration/dns-inventory-after-additions-2026-11-09.json`. Both are git-ignored.
- All 43 repositories visible to the `TatianaSF` account were checked for a Pages custom domain and `CNAME` file; no other account-owned repository matched `uateg.com`. GitHub global code search was not available to the current token, so this is not a global GitHub search.

## Ownership and HTTPS status

- GitHub account-level Pages domain verification succeeded on 2026-11-09. The exact challenge was read from GitHub and added through the authorized Cloudflare account; the challenge value is intentionally kept out of tracked files.
- The repository Pages API currently returns no custom domain (`cname: null`).
- `https://uateg.com/` previously failed TLS negotiation. Certificate issuance and HTTPS redirects remain **NOT VERIFIED**.
- DNS currently resolves directly to GitHub Pages; Cloudflare proxying is disabled for the inspected records.

## Prepared source configuration

- The app keeps Next.js static export and trailing slashes; the deployment workflow is being prepared for an empty base path and `https://uateg.com`.
- The workflow remains `workflow_dispatch` only. It must stop unless GitHub reports `uateg.com` as the repository domain and the protected domain state as `verified`.
- No `public/CNAME` file is required for this GitHub Actions Pages workflow; the custom domain belongs in repository Pages settings.
- DNS A/AAAA records now match GitHub's published apex configuration. `www` is intentionally not configured.

## Rollback reference

The current live build and its source configuration are preserved by commit `ba813d0d86ac37693e83beec25512058f3653f67`. To restore the project-site build after a later migration commit, revert that migration commit, clear the repository Custom domain setting, then manually run the Pages workflow and verify `https://tatianasf.github.io/uateg/`. Do not remove or replace the saved MX, SPF, DMARC, DKIM, or GitHub Pages A records as part of rollback.

## Remaining sequence

1. Run and validate the root-domain build, then commit/push the prepared changes.
2. Set `uateg.com` as the repository's Pages Custom domain and confirm the API reports the domain and verified protected-domain state.
3. Manually dispatch the guarded workflow and verify its build and deploy jobs.
4. Wait for the GitHub Pages certificate, enable HTTPS enforcement when GitHub permits it, and test redirects and all production routes.

Official references: [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).
