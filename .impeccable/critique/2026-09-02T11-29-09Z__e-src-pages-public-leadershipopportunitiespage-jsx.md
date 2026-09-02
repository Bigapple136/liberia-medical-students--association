---
target: the get-involved/leadership page
total_score: 17
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx"
target_fingerprint: "sha256:a8e44178bbca59681dfee3adc01fe1bd7cf2d7ca8240dcc01ad74bf0b2f287af"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx
timestamp: 2026-09-02T11-29-09Z
slug: e-src-pages-public-leadershipopportunitiespage-jsx
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session; Assessment A ran first and finished before any detector output was consulted, then Assessment B ran in the same context)

**Target:** `lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx` (route `/get-involved/leadership`) · **Mode:** Persuade · **Slug:** `e-src-pages-public-leadershipopportunitiespage-jsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | "Elections are held annually" is the entire status story — no date, no window, no open/closed state, no current year |
| 2 | Match System / Real World | 2 | Plain language, but the five executive titles are hardcoded while `/leadership` renders the real ones from the API; "Committee Chairs" is an appointment offered as an opportunity |
| 3 | User Control and Freedom | 3 | No traps, no modals, nothing to undo |
| 4 | Consistency and Standards | 2 | Closes with the same sentence and the same button as `/leadership`; the sibling `/get-involved/committees` now has a real action and this one doesn't |
| 5 | Error Prevention | 2 | Nothing to fill in — but the one CTA sends a candidate to committees, which is a different task |
| 6 | Recognition Rather Than Recall | 2 | Roles are visible; "how do I stand?" is never answered, and the constitution article that answers it is never linked |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no repeat-use accelerators apply |
| 8 | Aesthetic and Minimalist Design | 2 | Four sections, three near-identical white cards, eight numbered benefits, one image on the whole page |
| 9 | Error Recovery | 2 | No failure states, because nothing can be attempted |
| 10 | Help and Documentation | 1 | No process, no timeline, no eligibility detail beyond a phrase; Constitution Article IV "Elections & Appointments" exists and is unlinked |
| **Total** | | **17/36** | **Poor (47%)** |

Heuristic 7 scored `n/a` on this Persuade surface, so the applicable maximum is 36. The score is low for a reason the eye doesn't see: the page is visually clean and fully accessible — its deficit is functional. There is nothing on it to do.

## Design Specificity Verdict

**LLM assessment (unanchored).** Category-interchangeable, and thinner than the two pages critiqued before it. Every line could belong to any student association anywhere: three levels of leadership, eight abstract benefits ("Enhance your CV/resume", "Improve public speaking abilities"), no person, no photograph, no term dates, no election result, no quote from anyone who has held one of these roles. The rendered page contains **one image** — the layout's hero — and **one link in the entire body**.

The sharper problem is that this page has a **twin** at `/leadership`. `LeadershipPage.jsx` fetches real executive positions (`executiveService.getAll()`, T19/T20), shows the current academic year from that data, describes "How the work is organized", and closes with a callout reading *"Elections are held annually. Start by finding the work that matters to you."* and an action labelled **"Explore committees" → `/leadership/committees`**. This page closes with *"Elections are held annually. Your first step can start today."* and the same **"Explore committees" → `/leadership/committees`**. Two routes, one message, one button — and the version without the real data is the one asking people to stand.

What this page uniquely contributes is genuinely good: the three-level model (Executive Committee / Class Representatives / Committee Chairs) with term and eligibility for each. That table is the page's only asset, and it has no action attached to it.

**Deterministic scan.** `detect.mjs` on the source: **0 findings**. On the SSR-rendered page with the built stylesheet inlined: 20 findings against an 18-finding baseline, so **2 introduced** — `gray-on-color`, `text-gray-600` and `text-gray-700` on `bg-amber-800`. **Both are false positives**, and this is the third page in a row to trip the same artifact: the route's hero is gold (`bg-amber-800`), the body contains 30 elements with gray-600/700 text, and jsdom confirms **0** of them sit inside an amber-800 ancestor. The detector pairs at page level, not ancestor level.

**Measured by hand where neither pass reached.**
- **No contrast defects at all** — the first of the three pages to earn that. Position chips 7.32:1, level eyebrow 5.92:1, level title 10.96:1, term/eligibility 7.56:1, benefit text 9.53:1, benefit number 5.48:1, section description 6.99:1, intro prose 9.53:1, callout action 8.69:1. Non-text icons 4.46:1 and 4.12:1, both above the 3:1 threshold.
- (One apparent failure discarded: the callout overline reads 1.48:1 under jsdom because jsdom's cascade ignores specificity, but the built CSS puts the two-class `.editorial-callout .editorial-overline` rule after the one-class `.editorial-overline` rule, so a real browser renders lmsa-200 on lmsa-900 = 6.85:1.)
- Structural: **1 `<h1>`** (layout hero), 4 `h2`, 3 `h3`, **2 links on the whole page** (hero CTA, closing callout), 1 image, 20 `aria-hidden` icons, 0 `sr-only` strings.

**Visual overlays.** Not available — no browser automation exposed, and no Chromium can be provisioned (Playwright's and Puppeteer's CDNs unreachable; the `@sparticuz/chromium` binary dies on missing system libraries). No `[Human]` overlay exists. Fallback signal: source read, SSR render, jsdom computed styles, contrast arithmetic, and the dev preview on port 5173.

## Overall Impression

The tidiest page of the three and the least useful. It explains leadership, beautifully and accurately, and then stops one step short of the only thing a reader came for: how to put their name forward. There is no form, no email, no nomination route, no date, no process, and no link to the constitution article that covers elections and appointments. The single callout promises three things — "Explore committees, meet the current leadership team, and learn where your contribution could be most useful" — and links one of them, to a page that isn't about standing for election. The biggest opportunity is small and specific: give the three levels an action and the elections a date.

## What's Working

1. **Accessibility and contrast are clean** — the only one of the three pages with zero contrast defects, correct `h1` → `h2` → `h3` order (the `h1` comes from the layout's `PageHero`), every decorative icon `aria-hidden`, and the global focus ring. Whoever built this page did the invisible work properly.
2. **The three-level model is genuinely useful.** Executive Committee / Class Representatives / Committee Chairs, each with its term ("1 year") and its eligibility ("Full members in good standing", "All medical students", "Appointed by Executive Committee"). Concrete, honest, and the page's one unique asset.
3. **The voice is the best on the site.** "Leadership is a skill you build by taking responsibility." and "The role ends. The skills stay." are real sentences, not brochure filler.
4. **It respects the house system.** `EditorialSectionHeader`, `site-container`, editorial banding — it reads as the same product as the other 27 pages.

## Priority Issues

**[P0] There is nothing to do.** The page's purpose is to produce candidates; the body contains **one link**, and it is "Explore committees" → `/leadership/committees` — a page about joining committees, not standing for election. No declaration of interest, no nomination route, no leadership-specific contact, no per-level action on the three cards. Compare the sibling `/get-involved/committees`, which now has a real apply dialog and per-card states; the pattern exists in this codebase and simply hasn't been applied here.
- **Why it matters:** a member who finishes this page wanting to run for Class President has been told the role exists and nothing else. The drop-off is total, and it's silent — there's no button to click and discover is broken.
- **Fix:** (a) minimum — per-level actions routing to a real hand-off, `/contact?topic=elections&role=class-president`, plus a leadership-specific callout; (b) proper — an expression-of-interest flow reusing the committee application pattern just built (`committee_applications` generalised, or a sibling table), with nominations opening and closing on real dates.
- **Suggested command:** `$impeccable shape lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

