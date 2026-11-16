# Committee content: what the public site may show, and what stays in the portal

Status: policy, agreed 2026-11-16. Applies to every committee page and section built from here on.
Companions: `docs/14-committee-programmes-plan.md`, `docs/15-admin-programmes-ui.md`.

## 1. Why this exists

The committee pages are the **public face** of the association. They are read by students who
are members, students who are not, applicants, the wider public, journalists, partners and
whoever searches for the association by name. The **member portal** is the other thing: the
place where being a member is the point — insider documents, rosters with contact details,
attendance, dues, applications.

Those two things share a database, which is exactly why the boundary has to be written down.
Until now it was implicit: whole routes sat behind `authenticate`, and a public page that
called them simply rendered nothing. That failure mode is quiet, which is fine — but the
same routing will, the moment someone "fixes" an empty section, publish something that was
only ever excluded because the caller happened to be anonymous.

The rule is not "hide what is sensitive". It is this:

> Every block on a public page must be readable by someone who has never logged in,
> and nothing on it may be data the association would not put on a poster.

## 2. The test, applied to one block

Before a section goes on a public page, three questions, in order:

1. **Can an anonymous visitor read it?** If the only route that returns it sits behind
   `authenticate`, the section does not go on the page. Adding a login box in the middle of a
   marketing page is not an answer.
2. **Would we print it?** If the association would not put it on a noticeboard by the
   cafeteria, it belongs in the portal. This is the real filter; question 1 is only mechanics.
3. **Does it tell a stranger what to do next?** A public page earns its length by answering
   "can I come?", "who do I ask?", "how do I join?", "who is responsible?". Facts that answer
   none of those are decoration, however true they are.

## 3. The classes of content

Public means: on the site, anonymous read, indexed by search engines. Portal means: behind
`authenticate`, never on a public page, even for a logged-in member looking at the public page
(a page whose content changes with who is looking is a page nobody can quote).

| Content | Public? | Where | What is shown |
|---|---|---|---|
| Committee name, slug, one-line description, mandate, key activities, meeting schedule | **Public** | `GET /api/committees/:slug` | As written. This is the page's identity. |
| Committee contact address (`committees.email`) | **Public** | Same | Yes. It is an institutional address, not a person's. |
| Programmes (frames) | **Public, published only** | `GET /api/committees/:identifier/programmes` | Name, summary, audience, image, order, derived state. |
| Programme sessions | **Public, published programmes only** | `GET /api/events?committee=<slug>` | Title, date, time, venue, fee, registration requirement and deadline, and a link to the event. |
| One-off events | **Public, non-draft** | Same | As above. |
| Committee roster | **Public, reduced** | new `GET /api/committees/:slug/members` | Name and position. No photo until there is a public-profile flag (§4, §9.3). |
| Pinned notices / announcements | **Public** | new `GET /api/committees/:slug/announcements` | Title, message, pinned flag, date, type. The table has no visibility flag (§9.1). |
| Achievements | **Public** | new route when a page needs it | Title, description, date, badge. |
| Documents whose `access_level = 'public'` | **Public** | new projection of the documents read | Title, description, category, file type/size, file URL, date. |
| Documents at `members`, `executive`, `admin` | **Portal** | — | Never on a public page, and never counted there ("3 documents available to members" is a login prompt dressed as content). |
| Draft programmes and their sessions | **Portal** | — | Absent from public reads and from `GET /api/events` for non-staff. Already enforced in `event.controller.getAll` and `committee.controller.getProgrammes`. |
| Draft events (`events.status = 'draft'`) | **Portal** | — | Excluded from public event lists. |
| Event registrations, attendee lists, capacities sold | **Portal** | — | A public page may say "registration required" and "registration closes 3 Mar". It may never say who is coming. |
| Committee applications and their statements | **Portal** | — | The *call* to apply is public; the application and its review never are. |
| Dues, payments, attendance, ID cards, internal notifications, `activity_log` | **Portal** | — | Not committee content; listed so it is not "helpfully" pulled in by a new endpoint. |
| The fault / inspection record (reports, status, history) | **Portal** | — | See §5. |
| Newsletter subscription for a committee | public **write** | `POST /api/committees/:id/subscribe` | The form is public; the subscriber list never is. |
| Contact form submissions | public **write** | `POST /api/committees/:id/contact` | Idempotent from the public side: submit, get a thank-you. No read-back, no ticket status. |

## 4. People, specifically

A roster on a public page is a list of **representatives**, not a list of users. The
projection is deliberately smaller than the table:

