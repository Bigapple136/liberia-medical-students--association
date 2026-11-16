# Admin: Programmes section and the event form's programme select

Companion to `docs/14-committee-programmes-plan.md` (§4). Design only — nothing built yet;
this depends on the P2 endpoints.

## 1. Where it lives

A new tab in `CommitteeAdminDashboard.jsx`, placed before **Events** because a programme is
the frame and events are what fill it:

```
Details · Members · Applications · Programmes · Events · Documents · Announcements · Achievements · Analytics
```

**Programmes tab** (new `ProgrammesTab`, ~200 lines, no new dependencies)
**Event form** (existing `EventsTab` inline form + `EventsAdminPage.jsx`)

Reuse what's there: `SectionCard`, `Label`, `EmptyState`, `input`/`btn` classes, `toast`,
and `confirm()` for deletes. No drag-and-drop library.

## 2. Programmes tab — list

```
┌ Programmes ──────────────────────────────────────────── [ + New programme ] ┐
│ 4 programmes · 2 published · next session 3 Mar                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ First Aid Training                                        ● Running now     │
│ First-aid and emergency-response training, open to students and the wider   │
│ community.                                                                  │
│ 3 sessions · next Tue 3 Mar, 10:00 · A.M. Dogliotti        Published        │
│ [ Add session ]  [ Edit ]  [ Unpublish ]  [ Delete ]      ↑ ↓               │
├─────────────────────────────────────────────────────────────────────────────┤
│ Vaccination Drives                                        ◌ Dates to be announced │
│ ...                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

Row anatomy, in reading order:

1. **Name** — 15px semibold, the row's heading.
2. **Derived state chip**, right-aligned: `Running now` / `Next 3 Mar` / `Dates to be
   announced` / `Finished`. Read-only, with the tooltip "Computed from session dates". It is
   never editable — the whole point of the model is that state cannot be typed. The chip
   carries text, never colour alone.
3. **Summary**, one line clamped (`line-clamp-2`), grey.
4. **Meta line**: `3 sessions · next Tue 3 Mar, 10:00 · A.M. Dogliotti`, then a
   `Published` / `Draft` badge.
5. **Actions**: `Add session`, `Edit`, `Publish`/`Unpublish`, `Delete`, and `↑`/`↓` order
   arrows (disabled at the ends, `aria-label="Move up"`).

Header count line reads from the same list: `4 programmes · 2 published · next session 3 Mar`.

**Order** is saved immediately on arrow click (`PUT /programmes/reorder`), with optimistic
reorder and rollback + toast on failure. No "Save order" button — one less thing to forget.

**Empty state** (`EmptyState` with `Layers` icon):

> **No programmes yet**
> A programme groups sessions under one name on the public committee page. Create it here,
> then add its sessions. Nothing appears publicly until you publish.

The sub-line matters: it tells an admin that publishing is the gate.

**Delete** uses `confirm()` with the consequence spelled out:

> Delete "First Aid Training"? Its 3 sessions stay in Events, unassigned.

**Draft rule**, stated in the UI where it bites: a draft programme and all of its sessions
are invisible publicly — a session cannot surface on the committee page attached to a
programme nobody can see.

## 3. Programmes tab — create / edit form

Inline card under the list header, matching `EventsTab`'s pattern rather than the `Modal`
(the modal is `max-w-md` and five fields do not fit):

```
New programme                                        (Draft · Published radio)
┌───────────────────────────────┬───────────────────────────────┐
│ Name *                        │ Audience                      │
│ [ First Aid Training        ] │ [ Open to students and the… ] │
├───────────────────────────────┴───────────────────────────────┤
│ Summary *                                         42 / 160    │
│ [ First-aid and emergency-response training, open to …      ] │
├───────────────────────────────────────────────────────────────┤
│ Image URL (optional)                                          │
│ [ https://…                                                 ] │
└───────────────────────────────────────────────────────────────┘
                              [ Cancel ]  [ Save programme ]
```

| field | type | rules | why |
|---|---|---|---|
| Name | text | required, ≤ 60 chars, unique per committee | the public page's heading; 409 surfaces as "A programme with this name already exists" |
| Summary | textarea, 3 rows | required, ≤ 160 chars, live counter | one sentence is all the public list shows; forcing it here stops a blank row |
| Audience | text | optional, ≤ 80 chars, placeholder "Open to students and the wider community" | shown only when it differs from the page's audience |
| Image URL | url | optional | optional on purpose; a programme without an image must still look finished |
| Status | radio: Draft / Published | default Draft | publish is a deliberate act |

Slug is generated from the name server-side and not shown: sessions keep their own slugs
(`/events/:slug`), so nobody has to care.

Defaults: new programme opens as **Draft**, so a half-written programme cannot go live by
being saved. `Save programme` is disabled until name and summary are non-empty; dirty-state
guard on `Cancel` uses the existing pattern (confirm discard if changed).

Character caps are enforced in the input (`maxLength`) and validated again server-side.

## 4. Sessions inside the tab

Each row shows its sessions read-only — `Tue 3 Mar, 10:00 · First Aid Training — Session 1
· upcoming` — with a link to the Events tab. **Add session** switches to Events and opens
the create form with `programme_id` and `committee_id` prefilled.

Implementation: lift one piece of state to `CommitteeAdminDashboard` —
`eventPrefill = { programmeId } | null` — set by `ProgrammesTab`, consumed by `EventsTab`
on mount (`openFormWith(programmeId)`), cleared after the form closes. `activeTab` already
lives there, so this is two props, not a state library.

## 5. Event form — the programme select

Two hosts, one rule set.

**In the committee's Events tab** (committee is fixed):

```
Programme (optional)
[ None — one-off event                                    ▾ ]
  First Aid Training
  Vaccination Drives (draft)
```

**In `EventsAdminPage.jsx`**, directly under the existing "Committee (optional)" select
(line 694), same grid cell pattern:

```
Committee (optional)                Programme (optional)
[ Health Committee       ▾ ]        [ None — one-off event  ▾ ]
                                    Groups this session under a programme on the
                                    committee page.
```

Rules:

- **Disabled until a committee is chosen**, with helper text "Choose a committee first".
  The control stays visible rather than appearing on selection — it explains the feature.
- **Options are that committee's programmes only**, drafts included, labelled
  `(draft)` so an admin knowingly schedules into an unpublished programme.
- **`None — one-off event`** is always first and is the default: most events are not part
  of a programme, and this select must not make that feel wrong.
- **Changing the committee clears the programme** and says so: "Programme cleared — it
  belongs to the previous committee." Silent clearing is how an event ends up filed under
  the wrong programme.
- **Edit preserves** `programme_id` (the edit loader at line 452 must map it, like
  `committee_id` does today). Its absence from the edit payload would silently unfiled
  every programme session on save — the single most likely bug in this feature.
- **Server enforces the relationship** regardless of the UI: `programme_id` whose
  `committee_id` differs from the event's → 400 "Programme does not belong to this
  committee."
- Nothing else about the event form changes: dates, venue, fee, registration are the
  session's, and the programme does not override them.

## 6. Service surface this needs

```js
committeeService.getProgrammes(id)            // admin: drafts included
committeeService.createProgramme(id, payload)
committeeService.updateProgramme(id, programmeId, payload)   // incl. status
committeeService.deleteProgramme(id, programmeId)
committeeService.reorderProgrammes(id, orderedIds)
```

Event payloads gain `programme_id` in both `createEvent` and `update`; `EventsAdminPage`
passes `programme_id` through `handleChange` like `committee_id`.

## 7. Accessibility and small print

- Order arrows and icon-only buttons carry `aria-label`; the state chip is text first.
- Focus moves to the first field when the create form opens; focus returns to the trigger
  on close.
- Delete and unpublish announce via the existing toasts.
- All controls ≥ 44px tall on touch (`btn` class already is).
- Empty states are real `<p>` copy, not "No data".

## 8. Out of scope, deliberately

Drag-and-drop ordering (arrows are enough for ≤ 10 programmes), per-programme image upload,
programme-level registration defaults, bulk session creation, and per-programme public URLs
(sessions already have `/events/:slug`).
