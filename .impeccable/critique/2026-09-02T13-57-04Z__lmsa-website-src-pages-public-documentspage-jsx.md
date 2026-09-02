---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/DocumentsPage.jsx"
target_fingerprint: "sha256:5800a737ea3559e2835e645a6d0097d792e3396449ef7ba934af8c4614af5bf1"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/DocumentsPage.jsx
timestamp: 2026-09-02T13-57-04Z
slug: lmsa-website-src-pages-public-documentspage-jsx
---
# Critique — Documents page (lmsa-website/src/pages/public/DocumentsPage.jsx)
Run: 2026-09-02 · Mode: Operate (find + download) · ⚠️ DEGRADED: single-context (no sub-agent tool in this session)

## Provenance
- Assessment A: inline design review (source + document.service + API controller inspection), completed before detector output
- Assessment B: detect.mjs CLI — 0 findings (exit 0); browser overlay skipped (no browser automation)
- Ignore list: none

## Design-specificity verdict
Functionally the most complete page reviewed this session: real API, working category filter, per-item download states, server-side access filtering, an h1. But it is entirely dressed in the abandoned pre-redesign world (gray-50, rounded-2xl, shadow cards, pill chips, boxed Select) — a top-level, nav-linked "Learn & lead" page that looks like it belongs to a different site than every editorial sibling.

## Heuristic scores (0–4)
1. Visibility of system status: 2 — good per-item download spinner, but fetch failure renders "No documents available yet. Check back soon!" (toast-only, no retry) — the recurring error-as-empty lie
2. Match with real world: 3 — humanized category labels; honest metadata (size, date, downloads)
3. User control & freedom: 3 — filter works and resets cleanly
4. Consistency & standards: 1 — whole page in the legacy visual world; filter is a boxed legacy Select while /news established the editorial chip-row pattern for the identical job; chips are rounded pills vs the site's squared badges
5. Error prevention: 3 — download disabled in flight; access pre-filtered server-side
6. Recognition over recall: 3
7. Flexibility & efficiency: 3 — the first reviewed page whose filter actually works
8. Aesthetic & minimalist design: 2 — boxed filter row, cramped justify-between meta line whose layout shifts as optional fields drop out
9. Error recognition/recovery: 2
10. Help & documentation: n/a
Total: 22/36 = 61% → Acceptable

## Strengths
- Complete Operate loop: list → filter → download, with real loading/disabled states.
- Server-side access control (canAccess) means anonymous users only ever see public documents — the UI never promises a file it can't deliver.
- Filter-aware empty-state copy already exists.

## Priority issues
- P1 Legacy visual world on a top-level public route — the largest remaining instance of the drift class this session has been eliminating (news detail, event detail already migrated).
- P1 Error masquerades as empty; no retry affordance (recurring class, fixed on news/events indexes already).
- P2 Unlabeled filter control: Select is rendered without its label prop, so the only signal is a decorative Filter icon — screen readers announce an anonymous combobox.
- P2 Filter pattern inconsistency: /news uses editorial chip-rows with aria-pressed for the same task; this page should match.
- P2 documentService.download calls window.open AFTER an awaited request — popup blockers may eat the tab since the gesture context is lost. Flagged (service-level; shared with admin page) rather than fixed unilaterally.
- P3 No skeletons; no <time> elements; /documents has no PageMeta entry (falls back to the generic site title); meta row uses justify-between so fields shift position as optional values drop out; no closing callout (every editorial sibling has one).

## Emotional journey
Task-focused and mostly honest; the valleys are aesthetic whiplash on arrival (different world than the nav promised) and the false "no documents" message on failure.

## Persona red flags
- Sam: unlabeled select; pill chips rely on color alone to distinguish access levels (text is present, acceptable).
- Riley: kills the network, sees "No documents available yet" — a lie; downloads blocked by popup blocker leave no explanation.
- Alex: filter works (rare praise this session); no way to sort by date/downloads — acceptable at current volume.

## Detector agreement
0 findings — the drift is world-level and behavioral, not token-level. Seventh consecutive clean scan against a page with real issues.

## Verdict
Polish: migrate the shell to the editorial world (header, chip filter, squared cards, callout), give errors their own state with retry, label the filter, add skeletons/<time>/PageMeta. Keep the functional loop exactly as is.