| Field | Public | Reasoning |
|---|---|---|
| `full_name` | yes | The point of publishing a roster is accountability: who is responsible. |
| `position` | yes | Chair, secretary, treasurer — this is the public role. |
| `profile_photo_url` | **not yet** | Only with an explicit public-profile choice — see §9.3. No silhouette placeholder in the meantime. |
| `bio` | optional, if written for the site | A portfolio bio is public copy; a profile bio filled in for the portal is not. Until there are two fields, leave it out. |
| `email` | **no** | Personal addresses. The committee address (§3) is the contact route. |
| `year_level` | **no** | Not needed to hold someone accountable, and it is a fact about a student, not an office. |
| `phone` | **no** | Same. |
| user id | **no** | Keys are internal. Return the membership row's id, not the user's. |
| `joined_at`, `left_at` | **no** | Only current members are returned; the dates are personnel record. |

`getMembers` today returns `email`, `bio`, `year_level`, `profile_photo_url` and flattens in
the user id (`committee.controller.js`, line ~224). A public route must be a separate
projection rather than that handler behind `optionalAuthenticate` — the difference between the
two must be visible in the query, not in the caller's role.

## 5. The fault report

The report **form** is public: anyone — a student in a hall, a neighbour — may report a fault,
and the page should not ask them to log in first. What happens next is not public:

- the report's text and the reporter's identity,
- whether it was inspected, by whom, when,
- the status and history of the fault.

