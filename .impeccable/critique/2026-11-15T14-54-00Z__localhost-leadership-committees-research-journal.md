---
target: the Research & Journal committee page
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "url:http://localhost:5173/leadership/committees/research-journal"
timestamp: 2026-11-15T14-54-00Z
slug: localhost-leadership-committees-research-journal
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed in this session)

Target: the Research & Journal Committee page at `/leadership/committees/research-journal`, rendered by `lmsa-website/src/pages/committees/CommitteePageTemplate.jsx` from the `research-journal` entry in `src/utils/committeesData.js`, with no profile of its own before this run.
Mode: **Persuade** (a student reads what the committee publishes, then reads an issue or sends work).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | No plan, no status, no dates: the page states what the constitution requires and stops |
| 2 | Match System / Real World | 3 | "The Research & Journal Committee gathers, organizes, edits, and publishes data for LMSA's official journal" — registry prose naming the committee twice and burying the product; "May publish yearbook" reads as a permission slip |
| 3 | User Control and Freedom | 2 | With no plan or support routes, the on-page index rendered nothing at all; the only route off the page was "All committees" |
| 4 | Consistency and Standards | 2 | Two adjacent numbered lists with different rule colours — the mandate's green, the activities' grey — and programme labels in Title Case against a page set in sentence case |
| 5 | Error Prevention | 3 | Required fields and maxlengths set; subject seeding only fires from an ask band this committee does not have |
| 6 | Recognition Rather Than Recall | 3 | The journal and newsletters exist in the documents library, filed as their own categories, and the page pointed at neither |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | Nothing duplicated, but the page closed on the association-wide "one of twelve standing committees" pitch, and its one section photograph was a stethoscope on a coat |
| 9 | Error Recovery | 3 | Roster failure names the fallback, though it arrives inside the contact copy |
| 10 | Help and Documentation | n/a | Persuade surface |
| **Total** | | **21/32** | **66% — Acceptable** |

## Design Specificity Verdict

**LLM assessment**: The page is a directory entry, not a committee page. Everything on it is true and nothing on it is the committee's own: the description is the registry sentence, the mandate is the constitutional register, and the work list is six programme names with no verb, no timing and no status. A publisher with no route to anything it publishes is the central design failure — the association already files journals and newsletters as categories in the documents library, and the page never mentions it.

**Deterministic scan**: `detect.mjs` on the template returned 0 findings, exit 0.

**Visual overlays**: Not produced. Evidence came from captured viewports at 1440 and 390 plus a computed-style probe.

## Overall Impression

The Academic page's own commit made this criticism of its predecessor: *"The page recited its constitutional duties and stopped."* Research & Journal was still doing exactly that. The fix was not to invent a calendar for a committee nobody has scheduled, but to point the page at the work that already exists — the journal and newsletters in the documents library, and the research desk — and to give it a closing that belongs to this committee rather than to the register.

## What's Working

- **The mandate section is honest and specific.** "Publish one journal per academic year", "at least two newsletters per semester" — countable obligations, not sentiment, with "Read the constitution" beside them so the claim can be checked.
- **The work list names real programmes.** A journal, quarterly newsletters, a research symposium, student projects, publication workshops, medical writing training. These are the committee's actual products, and they were being wasted as a bare list.
- **Contrast is clean.** No text node under 4.5:1 (3:1 large) at either width.

## Priority Issues

- **[P1] A publisher with no route to its publications.** The documents library files `journal` and `newsletter` as categories, and the page linked to nothing.
  **Why it matters**: a student who came to read the journal left the page without knowing it exists, and the committee's product had no proof on the page that it is produced.
  **Fix**: a "Where the writing lives" section linking the journal, the newsletters and the research desk — plus `?category=` support in the documents library, since it had no way to deep-link a shelf. Applied.
  **Suggested command**: `$impeccable clarify`

- **[P1] The hero and the closing were about the association, not the committee.** The intro was the third-person registry sentence; the closing was "One of 12 standing committees", the same pitch Health removed on the grounds that it belongs on the index.
  **Why it matters**: the first and last things a reader sees described an org chart, not a publication.
  **Fix**: an intro stating what comes out ("Publishes LMSA's journal once a year and a newsletter twice a semester, gathered, edited and reviewed by students"), and a closing that asks for copy. Applied.
  **Suggested command**: `$impeccable clarify`

- **[P2] Two numbered lists, two rule colours.** The mandate's items carried `border-lmsa-200` and the activities band's carried `border-gray-200`, 600px apart on the same page.
  **Why it matters**: the two lists are the same kind of thing — an enumerated ledger — and different rules make them read as different components.
  **Fix**: brought the activities band onto `border-lmsa-200`. Verified: one border colour across every `li` on the page. Applied.
  **Suggested command**: `$impeccable polish`

- **[P2] The section photograph said clinician, not editor.** The activities band fell back to the symposium photo — a stethoscope on a white coat — on a page about writing and publishing.
  **Why it matters**: the page's one mid-scroll image contradicted its subject, and the photograph is the largest single element in that band.
  **Fix**: the section now shows the library photograph (open textbooks and notes), which is what a shelf of student work looks like. Applied.
  **Suggested command**: `$impeccable clarify`

- **[P2] The publications links measured 28px tall.** The support cards' links were `min-h-6`, so the only route to the journal was a 28px target on a phone.
  **Why it matters**: below the project's own 44px floor, on the page's primary outbound action.
  **Fix**: `min-h-11`. Applied; measured 44px on all three, and Academic's five support links came up with it.
  **Suggested command**: `$impeccable adapt`

## Persona Red Flags

**Jordan (First-Timer)**: Reads "gathers, organizes, edits, and publishes data for LMSA's official journal" and cannot tell whether the committee writes the journal or administers a database. Never learns where the journal is, because the page never says.

**Alex (Power User)**: Wants the latest issue. Finds no link, no date, no issue number, and an on-page index that renders nothing because the committee has neither a plan nor support routes.

**Sam (Accessibility-Dependent)**: Pre-fix, tabs into no on-page navigation at all on this page; post-fix the nav is a single "Publications" link. The publications links were 28px tall before the fix.

## Minor Observations

- "May publish yearbook" is faithful to the constitution but reads as a permission rather than an intention; it belongs among the work, not the obligations, if the committee wants it understood as planned.
- The programme names are Title Case across all twelve committees ("LMSA Journal Publication", "Quarterly Newsletters"). That is the data convention, so the page-level inconsistency is with the site's sentence-case voice rather than something to fix here.
- The documents library keeps an unknown `?category=` value in the URL while falling back to "All documents" in the UI. Harmless, and the next chip click rewrites it.

## Questions to Consider

- Should the page show the most recent issue inline rather than a link to a shelf?
- Whose name goes on an issue — the committee, the editor, the contributors?
- If the association publishes twice a semester, why is there no submission deadline anywhere on this page?
