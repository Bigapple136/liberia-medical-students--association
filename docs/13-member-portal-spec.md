# Member Portal — Product & UX Specification

**Status:** Draft v1 · 2026-09-29
**Source:** `$impeccable critique` run 2026-09-29 (score 22/40 · snapshot `.impeccable/critique/2026-09-29T23-24-10Z__lmsa-website-src-pages-portal-dashboardpage-jsx.md`)
**Surfaces:** `lmsa-website/src/layouts/PortalLayout.jsx`, `src/pages/portal/**`, `src/components/common/ProtectedRoute.jsx`, `src/pages/auth/LoginPage.jsx`
**Mode:** Operate — the member completes tasks. Scanability, consistency, and native expectations outrank expression; brand lives in precise details.

---

## 1 · Problem statement

The portal is one read-only dashboard inside a locked room. The critique found:

- **P1 — Locked room.** `PortalLayout`'s sidebar contains only the word "Portal": no nav, no logout, no back-to-site. Mobile is a floating hamburger (`fixed top-20 left-4`) overlapping scrolling content, opening a drawer with one word in it.
- **P1 — Portal is unreachable after login.** Students land on `/` post-login (deliberate, see §2 Decision D1); the only portal entry is the utility bar's "Member portal" text link.
- **P1 — No account surface.** `GET/PUT /users/me` exist; nothing in the portal uses the PUT. Membership status renders as bare text with no explanation ("Pending" → then what?).
- **P2 — Dead stat cards.** "Events Registered: 3" is inert though `POST/DELETE /events/:id/register` exist. "Upcoming LMSA Events" duplicates the public site.
- **P2 — Shell drift.** Portal and admin use different mobile patterns; portal renders with no brand chrome; `top-16` hardcodes a header height the portal doesn't render.

## 2 · Decisions (locked with client 2026-09-29)

| # | Decision | Consequence |
|---|----------|-------------|
| **D1** | **Keep homepage as the post-login destination for students.** Do not change LoginPage's redirect. | Reachability is solved by adding portal entry points where members actually are (§4.1), not by changing the redirect. Admins keep `/admin/dashboard`. `?next=` keeps highest precedence. |
| **D2** | **Full portal scope.** Shell + nav, entry points, profile, actionable dashboard, unified mobile pattern, a11y, shared Spinner — the full member home-base. | Everything in §4 is in scope. Non-goals in §7 (roadmap Sprints 7–8: ID card, meetings, notifications). |
| **D3** | **Build order: reachability first.** Ship entry points before any new pages, so the portal gains traffic while it grows. | §4.1 is the first build item. |
| **D4** | **The portal is a deliberately compact member app** — not a mini public site. It keeps its own compact shell and never mirrors the public header/footer. | §4.2 shell stays self-contained; brand enters through the badge and green, not through site chrome. |
| **D5** | **Green means service to the greater community.** In the portal, LMSA green is semantic, not decorative: it marks the member's standing and connection to service — active membership, committee/volunteer CTAs, the month's priority. | §3 principle 4, §4.5 accents. |
| **D6** | **The dashboard surfaces the month's priority — with moderate emphasis, not an alarm** ("kinda shouting"). One calm green-accented card; red stays reserved for suspended status and true errors. | §4.5 first bullet. |

## 3 · Guiding principles

1. **Every number is a door.** If the dashboard shows it, the member can act on it.
2. **Honest states stay.** Keep the `Promise.allSettled` per-section loading, per-section retry, and "unavailable, not zero" convention. Extend it to new pages; never regress it.
3. **One shell pattern.** The portal adopts AdminLayout's proven mobile top-bar + off-canvas drawer. Do not invent a third pattern.
4. **Green means service.** LMSA green (`#0C8950` family) is the portal's only accent, and it is semantic (D5): it marks standing and service-to-community moments — active membership, committee and volunteer CTAs, the month's priority card. Never decoration; no `text-blue-600` accents inside the portal.
5. **Accessible by default.** Esc closes overlays, focus returns to the trigger, spinners announce via `role="status"`, status is text+color never color alone.

## 4 · Scope

### 4.1 Reachability & entry points  *(build first — D3)*

Members must be able to reach the portal from where D1 leaves them.

- **Homepage (signed-in):** add a member strip/section — "Welcome back, {first name}" + portal CTA — rendered only when `user` is truthy. Place below the hero; never displace public content.
- **Header (signed-in):** keep the existing "Portal" text link; it becomes the second entry, not the only one.
- **Footer:** add "Member portal" link (signed-in or not — the route guards handle it).
- **Post-registration:** `RegisterPage` success path links users to the portal ("Visit your portal" secondary CTA).
- **Acceptance:** from the homepage a signed-in student reaches `/portal/dashboard` in one click; a signed-out visitor hitting any `/portal/*` route still lands on `/login?next=<path>` (preserve `next`).

