# GitHub Pages deployment

## Current release

- Repository: `https://github.com/TatianaSF/uateg` (public, branch `main`).
- Live project site: `https://tatianasf.github.io/uateg/`.
- GitHub Pages source is GitHub Actions. Deployment workflow: `.github/workflows/deploy-pages.yml`.
- The workflow runs only by manual `workflow_dispatch`; deployment is limited to `main`.
- Build settings: `NEXT_PUBLIC_BASE_PATH=/uateg`, `NEXT_PUBLIC_SITE_URL=https://tatianasf.github.io`.
- `uaTeg.com` is not set in Pages, there is no CNAME file, and no DNS was changed.

The app uses Next.js static export (`output: "export"`) and trailing slashes. It has no runtime server/API. The organizer inquiry is disabled until an external provider and its privacy/retention behavior are reviewed.

## Repeat the Pages release

From the GitHub repository, choose **Actions → Build and deploy GitHub Pages → Run workflow → main**. The workflow runs `npm ci`, typecheck, lint, tests, audit, static export and public archive checks before uploading `out/` and deploying.

CLI equivalent:

```powershell
gh workflow run deploy-pages.yml --repo TatianaSF/uateg --ref main
gh run list --repo TatianaSF/uateg --workflow deploy-pages.yml --limit 1
gh run watch RUN_ID --repo TatianaSF/uateg --exit-status
```

## Later connect `uaTeg.com`

Do not use the project-site `/uateg` build settings with the root custom domain. When the domain change is approved:

1. Review all current DNS records (including MX, TXT, wildcard and service records) at the DNS provider.
2. In `TatianaSF/uateg → Settings → Pages`, set the custom domain to `uaTeg.com` and follow GitHub's domain-verification flow.
3. Change the build environment to an empty `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL=https://uaTeg.com`; rerun all checks and manually deploy.
4. Add only the DNS records shown in the then-current official GitHub instructions. Verify records and HTTPS before enabling enforcement.

No custom domain or DNS change has been made as part of this release. See [GitHub's current custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) when carrying out that separate change.
