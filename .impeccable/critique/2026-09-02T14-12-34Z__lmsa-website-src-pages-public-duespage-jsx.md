---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/DuesPage.jsx"
target_fingerprint: "sha256:fdd51d97d7b661cf86a14392ad5170b8a2e90fe99141d2f0de98721aaad29fcf"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/DuesPage.jsx
timestamp: 2026-09-02T14-12-34Z
slug: lmsa-website-src-pages-public-duespage-jsx
---
# Impeccable critique — DuesPage.jsx (/membership/dues)

Date: 2026-09-02 · Mode: Understand (informational — fees, routes, rules)
DEGRADED: single-context (no sub-agent tool; Assessments A then B sequentially; detector CLI ran, browser overlay skipped — no browser automation exposed)

## Verdict
Score: 25/32 = 78% → **Good** — the healthiest surface reviewed this session
(ninth page). No broken primary promise, no fabricated content, correct
editorial world, PageMeta present, fee figures consistent with
CategoriesPage ($25/$15).

Heuristics: 4, 3, 3, 2, 3, 3, 4, 3, n/a, n/a
(states n/a — static informational page, no async data; the second n/a is
the operate-loop heuristic, no transactional flow on-page)

## Findings

### P2 — "Start your membership" lands at the top, not at Apply
The closing callout links to `/membership#apply`. The anchor exists
(MembershipPage section id="apply"), but the app has NO hash-scroll handling:
no ScrollToTop component, no hash effect in App.jsx or PublicLayout. React
Router does not scroll to hashes on client-side navigation, so the CTA lands
at the top of a long page and the user must find the apply section themselves.
Degraded promise, not broken — the destination is real.

### P2 — No h1
The hero EditorialSectionHeader omits as="h1"; every heading on the page is
h2/h3. Same recurring miss fixed on documents and resources.

### P2 (SITE-WIDE, flag for the board) — No scroll restoration at all
The absence of hash handling is one symptom of a broader gap: with no
ScrollToTop on route change, navigating from the bottom of any long page
lands the user mid-page on the next route. Affects every public page, not
just dues. Small shared fix (one component with useLocation: scroll to hash
target if present, else to top).

### P3 — Table semantics
Real <table> with <thead> — good — but no scope="col" on headers and no
caption; screen-reader users get weaker column association on a 3x3 fee
matrix.

### P3 — "Payment portal (coming soon)"
Hedged, so not a lie — but "coming soon" copy rots silently. Worth a date or
removal at next content review. No portal exists in the codebase (correctly
not promised as available).

## Strengths
- Honest throughout: no invented artifacts, no dead controls. Both links
  resolve (/membership#apply, /membership/categories).
- Fee data agrees with CategoriesPage — no cross-page contradiction.
- Genuinely good copy ("A transparent contribution to a shared student
  infrastructure"); deadline/grace-period facts stated once in stats and
  reinforced in the numbered list without contradiction.
- Correct editorial vocabulary end to end (stat grid, muted banding,
  article-list rows, bordered info aside, green callout).

## Detector agreement
0 findings — ninth consecutive token-clean page; agrees with the visual
assessment here (world is genuinely right), and as usual sees neither the
missing h1 nor the navigation-behavior gap.

## Polish plan (if authorized)
1. as="h1" on the hero header (one line).
2. Add a shared ScrollManager (scroll to hash target on navigation, else
   top) mounted once — fixes the CTA here AND the site-wide restoration gap.
3. scope="col" + caption (sr-only) on the fee table.
