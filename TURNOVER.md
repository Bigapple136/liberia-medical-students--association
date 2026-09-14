# Turnover Note — LMSA Website Orchestration

**Written:** 2026-09-03, end of a long session, handing off to a fresh
chat because this one is near its usage limit. Read this first, then
skim `ORCHESTRATION.md` (the full task-by-task history — long, but it's
the actual source of truth). This file is orientation + what's still
open; `ORCHESTRATION.md` is the detailed record.

## What this project is

Liberia Medical Students' Association website. Full-stack: React +
Vite + Tailwind frontend, Node/Express backend, Supabase
(PostgreSQL + Storage + Auth).

- **Repo:** `github.com/Bigapple136/liberia-medical-students--association`
- **Frontend code:** `lmsa-website/` — deployed on Cloudflare Workers at
  `https://lmsa-online.stone-yegan.workers.dev`
- **Backend code:** `lmsa-api/` — deployed on Render at
  `https://lmsa-site.onrender.com`
- **Database:** Supabase project (Stone has the credentials/dashboard
  access, you don't — you can't query it directly, only via the app's
  own API or by asking Stone to run SQL/check things)

## Your role

You are the **orchestrator**, not a single implementer. Stone (the
project owner) relays your instructions to implementing agents (Claude
Code or similar), who work on task branches and report back in this
chat. You: write precise task specs, review submitted work
**independently** (never just trust a report — re-run lint/build/tests
yourself), merge what's correct, send back what isn't, and keep
`ORCHESTRATION.md` accurate as the single source of truth. Stone has
also occasionally pushed pre-built branches directly for your review
(treat these exactly like task branches — full independent review, not
a rubber stamp).

## How to actually operate (mechanics)

