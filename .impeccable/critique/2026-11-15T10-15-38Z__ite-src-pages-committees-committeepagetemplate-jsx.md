---
target: the Academic committee page
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\goldw\\Desktop\\freelance\\liberia-medical-students-association\\lmsa-website\\src\\pages\\committees\\CommitteePageTemplate.jsx"
target_fingerprint: "sha256:00bb75dce46cda3a79ff3dbf546da6a7ba98c3362d8c0dfd95d0f0e185c5c004"
target_path: "C:\\Users\\goldw\\Desktop\\freelance\\liberia-medical-students-association\\lmsa-website\\src\\pages\\committees\\CommitteePageTemplate.jsx"
timestamp: 2026-11-15T10-15-38Z
slug: ite-src-pages-committees-committeepagetemplate-jsx
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session)

Target: `lmsa-website/src/pages/committees/CommitteePageTemplate.jsx` — the Academic Committee page at `/leadership/committees/academic`.
Mode: **Persuade** (a student reads it, then acts: proposes a topic or writes to the committee).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Plan states and form feedback are clear; when the API fails the page silently drops the roster/events and prints one unexplained line |
| 2 | Match System / Real World | 2 | Body copy is excellent, but the hero leads with registry boilerplate ("plans and executes all functions related to") |
| 3 | User Control and Freedom | 3 | Every jump lands somewhere useful; nothing traps, but there is no way to skip a 7,700px page |
| 4 | Consistency and Standards | 3 | Three labels for one action, and they behave differently: "Ask the committee" does not preselect the subject, "Suggest a topic" does |
| 5 | Error Prevention | 3 | Whitespace-only messages blocked, maxLength set, subject constrained to a select |
| 6 | Recognition Rather Than Recall | 2 | Support routes sit 5+ screens below the hero with no index; a student must remember where the study help was |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no expert path to accelerate |
| 8 | Aesthetic and Minimalist Design | 2 | Visually calm and well set, but the plan, the mandate and "What members take on" state the same work three times |
| 9 | Error Recovery | 3 | Both failures keep the typed message and explain in plain language; no inline field-level errors |
| 10 | Help and Documentation | n/a | Single institutional page; help/docs is not this surface's job |
| **Total** | | **21/32** | **Acceptable (66%) — significant improvements needed** |

## Design Specificity Verdict

**LLM assessment.** Genuinely authored, not category-interchangeable. The page's spine is the year's academic programme as a schedule rail — time column, entry, state dot — which is a decision only this committee's page could make, and the ask band ("A topic worth an afternoon? Name it.") gives the page a voice that no downloaded template produces. The support ledger reads like a desk list rather than a three-up card grid, which is the right register for a committee whose actual work happens on other pages.

What keeps it short of excellent is that the authoring stops at the section level. Sections three and four say what sections one and two already said. The hero, which is the one place every visitor reads, is the only block on the page written in committee-register English instead of student-register English.

**Deterministic scan.** `detect.mjs` on the template file: **0 findings** (exit 0, empty array). The browser-injected detector on the rendered page reported **4 anti-patterns**:
- `low-contrast` ×3 — `#ffffff` on `#0c8950` = **4.46:1**, under the 4.5:1 AA bar this project declares. One is the shared header's "Join LMSA" button; two are this page's own filled buttons (Subscribe, Send message).
- `overused-font` ×1 — Inter at 100% of text. **False positive here**: PRODUCT.md pins Inter as a brand commitment, so the brief wins over the detector.

**Visual overlays.** Injection succeeded (mutation preflight passed, 4 overlay nodes in the DOM, console group `[impeccable] 4 anti-patterns found`). This session is headless — there is no presented browser tab for you to click through — so I captured the overlay instead at `lmsa-website/.taste-skill/inspect/critique-overlay.png`. The header "Join LMSA" button is visibly flagged in that shot.

## Overall Impression

A confident, quiet, editorial page that a medical student would trust, undermined by saying its three best facts three times and by opening with the one paragraph nobody would say out loud. The single biggest opportunity is to make the term plan carry the whole story — it is the most original thing on the page — and delete the two sections that paraphrase it.

