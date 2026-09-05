---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/SymposiaPage.jsx"
target_fingerprint: "sha256:52cf03816cb28618c36077a9a927ff3670032d26dcbabeeb016b893e70e7f967"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/SymposiaPage.jsx
timestamp: 2026-09-02T13-15-26Z
slug: lmsa-website-src-pages-public-symposiapage-jsx
---
# Critique — Symposia page (lmsa-website/src/pages/public/SymposiaPage.jsx)
Run: 2026-09-02 · Mode: Read (with one Persuade moment: registration) · ⚠️ DEGRADED: single-context (no sub-agent tool in this session)

## Provenance
- Assessment A: inline design review (source-level; no browser automation available)
- Assessment B: detect.mjs CLI scan — 0 findings (exit 0); browser overlay skipped (no browser tool)
- Ignore list: none

## Design-specificity verdict
The shell is committed-world editorial and the copy voice is genuinely LMSA. But the content layer is a static demo array wearing production clothes: statuses, dates, and attendance are hardcoded strings, and the page's one action is a button wired to nothing.

## Heuristic scores (0–4, n/a allowed)
1. Visibility of system status: 2 — status chips are the page's core signal and they are stale
2. Match with real world: 1 — both "Upcoming" events (Aug 15–17 and Mar 20–21, 2026) are already past as of today (Sep 2, 2026); one still offers registration
3. User control & freedom: 2 — Register leads nowhere; no detail view, no way back out of intent
4. Consistency & standards: 2 — eyebrow says "Stories & events / Symposia" but the route is /academics/symposia and siblings use "Learn & lead / …"; Register button omits the sitewide focus-visible ring; a no-op button violates basic control standards
5. Error prevention: 2 — status as a hand-typed string guarantees rot; nothing derives from dates
6. Recognition over recall: 3 — clear sections, icon+text meta rows
7. Flexibility & efficiency: 2 — no event detail links, no calendar export, no abstract-submission path despite a Research page that invites inquiry
8. Aesthetic & minimalist design: 3 — restrained editorial composition; theme is buried as a right-aligned span, visually orphaned from the title
9. Error recognition/recovery: n/a (fully static page)
10. Help & documentation: n/a
Total: 17/32 = 53% → Acceptable (borderline Poor)

## Strengths
- Fully inside the committed editorial world — paper banding, overlines, editorial-note, callout all correct.
- Upcoming vs past cards get honest visual differentiation (white vs muted surface).
- Copy voice is strong and specific ("Ideas become momentum when we gather around them.").

## Priority issues
- P0 Dead call-to-action: "Register now" is <button type="button"> with no handler and no destination. The page's single conversion moment does nothing.
- P0 Content truth failure: statuses are hardcoded; today both "Upcoming" symposia have already happened, and a finished event still shows a Register button. Status must derive from the date, or the data must come from the events API.
- P1 Orphaned data layer: an events service + admin already exist, yet symposia are a hardcoded array no admin can update — rot by design (already rotted).
- P1 No h1 on the page (EditorialSectionHeader defaults to h2; the `as="h1"` prop added during the news redesign is available and unused here).
- P2 Wayfinding mislabel: eyebrow claims "Stories & events" while route, nav, and PageMeta place symposia under academics ("Learn & lead / …" on siblings).
- P2 Register button lacks the sitewide focus-visible ring convention.
- P2 Theme ("Innovation in African Healthcare") — the most evocative line on each card — is a small right-aligned span detached from the title; on narrow screens its association becomes ambiguous.
- P3 Dates are plain strings (no <time>); sections have no empty state if a filter yields nothing; no cross-link to /events or the research/abstract pipeline.

## Cognitive load
Low — three cards, four sections. No decision point exceeds 4 options. The problem is truth and dead ends, not load.

## Emotional journey
The copy builds real aspiration; the peak of intent is "Register now" — and it is exactly there that the page goes dead. Peak-end rule inverted: highest intent meets zero response.

## Persona red flags
- Jordan (first-timer): clicks Register, nothing happens, clicks again, assumes the site is broken — support-contact territory.
- Alex (power user): no detail page, no calendar export, no registration link to evaluate; leaves in seconds.
- Sam (a11y): tabbing to Register shows no focus indicator; page lacks an h1 landmark.
- Riley (stress tester): spots the stale "Upcoming" labels immediately; the page's credibility collapses from one glance at a calendar.

## Detector agreement
Detector: 0 findings — consistent with Assessment A's view that the defects are truth, wiring, and IA-level, invisible to token-level scanning. No false positives.

## Verdict
The visual world is right; the page is a well-dressed prototype. It needs live or date-derived data, a real registration path, and IA-consistent wayfinding before it can be trusted.
