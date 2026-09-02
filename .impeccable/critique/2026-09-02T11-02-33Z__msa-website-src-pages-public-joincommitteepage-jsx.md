---
target: the get-involved/committees page
total_score: 19
max_score: 36
na_heuristics: 7
p0_count: 2
p1_count: 2
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/JoinCommitteePage.jsx"
target_fingerprint: "sha256:0b1852c4aef14230040612469774efd9dfb63dae061705e18be3fdf922d3b628"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/JoinCommitteePage.jsx
timestamp: 2026-09-02T11-02-33Z
slug: msa-website-src-pages-public-joincommitteepage-jsx
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session; Assessment A ran first and finished before any detector output was consulted, then Assessment B ran in the same context)

**Target:** `lmsa-website/src/pages/public/JoinCommitteePage.jsx` (route `/get-involved/committees`) · **Mode:** Persuade · **Slug:** `msa-website-src-pages-public-joincommitteepage-jsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Seven "Apply now" buttons do nothing at all; the page also advertises a deadline that passed three months ago |
| 2 | Match System / Real World | 2 | 7 committees here vs 12 on `/leadership/committees`, with different focus copy and invented openings counts |
| 3 | User Control and Freedom | 3 | No traps, no modals, nothing to undo |
| 4 | Consistency and Standards | 2 | The sibling page uses `editorial-link-card` as real links; here it's on inert `<article>`s while the CTA is a `<button>` where the rest of the site uses `<Link>` |
| 5 | Error Prevention | 2 | The page cannot express "applications are closed" — the state is hardcoded and already stale |
| 6 | Recognition Rather Than Recall | 2 | One line of focus per committee, and no link to the seven detail pages that already exist |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no repeat-use accelerators apply |
| 8 | Aesthetic and Minimalist Design | 2 | Five sections, three of them card grids; deadline repeated 8×; decorative `01`–`07` numbering |
| 9 | Error Recovery | 2 | Nothing can fail because nothing happens; the only working route is a fallback contact CTA |
| 10 | Help and Documentation | 3 | A real, concrete FAQ — eligibility, term, multiple committees, 3–5 hrs/month. The page's best asset |
| **Total** | | **19/36** | **Acceptable (53%)** |

Heuristic 7 scored `n/a` on this Persuade surface, so the applicable maximum is 36.

## Design Specificity Verdict

**LLM assessment (unanchored).** Category-interchangeable apart from the seven committee names. Swap them out and this is any student society's recruitment page: no photography (the rendered page contains exactly one image — the layout's hero), no committee members, no quote from anyone who has served, no project, outcome, or date that only LMSA could own. The benefits list ("Hands-on experience", "Boost your CV") is the generic six. What specificity exists comes from the FAQ, which is genuinely LMSA-shaped ("3-5 hours per month", annual appointment, one-committee recommendation).

The sharper problem is that this page has a **thinner twin two clicks away**. `/leadership/committees` (`CommitteesPage.jsx`) lists twelve committees, each with a slug, a member count, and a real `<Link>` to `/leadership/committees/:slug` — pages that exist and, per T3 on the orchestration board, are wired to the committee API. This page lists seven of those twelve with different focus copy ("Academic standards and curriculum support" vs "Curriculum and academic standards"), a different number per card (openings vs members), and no link to any of them. Two pages, same subject, no shared source of truth, and the one whose job is conversion is the less informative of the two.

Structurally: five sections, three of them card grids (committees 3-up, benefits 3-up, process 4-up), alternating `#f7f6f2` / `#ebeae4`. The rhythm is the house rhythm, so it reads as the same site — but nothing on the page is a peak.

**Deterministic scan.** `detect.mjs --json` on the source returned **0 findings** — the markup is clean by every rule the detector owns. Because that scan reads utilities and not layout, I also rendered the page (`PageHero` + `JoinCommitteePage` via `react-dom/server`), inlined the built stylesheet, and scanned the result: 19 findings against a 17-finding baseline (same stylesheet, empty body), so **2 introduced**. Both are `gray-on-color` — `text-gray-500 on bg-blue-800` and `text-gray-600 on bg-blue-800`. **Both are false positives**: jsdom confirms **0** elements with gray text sit inside the page's only `bg-blue-800` element (the route's blue hero, whose only text colour is `text-blue-100`); the 17 gray-text utilities live in the body. The detector paired them at page level, not ancestor level — the same co-occurrence artifact that produced the partnership page's three false positives.