### 4.2 Portal shell  (`PortalLayout.jsx` rebuild)

Deliberately compact (D4): the portal reads as its own focused member app — sidebar, top bar, content. No public header, footer, or mega-nav replicated inside; "home" is always one click away via the sidebar's "Back to LMSA site", not via re-imported chrome.

Desktop ≥ lg:

- Sidebar 256px, sticky, `bg-white border-r`, contains top-to-bottom:
  1. **Identity header** — LMSA badge (mirror AdminLayout's mark) + "Member Portal", links home.
  2. **Nav** (`<nav aria-label="Portal">`, `NavLink` with active `bg-lmsa-50 text-lmsa-700`): Dashboard · My Events · My Profile. Icons: `LayoutDashboard`, `Calendar`, `User`.
  3. **Footer block** — "Back to LMSA site" (`/`) and **Sign out** button (calls `logout()` from `useAuth`).
  4. User identity chip: avatar initial + `full_name` + membership status badge (§4.4.2).
- Main: `<main id="main-content" className="flex-1 p-4 sm:p-8 min-w-0">`, skip link unchanged.

Mobile < lg:

- **Sticky top bar** (AdminLayout pattern): hamburger + LMSA badge + "Member Portal". Removes the floating `top-20 left-4` button entirely.
- Off-canvas drawer: `inset-y-0`, backdrop `bg-black/40`, same as admin.
- Drawer a11y: Esc closes; focus returns to hamburger on close; backdrop click closes; nav click closes; `aria-expanded`/`aria-controls` on the toggle.
- Delete the `top-16` offset guess; sidebar anchors `inset-y-0`.

### 4.3 My Events page  (`/portal/events`)

- **Registered upcoming** — list of events with date, location, and **Cancel registration** (existing `DELETE /events/:id/register`); confirm dialog states what happens ("Your spot is released. You can re-register while registration is open."). Cancel is undoable-by-re-registering; no silent failures.
- **Browse CTA** — "Find more events" → `/events`.
- Empty state: Calendar icon + "No upcoming events registered" + browse link (existing copy, kept).
- Errors: per-section retry, "—" convention for unavailable counts.
- API: needs `GET /dashboard/my-events` (exists, max 5) plus event slugs for deep links (already returned).

### 4.4 My Profile page  (`/portal/profile`)

#### 4.4.1 Edit form
- Fields from `GET /users/me`: `full_name`, `email` (read-only — auth identity), `phone`, `institution`, `graduation_year`, etc. — whichever the profile row actually carries; ship with what exists, stub nothing visible.
- Save via `PUT /users/me`; optimistic-free, simple "Saving…" state on the submit button, toast "Profile updated".
- Validation: zod schema, inline field errors near the source, never clear the form on failure.

#### 4.4.2 Membership status card
- `StatusBadge` component: active (green — per D5, active standing is the service-to-community state, so green is earned here), pending (amber), inactive (gray), suspended (red) — **text + color, never color alone**; uses brand palette from `lmsa_brand_guide.md`.
- One plain-language sentence per status, e.g. Pending → "Your application is being reviewed by the membership committee. We'll email you when a decision is made."
- Pending additionally shows a "What happens next" list (review → email → dues invoice), and dues section links.

#### 4.4.3 Dues section
- Status line sourced from membership stats if the API carries it; otherwise link to public `/membership/dues` with "Review the current dues structure". No fake states — reuse the unavailable convention.

#### 4.4.4 Password change
- **Placeholder card, not a dead form:** "Password changes are coming soon. Need to change it now? Email support@lmsa.org.lr." until the auth endpoint lands. Do not ship a non-functional form.

### 4.5 Dashboard rework  (`DashboardPage.jsx`)

- **"This month" priority card** (D6 — sits directly under the welcome header, before stats): the single most time-relevant item for this member, picked by priority: (1) `membership_status` pending → "Your application is under review — see what's next" → profile; (2) a registered event within 30 days → name it, with date + "View details"; (3) otherwise the nearest upcoming event → "Register for {event}"; else the quiet all-clear: "Nothing due this month — you're all caught up." Moderate emphasis: `bg-lmsa-50` card with a green left accent and one action link — no red, no pulsing, dismissible for the session. Red stays reserved for suspended status and true errors (brand guide: Liberian red = urgent/emergency only). Data honesty: ranked only from what the API returns today (`membership_status`, my-events, upcoming events); dues joins the ranking when a dues endpoint exists.
- **Quick Actions row** (below stats): Register for events → `/events` · Join a committee → `/get-involved/committees` · Update profile → `/portal/profile` · View dues → `/membership/dues`. All endpoints/destinations exist today.
- **Stat cards become doors:**
  - Membership Status → links `/portal/profile` (badge, not bare text).
  - Events Registered → links `/portal/events`.
  - My Committees → links `/leadership/committees` (drill-in when a committee list page exists).
  - Replace "Upcoming LMSA Events" (duplicates the public site) with **Next event widget**: nearest upcoming site event + date + Register/View button. If none: "No events scheduled — check back soon."
- **Keep:** welcome header, partial-error banner, skeletons, per-section retries, Recent News block.
- Accent color: LMSA green family only.

### 4.6 Shared components

- **`Spinner`** (`components/common/Spinner.jsx`): replaces the `border-b-2` half-border spinner found 3× (ProtectedRoute, RouteFallback, LoginPage) — detector finding `border-accent-on-rounded`. Props: `size`, `label`. Markup: full border ring + `role="status"` + visually-hidden label + `animate-spin`. One component, three call sites.
- **`StatusBadge`** (§4.4.2) — reused in shell identity chip, profile, dashboard.

### 4.7 Accessibility requirements (all new/edited surfaces)

- Focus rings on every interactive element (`focus-visible:ring-2 focus-visible:ring-lmsa-600 focus-visible:ring-offset-2` — house pattern).
- Drawer: Esc + focus trap + focus return (§4.2).
- Spinners announce; toasts already announce via react-hot-toast.
- 44px minimum touch targets on all row-level links/buttons (existing convention).
- Landmarks: `<nav aria-label="Portal">` in sidebar; single `<main>`.

## 5 · API inventory (today)

| Endpoint | Status | Used by spec section |
|---|---|---|
| `GET /users/me` | ✅ exists (AuthContext) | 4.4.1 |
| `PUT /users/me` | ✅ exists, unused | 4.4.1 |
| `GET /dashboard/stats` | ✅ exists | 4.5 |
| `GET /dashboard/my-events` | ✅ exists (max 5) | 4.3, 4.5 |
| `GET /events`, `POST /events/:id/register`, `DELETE /events/:id/register` | ✅ exist | 4.3, 4.5 |
| `GET /news`, `GET /committees` | ✅ exist | 4.5 |
| Password change | ❌ absent | 4.4.4 placeholder only |

No backend work is a blocker for any §4 item. Dues data and password change are the only deferred integrations.

## 6 · Build order (D3)

1. **Reachability** (§4.1) — homepage member strip, footer link, register CTA. One PR, zero risk.
2. **Shell** (§4.2) + **Spinner/StatusBadge** (§4.6) — rebuild PortalLayout, adopt admin mobile pattern, shared components in.
3. **My Events** (§4.3) — first action surface; cancellation flow.
4. **Profile** (§4.4) — edit form + status card + dues/placeholder sections.
5. **Dashboard rework** (§4.5) — quick actions, door cards, next-event widget.
6. **Polish pass** (`$impeccable polish`) + re-run `$impeccable critique` to move the 22/40 baseline.

Each step is independently shippable. Step 1 lands before anything else.

## 7 · Non-goals (roadmap Sprints 7–8, out of this spec)

ID card page + QR, meetings/attendance tracking, realtime notifications, activity timeline, admin-facing membership review changes. These follow the existing `lmsa_dev_roadmap.md` phases and will absorb the shell/components built here.

## 8 · Acceptance criteria

- [ ] Signed-in student reaches the portal in one click from the homepage.
- [ ] No dead end: every portal page has nav, home, and sign-out visible without scrolling on mobile.
- [ ] Drawer: Esc, backdrop click, and nav-click all close; focus returns to trigger.
- [ ] Profile edits persist (`PUT /users/me`) with toast + inline validation; failures never clear the form.
- [ ] Membership status renders as badge + explainer sentence in all four states.
- [ ] Cancel registration works from My Events with a confirm that names the consequence.
- [ ] Zero detector findings in portal files (incl. spinner fix); lint passes with `--max-warnings 0`.
- [ ] Partial-failure convention intact: sections retry independently; "—" never means zero.
- [ ] Dashboard shows the "This month" priority card at moderate emphasis (D6), including the all-clear state; no red urgency styling on routine items.
- [ ] Portal contains no replicated public header/footer; the only site exit is the sidebar "Back to LMSA site" (D4).