### Getting set up in a fresh sandbox
Stone will need to give you a **GitHub Personal Access Token** (ask if
not already provided — check the conversation for one first, tokens
don't carry over between chat sessions). It needs **Contents: Read and
write** permission (fine-grained, scoped to this one repo). Once you
have it:

```bash
cd /home/claude
export GH_TOKEN="<token>"
git clone "https://x-access-token:${GH_TOKEN}@github.com/Bigapple136/liberia-medical-students--association.git" repo
cd repo
git config user.name "Claude (Orchestrator)"
git config user.email "claude-orchestrator@anthropic.local"
# Default clone only tracks main -- fix this or you won't see other branches:
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin --prune
```

**Never echo the token back in any message or put it in a file.** Treat
it as already-exposed once pasted in chat (Stone should rotate it
periodically, mention this if it's been a while).

**Sandbox resets happen mid-session, without warning** — the whole
`/home/claude` directory can just vanish (this happened twice while
writing this very document). If `cd /home/claude/repo` fails, redo the
clone/config above immediately. `main`'s state on GitHub is unaffected;
you only lose local, **uncommitted/unpushed** work. Lesson from direct
experience: commit and push anything important frequently, don't let
uncommitted work sit around — you may not get a chance to finish it
before a reset wipes it.

### The task-branch workflow
1. Spec a task as a new section in `ORCHESTRATION.md` (see existing T1–T30
   entries for the format: Context, Files to create/modify, Acceptance
   criteria, empty Report block for the agent to fill in).
2. Add a row to the summary table near the top.
3. `git checkout -b task/tN-short-name && git push origin task/tN-short-name`.
4. Give Stone the exact instruction to relay: "pull, checkout branch,
   read the T*N* section, fill in the Report block, push."
5. When Stone says it's done: `git fetch`, checkout the branch fresh
   from `origin/task/...` (don't reuse a stale local branch — rebase
   onto current `main` first, resolve any conflicts).
6. **Independently verify.** Run `npm install` (deps may need
   reinstalling after a sandbox reset), `npx eslint src --ext js,jsx`,
   `npm run build` in `lmsa-website`; `node --check` on every touched
   file in `lmsa-api`. Read the actual diff, not just the report.
   **Agents have falsely claimed "build clean" before — always verify
   yourself, every time, no exceptions.**
7. Fix small, well-understood issues yourself directly rather than
   round-tripping for something trivial. Send back anything bigger with
   a precise, itemized list of what needs to change.
8. Update both the summary table row **and** the detail section's
   status line to `done` — **grep the exact current text before editing
   either one**, don't trust your memory of what you last wrote; these
   two have drifted out of sync before from stale `sed` patterns.
9. Merge with `--no-ff`, write a real commit message describing what
   was reviewed and found (not just "merge task X").
10. Push. Do a final full-repo lint+build sanity check after merging.

### Known gotchas from this session
- **Cross-branch service-file collisions**: two agents working in
  parallel have independently created the same new service file (e.g.
  `membership.service.js`, `document.service.js`) with slightly
  different method signatures. Resolve by keeping whichever signature
  the *already-merged* branch's consuming page actually calls, and
  reconciling the other branch's call sites if needed — don't just pick
  one arbitrarily.
- **Stale-base branches**: when reviewing a branch that diverged from
  main a while ago, check `git merge-base` and diff against *current*
  main, not just read commit messages — a branch can claim to "fix" a
  bug that a *different*, later effort already fixed differently on
  main. Merging blindly can silently regress real, working fixes. This
  happened with `CommitteesPage.jsx` (T30) — see `ORCHESTRATION.md`'s T30
  entry for the full story.
- **`Promise.all` vs `Promise.allSettled`**: a recurring root cause of
  "whole page fails to load" bugs — if a page fetches from multiple
  independent endpoints, one failing shouldn't kill the rest.
- **Supabase doesn't throw on query errors** — it resolves with
  `{ data, error }` like every other call. Code that only wraps a
  Supabase call in `try/catch` without checking `.error` explicitly will
  silently swallow real failures. Check for this pattern when reviewing.
- **PostgREST embedded-resource filters/sorts** (e.g. filtering the
  outer query by a joined table's column) are unreliable — prefer
  restructuring the query so filters/sorts target the base table being
  queried from, not a nested `select()`.
- **Render free tier blocks outbound SMTP ports** (25/465/587) as of
  Sept 2025 — this is why email moved from nodemailer/Gmail to Brevo's
  HTTP API (T22). Don't try to "fix" email delivery with SMTP-based
  approaches again.

## Current state (as of commit `c4d2abd`)

Everything through **T30** is merged and independently verified. All 5
database migrations (001–005) are confirmed applied to production
Supabase. The core app is fully functional end-to-end: auth, committees,
events, membership applications, news, admin panels for all content
types, documents library, leadership/executive positions, newsletter
signup, committee applications, leadership nominations, responsive
design pass across public/portal/admin, and a full editorial/UI
redesign — all reviewed and live.

Two branches were reviewed and **deliberately not merged**:
- `improvement/ui-frontend` — stale, superseded by later work already on
  main. Leave alone.
- Nothing else currently pending review as of this writing — check
  `git branch -r` for anything new Stone may have pushed since.

## Open items — prioritized roughly by how actionable they are

1. **Forgot/reset password flow is completely missing.** `LoginPage.jsx`
   has a "Forgot password?" link pointing to `/forgot-password` — no
   such route or page exists (404). The backend handlers
   (`forgotPassword`/`resetPassword` in `auth.controller.js`) already
   exist and work; only the two frontend pages need building. This is a
   real, user-facing gap — worth specing as the next task unless
   something more urgent comes up. **Flagged, not yet fixed.**
2. **Brevo email setup deferred by Stone.** Code is done (T22, merged),
   but `BREVO_API_KEY`/`BREVO_SENDER_EMAIL`/`BREVO_SENDER_NAME` were
   never set on Render — Stone said to table this. Check if he's ready
   to revisit.
3. **`VITE_SITE_URL` unset on Cloudflare.** `PageMeta.jsx` (SEO
   meta tags) silently falls back to `https://lmsa.org.lr`, which isn't
   the real live domain. Documented in `lmsa-website/.env.example`, but
   Stone needs to decide the real value and set it.
4. **Announcements feature — undecided.** Stone was asked whether he
   wants a distinct sitewide-banner feature (different from News) and
   said "not sure yet, tell me more" — explained the tradeoff, never got
   a final answer. Follow up if it comes up again; not urgent.
5. **Real LMSA photography.** `PageHero.jsx`/`config/images.js` use
   licensed Unsplash stock photos as placeholders, self-documented with
   TODOs. Needs Stone's own photo assets whenever available — not
   something you can action without him.
6. **Committee recruitment settings unset.** `accepting_applications`,
   `openings`, `application_deadline` all default closed/0/null on every
   committee (T29's migration). Stone needs to set these per-committee
   (via Supabase directly, or eventually a proper admin UI if he wants
   one built) for the "Apply now" flow to actually show anything.
7. **No `election_cycles` row exists yet.** Needed for
   `/leadership#stand` to show real nomination dates/button — create via
   **Admin → Executive → Nominations & election cycle**. This is doable
   by Stone directly through the app UI, no code needed.
8. **`.replit` and `.agents/skills/`** — Stone confirmed keeping these
   (dev-tooling artifacts, not app code). Settled, no action needed.

## A note on tone/process

This session ran for a very long time and covered a lot of ground —
Stone has been a good, engaged collaborator throughout, responsive to
questions and comfortable with the back-and-forth review process. He
knows the drill: task branches, not direct pushes to `main` (confirmed
this explicitly after an early incident where direct pushes caused
merge conflicts with in-flight work). Keep the same rigor — independent
verification of every claim, real acceptance criteria, honest reporting
about what could and couldn't be tested from the sandbox (no live
browser, no direct Supabase access) — that's what's made this work well
so far.
