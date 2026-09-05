---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/CommitteesPage.jsx"
target_fingerprint: "sha256:efeba34530d1ad7fb74195bc5fdaae7b335c8f842f35c74fbc70008c97fb1a0b"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/CommitteesPage.jsx
timestamp: 2026-09-02T13-35-15Z
slug: lmsa-website-src-pages-public-committeespage-jsx
---
# Critique — Committees page (lmsa-website/src/pages/public/CommitteesPage.jsx)
Run: 2026-09-02 · Mode: Read · ⚠️ DEGRADED: single-context (no sub-agent tool in this session)

## Provenance
- Assessment A: inline design review (source + cross-referenced against CommitteePageTemplate registry, docs/LMSA STANDING COMMITTEES spec, DB schema), completed before detector output
- Assessment B: detect.mjs CLI — 0 findings on both files (exit 0); browser overlay skipped (no browser automation)
- Ignore list: none

## Design-specificity verdict
Visually the page is the strongest editorial composition in the section (split header, stat band, numbered link-card grid). But the content is fiction: the twelve committees it names are not LMSA's twelve constitutional standing committees, and every number on the page is invented.

## Heuristic scores (0–4)
1. Visibility of system status: 2
2. Match with real world: 0 — the core content (the committees themselves) contradicts the organization's constitution as encoded in the detail template's registry and the docs spec; "101 Active members" and "48+ Initiatives" are fabricated
3. User control & freedom: 1 — every forward path dead-ends
4. Consistency & standards: 1 — names/slugs disagree with the detail template, docs, and admin-facing data; Globe icon duplicated across two cards; card index renders 001–012 instead of 01–12 ('0' + padStart(2))
5. Error prevention: 1 — no guard against slug drift; the detail page's API-failure fallback spreads undefined into a truthy object, so bad slugs render a BLANK committee shell instead of the Not Found state
6. Recognition over recall: 3
7. Flexibility & efficiency: 3
8. Aesthetic & minimalist design: 3
9. Error recognition/recovery: 1 — the broken destination offers no recovery
10. Help & documentation: n/a
Total: 15/36 = 42% → Poor

## The two showstoppers
- P0 ALL TWELVE LINKS ARE BROKEN: CommitteesPage links slugs (medical-education, community-health, …) that have ZERO overlap with the registry the route's component understands (academic, health, research-journal, social-program, dietary, judicial, sports, auditing, foreign-affairs, membership, media-publicity, welfare). With the API empty/unavailable, the fallback renders a nameless blank committee page — worse than a 404.
- P0 FABRICATED PRODUCT TRUTH: the page invents committee names, focuses, per-committee member counts (8, 12, 6, …), and header stats ("101 Active members", "48+ Initiatives"). The real committees are documented in the constitution-derived registry the same codebase ships.

## Other issues
- P1 No h1 (same sitewide pattern; the `as` prop fix exists and is unused here).
- P1 CommitteePageTemplate's own related-committees footer links to `/committees/:slug` — a route that does not exist (should be `/leadership/committees/:slug`). The whole committee path is broken at both ends.
- P2 Card eyebrow numbering defect: renders 001/010/012, clearly intended 01–12.
- P2 Globe icon duplicated (legislative-affairs + international-relations) — differentiation failure in an icon-keyed grid.
- P3 Related, out of this target's scope: JoinCommitteePage repeats the same fabricated committee list with invented openings/deadlines — flag for the board.

## Emotional journey
Strong opening ("Where ideas become work that people can feel"), inviting grid — then any click lands on a blank page with no name and no explanation. The most complete trust collapse found on this site so far.

## Persona red flags
- Jordan: clicks "Medical Education" → blank page, no title, no recovery → assumes the org is defunct.
- Riley: cross-references the committee names with the constitution/docs and finds none match.
- Sam: no h1; blank destination page gives a screen reader almost nothing to announce.

## Detector agreement
0 findings on both files — the page is token-clean fiction. Truth and routing defects are invisible to static scanning; this is exactly why the dual assessment exists.

## Verdict
Polish = truth restoration: source the card grid from the constitutional registry the detail template already exports (names, slugs, descriptions, icons), delete the invented numbers, fix the numbering/h1, and repair the template's mislinked related-committees footer. Visual composition should be preserved as-is.
