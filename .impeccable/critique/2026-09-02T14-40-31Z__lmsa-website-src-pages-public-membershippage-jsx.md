---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/MembershipPage.jsx"
target_fingerprint: "sha256:5ecbb80c0699bec76eb5d566cc4a9120f368aca60a21a9359a243276dbe33f8b"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/MembershipPage.jsx
timestamp: 2026-09-02T14-40-31Z
slug: lmsa-website-src-pages-public-membershippage-jsx
---
# Impeccable critique — MembershipPage.jsx (/membership)

Date: 2026-09-02 · Mode: Operate (understand -> choose -> apply)
DEGRADED: single-context (no sub-agent tool; Assessments A then B sequentially; detector CLI ran, browser overlay skipped — no browser automation exposed)

## Verdict
Score: 31/40 = 78% → **Good** — the strongest transactional page of the
session, and the first with a complete, honest Operate loop out of the box:
auth-aware apply section with FIVE real states (signed-out with login/register
paths, status-loading, pending, approved, rejected-with-retry), real
membershipService calls, labeled Select, loading button, error toasts.

Heuristics: 4, 3, 3, 3, 3, 3, 2, 3, 4, 3 (all ten apply — full transactional page)

## Findings

### P2 — The apply form offers Honorary, which the site says cannot be applied for
MEMBERSHIP_TYPE_OPTIONS includes 'honorary'. The categories page states
"Offered by invitation — there is no application" and the dues table prices
Honorary as "By invitation". The backend does accept 'honorary'
(VALID_MEMBERSHIP_TYPES) — but the published policy on two sibling pages says
invitation-only. The UI should match the published policy; whether the backend
should also drop 'honorary' is an org decision for the board.

### P2 (BOARD) — Membership taxonomy split: four types vs three
Backend + this page: full, associate, honorary, veteran. Categories page and
dues table: three types — Veteran Member appears NOWHERE else on the site and
has no listed dues. Either Veteran is real (then categories/dues must add it,
with a fee decision) or it is not (then backend + this page should drop it).
Needs an org answer; not invented here.

### P2 — editorial-link-card misuse (fourth instance)
Four type cards use the hover-lift whole-card-clickable class on
non-interactive articles. Same fix as resources/categories/benefits.

### P3 — "past papers" claim (again)
"Access study materials, past papers, and tutoring programs" — the same
unverified library-content claim removed from the benefits page today.
Cross-page consistency requires the same treatment. ("Tutoring programs",
"internship placements", "residency guidance" are org-level claims — decision
item 5 family, left verbatim.)

### P3 — Rejected-state copy points the wrong way
"You may submit a new one below." renders BELOW the form it refers to.

### P3 — Honorary card carries no invitation cue
The type card grid describes Honorary with benefits but never says
"by invitation" — the one fact that changes what a reader should do.

## Strengths
- The apply loop is the real thing: status lookup on mount with mounted-guard,
  duplicate-application awareness, distinct pending/approved/rejected states,
  loading and submitting states, labeled inputs. This is what the session's
  other pages were missing.
- Eligibility list is a real ul/li; "4 membership paths" stat is backend-true.
- All links resolve (login, register, benefits callout).

## Detector agreement
0 findings — twelfth consecutive token-clean page.

## Polish plan
1. Remove 'honorary' from the apply options (UI aligns with published
   policy); backend question goes to the board.
2. Honorary type card gains a "By invitation" note.
3. Type cards -> plain bordered articles, featured accent kept.
4. "past papers" -> member-library phrasing (consistency with benefits).
5. Rejected copy: drop "below".