**Measured by hand where neither pass reached.**
- **"Apply now" — white on `bg-lmsa-600` `#0C8950` at 14px semibold = 4.46:1.** Fails AA (4.5:1). The only genuine contrast defect on the page; `bg-lmsa-700` gives 5.48:1 and matches the fix already applied on the partnership page.
- Everything else passes: card eyebrow 4.83:1, deadline 4.83:1, openings label 5.92:1, committee name 10.96:1, focus 7.56:1, stats 5.48–10.14:1, FAQ 5.48–10.14:1, callout action 8.69:1.
- Structural: **7 `<button type="button">` elements, 0 handlers, 0 links inside the 7 committee cards, 2 working links on the entire page** (hero CTA and closing callout). The deadline string appears **8 times**.
- One apparent failure I checked and discarded: the callout overline reads 1.48:1 under jsdom, but the built CSS places `.editorial-callout .editorial-overline` (lmsa-200) after `.editorial-overline` (lmsa-700) with higher specificity, so a real browser renders 6.85:1. jsdom's cascade ignores specificity; the browser does not.

**Visual overlays.** Not available. No browser automation is exposed in this session and no Chromium can be provisioned — Playwright's and Puppeteer's CDNs are unreachable from this sandbox (npm registry proxied, general internet not), and extracting the `@sparticuz/chromium` binary from its npm tarball dies on missing system libraries. No `[Human]` overlay exists; the fallback signal is the static source read, the SSR render, jsdom computed styles, and contrast arithmetic.

## Overall Impression

A well-written page attached to a broken machine. The copy is confident, the FAQ is genuinely useful, the structure is disciplined — and the one thing the page exists to do, "Apply now", is wired to nothing. Seven identical buttons, no handler, no destination, no disabled state, on a page whose headline promises "you do not need to wait for a title to start doing meaningful work." Judged as information it is a 7/10; judged as a conversion surface it is a 0, because the conversion does not exist. The single biggest opportunity is not visual at all: make the primary action real, and make the seven cards lead somewhere.

## What's Working

