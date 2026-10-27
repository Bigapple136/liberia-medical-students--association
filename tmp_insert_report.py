import io
p = 'ORCHESTRATION.md'
with io.open(p, 'r', encoding='utf-8', newline='') as f:
    s = f.read()
nl = '\r\n' if '\r\n' in s else '\n'
# placeholder was CRLF-terminated by earlier replacement - find the T43 one specifically
marker = "### Report" + nl + nl + "*(agent fills in on completion)*"
idx = s.find(marker, s.find('## T43'))
assert idx != -1, 'T43 Report placeholder not found'

report = """### Report

**Recap of what was actually done, method compliance.** Checked out
`origin/task/t41-portal-dashboard-hierarchy` (tip `93415a2`) into a scratch
detached worktree, read its `DashboardPage.jsx` (353 lines), its T41 report
and `.impeccable/` artifacts inside it, then removed the worktree. T41 was
never merged, rebased or cherry-picked anywhere. No file outside
`ORCHESTRATION.md` was created, modified or committed on this branch. No
mock auth, env-var bypass or preview hooks were added to anything. Ran the
impeccable detector (`detect.mjs`) over both versions of `DashboardPage.jsx`
(exit 0 on both — zero anti-pattern findings on either side).

⚠️ DEGRADED: single-context (no sub-agent/Task tool exposed in this session —
assessments ran sequentially inline)

⚠️ NO BROWSER: `/portal` sits behind Supabase auth and this sandbox has no
credentials, so neither dashboard could be rendered, screenshotted or
keyboard-walked. The 375/1280 and screen-reader judgments below are
source-level reasoning over the layout classes and markup, not screenshots.
Additionally, no mock data was actually used to run the scenarios — with no
browser it could not have been observed — so the seven scenarios were
evaluated by reasoning through the code paths per scenario rather than by
executing them. Both degraded-run disclosures are preserved verbatim per the
standard.

**Prior critique evidence, carried with provenance.** T41's own critique
snapshot (`/tmp/t41wt/.impeccable/critique/2026-10-06T11-43-21Z__…-dashboardpage-jsx.md`,
committed on that branch — I read it in the scratch worktree but copied
nothing out) scores the T41-shape-history dashboard 25/40, flagged
"⚠️ DEGRADED: single-context", with the browser overlay explicitly
unavailable behind auth. It predates both candidates below and is not
evidence about either; it is evidence that "zero hierarchy on the
dashboard" is the diagnosed problem both concepts answer. Because the
surface is auth-gated, no fresh browser-visible critique could be run for
this task at all; the standard's degraded/no-browser disclosure is the
significant-adaptation being invoked, not silently omitted.

**Key structural facts equal across both.** Both versions share the same
honest data layer verbatim — `Promise.allSettled` over the four endpoints,
`null` = unavailable rendered as `—`, per-section retry, the amber
partial-error banner ("Anything shown as '—' is unavailable, not zero"),
per-section skeletons, and identical empty states. Neither fabricates
numbers, and neither invents a state the API cannot support. The backend
`/dashboard/stats` returns only `membership_status`,
`events_registered_count`, and `committees_count`; there is no dues field
anywhere in the API, so neither dashboard ever receives dues data (this
becomes scenario 4's shared blind spot below). DOM/keyboard order is the
same in both: heading → lead element → stats → My Upcoming Events
("Manage my events" link precedes the list) → Recent News ("View all news"
link precedes the list), matching the visual order in both at 1280 and —
via single-column stacking — at 375.

### Scenario-by-scenario table

Legend for pre-verdicts: **"first at 375/1280"** = what the member needs to
know first and whether the page puts it first in the visual/reader order at
each width; **truthfulness** = no fabricated numbers or implied data; **K/S
order** = keyboard and screen-reader order; **color** = reliance on color
alone; **mobile** = 375 layout behavior. Verdict is which concept better
serves the member in that scenario.

| # | Scenario | T41 (status-led lead panel) | main ("this month" priority card) | Mobile (375) | Desktop (1280) | Verdict |
|---|---|---|---|---|---|---|
| 1 | Application pending | Lead panel renders a large amber StatusChip `pending` full-width. No CTA in this state — truthful but the member is left to infer "and now what?". Chip is text+dot, not color alone. | Priority card fires first, ranked above everything: "Your membership application is under review" + explanatory body + truthful CTA ("View your application status" → profile). Not dismissible content the member would want to lose, but dismissal is available and sessionStorage-only (honest session-not-forever, per D6 comment). | T41: tall lead panel pushes stats/events/news down; chip is the first thing seen but has no action. Main: CTA card is the first thing seen and actionable. Main wins at 375. | T41: 2px-bordered panel + big chip reads as a banner, fine at 1280 but carries no action. Main: instruction card with a CTA. Main wins at 1280. | **main** — an actionable instruction beats a passive classification for the highest-stakes state. K/S order tie (both lead with it). Truthfulness tie. Color tie (both text+color, never color alone). |
| 2 | Active member registered for an event within 7 days | Lead = status chip ("Approved" or similar); the registered event appears only further down in My Upcoming Events with a date tile. "First to know" (their event) is NOT first on the page. | Priority card ties to the member's soonest registered event ≤30 days: title + "You're registered — {date}" + truthful CTA into the event's page. Billing/`this month` framing matches the data (not "this week" only). | Main carries the actual answer first; T41 requires finding the events section mid-page. | Same at 1280: main's lead slot answers "what do I need to know"; T41's answers "what's my membership row". | **main** — the member's first need in scenario 2 is the event, and main puts it in the lead slot. Truthfulness tie. Color tie. |
| 3 | Active member, no registered events, an open event upcoming | Lead = status chip only; the site event is a *count* in the stat strip ("Upcoming LMSA Events: N") and a list further down. No direct nudge to the specific nearest event. | Priority card surfaces the nearest site-wide event by title + date + "save your spot" CTA — and has a unique already-registered deduplication check that downgrades to "You're registered — see you there" instead of offering a duplicate "Register" CTA (a truthful-state subtlety T41 does not have anywhere). | Main again surfaces the answer first; T41 buries the event behind a stat count. | Same at 1280. | **main** — the card turns "an event exists" into "this event, this date, here's how to act". Truthfulness edge to main (the already-registered dedup is a fabricated-CTA guard T41 lacks entirely). Color tie. |
| 4 | Overdue dues | **Neither concept can show this.** `/dashboard/stats` has no dues field; neither page reads dues; the numbers shown are events/committees only. Whichever layout wins on other rows, this scenario is a genuine shared blind spot, not a differentiator. | Same — no dues data reaches either page. | — | — | **tie — shared gap.** Not a point for either concept. Flagged below under "follow-up". |
| 5 | All clear (nothing pending, nothing upcoming) | Lead panel shows the status chip and then… correctly nothing else urgent. Correct but a big bordered panel with no news at all is visually loud for a "nothing happening" state. | Priority card renders an explicit "Nothing due this month — all caught up" state, dismissible for the session. Slightly warmer and self-explanatory, and the dismissal keeps it from repeating forever. | Both fine at 375. | Both fine at 1280. | **slight main** — an explicit all-clear beats a status-only panel for the calm state, and the dismissal is honest (sessionStorage-only, try/catch fallback). Color tie. K/S tie. |
| 6 | Stats endpoint failing | Partial-error banner + `—` chip + `—` stat values + per-section retry, all preserved verbatim from main. Smoke-tested by code (the loader is identical); not browser-verified for either. | Same banner and fallbacks, identical loader. The priority card degrades gracefully: with `stats` null it falls through to the event branches (registered/upcoming), so the card still shows something truthful built from event data. | Both degrade identically. | Both degrade identically. | **tie** — the graceful-degradation mechanics are the same shared loader. If the difference matters, note that main's card has one more graceful degradation (it can still show an events-based priority with stats down), T41's lead panel cannot (a null chip is its only story). Slight main, not decisive. |
| 7 | Brand-new member with no data at all | Lead panel correctly becomes "Apply for membership → /membership#apply" (the empty-status branch). Good. Same truthful `—`s elsewhere. | Priority card has **no** "apply" branch — it does not consult `membership_status` at all; the only apply CTA is smaller, inside the stat-grid Membership Status slot. Weaker for this scenario. | Both fine at 375. | Both fine at 1280. | **T41** — the one scenario where the panel genuinely beats the card: the empty-status state gets the whole lead slot. This is the strongest argument for a hybrid. |

**Criterion roll-up across all seven scenarios:**

- **First-to-know at 375 / 1280 (4 of 7 scenarios): main.** The priority
  card turns the data into an instruction; the panel tells you a status
  and moves on.
- **Truthfulness (7 of 7): tie, with one edge to main.** Both preserve the
  no-fabrication loader. Main additionally dedupes the register CTA when
  already registered (a truthfulness guard T41 lacks entirely). Neither
  ever invents a number.
- **Keyboard and screen-reader order: tie.** Both keep the same DOM order
  and the same anchor/button structures; "Manage my events"/"View all
  news" precede their lists in both. A source-level a11y draw. The one
  a11y delta found is T41's `sr-only` `role="status"` "Loading your
  membership status…" inside the lead panel's loading skeleton — a nice
  pattern that could be carried to main's priority-card skeleton (see
  recommendation).
- **Reliance on color alone: tie.** T41's `StatusChip` is label text +
  dot; main's status slot uses `StatusBadge`, also text + color. Neither
  uses color as the sole carrier anywhere in either version.
- **Mobile layout: tie in mechanics, slight main in practice.** Both are
  single CSS grids that stack to one column. T41's 2px-bordered full-
  width lead panel is a heavier object at 375 (it is the first thing the
  member scrolls past when the status is "Approved" and nothing else is
  happening); main's dismissible card can be closed. Not decisive, but it
  compounds the row-5 observation at small widths.

### Recommendation

**Keep `main`'s "this month" priority card. Do not adopt T41's status-led
lead panel as a whole. If anything changes, adopt T41's idea as two
specific parts — a named hybrid:**

1. **Adopt: T41's `sr-only` `role="status"` loading announcement**, applied
   to `main`'s *priority-card skeleton* (not a status-led panel). Both
   concepts share the same keyboard order today; this closes the only
   concrete a11y delta found, with zero visual or information-architecture
   cost.
2. **Adopt: T41's brand-new-member treatment** — the "empty membership
   status on a loaded account → 'Apply for membership'" action — as an
   **explicit branch in `main`'s priority-card ranking** (not as a
   full-width lead panel). Concretely: rank it above the "all clear" and
   "register for next site event" branches, below the "pending" branch.
   This fixes the single scenario (7) where the comparison found the
   current card genuinely weaker than the panel, without ever giving the
   panel the lead slot.

**Do not adopt:** the status-led full-width lead panel itself (scenarios 1,
2, 3 and 5 all favor the card); the "first-to-know is status" information
architecture change; the `justLoggedIn` admin redirect (removed on `main`
by T35's fix, deliberately — T41's report claiming it "preserved verbatim"
is the reason its branch is closed as code). Scenario-7 beats the panel in
T41's favor only when the panel *is* the lead slot; putting the same
action inside the card gets the scenario-7 win without the row-1/2/3/5
losses.

### Cost and risk of adopting the recommendation

- **Cost, if the hybrid is built:** one small branch — a ranking branch in
  `main`'s priority `useMemo` and one `sr-only` element in the
  priority-card skeleton. Both inside `DashboardPage.jsx`; no service,
  shell, or backend change; no `StatusChip` needed (main uses
  `StatusBadge`). Hours, not days. No immaculate full `critique` run
  needed for the follow-up itself (it is a two-line content augmentation
  of an existing surface under the same standard T38 used), but a
  `critique` on `DashboardPage.jsx` in the same session is recomputed and
  disclosed regardless.
- **Risk:** low. No new data sources; the empty-status branch keys off
  `stats.membership_status`, which the API already returns. The
  `sr-only` role=status element must be added inside the existing
  `aria-hidden` skeleton's parent (not to the element itself, which
  would silence it) — a real footgun and the main review point for that
  branch. The other risk is interaction between the new apply-branch and
  the existing "all clear" branch: as written, the "apply" branch must
  not fire when the member merely has `stats === null` (endpoint down)
  — otherwise scenario 6's graceful degradation silently becomes a
  permanent "apply" nudge for every existing member whose endpoint had a
  transient error. That condition needs a load-settled guard, not just a
  null check.
- **What could NOT be verified here:** no browser session at any width
  (auth-gated), so neither concept's chips, tiles, date blocks or cards
  were visually confirmed; no live data for any scenario; no
  screen-reader pass; no fresh 40-box critique table (the single-context
  degraded disclosure above covers this). Every verdict in the table is
  source-level reasoning over the two files and their shared loader, not
  a rendered observation. A reviewer with Supabase credentials should
  treat the scenario table as a strong structural hypothesis and re-walk
  scenarios 1–3 and 7 at 375 and 1280 in a real browser before acting on
  the follow-up spec below.

### Follow-up spec (only if the recommendation is adopted; not implemented here)

**T44 — Portal dashboard: adopt two pieces from the T43 comparison**

**Branch:** `task/t44-dashboard-adopt-t43` (new, off current `main`)
**Depends on:** none (T43 is decision support; this spec reads its report,
not its branch — T41 code is closed and must not be cherry-picked).
**Status:** unassigned

**Context.** T43 compared T41's status-led lead panel with `main`'s
"this month" priority card across seven scenarios and found the card
better in four, tied elsewhere, and the panel better only for the
brand-new member (scenario 7). Two narrow adoptions close the gap without
re-opening the hierarchy question. No T41 code, no `StatusChip` (T40's
dependency), no `justLoggedIn` logic — those are closed with T41/T40.

**What to build.** `lmsa-website/src/pages/portal/DashboardPage.jsx` only:

1. **New priority branch, "no membership status on a loaded account"** —
   ranked first after the "pending" branch, before the
   registered/next-event/all-clear branches, and **gated on the load
   having settled** (roughly `!loading && stats && !stats.membership_status`,
   so a transient `/dashboard/stats` failure in scenario 6 cannot turn
   into a permanent "apply" nudge). Title: "Membership application not
   started yet". Body: "LMSA membership is how you register for events,
   join committees, and stay in good standing." CTA: "Apply for
   membership" → `/membership#apply`.
2. **`sr-only` loading announcement** in the priority-card skeleton:
   add `<span className="sr-only" role="status">Loading your next
   update…</span>` inside the skeleton block (which currently is
   `aria-hidden` — the announcement must live on a sibling of that
   structure or on an un-hidden wrapper, never on the `aria-hidden`
   element itself). One instance, in that skeleton only.

**Do not change:** the loader, the partial-error banner, existing
ranking branches and their copy, the dismissal (sessionStorage) behavior,
quick actions, stat grid, event or news sections, or anything outside
this file. No `StatusChip`, no lead-panel layout, no `StatusBadge` change.

**Acceptance criteria.**

- [ ] `npx eslint src --ext js,jsx --max-warnings 0` and `npm run build`
      clean.
- [ ] Applied-member regression: for every existing priority scenario
      (pending; registered ≤30 days; next-site-event, including the
      already-registered dedupe; all clear), the rendered card is
      **byte-identical to `main` before this branch** — the new branch
      must not fire in any of them.
- [ ] Scenario-7 correctness: with stats loaded and
      `membership_status` empty/falsy, the card shows the new
      "Apply for membership" branch with the exact title/body/CTA text
      above, once, dismissible, not doubling with the stat-grid apply
      link visible at the same time unless both are truthful (they are,
      but the card must not rely on the stat link).
- [ ] Scenario-6 correctness: with `/dashboard/stats` failing but events
      endpoints succeeding, the card must NOT show the apply branch; it
      must fall through to the event branches exactly as on `main` today.
- [ ] Keyboard order unchanged; the new `role=status` announcement is
      reachable by screen readers while loading, and is not inside any
      `aria-hidden` element.
- [ ] Report includes a fresh impeccable `critique` on
      `DashboardPage.jsx` with the degraded no-browser disclosure per the
      standard (auth gate unchanged), and states explicitly what was and
      was not browser-verified.
- [ ] No file outside `DashboardPage.jsx` changes. No mock auth, no
      env-var bypass, no preview hooks.

*(Report block ends.)*"""

s = s[:idx] + report + s[idx + len(marker):]
with io.open(p, 'w', encoding='utf-8', newline='') as f:
    f.write(s)
print('Report inserted, length:', len(report))
