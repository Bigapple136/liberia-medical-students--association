# Surface Brief: Portal App Shell (v1)

Confirmed via `$impeccable shape` (approved by user 2026-10-06).

## Job and audience
A current medical student arrives at `/portal/*` right after login (or via the header link), on a phone more often than not, possibly on a slow connection. The shell answers three questions in five seconds: Who am I? What's my status? Where can I go? Visitor mode: **Operate**.

## Outcome and proof
Success: the member orients without reading anything twice, signs out without leaving the portal, and reaches every destination that exists today with zero dead ends. Membership status and identity stay visible at all times.

## Selected direction
"The Clinic Chart" app chrome (see DESIGN.md). Desktop ≥768px: persistent white sidebar (256px, 1px right border, flat): brand block → Primary nav (Dashboard, green-tint active row, `aria-current`) → Roadmap nav dimmed with `Soon` chips (disabled, `aria-disabled`, never 404): My Events, Resources, Dues, Applications → Support: Help & contact (→ `/contact`), Back to LMSA site (→ `/`) → Identity block pinned bottom (initials avatar, name, membership StatusChip, Sign out). Mobile <768px: portal top bar (wordmark + menu button) opening a left drawer with scrim, focus trap, Escape close, body scroll lock, `aria-expanded`, closes on route change.

## Scope and boundaries
`PortalLayout.jsx` + shared `StatusChip.jsx` primitive. Dashboard content, routes, data layer, public site: untouched. Anti-goals: no fake pages behind disabled items; no account settings UI; no Merriweather in chrome; no resting shadows; no new accent colors.

## States and ranges
Name missing → initials from email + "Member"; status missing → neutral gray "—" chip. Shell renders instantly (ProtectedRoute settles auth first). Admin-tier members see the same student portal (their intentional choice; admin redirect handled at login).

## Interaction
Section labels are captions, not headers. Active nav row carries weight, not color alone. Touch targets ≥44px. Skip link retained.

## Decisions confirmed by user
- Full roadmap nav visible with Soon chips (not hidden, not coming-soon pages).
- Shape covered the shell only; dashboard hierarchy (status chips in cards, icon stat cards, date tiles) gets its own shape pass next.
- P0 (dead-end shell) leads before dashboard work.
