---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/CategoriesPage.jsx"
target_fingerprint: "sha256:bb7b0769e15c0a4897399c42bae380fcd4a7f859d2c08d41e3fd20d67220bdbc"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/CategoriesPage.jsx
timestamp: 2026-09-02T14-23-27Z
slug: lmsa-website-src-pages-public-categoriespage-jsx
---
# Impeccable critique — CategoriesPage.jsx (/membership/categories)

Date: 2026-09-02 · Mode: Decide (choose a membership category)
DEGRADED: single-context (no sub-agent tool; Assessments A then B sequentially; detector CLI ran, browser overlay skipped — no browser automation exposed)

## Verdict
Score: 23/32 = 72% → **Acceptable** (second-healthiest surface of the session,
tenth page reviewed). Composed route evaluated per the double-h1 lesson:
PageHero provides the h1 (route is hero-configured) — correctly no page-level
h1. PageMeta present. Fees ($25/$15) consistent with DuesPage. All links
resolve, and /membership#apply now scrolls correctly thanks to ScrollManager.

Heuristics: 4, 2, 3, 3, 3, 2, 3, 3, n/a, n/a (states + operate-loop n/a — static page)

## Findings

### P2 — Honorary Member: "By invitation" AND "Apply now"
The card's own copy says "By invitation" / "Lifetime appointment", yet it
renders the same "Apply now" CTA as the other two categories. A user cannot
apply for an invitation-only category — the page contradicts itself on the
exact decision it exists to support.

### P2 — Green checkmarks on negatives
Every feature renders a green Check icon — including "No voting rights",
"Cannot hold elected office", and "Cannot hold office". The visual grammar
says *included benefit*; the words say *restriction*. On a comparison page
this is the semantics that matters most.

### P2 — editorial-link-card misuse (recurring class)
Cards use .editorial-link-card (hover lift + shadow + border shift — the
whole-card-is-clickable affordance) on a non-interactive <article> whose only
control is the inner Apply link. Same misuse fixed on resources.

### P2 — Off-canon email
"Need help choosing?" points at membership@lmsa.org. The site's canonical
published contact (ContactPage + Footer) is dev.lmsa@gmail.com; ErrorBoundary,
LoginPage and PartnershipPage use support@/partnerships@lmsa.org.lr. Three
domain families across the site; this page's address matches none of them and
is unverifiable — questions sent there may vanish. SITE-WIDE flag for the
board: which address family is real?

### P3 — Eligibility mixed into feature lists
First "feature" of each card is actually eligibility ("All medical students
currently enrolled", "Pre-medical and health sciences students", "Faculty and
alumni supporters") — a who-is-this-for fact dressed as a benefit.

### P3 — "Event discounts" claim
No paid events or pricing exist anywhere in the codebase; discounts are
unbacked. Registration does exist — claim should name what is real.

### P3 — !important overrides (!mt-3, !text-lmsa-700) fighting the card class.

## Strengths
- Right structure for a Decide page: three options, one recommended, single
  next step, dues cross-link.
- Fee facts agree with /membership/dues; "Most common" flag is honest framing
  (not fake urgency).
- Correct editorial vocabulary; correct composed-route heading hierarchy.

## Detector agreement
0 findings — tenth consecutive token-clean page. Blind, as established, to
copy contradictions, icon semantics, affordance misuse, and email canon.

## Polish plan
1. Split features into included[] vs limits[] — Check (green) for included,
   Minus (muted) for limits; eligibility becomes a dedicated "For" line.
2. Honorary card: drop Apply CTA; state "Offered by invitation — there is no
   application." with a contact link.
3. Plain bordered cards (keep the recommended top-accent); drop ! overrides.
4. Help box routes to /contact instead of the off-canon mailto.
5. "Event discounts" → registration-backed phrasing.