## What's Working

1. **The term plan rail as the spine.** Time in small caps, the entry at 19px, state as a dot plus a word at the right edge. It reads as a schedule someone maintains, not as a list of promises, and it is the reason this page does not look like the other eleven committee pages.
2. **The ask band's three numbered steps.** "You name the topic → the committee chooses and invites → it goes on the calendar" closes the loop a student actually worries about (does anything happen to my suggestion?). This is the emotional peak of the page and the right one.
3. **The support ledger.** Five routes set as hairline rows with a one-line description each, final row spanning both columns. It respects that the committee does not own those pages and still gets a student to them in one click.

## Priority Issues

**[P1] The same work is stated three times.**
- **What**: The plan rail (two symposia, workshops, library schedules, study groups), the constitutional mandate (conferences, symposia, library schedules, topics), and "What members take on" (Annual Medical Symposium, Clinical Skills Workshops, Academic Mentorship Program, Study Group Coordination, Library Resource Management, Guest Speaker Series) describe one programme in three vocabularies.
- **Why it matters**: A student scrolling for the thing they can act on passes ~4,000px of overlapping lists. On a 3G phone that is 8 screens of near-repetition between the hero and the support routes, which is where the page's real utility is.
- **Fix**: Let the plan rail own the programme. Demote the mandate to a disclosure at the end of that section (it is evidence, not content a student came for), and fold the activities list into the plan rows as the concrete instances of each entry — or delete it. That removes one full section and one photo without losing a fact.
- **Suggested command**: `$impeccable distill`

**[P1] The hero leads with registry boilerplate.**
- **What**: "The Academic Committee plans and executes all functions related to LMSA's academic affairs, including symposia, conferences, and student academic support." This is the committee's registry description rendered verbatim as the first sentence of the page.
- **Why it matters**: The page's own voice is direct and second-person ("A topic worth an afternoon? Name it.", "Say what you want covered"), and the one paragraph every visitor reads is written in the third person by a committee about itself. It is also the least informative sentence here: "functions related to academic affairs" is a restatement of the title.
- **Fix**: Rewrite the hero paragraph as what the committee does for the reader this term — the two symposia and the workshops between them, and that students can change what those are. Keep the registry sentence on the committees index, where a directory needs a formal description.
- **Note**: This replaces committee-authored copy, so confirm the wording before it ships.
- **Suggested command**: `$impeccable clarify`

**[P1] White on brand green fails the project's own contrast bar.**
- **What**: `text-white` on `bg-lmsa-600` (`#0C8950`) measures **4.46:1**. It appears on this page's Subscribe and Send message buttons, and in the shared header's "Join LMSA". Normal-size text needs 4.5:1.
- **Why it matters**: PRODUCT.md and the Tailwind token comments both declare WCAG 2.1 AA as a hard floor, and the detector flags it on the primary action of the page's contact block. Low-vision users on a washed-out phone screen are the realistic failure case here.
- **Fix**: Use `lmsa-700` (`#0A7343`, ~6.3:1 with white) for filled buttons, or keep `lmsa-600` and set the label to `lmsa-900`. The token is shared, so fix it once at the source and the header and every other committee page inherit the correction.
- **Suggested command**: `$impeccable audit`

**[P2] "Suggest a topic" drops you on the newsletter field on mobile.**
- **What**: Every CTA scrolls to `#committee-contact`, but on a 390px screen the section opens with "Updates from this committee" — an email input and a Subscribe button — directly above "Your name". The first input a student meets after tapping "Suggest a topic" is the wrong one, styled identically.
- **Why it matters**: This is the page's conversion path. Mistyping a message into a mailing-list field and pressing Subscribe loses the suggestion and subscribes them to something they did not want.
- **Fix**: On mobile, order the form before the newsletter block (one `order` utility on the two children), or make the jump target the form itself rather than the section, and put the newsletter below the submit button.
- **Suggested command**: `$impeccable adapt`

