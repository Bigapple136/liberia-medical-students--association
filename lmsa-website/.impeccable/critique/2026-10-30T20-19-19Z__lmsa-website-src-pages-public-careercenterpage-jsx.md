---
target: the career center page
total_score: 21
max_score: 28
na_heuristics: 5,7,9
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\goldw\\Desktop\\freelance\\liberia-medical-students-association\\lmsa-website\\lmsa-website\\src\\pages\\public\\CareerCenterPage.jsx"
timestamp: 2026-10-30T20-19-19Z
slug: lmsa-website-src-pages-public-careercenterpage-jsx
closed: true
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session — Assessments A and B ran sequentially in this context)

# Critique: Career Center page (`lmsa-website/src/pages/public/CareerCenterPage.jsx`)

Mode: Persuade (program/marketing page inside Learn & Lead)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active nav state and real h1 anchor the user; nothing dynamic needs feedback |
| 2 | Match System / Real World | 4 | Warm student voice, genuinely Liberian framing |
| 3 | User Control and Freedom | 3 | Freely navigable; no traps; nothing deepens the journey |
| 4 | Consistency and Standards | 3 | Shared editorial system; FAQ mirrors join-committee pattern |
| 5 | Error Prevention | n/a | No forms/inputs on this surface |
| 6 | Recognition Rather Than Recall | 2 | Promises without visible affordances; /contact does everything behind the scenes |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | Clean banded rhythm; "start early" said three ways |
| 9 | Error Recovery | n/a | No input/error states on the page |
| 10 | Help and Documentation | 3 | FAQ answers real anxieties and invites unanswered questions |
| **Total** | | **21/28** | **Good (75%)** |

n/a heuristics: 5, 7, 9. Max = 4 × 7 = 28.

## Design Specificity Verdict

**LLM assessment — largely authored.** Real editorial world (serif pull-notes, overline eyebrows, banded muted sections, h1→h2→h3 discipline). Copy is specific and Liberian-grounded. Two category-generic moments: featured-offer + three supporting cards is a SaaS pattern; pathways grid enumerated like a listicle. The page's most distinctive promise — a person behind every pathway — has no way to act on it.

**Deterministic scan:** clean — 0 findings (exit 0) across CareerCenterPage.jsx plus EditorialSections.jsx and PageHero.jsx. Detector and review agree: no structural/anti-pattern defects; real issues are semantic (claims vs. affordances).

**Visual evidence:** fallback signal — no browser-automation tool exposed; used committed viewports in `.taste-skill/inspect/career-r3/`. Fixtures are stale vs. current source (they show a numbered 3-column pathways grid and CTA "Your career starts earlier than you think"; source has 2-column list + photo figure and CTA "Your career starts in year one"). Source treated as truth; fixture evidence applies where layouts match.

## Overall Impression

A persuasive, well-voiced page that earns trust with specifics, then spends it on promises it doesn't wire up: the opportunity board doesn't exist as a surface, pathways have no links, and all of it resolves to a generic /contact form.

## What's Working

1. The editorial system is real and consistently obeyed.
2. The copy ("You bring the questions; the conversation works out the rest.") speaks to the actual anxiety.
3. Discipline: correct heading hierarchy, decorative images alt="", aria-hidden icon tiles, semantic dl FAQ.

## Priority Issues

1. **[P1] Promises with no affordance** — "live board of opportunities" not wired (no board route exists; News has an Opportunities category, unlinked); alumni-per-pathway pledge with zero links. Fix: wire to real destinations or soften the claim. Suggested command: `$impeccable harden`.
2. **[P1] One generic exit for three specific intents** — all CTAs lead to /contact, a form about "a question, an idea, or an opportunity to share" with no career framing; career team is nameless. Fix: career-specific handoff or copy continuity on the receiving page; name an advisor. Suggested command: `$impeccable clarify`.
3. **[P2] "Start early" repeated three times** (editorial note, closing CTA title, FAQ #3) plus FAQ #1 re-pitching advising. Fix: keep the note, redirect the CTA title toward action, shorten the FAQ answer. Suggested command: `$impeccable distill`.
4. **[P2] Reused, skewed imagery** — pathways figure reuses the mentorship hero photo; hero shows an OR team on a page about choosing among six pathways. Fix: dedicated advising photo. Suggested command: `$impeccable bolder` (imagery direction).
5. **[P3] Feature card underfilled** — large card, two short sentences plus pull-quote. Fix: add concrete details (booking, who advisors are, response time) or tighten. Suggested command: `$impeccable clarify`.

## Persona Red Flags

- **Jordan (first-timer):** No next step after the alumni-network promise; generic Contact form never repeats the career-team story.
- **Riley (stress tester):** Cannot verify the "live board" (doesn't exist) or the absolute "every pathway is represented."
- **Casey (mobile):** Mobile stacks cleanly (390px fixture); no mobile-specific red flags.

## Minor Observations

- Pathways figure img lacks `loading="lazy"`.
- "Every pathway is represented in the alumni network" — soften or substantiate.
- Career team nameless everywhere; one named advisor would raise trust materially.
- If the board lands in the member portal later, link it from the opportunity card.

## Questions to Consider

- What if every pathway earned a real link (alum story, rotation diary)?
- Does the page need a board promise it can't keep — yet?
- What would the closing CTA be if it named the actual first step for a first-year?
