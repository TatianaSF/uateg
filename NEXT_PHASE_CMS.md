# Phase 2: CMS plan

Keep GitHub Pages and the public site static. A later editorial interface should write reviewed, version-controlled JSON or Markdown, then trigger a new GitHub Actions static build. Do not introduce runtime APIs, a database or a server into this phase.

## Suggested sequence

1. Decide authenticated editor roles and a separate approval role; require multi-factor authentication where the selected platform supports it.
2. Model drafts, reviews, published snapshots and immutable source-page citations. Preserve `sourcePageIds`, original spelling/date precision and a complete change log.
3. Add field-level safeguards for historical counts, conflicts and translations. Require an editor to resolve or explicitly accept `EDITORIAL_REVIEW.md` flags.
4. Build an asset intake flow with consent evidence, rights metadata, restricted originals and safe derivatives. Keep child-related image consent private; publish only after affirmative approval.
5. Store form submissions in the approved provider or a separately assessed private service; set retention and deletion procedures. Never write personal inquiries to Git history or Issues.
6. Keep the current `ContentRepository` interface as the presentation boundary. CMS changes generate static-safe content artifacts; previews and route validation run before merge.
7. Review backups, access logs, vendor data processing terms, incident handling and public-repository publishing risks before selecting a CMS.

No CMS, authenticated editing, database or submission backend is included in version 1.