**[P1] No process, no dates, no current cycle.** "Elections are held annually" is the whole story: no month, no nomination window, no who-to-talk-to, no statement of whether a round is open. Meanwhile the constitution carries **Article IV — "Elections & Appointments"** (`ConstitutionPage.jsx`) and is never linked, and `/leadership` already displays the current academic year pulled from real data while this page names no year at all.
- **Why it matters:** "annually" is not a plan a student can act on. The person most likely to stand is the one who needs a date and a deadline, and the site has both — one in the constitution, one in the database — and shows neither here.
- **Fix:** state the cycle (nominations open → close → election), render an open/closed state from data, link Article IV, and show the current academic year as `/leadership` does.
- **Suggested command:** `$impeccable harden lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

**[P1] It is a near-duplicate of `/leadership`.** Both pages describe the leadership structure and close with near-identical copy ("Elections are held annually…") and the identical action ("Explore committees" → `/leadership/committees`). Neither page links `/leadership/executive-council` or `/leadership/past-presidents`, although both exist and the callout text promises "meet the current leadership team".
- **Why it matters:** two routes saying the same thing split the SEO signal, confuse navigation, and — worse — the version with the real data (`/leadership`) is the one that doesn't ask you to act.
- **Fix:** differentiate hard. `/leadership` = who leads now, from the API. This page = how to stand: eligibility, timeline, nomination, what the job involves. Then link each to the other, and link both to the executive council.
- **Suggested command:** `$impeccable shape lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

