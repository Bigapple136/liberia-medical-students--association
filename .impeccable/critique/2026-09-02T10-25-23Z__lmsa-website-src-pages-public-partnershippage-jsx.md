---
target: the partnership page
total_score: 21
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 3
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/PartnershipPage.jsx"
target_fingerprint: "sha256:0c5ea296470a4ecf033ff501c718b876d9ade40902acaa3b8dc3a162f730b452"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/PartnershipPage.jsx
timestamp: 2026-09-02T10-25-23Z
slug: lmsa-website-src-pages-public-partnershippage-jsx
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session; Assessment A ran first and finished before detector output was consulted, then Assessment B ran in the same context)

**Target:** `lmsa-website/src/pages/public/PartnershipPage.jsx` · **Mode:** Persuade · **Slug:** `lmsa-website-src-pages-public-partnershippage-jsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Static page; "Get started" sets no expectation of what happens next or when |
| 2 | Match System / Real World | 2 | Placeholder `+231 77 000 0000`; unlabelled USD prices; partner blurbs restate their own category |
| 3 | User Control and Freedom | 3 | No traps or modals; exits are header/footer only |
| 4 | Consistency and Standards | 3 | House `editorial-*` classes throughout, but `editorial-link-card` (hover-lift + focus ring) is on non-interactive `<article>`s; partner and tier cards hand-roll `border border-gray-200 bg-white p-6` |
| 5 | Error Prevention | 2 | No input here, but the hand-off to `/contact` captures no context — free-text Subject, no tier, no intent |
| 6 | Recognition Rather Than Recall | 3 | "All Silver benefits" / "All Gold benefits" forces cross-column recall; no comparison table |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no repeat-use accelerators apply |
| 8 | Aesthetic and Minimalist Design | 2 | Clean type and rhythm, but 8 sections with 6 identical overline + statement + card-grid blocks, zero imagery, and the same two stats repeated top and bottom |
| 9 | Error Recovery | 2 | The only failure path (email/phone) has no fallback, no second named contact, no confirmation |
| 10 | Help and Documentation | 2 | No "what happens next", no prospectus or deck, no FAQ, no timeline |
| **Total** | | **21/36** | **Acceptable (58%)** |

Heuristic 7 scored `n/a` on this Persuade surface, so the applicable maximum is 36.

## Design Specificity Verdict

**LLM assessment (unanchored).** Category-interchangeable. Swap "LMSA" and "Liberia" for any national student association and nothing on this page would need to change: there is no fact, face, photograph, logo, quote, or number here that only LMSA could own. The six partner cards render as generic lucide glyphs (`Building2`, `BookOpen`, `Heart`) paired with descriptions that merely restate their own category — "AMAMU Medical College — Academic institution partnership", "Red Cross Liberia — Humanitarian organization partnership". The design system ships a `Photo` component and a `stockPhotos` library (`src/config/images.js`) used on HomePage and the committee pages; this page uses neither. `lmsa_website_plan.md` specifies "**Our Partners** (logos + descriptions)" and a homepage "Partners & Supporters (logo carousel)" — neither exists here.

Structural sameness is the deeper problem: eight sections, six of which are the literal same three-part block (11px uppercase overline → sentence-case statement headline → 2–3 column card grid), distinguished only by alternating `#f7f6f2` / `#ebeae4` banding. Two of the remaining sections are stat bands, and one is a callout. There is no peak, no contrast in scale, no moment where the page stops talking and starts showing.

**Deterministic scan.** `node .agents/skills/impeccable/scripts/detect.mjs --json lmsa-website/src/pages/public/PartnershipPage.jsx` returned 3 findings, all `gray-on-color` (warning, quality) at line 82. All three are false positives from line-level co-occurrence: line 82 is the entire single-line tier map, so `bg-amber-500` (the "Most popular" badge) shares a line with `text-gray-900` / `text-gray-700` / `text-gray-500` belonging to the white and purple cards. No layout, typography, or accessibility rule fired — the detector reads markup, so it structurally cannot see the ragged stat grids, the duplicated stats, or hover states on non-interactive cards.

**Measured by hand where neither pass reached:**
- `bg-amber-500` = `#f59e0b` (Tailwind default; `tailwind.config.js` only extends amber 50/100/400/600/800) with `text-white` at 12px bold = **2.15:1**. Fails WCAG AA (4.5:1).
- Tier CTA `bg-lmsa-600` `#0C8950` with white 14px semibold = **4.46:1**. Marginal AA fail.
- `.editorial-stat-grid` is `sm:grid-cols-3`. The hero puts 2 stats in it (one empty cell, ragged right border); the closing band puts 4 in it (orphan row of one).

