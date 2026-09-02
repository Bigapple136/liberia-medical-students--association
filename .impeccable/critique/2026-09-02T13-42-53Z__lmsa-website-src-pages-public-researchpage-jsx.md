---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/ResearchPage.jsx"
target_fingerprint: "sha256:75b183be6062b0ed0f77abe951023662d0b97a89dd719b8b9658c0965c49d9b6"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/ResearchPage.jsx
timestamp: 2026-09-02T13-42-53Z
slug: lmsa-website-src-pages-public-researchpage-jsx
---
# Critique — Research page (lmsa-website/src/pages/public/ResearchPage.jsx)
Run: 2026-09-02 · Mode: Read · ⚠️ DEGRADED: single-context (no sub-agent tool in this session)

## Provenance
- Assessment A: inline design review (source-level), completed before detector output
- Assessment B: detect.mjs CLI — 0 findings (exit 0); browser overlay skipped (no browser automation)
- Ignore list: none

## Design-specificity verdict
Strong, committed-world editorial page with a genuinely good voice ("Curiosity is not a distraction from practice."). The failure is behavioral, not visual: the page's entire opportunity section is built from link-styled components that link to nothing.

## Heuristic scores (0–4)
1. Visibility of system status: 3 (fully static; nothing to signal)
2. Match with real world: 3 (copy plausible and specific; "reviewed quarterly"/"year-round" are unverifiable hardcoded claims — preserved, flagged)
3. User control & freedom: 1 — the four primary affordances (EditorialLinkCard with hover lift, corner arrow, focus ring) receive NO `to` prop; <Link to={undefined}> navigates to the current page at best. Every "way to begin" is a dead end.
4. Consistency & standards: 2 — the link-card pattern is used for non-links; each opportunity defines an `action` label ('Learn more', 'Submit paper', 'View workshops') that is never rendered — dead data revealing unfinished intent.
5. Error prevention: 2 — Link with undefined `to` is a latent self-navigation/scroll-reset hazard.
6. Recognition over recall: 3
7. Flexibility & efficiency: 2 — no actual path to apply for a grant, submit to the journal, or find workshops.
8. Aesthetic & minimalist design: 3 — split header, note, numbered rows: solid.
9. Error recovery: n/a
10. Help & documentation: n/a
Total: 19/32 = 59% → Acceptable

## Strengths
- Best copy voice of the section; the editorial-note pull quote earns its place.
- Focus-areas list is a clean, scannable numbered treatment.
- Closing callout routes to a real destination (/academics/mentorship).

## Priority issues
- P0 Four dead primary affordances: every opportunity card is a link-styled component with no destination. Arrow + hover promise navigation; click delivers nothing (self-navigation). Same failure class as the symposia dead Register button — peak interest, zero response.
- P1 No h1 (sitewide pattern; `as` prop available).
- P2 Dead `action` data: labels exist for exactly the CTAs the cards are missing — the intent was per-card actions ('Submit paper', 'View workshops') that were never wired.
- P3 Hardcoded review-cycle claims ("quarterly", "year-round") cannot be verified from the codebase; preserved but flagged for the board.

## Emotional journey
The header and note build real intellectual warmth; the opportunity grid then breaks the contract four times in a row. A student ready to submit a paper has no move to make.

## Persona red flags
- Jordan: clicks "LMSA Medical Journal", lands where they already are, concludes the journal isn't real.
- Alex: middle-clicks all four cards; four tabs of the same page.
- Sam: four focusable "links" that announce as links and go nowhere.

## Detector agreement
0 findings — token-clean; the defect is a missing prop, invisible to static pattern scanning. No false positives.

## Verdict
Polish: keep the composition, make the cards honest — static editorial cards carrying their intended `action` labels as real links to truthful destinations (contact for grants/journal inquiries, mentorship for collaboration, symposia for training), plus the h1.
