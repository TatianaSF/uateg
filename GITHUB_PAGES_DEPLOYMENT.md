# GitHub Pages deployment — `uaTeg.com`

## Current state

The project workspace did not contain a Git repository when this review began. A local `main` branch and initial commit are now prepared; no GitHub remote repository has been created, no changes pushed, and no site deployed. GitHub Pages on GitHub Free requires a public repository. Review the sanitized public files and permissions before choosing one.

The app uses Next.js `output: "export"`, `trailingSlash: true`, and writes static files to `out/`. `next build` creates the HTML routes; it does not need a Node.js server at runtime. GitHub Actions publication does not require a `CNAME` file in the artifact when the custom domain is set in Pages settings.

## Workflow

`.github/workflows/deploy-pages.yml` is manual-only (`workflow_dispatch`) and its deployment job runs only from `main`. It has no `push`, `pull_request` or schedule trigger. For stronger two-person release control, configure required reviewers on the `github-pages` environment in repository settings before enabling Pages. To publish after reviewing the repository and public content:

1. Add the completed project to the owner-selected **public** GitHub repository. Do not add `/source-private/` or any source archive.
2. In `Repository > Settings > Pages > Build and deployment`, set `Source: GitHub Actions`.
3. Review `.github/workflows/deploy-pages.yml` permissions and run the workflow manually from the approved branch.
4. Check the uploaded site, route set, privacy scan and artifact size before entering the domain.
5. In `Repository > Settings > Pages > Custom domain`, enter `uaTeg.com`. Enable `Enforce HTTPS` after the certificate is available.

### Connect an approved empty public repository later

First create an **empty** public repository under the selected GitHub owner. Do not initialize it with a README, license or `.gitignore`. Then, from this local project after review:

```powershell
git remote add origin https://github.com/OWNER/REPOSITORY.git
git remote -v
git push -u origin main
```

Replace both placeholders with the selected owner and repository. These commands are instructions only; no remote has been configured and no push has been performed.

## DNS preparation (do not apply without first inspecting current DNS)

Before changes, inventory A/AAAA/CNAME/ALIAS/ANAME, MX, TXT and wildcard records at the existing provider. Preserve all mail and verification records; do not replace wildcard records or unrelated service routes.

For the apex host `@`, GitHub Pages documents these A records:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

Optional AAAA records should be taken from the current official GitHub Pages documentation at setup time. For `www`, use a CNAME to the real repository owner’s `OWNER.github.io` hostname; owner is unknown in this workspace and must not be guessed. GitHub domain verification may use a TXT record created from the actual Pages account’s verification flow.

Inspect records before any change:

```powershell
Resolve-DnsName uaTeg.com -Type A
Resolve-DnsName uaTeg.com -Type AAAA
Resolve-DnsName uaTeg.com -Type MX
Resolve-DnsName uaTeg.com -Type TXT
Resolve-DnsName www.uaTeg.com -Type CNAME
```

No DNS or GitHub settings were touched for this implementation.

## Pre-publication checklist

- [ ] Repository owner/name and public-repository decision are confirmed.
- [ ] Rights/consent and editorial reviews in `EDITORIAL_REVIEW.md` are complete or explicitly approved as pending public-safe placeholders.
- [ ] `npm ci`, typecheck, lint, tests, static build and `check_public.py` pass from a clean checkout that has no private source folder.
- [ ] `out/` contains `/`, `/en/`, `/uk/`, both locale route sets for all 33 events, `/404.html`, sitemap, robots and `.nojekyll`.
- [ ] Artifact is below the 1 GB published-site limit and contains no source documents, raw inventory, email or phone details.
- [ ] GitHub Pages source is Actions, custom domain is set, DNS is reviewed, HTTPS certificate is ready, and HTTPS enforcement is enabled.
- [ ] The approved form channel is configured or the form remains honestly disabled.

## Known limits

GitHub Pages does not run Next.js API routes, Server Actions, server-side form validation, rate limits or configurable HTTP security headers. The organizer form stays unconfigured until an external provider is selected and reviewed. The map lists all source cities but has no points until coordinates are verified. No live site is claimed.