**Visual overlays.** Not available. No browser automation is exposed in this session and no browser binary could be provisioned: Playwright's Chromium CDN and Puppeteer's storage host are both unreachable from this sandbox (npm registry is proxied; general internet is not). No `[Human]` overlay exists — fallback signal for this run is the static source read, Tailwind token math, and a Vite dev server on port 5173 so the page can be looked at directly.

## Overall Impression

Well-mannered, competent, and completely forgettable. Every section is correct and none is persuasive. The page has the tone of an internal brief — "here are the categories of partnership we accept" — where a Persuade surface needs an argument: who you'd be betting on, what they've already done, and what you get. The single biggest opportunity is that this is an informational artefact pretending to be a persuasive one; the fix is not polish, it is evidence and a real conversion path.

## What's Working

1. **Editorial system discipline.** Every section uses `EditorialSectionHeader` inside `site-container` / `editorial-section`, so this page is unmistakably the same product as Volunteer, Dues, and Membership. The type scale — `text-3xl/md:text-4xl` headlines at `-0.03em` tracking, 11px `0.18em` overlines, `text-4xl` stats at `-0.05em` — is genuinely refined and gives the page a calm authority most association sites lack.
2. **Accessibility hygiene is above average.** `aria-hidden="true"` on every decorative icon, a global `*:focus-visible { ring-2 ring-lmsa-600 ring-offset-2 }`, real `mailto:` and `tel:` anchors, semantic `<section>` / `<h2>` / `<h3>` order, and a keyboard-reachable focus ring on the link-card pattern.
3. **The voice is confident without being corporate.** "The future of healthcare is a shared project." and "In-kind support can meet an immediate need." sound like an organisation that knows what it wants, not like a template.

## Priority Issues

**[P0] Unverifiable institutional claims and a placeholder phone number.**
- **Why it matters:** the page asserts collaborations with the Ministry of Health and the WHO Liberia Office, and lists Liberia Medical Association, Red Cross Liberia, and Liberia College of Physicians as current partners — with nothing anywhere else in the repo corroborating them. Publishing named institutional affiliations that aren't confirmed is a reputational and legal hazard for a student association, and it is the first thing a visiting partner will check. Meanwhile the only phone number is `+231 77 000 0000`, which reads as scaffolding to every adult who sees it; a partner who prefers to call simply cannot.
- **Fix:** confirm each named partner in writing before this page ships, or relabel the section "Organisations we are working with" / "Prospective partners" and say so. Replace the phone number with a real line, or drop the phone and keep email + form.
- **Suggested command:** `$impeccable harden lmsa-website/src/pages/public/PartnershipPage.jsx`

**[P1] Zero proof substrate: no logos, no quotes, no outcomes.**
- **Why it matters:** trust is the entire product on a partnership page, and this one offers none of the three currencies of trust — recognition (logos), testimony (a partner quote), or results (what a past partnership produced). The six cards are icon + tautology. The stats ("6+", "500+", "$15K+", "12") carry no date, source, or definition, so a sceptical reader discounts all four.
- **Fix:** lead the partner section with real logos at a consistent height (the plan already specifies a logo carousel); add one attributed quote from a named partner; convert the four stats into two dated, sourced, specific claims — "38 students placed in 2024 clinical placements" beats "500+ Students impacted".
- **Suggested command:** `$impeccable craft` (new-work) or `$impeccable bolder lmsa-website/src/pages/public/PartnershipPage.jsx`

**[P1] The conversion path is a dead end.**
- **Why it matters:** all three "Get started" buttons and the closing "Use our contact form" callout go to the same generic `/contact`, whose form has a free-text `Subject` input and no topic select. Clicking Gold tells LMSA nothing; if the user bounces or the tab closes, the intent is gone. There is no named contact, no response-time expectation, no downloadable prospectus, and no statement of what happens after you write.
- **Fix:** make the tier CTA carry its choice — `/contact?topic=partnership&tier=gold` and have ContactPage prefill from the query string; add an `Inquiry type` select; state the response window ("we reply within five working days"); name a human with a role ("Partnerships Lead, External Relations Committee").
- **Suggested command:** `$impeccable shape lmsa-website/src/pages/public/PartnershipPage.jsx`

**[P1] Six near-identical sections and no imagery — the page cannot be scanned or remembered.**
- **Why it matters:** with every section at the same weight, nothing is the point. There is no visual peak, so the page has no peak-end memory at all; the emotional journey is a flat line from first viewport to last. It is also the only major page on the site with no photography whatsoever.
- **Fix:** break the rhythm deliberately — give the hero a photograph (the `Photo` component and `stockPhotos` already exist), collapse "Ways to work together" and "In-kind support" into one section or make one of them a full-bleed band, and let the tiers be the single visual peak with real scale contrast. Cut at least one card grid.
- **Suggested command:** `$impeccable layout lmsa-website/src/pages/public/PartnershipPage.jsx`