The public page may state the *procedure* ("a member inspects and logs it with a date, and the
record stays open until it is fixed") because that is a promise about how the committee works.
It may not show the log. If a fix is worth publishing, it is published as news — through the
news category that already feeds the page — not by exposing the ticket.

## 6. API rules

These are the mechanics that keep the policy honest. They apply to every new committee route.

1. **Public reads take no auth.** Not `authenticate`, and not `optionalAuthenticate` used to
    include a little more for staff. `optionalAuthenticate` is legitimate only where the
    *same* public content varies in shape by role (draft programmes hidden), never to grant a
    logged-in visitor access to something an anonymous one cannot get at all.
    Note the consequence: a section that needs such a route cannot render for the public, which
    is how the page's empty-tab problem (§7) arose.
2. **Name the columns.** `select('*')` is acceptable only behind admin auth. Every public
    query projects its fields explicitly, so adding a column to a table cannot leak it.
3. **Filter server-side, by data, not by caller.** `status = 'published'`,
    `access_level = 'public'`, `left_at is null`, `events.status <> 'draft'`. The page does not
    filter, and it must not receive the rows in order to drop them.
4. **A draft is absent, not flagged.** Public responses should not carry
    `status: 'draft'` rows with a flag the client is trusted to hide, and a draft's slug should
    404 rather than return an empty object that confirms it exists.
5. **No personal identifiers.** Public representations of people carry the fields in §4 and
    nothing else — no user UUIDs, no emails, no phone numbers, no unhashed anything.
6. **Public writes are validated and uninformative.** Contact, subscribe and report endpoints
    cap lengths (they already do), and answer the same way whether or not a record matched
    something internal. An error message must not distinguish "no such committee" from
    "committee exists but is inactive" if the difference is private.
7. **A public page shows the same thing to everyone.** Role variance on a shared route (a
    staff caller sees drafts so the dashboard can edit them) is a preview affordance for the
    admin screens, never the mechanism by which a signed-in member sees member-only content on
    a public page. If a block would only appear to members, it belongs in the portal.

## 7. Where the code stands (2026-11-16)

| Feed the committee page needs | Route | Public today |
|---|---|---|
| Committee record | `GET /api/committees/:slug` | yes |
| Programmes | `GET /api/committees/:identifier/programmes` | yes, drafts hidden by role |
| Sessions and one-off events | `GET /api/events?committee=<slug>` | yes, drafts hidden by role |
| News | `GET /api/news?category=<slug>` | yes |
| Roster | `GET /api/committees/:id/members` | **no** — `authenticate` |
| Notices | `GET /api/committees/:id/announcements` | **no** — `authenticate` |
| Documents | `GET /api/committees/:id/documents` | **no** — `authenticate`, and unfiltered by `access_level` |
| Achievements | `GET /api/committees/:id/achievements` | **no** — `authenticate` |

Two gaps follow directly, and both are prerequisites for any further committee page work:

1. **The page still calls the authenticated events route** (`committeeService.getEvents(id)`),
   so a logged-out visitor sees no dates at all — including the programme sessions that the
   programme endpoint already lists. It should read `GET /api/events?committee=<slug>`.
2. **Roster, notices (and documents, achievements where a page shows them) have no public
   read.** Until the projections in §3–§4 exist, those sections can only be built for signed-in
   visitors, which is the opposite of what the page is for.

Order of work: public events on the page → public roster and notices projections → public
documents projection (`access_level = 'public'`) → then page work that depends on them, such
as the tabbed Health layout.

## 8. Review checklist

Copy this into the pull request of any committee page or public endpoint.

- [ ] Every section's data comes from a route that answers without a token.
- [ ] Every public query lists its columns; no `select('*')` behind a public route.
- [ ] Drafts, non-public documents and departed members are excluded by the query.
- [ ] People are represented by the §4 fields only.
- [ ] Nothing renders differently for a logged-in member.
- [ ] No counts, labels or empty states reveal that hidden content exists.
- [ ] The page states its procedure (what happens after a report or an application) without
      exposing the record.
- [ ] Copy is understandable to someone who is not a member: no "ledger", "machinery",
      "pipeline", no acronym without expansion.
- [ ] Contact and join paths are reachable from the page itself, and say when a step needs a
      login instead of surprising the reader with one.

## 9. Open questions

1. **Notices have no visibility flag.** `committee_announcements` carries `pinned` and `type`
   but nothing that says public or internal. The working assumption above is that a pinned
   notice is public by definition (a committee pinning something is publishing it). If internal
   bulletins are wanted, add `visibility` defaulting to `public` — do not repurpose `pinned`.
2. **Documents default to `members`.** That default is right, but it means the public document
   list will be empty in practice until someone marks files public. A page should not render an
   empty documents section, and admins should be told at upload time what the setting means.
3. **`bio` and photos.** If a member's portrait is published, it should be because they chose
   to, not because a profile field exists. Until there is an explicit public-profile flag,
   photos on the public roster stay out (§4).
4. **The member portal's own committee views** should reuse the same projections for what they
   show publicly, and add the rest deliberately — the portal is where the wider read is
   allowed, not where a second, inconsistent one should be invented.

## 10. Audit of the existing public surface (2026-11-16)

Every route reachable without a token was read against §3–§6, and every public page against
the checklist. What was found, and what was done:

| # | Finding | Where | Fix |
|---|---|---|---|
| 1 | The committee detail response carried the chair's **personal email** and year level, and selected `*` from `committees`. | `committee.controller.getBySlug` | Named public projection, shared with the list; the chair appears as a name only. |
| 2 | **Draft events were listed publicly.** The filter covered draft *programmes* but not `events.status = 'draft'`, so an unannounced event appeared in `GET /api/events`. | `event.controller.getAll` | Non-staff callers get `status <> 'draft'`; staff keep the full list. |
| 3 | A draft event's **own page loaded by slug**, for anyone who guessed it. | `event.controller.getBySlug` | 404 for non-staff, indistinguishable from an unknown slug. |
| 4 | `organizer_id` — a user id — was returned on every public event. | `event.controller` (both reads) | Deleted from the response; no public surface rendered it. |
| 5 | `GET /api/executive` and `/past-presidents` returned `*` plus the holder's user id and year level, and the public leadership page printed "Year 4". | `executive.controller` (both public handlers), `LeadershipPage.jsx` | Named projection; the holder is a name and portrait; `user_id` deleted; the year line removed from the page. |
| 6 | Public news returned `author_id`. | `news.controller` (`getAll`, `getBySlug`) | Named column list; the admin list keeps `*`. |
| 7 | A committee's documents could be listed through the committee route **regardless of `access_level`** — a members-only or executive file appeared for any signed-in caller. | `committee.controller.getDocuments` | The rule now lives once (`canAccessDocument`, exported from `document.controller`) and is applied here too; `uploaded_by` dropped. |
| 8 | The committee page read its dates from the **authenticated** committee route, so a member saw drafts on a public page and a stranger saw nothing. | `CommitteePageTemplate.jsx` | Switched to `GET /api/events?committee=<slug>`, which drops draft events and draft programmes' sessions for non-staff. Verified in a browser: a logged-out visitor now sees the committee's next session. |
| 9 | `/api/documents` returned `uploaded_by` to anonymous readers. | `document.controller.getAll` | Dropped from the public list; the admin list is a separate route. |

**Kept deliberately.** `registration_count` stays on public event responses. It is an
aggregate, not a person, and it answers a public question — is there room for me — which the
event page and the symposia list both act on ("full"). What stays private is who is coming,
not how many have registered. `views` and `downloads` also stay: published counts, no identity.

**Not fixed, because it needs new routes rather than a tightened one** — see §7: a public
roster read, a public notices read, and a public documents read for a committee. Until they
exist those sections cannot be built for the public, and the fix is not to re-open the
authenticated ones. Also noted: `document.controller.getAll` filters after fetching every row;
that is correct but it would be cheaper for the query to filter by `access_level` once the
public projection lands.
