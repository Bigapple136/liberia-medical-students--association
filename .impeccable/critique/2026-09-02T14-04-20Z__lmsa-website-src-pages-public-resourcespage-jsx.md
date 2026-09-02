---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/ResourcesPage.jsx"
target_fingerprint: "sha256:6a9c8714dc86a884e8acc3705fc26162f53a11f4c87a3b2657d808923d554a44"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/ResourcesPage.jsx
timestamp: 2026-09-02T14-04-20Z
slug: lmsa-website-src-pages-public-resourcespage-jsx
---
# Impeccable critique — ResourcesPage.jsx (/academics/resources)

Date: 2026-09-02 · Mode: Operate (find & access study materials)
DEGRADED: single-context (no sub-agent tool; Assessments A then B sequentially; detector CLI ran, browser overlay skipped — no browser automation exposed)

## Verdict
Score: 13/36 = 36% → **Needs work** (lowest of the session; committees was 15/36).
Heuristics: 0, 0, 4, 1, 2, 2, 1, 2, 1, n/a

The visual world is right — this page was already migrated to the editorial
pattern, and the detector returns 0 findings (eighth consecutive token-clean
page). The failure is entirely at the promise layer, and it is the session's
worst instance of BOTH known variants combined:

## Findings

### P1 — Twelve fabricated resources (unbacked copy)
All 12 items ("Anatomy Study Guide", "Past Exam Papers (2020-2025)", "MCQ
Practice Bank", "OSCE Preparation Guide"...) are a hardcoded array. No such
files exist anywhere — not in the documents API, not in static assets. Same
class as JoinCommitteePage's invented committee list. Meanwhile the REAL
library (documents API, category `study_material`, working download flow,
server-side access filtering) lives at /documents.

### P1 — Twelve dead controls
Every card renders `<button type="button">Access resource</button>` with no
onClick. Not one control on the page's primary surface does anything. Worst
dead-control count of the session (symposia: 1, research: 4, committees: 12
links but those at least navigated somewhere).

### P2 — No h1
Both EditorialSectionHeaders use the default `as` ('h2'). The page has no h1.

### P2 — editorial-link-card misuse
The class is designed for `<Link>` cards (hover arrow, group states). Here it
dresses a non-interactive `<article>` containing a dead button — the affordance
promises navigation the element cannot deliver.

### P3 — Meaningless card numbering
Card eyebrow is `0{sectionIndex + 1} / {type}` — every card in a section shows
the same number ("01 / PDF", "01 / Video Series", ...). Numbers the section,
not the item; reads as broken.

### P3 — Circular fakery with /documents
DocumentsPage's closing callout says "Browse study resources" → here; here 12
fake items dead-end. The two pages should divide labor: /documents = full
library, /academics/resources = study-stage guidance + live study_material
shelf.

## Strengths
- Editorial world already correct (header, note, muted banding, green callout).
- PageMeta entry exists for /academics/resources.
- Stage framing (Pre-Clinical / Clinical / Exam Prep) is a genuinely good
  information architecture worth preserving as guidance.

## Detector agreement
0 findings. Consistent with the session pattern: promise-layer failures are
invisible to token scanning.

## Polish plan
1. Keep the stage framing but convert it to honest guidance (focus areas, not
   named artifacts) with no dead controls.
2. Add a live "From the library" section fetching real
   `category=study_material` documents via the existing public API, with the
   established skeleton / error-retry / honest-empty states and per-item
   download buttons (DocumentsPage patterns).
3. h1 via as="h1"; fix card semantics; link to /documents for the full library.
4. Keep the contribute callout.