**[P2] False affordance and ragged stat grids.**
- **Why it matters:** the four "Ways to work together" cards use `editorial-link-card`, which ships `hover:-translate-y-1 hover:shadow-lg` and a focus ring, but they are static `<article>`s — the page promises clickability it doesn't deliver. Separately, `.editorial-stat-grid` is a 3-column grid that receives 2 stats in the hero (leaving an empty cell and a ragged right border) and 4 in the closing band (leaving an orphan row of one).
- **Fix:** render those four as real `EditorialLinkCard`s to the relevant route, or drop the hover treatment. Make the stat grid's column count match its item count (`sm:grid-cols-2` for the hero, `sm:grid-cols-4` for the closing band).
- **Suggested command:** `$impeccable polish lmsa-website/src/pages/public/PartnershipPage.jsx`

**[P2] Contrast and unlabelled currency.**
- **Why it matters:** "Most popular" is white on `#f59e0b` at 2.15:1 — unreadable for low-vision users, and it's the badge doing the selling. The tier CTA sits at 4.46:1, just under AA. And `$500 / $1,500 / $3,000 per year` never says which dollar; for a Liberian audience the LRD equivalent and payment route matter more than the number.
- **Fix:** use `bg-lmsa-800` or `bg-amber-800` (`#C68400` gives 4.6:1 with white) for the badge, darken the CTA to `bg-lmsa-700` (5.4:1+), and label the currency — "USD $500 / year (or LRD equivalent)".
- **Suggested command:** `$impeccable audit lmsa-website/src/pages/public/PartnershipPage.jsx`

## Persona Red Flags

**Jordan (Confused First-Timer)** — a programmes officer at a small foundation who has never heard of LMSA. She lands on "6+ Active partners / 500+ Students impacted" with no date or source, scrolls to "Our current partners" for the one thing that would tell her whether this organisation is real — and finds six grey icons with no logos. The only phone number is `+231 77 000 0000`, which she reads (correctly) as a placeholder. Nothing on the page tells her what happens after she writes, or how long it takes. Red flags: unverifiable partner claims, no logos, placeholder contact, no stated next step, no named human.

**Riley (Deliberate Stress Tester)** — reads "6+ Active partners" directly above exactly six partner cards; tries to reconcile "$15K+ Annual support value" against three tiers priced at $500/$1,500/$3,000 and cannot; looks for the currency and finds none; clicks "Get started" on Gold and lands on a free-text contact form identical to the Silver and Platinum destinations, with no tier recorded anywhere; checks whether WHO Liberia and the Ministry of Health are mentioned anywhere else in the site and finds they are not. Red flags: numbers that don't reconcile, three CTAs that are the same CTA, unsupported institutional claims, no state carried across the hand-off.

**Casey (Distracted Mobile User, Monrovia, one thumb, on mobile data)** — the page is a single vertical stack of eight sections. The first "Get started" button sits roughly six screens down, inside the tier section; the two contact shortcuts (email and phone) are the very last elements on the page; there is no sticky CTA, and the hero has no image to orient her. A page whose only fast paths are at the bottom will lose the interruption-prone user. Red flags: primary action above the fold is absent, contact affordances below the fold, no persistent CTA, no imagery to break the scroll.

## Minor Observations

- No `<h1>` anywhere on the page. This is a site-wide pattern across the editorial pages (`Volunteer`, `Dues`, `Membership` too) — the only `<h1>` in the codebase lives in `PageHero.jsx`, which no page renders. No per-page `<title>` either: `PageMeta` is imported by zero pages, so every route ships "The voice of Liberia's future physicians | LMSA".
- The hero's two stats (`6+` Active partners, `500+` Students impacted) are repeated verbatim in the closing stat band.
- The partner "type" badge renders *after* the description, so the word that categorises the card is the last thing read.
- `.editorial-stat` keeps its `border-b` on the final item of the 4-stat grid, doubling up against the section border.
- `tierStyles` reaches for `bg-purple-50` / `border-purple-300` on Platinum, importing a "premium" palette that appears nowhere else on the page; the gold card's `border-amber-300` on `bg-amber-50` is nearly invisible.
- Tier cards hold 5, 6, and 7 list items respectively at equal height with no cross-column alignment — the tiers can't be compared by scanning.
- The page is 100% static with no data layer, so when a real partner list eventually arrives there is nowhere for it to load — no loading or empty state is designed for.

## Questions to Consider

- If a Ministry of Health programme officer opened this page on their phone, which single element would convince them LMSA is a credible counterparty? Right now: none.
- What would this page look like if it opened with one partnership that actually happened — the programme, the number of students, the year, and what the partner got?
- Why are there six "partner" cards with no logos when the site plan specifies a logo carousel and "logos + descriptions"?
- Should the tiers be prices at all, or should the first conversation be "tell us what you can give" — with tiers revealed only after contact?
