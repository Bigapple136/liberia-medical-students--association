---
target_identity: "file:/home/user/liberia-medical-students--association/lmsa-website/src/pages/public/EventsPage.jsx"
target_fingerprint: "sha256:264176f9780cae27903b5d4f81d5d03bde37c641417ecc1a714d6623382fafff"
target_path: /home/user/liberia-medical-students--association/lmsa-website/src/pages/public/EventsPage.jsx
timestamp: 2026-09-02T13-26-46Z
slug: lmsa-website-src-pages-public-eventspage-jsx
---
# Critique — Events pages (EventsPage.jsx + EventDetailPage.jsx)
Run: 2026-09-02 · Mode: Read (index) + Operate moment (registration) · ⚠️ DEGRADED: single-context (no sub-agent tool in this session)

## Provenance
- Assessment A: inline design review (source + API contract inspection), completed before detector output
- Assessment B: detect.mjs CLI — 0 findings on both files (exit 0); browser overlay skipped (no browser automation)
- Ignore list: none

## Design-specificity verdict
Index: committed editorial world, LMSA voice — good. Detail: legacy pre-redesign world (gray-50, rounded-2xl card, pill badge, `btn btn-primary`). The pair repeats exactly the split the news surface had before its redesign.

## Heuristic scores (0–4)
1. Visibility of system status: 2 — spinner only; no signal that "upcoming" includes past events; register button has decent loading/success states
2. Match with real world: 2 — header says "Upcoming events" but getAll() is called with NO params: ALL events return, ascending, so the OLDEST PAST events render first under an "upcoming" banner
3. User control & freedom: 2 — unauthenticated register click 401s and the interceptor silently bounces to /login, losing all context; no pre-hint
4. Consistency & standards: 2 — detail page in legacy world; `.btn` supplies NO padding so the register button renders as a bare tight pill; squared chips vs rounded pills
5. Error prevention: 2 — register button shows for past events and after registration_deadline (client never checks either); index fetch failure renders the "No events scheduled yet" empty state — an error masquerading as emptiness
6. Recognition over recall: 3 — icon+label meta rows are clear on both pages
7. Flexibility & efficiency: 2 — API supports ?upcoming/?type filters, UI uses none; registration_deadline, fee, max_attendees, registration_count, image_url all fetched or available but never displayed on detail
8. Aesthetic & minimalist design: 3 — index is solid editorial; detail dated but tidy
9. Error recognition/recovery: 2 — toast-only, no retry; "Failed to register" names no cause or fix
10. Help & documentation: n/a
Total: 20/36 = 56% → Acceptable

## Strengths
- Index card craft: consistent hover lift, focus-visible rings, icon meta rows, image fallback.
- Register flow already handles loading/registered states and suppresses the confusing 401 toast.
- Backend contract is rich (counts, deadlines, fees, capacity) — the data for a much better page already exists.

## Priority issues
- P1 Truth failure on the index: "Upcoming events" shows every event ever, past first (no ?upcoming=true, ascending order). After any event concludes, the page leads with stale content under a false banner.
- P1 Detail page lives in the abandoned legacy visual world — the exact drift class the news detail migration just fixed; also `btn btn-primary` has no padding (visible defect).
- P1 Error masquerades as empty on the index (fetch failure → "No events scheduled yet. Check back soon!", toast-only recovery).
- P1 No h1 on the index.
- P2 Registration honesty: button renders for past events and past deadlines; unauthenticated users get silently redirected with no warning; registered state is render-local only.
- P2 Detail page hides data it already has: image_url, registration_deadline, fee, max_attendees/registration_count never shown.
- P3 No <time> elements; spinner instead of skeletons; no cancellation-safe fetch or scroll reset on detail; no calendar export.

## Emotional journey
Index copy sets a warm gathering tone; the valley is identical to the symposia case — the moment of highest intent (register) is where honesty breaks down: hidden deadlines, silent login bounce, phantom availability for finished events.

## Persona red flags
- Jordan: clicks Register while signed out → teleported to login with zero explanation.
- Alex: no filters despite API support; no calendar export; can't see if an event is full.
- Sam: index lacks h1; detail loader lacks role="status".
- Riley: registers for an event that ended last month; refreshes and the button forgets they registered.

## Detector agreement
0 findings both files — agrees the debt is IA/truth/state-level, invisible to token scanning. No false positives.

## Verdict
Polish, not redesign: partition the index truthfully (upcoming vs past), give errors their own state, and migrate the detail page onto the established editorial pattern with an honest registration panel using the data the API already returns.
