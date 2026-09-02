---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/portal/DashboardPage.jsx"
target_fingerprint: "sha256:eca235d728b381f3e9d0da4d754e1a083eac692e4dd7c4c00c2a61c1837e4a31"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/portal/DashboardPage.jsx
timestamp: 2026-09-02T14-51-09Z
slug: lmsa-website-src-pages-portal-dashboardpage-jsx
---
# Impeccable critique — portal DashboardPage.jsx (/portal/dashboard)

Date: 2026-09-02 · Mode: Monitor/Operate (member's own state -> next actions)
DEGRADED: single-context (no sub-agent tool; Assessments A then B sequentially; detector CLI ran, browser overlay skipped — no browser automation exposed)

## Verdict
Score: 31/40 = 78% → **Good** (ties the membership page for healthiest
surface). The honest sibling of the admin dashboard: every number and list is
real (dedicated dashboardService + news + events APIs), empty states are
honest and route users somewhere useful, the h1 greets by first name, touch
targets are 44px. No fabrication anywhere. The gaps are resilience and
affordance polish.

Heuristics: 3, 4, 3, 4, 3, 3, 3, 3, 2, 3

## Findings

### P2 — One failure kills the whole dashboard, then lies quietly
All four sources load in a single Promise.all inside one try/catch. Any one
failure -> toast only, then the page renders zeros and "—" as if they were
data (error-as-zeros, sixth instance this session), with no retry and no
error state. The four sources are independent; their failures should be too.

### P2 — Full-page spinner
A centered Loader replaces the entire dashboard during load — nothing
renders, not even the section shells. The session pattern (and the admin
dashboard as of today) uses skeletons within the layout.

### P3 — Icon semantics
Event LOCATION renders a BookOpen icon (a book, for a place — MapPin exists
in the imported set's library); the news empty state renders a Users icon.

### P3 — Event rows don't link
The my-events API returns slug; /events/:slug exists; rows render as inert
cards. The one thing a member most plausibly wants — checking details of an
event they registered for — requires going through /events and finding it
again.

### P3 — "Upcoming Site Events" — internal jargon ("site events") leaking
into member-facing copy.

### P3 — Membership status dead-ends at "—"
A member with no application sees an em-dash with no path to act. The apply
flow exists one link away (/membership#apply, now scroll-correct).

### P3 — eslint-disable react-hooks/exhaustive-deps instead of a memoized
loader (the pattern used elsewhere in the session).

## Strengths
- Zero fabrication — first dashboard-class page that needed no honesty
  surgery. All links resolve; news cards link to real detail routes.
- Honest, actionable empty states ("Browse upcoming events to register").
- Responsive sizing, touch-target minimums, line-clamp on excerpts.

## Detector agreement
0 findings — fourteenth consecutive token-clean page.

## Polish plan
1. Promise.allSettled; per-section unavailable states; amber banner + retry
   (mirrors today's admin dashboard treatment).
2. Skeletons in-layout instead of the full-page spinner.
3. MapPin for location, Newspaper for the news empty state.
4. Event rows link to /events/:slug when slug is present.
5. "Upcoming LMSA events" label; membership "—" gains an apply link when
   status is absent.
6. useCallback loader, drop the eslint-disable.
