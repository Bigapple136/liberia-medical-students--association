# Surface Brief: Portal Dashboard Hierarchy (T41)

Confirmed via `$impeccable shape` (approved by user 2026-10-06). Depends on the Portal App Shell brief (T40) and its `StatusChip` primitive.

## Job and audience
The same member, seconds after the shell orients them. The dashboard body answers "what's my status and what's happening." Operate mode; mobile-first, low bandwidth binding.

## Outcome and proof
One glance answers: membership status (color + label, not undifferentiated text), then the member's own events, then association news. Every tile is truthful data or an honest action — no dead tiles, no fabricated numbers.

## Selected direction — status-led
1. **Lead: membership status panel** — full-width emphasized card, system's 2px green border on white (green-tint chip needs a neutral ground). Large `StatusChip size="lg"` + one contextual action shown only when truthful: no status → "Apply for membership" → `/membership#apply`.
2. **Secondary stat strip** — three compact cards: Events Registered, My Committees, Upcoming LMSA Events. Icons (lucide). Only "Upcoming LMSA Events" is clickable (→ `/events`); others stay static until their portal sections exist — same honesty as the Soon chips.
3. **My Upcoming Events** — rows gain date tiles (day + month block in green tint) replacing the bare calendar icon; link semantics and time/location meta unchanged.
4. **Recent News** — consistency restyle only: date caption above title (small caps rhythm), title/excerpt as below.

## Scope and boundaries
`DashboardPage.jsx` only + `StatusChip` reuse (additive `size="lg"` prop). Untouched: routes, services, the honest data layer (`Promise.allSettled`), the shell, public site. Anti-goals: no new colors, no invented data, no Merriweather, no resting shadows, no changes to loading/error/empty logic (skeletons, partial-error banner, per-section retry preserved verbatim).

## States and ranges
All existing states kept and restyled only: loading skeletons (lead panel gains its own skeleton), partial-error banner, per-section error cards, empty states. `stats === null` → neutral "—" chip; status missing → apply action; zero counts render truthfully.

## Interaction and layout
Order: status panel (full width) → 3-up stat strip (`sm:grid-cols-3`) → events → news; stacks on mobile. 44px targets on all links; `text-sm` workhorse; `aria-labelledby` section semantics on the lead panel.

## Decisions confirmed by user
- Full dashboard body in one pass (not stat row only).
- Status-led recomposition (not equal cards, not single strip).
- Link real destinations only (not all four cards, not no links).
