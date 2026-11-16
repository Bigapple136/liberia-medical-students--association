---
target: the Health committee page
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "url:http://localhost:5173/leadership/committees/health"
timestamp: 2026-11-15T14-24-22Z
slug: localhost-leadership-committees-health
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session)

Target: the Health Committee page at `/leadership/committees/health`, rendered by `lmsa-website/src/pages/committees/CommitteePageTemplate.jsx` from the `health` entry in `src/utils/committeesData.js` and the `health` profile in `COMMITTEE_PROFILES`.
Mode: **Persuade** (a student reads the committee's record, then reports a fault or writes to it).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Plan rail carries a status per entry (ongoing/planned); the page's own form gives no inline confirmation while sending, and the recruitment lookup fails into a message about a number the page never shows |
| 2 | Match System / Real World | 4 | "A tap that has not worked for a month, a hall that is not cleaned, a dormitory with no water" — the language is the student's, not a constitution's |
| 3 | User Control and Freedom | 3 | On-page index and skip link work; the index used to point twice at the same anchor |
| 4 | Consistency and Standards | 2 | The same six commitments appeared twice in a row, once with timing and status, once without; three contact routes crowded the hero |
| 5 | Error Prevention | 3 | Required fields and maxlengths are set; the subject select defaults to "General enquiry" and the profile's own subject is only applied when the CTA is used |
| 6 | Recognition Rather Than Recall | 4 | Every step of "report → inspect → fix" is named on the page, not remembered from elsewhere |
| 7 | Flexibility and Efficiency | n/a | Persuade surface; no power path to accelerate |
| 8 | Aesthetic and Minimalist Design | 2 | A 1,548px section repeated the plan, and inside it a 535px-tall stock photograph of a clinic that is not LMSA's was the largest visual on the page |
| 9 | Error Recovery | 3 | Failure copy names the fallback (refresh, or write to the committee) but sits away from the thing that failed |
| 10 | Help and Documentation | n/a | Persuade surface; the ask band is the help |
| **Total** | | **23/32** | **78% — Good** |

## Design Specificity Verdict

**LLM assessment**: The page is authored, not templated. The spine is the committee's own operating loop — inspect, log, escalate, publish — and the closing band names it ("The record stays open until the fault is closed"). No other committee on the site could take this copy unchanged, and the ask band opens on a concrete fault rather than an invitation. The failure of taste was additive, not generic: the page kept a section that restated its own plan, and a photograph that showed somebody else's clinic doing health work LMSA is claiming.

**Deterministic scan**: `detect.mjs` on the template returned 0 findings, exit 0 — same as the Academic run. Nothing in the anti-pattern set fires here.

**Visual overlays**: Not produced. Browser evidence came from captured viewports (1440 and 390) plus a computed-style probe, not an injected overlay.

## Overall Impression

This is close to the strongest committee page on the site. Its argument is coherent and it argues once too often: the plan rail already says what the committee does and when, and the band beneath it says the same six things again, minus the timing, wrapped around a full-screen photo of a vaccination in a clinic that is not LMSA's. Against a 5,662px page, that band was 1,548px — 27% of the page — for no new information. The single biggest opportunity was subtraction.

## What's Working

- **The rail as spine.** Six entries, each with a relative time and a status, so the page reads as a term in progress rather than a list of duties. Relative timing ("Mid-term", "Before exams") is the right call: no date can go stale and read as a broken promise.
- **The ask band earns its place.** "Something broken or unsafe? Say so." states the three-step loop in the student's words, and the CTA seeds the form's subject with the profile's own value, so a report does not arrive as a generic enquiry.
- **Contrast is clean across the whole page.** A computed-style sweep of every text node at both widths found nothing under 4.5:1 (3:1 for large text). The green ramp work holds here.

## Priority Issues

- **[P1] The page states its work twice.** The plan rail's six entries and the "What members take on" band's six activities describe five of the same six commitments: inspecting on a schedule, first-aid training, the vaccination drive, wellness and mental health, publishing results. The second pass drops the timing and status that made the first useful, so it reads as a longer way of saying nothing new.
  **Why it matters**: 1,548px of a 5,662px page (27%) asks a student to read the committee's commitments again, and the repetition makes the plan look like a wish list restated rather than a schedule being honoured.
  **Fix**: `activities: 'hidden'` in the health profile, the same call Academic makes, since the plan carries the work. Applied.
  **Suggested command**: `$impeccable distill`

- **[P1] A load failure is reported in the wrong section.** When the roster does not load, the line lands in the contact panel, directly under "A question about the work, a request for a document, or an idea for the year ahead." Nothing on the page has mentioned a roster, because the section that would have held it is not rendered at all.
  **Why it matters**: the reader is being told to write to the committee, then told an unrelated thing failed. The one honest signal about missing data arrives as a non-sequitur and reads as a broken page.
  **Fix**: lead with the subject — "Committee members for this year: we couldn't load the roster." Applied.
  **Suggested command**: `$impeccable clarify`

- **[P2] The hero offers three ways to make contact, two of them to the same anchor.** "Ask the committee" and the "Write to the committee" index link both land on `#committee-contact`, 40px apart, with "Email the committee" beside them.
  **Why it matters**: duplicated destinations make the index look like decoration rather than navigation, and on a 390px screen the three stack into a wall of links before the reader has seen the plan.
  **Fix**: list the contact entry only when the hero's button leaves the page (round open → join page). Applied.
  **Suggested command**: `$impeccable distill`

- **[P2] Ten of the twelve committee pages rendered an empty navigation landmark.** With the duplicate contact entry removed, committees without a term plan or support routes keep a `<nav aria-label="On this page">` containing nothing.
  **Why it matters**: a screen reader announces "On this page, navigation" and then offers no destination — worse than no landmark at all.
  **Fix**: compute the link list once and skip the nav when it is empty. Applied; verified `nav` count 0 on Dietary and Sports.
  **Suggested command**: `$impeccable harden`

- **[P2] The only route back to the register measured 123×24 on a phone.** "All committees" sat at `min-h-6`.
  **Why it matters**: the project holds itself to 44px touch targets, and this is the sole escape from a 6,500px page.
  **Fix**: `min-h-11`. Applied; the link no longer appears in the sub-44px sweep.
  **Suggested command**: `$impeccable adapt`

- **[P2] A failed recruitment lookup still occupied the hero.** "We couldn't load this round's recruitment status" sat under the description, above the page's own action, on a page that otherwise never mentions recruitment.
  **Why it matters**: an error about absent data in the visual prime position reads as "this page is broken" before the reader has learned what the committee does.
  **Fix**: not rendered on committee detail pages; the committees index already states when recruitment details are unavailable. Applied.
  **Suggested command**: `$impeccable distill`

## Persona Red Flags

**Jordan (First-Timer)**: Reaches "What members take on" and finds it repeating the plan he just read, with none of the "mid-term" or "before exams" anchors. Cannot tell whether the two lists are the same commitments or different ones, so assumes the page is padded.

**Sam (Accessibility-Dependent)**: On Dietary and Sports, tabs into a navigation landmark announced as "On this page" that contains no links. On Health the "All committees" escape measured 24px tall — passable with a mouse, not with a thumb or a tremor.

**Casey (Distracted Mobile User)**: The page ran 8,088px, with a 1,472px section that repeated the plan and a full-screen photograph in the middle of it. Leaving and returning means scrolling past all of it again to reach the report form.

## Minor Observations

- The contact form's empty subject reads "General enquiry" and doubles as the default value, so a message sent without touching the select is filed as a general enquiry. Defensible, and the Health-specific option is one row below it.
- "Updates from this committee" puts a second subscribe field on the page, two screens above the footer's association-wide one. Different scope, so not a duplicate, but the page now carries two newsletter pitches.
- The closing band's "See this term's plan" links back to the top of the rail on a page the reader has just come down from. Cheap, and it does help a reader who jumped straight to the CTA.
- The hero photograph (volunteer at a distribution point, credited Kat Yakuwa / Unsplash) is the right one for this committee and is credited correctly.

## Questions to Consider

- If the plan is the page's argument, why does the table come after a full-height hero rather than beside it?
- Should a committee page carry a recruitment status at all when the association recruits by round, not by committee?
- What would this page look like if the fault record it describes were visible — counts of what was inspected, fixed and outstanding?

## Run Notes

Target: the Health committee page (URL-resolved, data-driven from `src/utils/committeesData.js` and the `health` profile). Assessment independence: **degraded** — no sub-agent tool in this session, so Assessment A and B ran sequentially in one context. CLI detector: 0 findings, exit 0. Browser: headless Edge, 1440×900 and 390×844, seven and eleven viewport segments plus a computed-style sweep for contrast and target sizes. Contrast: 0 failures at either width. Live server: the project's own dev server on 5173, not started for this run and not stopped by it. Temp scripts deleted after the run (`health-probe.mjs`, `nav-check.mjs`, `nav-count.mjs`). Data quality: the API's CORS policy rejects localhost origins, so roster, events and news never render; those findings are read from source, not seen.
