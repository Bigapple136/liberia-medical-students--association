---
target: member portal
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\goldw\\Desktop\\freelance\\liberia-medical-students'-association\\lmsa-repo\\lmsa-website\\src\\pages\\portal\\DashboardPage.jsx"
target_fingerprint: "sha256:5884e53f7cc167de13c26dd830398c8a54e6f9f788a78e7a842b64464721c1d2"
target_path: "C:\\Users\\goldw\\Desktop\\freelance\\liberia-medical-students'-association\\lmsa-repo\\lmsa-website\\src\\pages\\portal\\DashboardPage.jsx"
timestamp: 2026-10-06T11-43-21Z
slug: lmsa-website-src-pages-portal-dashboardpage-jsx
---
⚠️ DEGRADED: single-context (no sub-agent/Task tool exposed in this session — assessments ran sequentially inline)

## Design Health Score — Member Portal

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeletons + partial-error banner are excellent; but no current-location indicator exists (nav doesn't exist) |
| 2 | Match System / Real World | 3 | Plain member language; "My Upcoming Events" vs "Upcoming LMSA Events" differ only by a possessive |
| 3 | User Control and Freedom | 2 | No sign-out inside the portal, no path back to the site — browser-back is the only exit |
| 4 | Consistency and Standards | 2 | Public site is polished; portal chrome is an unstyled wireframe; status renders as text, not the design system's chip doctrine |
| 5 | Error Prevention | 3 | Read-only surface, retry affordances present |
| 6 | Recognition Rather Than Recall | 2 | Sidebar contains only the word "Portal" — destinations are invisible; members must remember/know URLs |
| 7 | Flexibility and Efficiency | 2 | One page, no accelerators; no jump-points to events/committees/resources |
| 8 | Aesthetic and Minimalist Design | 2 | Clean but unauthored: four identical gray cards, no icons, no hierarchy, no actions |
| 9 | Error Recovery | 4 | Per-section retry + honest "unavailable ≠ zero" copy — genuinely rare craft |
| 10 | Help and Documentation | 2 | No help/contact path inside the portal (CONTACT_EMAIL exists but isn't surfaced) |
| **Total** | | **25/40** | **Acceptable — significant improvement needed** |

## Design Specificity Verdict

**Content-specific, chrome-interchangeable.** The dashboard's data and copy are unmistakably LMSA (membership status, committees, A.M. Dogliotti context). But the shell could be any React starter template's — and it's the first thing every member sees after login. The login page is more visually committed than the member home.

**LLM assessment:** Coherence comes from the data layer, not the visual layer. Structural sameness: four identical cards with no differentiation; the shell is category-interchangeable. Missed opportunity: the medical/clinical identity (committed on the public site's hero system) never appears in the portal.

**Deterministic scan:** `detect.mjs` over `src/pages/portal` + `src/layouts`: 0 findings (exit 0) — no slop patterns (gradient text, eyebrow labels, decorative noise). The problem is absence of design, not presence of anti-patterns.

**Visual overlays:** Not available — `/portal` sits behind Supabase auth and the sandbox has no env credentials, so no browser session can reach the surface. Fallback signal: static source analysis of `PortalLayout.jsx` + `DashboardPage.jsx`.

## Overall Impression

The data layer is production-grade; the experience layer is scaffolding. A member logs in through a polished page and lands in a wireframe with no way to leave. The single biggest opportunity is the **app shell** — it's simultaneously the navigation, the identity, and the "feels like an application" answer.

## What's Working

1. **Honest data states.** `Promise.allSettled` partial loading, per-section "Try again", skeletons, and the amber banner saying "Anything shown as '—' is unavailable, not zero" — a level of state honesty most production dashboards never reach.
2. **Accessibility foundations.** Skip link, `focus-visible` rings with offsets, 44px touch targets on the "View all" links, `aria-hidden` icons.
3. **Copy tone.** "Here's what's happening with your LMSA membership" — warm, plain, member-first.

## Priority Issues

1. **[P0] The portal is a dead end.** No nav items, no sign-out, no back-to-site link — logout lives only in the public header, which doesn't render on `/portal` routes. Why it matters: control, orientation, and basic trust. Fix: build the app shell — sidebar nav with active states, identity block, sign-out, back-to-site. Suggested command: `$impeccable shape portal`.
2. **[P1] Zero hierarchy on the dashboard.** Four identical gray cards, no icons, no links, no status color — and membership status (the member's #1 question) renders as undifferentiated text. Why it matters: the peak emotional moment after login is also the flattest screen. Fix: status chips per DESIGN.md, icon + action per stat card, clickable cards, app-style date tiles for events. Suggested command: `$impeccable polish` (after shape).
3. **[P1] Mobile chrome floats over content.** The hamburger sits at `top-20 left-4`, overlapping the page headline; there's no top bar; the drawer has no focus trap or Escape handling. Why it matters: mobile-first is the confirmed primary context. Fix: proper app top bar + managed drawer. Suggested command: `$impeccable adapt`.
4. **[P2] No identity presence.** Once inside, the member's name, role, and status are invisible. Fix: identity block with avatar initials + membership chip in the shell. Suggested command: covered by shape.
5. **[P2] Dead data + event taxonomy confusion.** Stat cards aren't clickable; "My Upcoming Events" and "Upcoming LMSA Events" are two concepts separated only by phrasing. Fix: make cards links, rename to "Upcoming events (site-wide)" or icon-differentiate. Suggested command: `$impeccable clarify`.

## Persona Red Flags

**Alex (Power User):** No way to jump to events, committees, or resources from the portal — must route through the public site. Zero accelerators; would route around the portal entirely.

**Jordan (First-Timer):** Sees the word "Portal" and nothing else. No visible destinations, no help, no contact path. First-5-seconds test fails: "what can I do here?"

**Sam (Accessibility):** Fundamentals hold (skip link, rings, targets). Gaps: drawer lacks focus trap/Escape; the floating toggle's `aria-label="Toggle sidebar"` is generic; body scroll isn't locked while the drawer is open.

## Minor Observations

- The stat card grid handles `emptyAction` (apply link) nicely — good pattern worth extending to all cards.
- `RowSkeleton` renders 2 identical rows regardless of actual content length — minor flash of wrong layout.
- `upcomingSiteEvents` stores a count, not the events — that card could deep-link to `/events` (it does nothing today).
- Drawer overlay + toggle are fine on desktop; consider `aria-expanded` on the toggle.

## Questions to Consider

- What if the dashboard led with the member's identity and status instead of four equal numbers?
- What would a confident version of this shell look like — one glance: who am I, what's my status, where can I go?
- Should stat cards be navigation? (Data that answers a question usually implies a destination.)