1. **The FAQ is excellent and rare.** Four questions a real applicant actually asks — who can join, how long, can I join more than one, what's the time commitment — answered concretely ("Most committees meet monthly… Expect 3-5 hours per month"). This is the page's strongest element and most association sites have nothing like it.
2. **The four-step process is honest and legible.** Apply → Review → Interview → Join, with "Brief interview (if needed)" hedged rather than over-promised. It sets expectations instead of selling.
3. **The house system is respected.** `EditorialSectionHeader`, `site-container`, `editorial-section` banding, correct `h1` (from the layout's `PageHero`) → `h2` → `h3` order, every decorative icon `aria-hidden`, global `*:focus-visible` ring. It looks and reads like the same product as the other 27 pages.
4. **The voice is good.** "Small teams are where confidence becomes capability." is a better line than most of the site manages.

## Priority Issues

**[P0] "Apply now" does nothing — the page's primary action is inert.**
- **Why it matters:** rendered DOM confirms 7 `<button type="button">` elements with no `onClick`, no form, no modal, no navigation. Clicking one gives zero feedback: no loading state, no error, no confirmation. There is no committee application flow anywhere in the codebase — `committee.service.js` has `submitContactForm` but no apply method, and the one comparable CTA on the site (`CategoriesPage.jsx`) is a real `<Link to="/membership#apply">`. A student who wants to serve hits a dead button and concludes either the site is broken or they are not eligible.
- **Fix (two options, ascending cost):** (a) hand off to something that exists today — each card links to `/leadership/committees/:slug`, and the CTA becomes `/contact?topic=committee&committee=<slug>`, which `committeeService.submitContactForm` can already carry; (b) build the real flow — an application form plus endpoint, mirroring the membership application T9/T10 already shipped. Either way the button must be a `<Link>` or have a handler, and it must carry which committee was chosen.
- **Suggested command:** `$impeccable shape lmsa-website/src/pages/public/JoinCommitteePage.jsx`

**[P0] The deadline is three months in the past.**
- **Why it matters:** "Applications are open through May 31, 2026" — today is 2026-09-02. The page asserts, eight separate times, that something is open which is not. A student who discovers this stops trusting every other date on the site; and the page has no vocabulary for "closed" because the date is hardcoded seven times in a data array. This is a site-wide pattern, not a one-off: `SymposiaPage.jsx` still lists "March 20-21, 2026" as `Upcoming`.
- **Fix:** one source of truth for the deadline (config or the committee API), rendered once, with a real closed state ("Applications for the 2026/27 year have closed — here's when the next round opens") instead of a date that silently rots.
- **Suggested command:** `$impeccable harden lmsa-website/src/pages/public/JoinCommitteePage.jsx`

**[P1] Two pages, two versions of the committees.**
- **Why it matters:** `/leadership/committees` shows 12 committees with slugs, member counts, and working links to detail pages. This page shows 7 of those 12 with different focus copy and invented opening counts (3+5+2+4+3+2+3 = 22, matched to a "22 Open positions" stat — internally consistent, externally untrue). Five committees (Finance & Budget, Ethics & Discipline, Legislative Affairs, Sports & Recreation, Cultural Affairs) do not exist here at all, so a student browsing this page can never apply to them.
- **Fix:** one committee list in one place (the T1 API or a shared module), rendered by both pages with different fields — this page adds openings/deadline, the other adds members/projects. Delete the second copy.
- **Suggested command:** `$impeccable shape lmsa-website/src/pages/public/JoinCommitteePage.jsx`

**[P1] Seven detail pages exist and this page links to none of them.**
- **Why it matters:** the entire page contains **two** working links (hero CTA, closing callout). "Find the committee that fits your interests" then offers one line of focus per committee and no way to learn more — while `/leadership/committees/:slug` pages exist for exactly that, wired to real data since T3. The choice the page asks a student to make is the one decision it gives the least support for.
- **Fix:** make each card a link to its committee page, and put "Apply now" inside it as a secondary action. The `editorial-link-card` class already ships the arrow, the hover lift, and the focus ring for exactly this.
- **Suggested command:** `$impeccable polish lmsa-website/src/pages/public/JoinCommitteePage.jsx`

**[P2] False affordance, and no state for a full or closed committee.**
- **Why it matters:** `editorial-link-card` promises clickability (hover lift, shadow, focus ring, arrow slot) on seven non-interactive `<article>`s, and the one real control inside them does nothing. There is also no representation for a committee with 0 openings or a closed round — the page can only ever look open.
- **Fix:** card = link, CTA = real action, and add the closed/full state now so it exists when the data needs it.
- **Suggested command:** `$impeccable polish lmsa-website/src/pages/public/JoinCommitteePage.jsx`

**[P2] Contrast, repetition, and grid defects.**
- **Why it matters:** "Apply now" is white on `lmsa-600` at 4.46:1 — a marginal AA fail on the most important control on the page. The deadline is repeated 8 times. The process grid goes 4-up at `md` (~180px columns at 768px, so "Brief interview (if needed)" wraps to three lines). The hero stat grid is `sm:grid-cols-3` holding 2 stats, leaving an empty cell and a ragged right border. Committee and benefit cards carry `01`–`07` numbering whose sequence carries no information.
- **Fix:** `bg-lmsa-700` on the CTA (5.48:1); state the deadline once in the section header; `md:grid-cols-2 lg:grid-cols-4` for the process; size the stat grid to its item count; drop the decorative numbers on the two card sets and keep them only on the four-step process, where the sequence is the point.
- **Suggested command:** `$impeccable audit lmsa-website/src/pages/public/JoinCommitteePage.jsx`

## Persona Red Flags

**Jordan (Confused First-Timer)** — a first-year member who wants to contribute. She reads "Applications are open through May 31, 2026", picks Community Health (5 openings), and clicks **Apply now**. Nothing happens — no new page, no form, no message, not even a spinner. She clicks again, then tries Professional Development, same result. The FAQ tells her all active members in good standing are eligible, so she concludes her *membership* must be the problem, and leaves to email someone instead. Red flags: zero feedback on the primary action, no confirmation of any kind, a status claim the page cannot back up.

**Riley (Deliberate Stress Tester)** — clicks all seven buttons, opens devtools, and finds no handler and no network request. Jumps to `/leadership/committees` and counts twelve committees against this page's seven, with five absentees and two different focus strings for the same committee. Notices the deadline is 94 days stale, that `SymposiaPage` has the same rot, and that `CategoriesPage`'s "Apply now" works because it's a `<Link>`. Red flags: silent no-op control, two conflicting sources of truth, no state for closed/full, invented counts that reconcile with each other but with nothing else.

**Casey (Distracted Mobile User, Monrovia, one thumb)** — on a phone the seven cards stack to roughly seven screens before the FAQ, each card ~250px tall (icon, copy, footer rule, button). The only two working links are at the very top and the very bottom; the button she actually wants sits mid-card, mid-page, and does nothing when she taps it. Red flags: primary action buried in a long scroll, no sticky or repeated CTA, and the one control she reached for is inert.

## Minor Observations

- No imagery below the hero — the rendered page contains one image, the layout's `PageHero` photo.
- The FAQ's questions are `<b>` inside a `<span>` with a `<br />`, not headings — screen-reader users can't jump between questions with heading navigation. A `<dl>`, or `h3` + `p` per row, costs nothing.
- "22 Open positions" is correct arithmetic on invented numbers; internal consistency is not the same as being true.
- The closing callout's CTA is "Contact LMSA" — the only working action on the page, and it's framed as a fallback rather than the goal.
- The page never says when applicants hear back, even though steps 2–4 imply a review and interview.
- Site-wide and pre-existing: this page also nests a `<main>` inside `PublicLayout`'s `<main id="main-content">` (fixed on `/partnership`, still open on the other 27 pages).
- `0{index + 1}` would render `010` at ten items; `CommitteesPage` already uses `String(index + 1).padStart(2, '0')`. Worth matching.

## Questions to Consider

- What should "Apply now" actually do — a real application flow, or a routed hand-off to something that exists today?
- Should this page exist separately from `/leadership/committees` at all, or should one page carry both "what the committees are" and "how to join one"?
- When the deadline passes, who updates it — and why is that date in seven places instead of one?
- Would showing a committee's actual work (its projects, its members, a photo from a health camp) recruit better than "Boost your CV"?