**[P2] There is no way through the page.**
- **What**: 7,688px on desktop, 10,558px on mobile, nine sections, and no in-page index. The only internal jump is a secondary link at the very bottom ("See this term's plan"), which sends a student upward.
- **Why it matters**: The page's value is unevenly distributed: the support routes are the most useful block for a student with a study problem, and they sit five screens down with nothing above them signalling they exist.
- **Fix**: Add a compact three-item jump row under the hero CTA ("This term's plan · Study support · Write to the committee"), styled as text links rather than buttons so the primary action keeps its weight.
- **Suggested command**: `$impeccable layout`

## Persona Red Flags

**Jordan (first-timer, Year 1).** Meets "pre-clinical", "panelists", "the register" and "written into the constitution" before any plain statement of what the committee will run this year. Reads "Recruitment details could not be loaded." and has no idea whether that means applications are closed or the site is broken — there is no retry, no date, no link. Reaches the support routes only by scrolling past the sections that restate each other.

**Casey (mobile, one-handed, ~3G).** Page is 10,558px. Taps "Suggest a topic" in the dark band, lands at the contact section, and is offered a newsletter email field first — one thumb-reachable input, visually the same as "Your email" three fields later. Photo credits and stock imagery download before the plan rail does. Nothing is lost if she leaves, but nothing is saved either: a half-typed message is gone on return.

**Sam (screen reader, keyboard).** Good news first: one `h1`, ordered `h2`s, the plan as a true `<ol>`, decorative numerals `aria-hidden`, `focus` moved to the contact heading on a jump (rare and correct). Red flags: the 4.46:1 filled buttons; the jump to `#committee-contact` fires from a `<button>`-looking `<a href>` and focus lands on a heading with `tabIndex={-1}` that has an outline suppressed — a sighted keyboard user gets no visual confirmation of where they arrived; and the state dots convey meaning redundantly with text, which is right.

## Minor Observations

- The plan rail's time column is a fixed 10rem at `md`, so "Throughout the year" and "Before the first symposium" wrap to two ragged uppercase lines while "Before exams" stays on one. Widening to 12rem or `whitespace-nowrap` would settle it.
- "Each semester" appears twice with different entries; correct, but the rail's granularity mixes "throughout the year", "each semester" and "before exams" in one column, so it cannot be scanned as a chronological sequence.
- When the API is unreachable the page says "Recruitment details could not be loaded." and "This year's roster could not be loaded." — honest, but developer phrasing in a student-facing voice. A plain "We couldn't load this just now" plus the email fallback would be warmer and equally truthful.
- The mandate numbers and the activities numbers are both `01–06` in the same green, at the same size, on alternating backgrounds — they read as one interrupted list rather than two.
- Stock photography, credited "Pop & Zebra / Unsplash", is a known constraint in PRODUCT.md, not a defect. The conference-audience hero is the right pick; the workshop photo under "What members take on" is cropped tight enough to read as a meeting.

## Questions to Consider

- If the plan rail is the page's best idea, why does it come third behind a hero paragraph and a constitutional list?
- What would this page look like if a student could act on it in one screen instead of nine?
- Which of the three lists would the committee itself miss if it disappeared?

## Run Notes

Target slug: `...lmsa-website-src-pages-committees-committeepagetemplate-jsx`. No `.impeccable/critique/ignore.md` exists, so nothing was suppressed. Assessment independence: **degraded** — this harness exposes no sub-agent tool, so Assessment A and B ran sequentially in one context (banner above). CLI detector: `detect.mjs` on the template returned 0 findings, exit 0. Browser: headless Edge via a throwaway Playwright script against `http://localhost:5173`; mutation preflight passed, `detect.js` injected, console group read (4 anti-patterns), overlay captured to `.taste-skill/inspect/critique-overlay.png`. Live server on port 8400 started in background and stopped afterwards; the stop reported `config_missing` when removing the script tag, which is expected because the tag was injected at runtime rather than into the HTML entry. Temp script deleted. Screenshots reviewed from `.taste-skill/inspect/committee-final/`. Data quality: the API's CORS policy rejects `localhost` origins, so roster, events, news and records did not render in any capture — findings about those sections are read from source, not seen.