**[P2] Hardcoded positions sitting beside the real ones.** `/leadership` renders executive positions from `executiveService.getAll()`; this page hardcodes five titles (President, Vice President, Secretary General, Treasurer, Public Relations Officer). `position_name` is free text set by admins, so the two can drift apart — the same "two truths" defect the committee pages had. Separately, "Committee Chairs — Appointed by Executive Committee" is presented as a leadership *opportunity* when by its own eligibility line there is nothing for a reader to do.
- **Fix:** pull the executive position names from the same service the other page uses, and mark appointed roles as appointed rather than listing them among opportunities.
- **Suggested command:** `$impeccable polish lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

**[P2] Composition and craft.** Three near-identical white cards; eight benefits carrying decorative `01`–`08` numbering (the sequence carries no information — it isn't a process); `md:flex-row` puts the level title and five position chips side by side at 768px, which is too tight; the last row of benefits keeps its `border-b` against nothing; no imagery below the hero (one image on the page).
- **Fix:** switch the card row to `lg:flex-row`; drop the benefit numbering; remove the trailing border; break the card rhythm with one piece of real evidence — the current office-holders, a photograph, or one quote from a past class representative.
- **Suggested command:** `$impeccable layout lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

**[P3] The callout promises three actions and links one.** "Explore committees, meet the current leadership team, and learn where your contribution could be most useful" — only the first is a link, and it's the least relevant of the three to someone preparing a candidacy.
- **Fix:** three links, or copy that describes what the one link does.
- **Suggested command:** `$impeccable clarify lmsa-website/src/pages/public/LeadershipOpportunitiesPage.jsx`

## Persona Red Flags

**Jordan (Confused First-Timer)** — a second-year who would make a good class representative. She reads the three levels, finds "Class Representatives — All medical students — 1 year", and wants to know what to do next. There is nothing to click. She scrolls to the bottom, where the callout says "Your first step can start today" and offers one button: "Explore committees". She takes it, lands on `/leadership/committees`, and spends five minutes on a page about joining committees — a different thing — before giving up. Red flags: no action on the object of the page, a CTA that routes to the wrong task, no date she could put in her calendar.

**Riley (Deliberate Stress Tester)** — counts one link in the whole body. Notices the callout promises three actions and ships one. Opens `/leadership` and finds the same "Elections are held annually" sentence and the same "Explore committees" button on a page that has real data. Greps `executiveService` and sees `/leadership` renders positions from the API while this page hardcodes five — two sources, no guarantee they agree. Finds Constitution Article IV covers elections and appointments and is linked from neither page. Red flags: duplicate destinations, unlinked primary source, position list guaranteed to drift.

**Casey (Distracted Mobile User, Monrovia, one thumb)** — the three level cards stack; the five position chips on "Executive Committee" wrap into a block of pills that pushes the term/eligibility row down; then eight numbered benefits; then, finally, the only button. She has to scroll the entire page to find the one thing she can press, and it takes her somewhere else. Red flags: single action at the very bottom, chips that balloon at narrow widths, no sticky or repeated CTA.

**Sam (Accessibility-Dependent User)** — the one persona this page mostly serves well: heading order is correct, decorative icons are hidden, focus rings are global, and every text pair passes AA (the only page of the three with no contrast defect). The failing is navigational rather than technical: with only two links on the page, a screen-reader user jumping link-to-link finds the hero and one callout and no way to reach the executive council, the constitution, or anything about standing.

## Minor Observations

- The eight-item benefits block is byte-identical JSX to `VolunteerPage.jsx`'s — three pages now share this markup, numbering and all. If it stays, it belongs in a component.
- `0{index + 1}` renders `010` at ten items; `CommitteesPage` and the rebuilt join page now use `String(index + 1).padStart(2, '0')`. Worth matching before a ninth benefit is added.
- Neither this page nor `/leadership` links `/leadership/executive-council` or `/leadership/past-presidents`, both of which exist and are exactly what "meet the current leadership team" promises.
- Eligibility is a single phrase per level ("All medical students") with no reference to the constitution's actual rules.
- Site-wide and pre-existing: this page also nests a `<main>` inside `PublicLayout`'s `<main id="main-content">`.
- The hero for this route (`PageHero.jsx`, gold accent) already links to `/leadership` — "Meet the leadership team" — so the body's failure to link it is a missed second entry point, not an impossibility.

## Questions to Consider

- Should this page exist separately from `/leadership`, or should one route carry both "who leads now" and "how to stand"?
- What *is* the first step — a nomination form, an email to the Electoral Committee, a declaration at a general meeting? The site has a real answer somewhere; the page should say it.
- Should the position list come from the database, as `/leadership` already does?
- Would showing the current office-holders — names, photos, the year they served — recruit better than eight abstract benefits?
