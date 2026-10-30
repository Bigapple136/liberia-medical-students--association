# LMSA Orchestrator Handover

Written 2026-10-11 by the outgoing orchestrator. `main` was at `0eb671f` (the
T43 merge) when this was written; the handover commit sits on top of it.

This repo is **public**. Never commit a token, a password, or any secret to it,
including in this file.

## 0. The five things to know before you touch anything

1. You orchestrate. You write task specs into `ORCHESTRATION.md`, an
   implementing agent builds, and you independently verify and merge. Stone
   relays instructions and reports between you and the agents.
2. Never trust a report. Re-run lint and build yourself, read the diff against
   the spec, and check every load-bearing claim against source. Section 4 lists
   the checks that have caught real bugs here.
3. `ORCHESTRATION.md` (8,570 lines) is the single source of truth for the board
   and every task spec, report and review. The summary table near the top is the
   index. Keep it accurate.
4. The sandbox you work in gets reset without warning, and unpushed local work
   is lost when it does. Commit and push often. Recovery steps are in section 2.
5. Ask Stone for a fresh GitHub token at the start. The previous one was pasted
   into chat several times; ask him to rotate it.

## 1. Role and boundary

Stone's standing rule, recorded in `ORCHESTRATION.md` under "Orchestration
boundary": **spec-and-delegate is the default.** You write the spec, an agent
builds it. Stone also confirmed the orchestrator is the lead coder and may fix
things directly where necessary.

The test for which side of the line something falls on is not file count. It is:

- **Direct fix is fine:** small, bounded, often urgent. A live crash, a broken
  redirect, a stale nav link, a role-list typo.
- **Spec it instead:** building or integrating a feature, multiple files, real
  design decisions, anything that benefits from a different person implementing
  than reviewing.

The outgoing orchestrator got this wrong once: it implemented a six-file
recruitment-notice integration itself. Stone corrected it. Do not repeat it.
When in doubt, write the spec.

## 2. Sandbox setup

Work happens in `/home/claude/repo`. The sandbox allows these hosts only:
github.com, api.github.com, raw.githubusercontent.com, codeload.github.com, npm
registries, pypi.org. Everything else is blocked.

```bash
# 1. Clone. The repo is public, so reading works without a token. Pushing needs one.
cd /home/claude
git clone "https://x-access-token:${GH_TOKEN}@github.com/Bigapple136/liberia-medical-students--association.git" repo
cd repo
git config user.email "orchestrator@lmsa-project.local"
git config user.name  "LMSA Orchestrator"
# 2. Install and take a baseline
(cd lmsa-website && npm install)
(cd lmsa-api     && npm install)
(cd lmsa-website && npx eslint src --ext js,jsx --max-warnings 0 && npm run build)
(cd lmsa-api && find src -name '*.js' | xargs -I{} node --check {})
```

Keep the token in a shell variable or the remote URL only. Never write it to a
file, a commit message, or a report. Do not echo it back.

**Resets.** The sandbox reset twice in the last stretch of work, both times mid-merge. Symptoms: `cd` into the
repo fails, `~/.gitconfig` is gone. Only unpushed local work is lost; GitHub is
unaffected. Recovery: re-clone (read access needs no token), set the git
identity, and ask Stone for the token again to push. If a reset hits mid-merge,
redo the merge from scratch rather than trying to reconstruct it.

**Installs leave noise.** `npm install` rewrites `package-lock.json` in both
packages. Run `git checkout -- lmsa-website/package-lock.json
lmsa-api/package-lock.json` before committing. Never commit lockfile churn.

**Apostrophe in the path.** Vite's config loader fails when the working
directory path contains an apostrophe. Stone's local folder is named
`liberia-medical-students'-association`, so agents building locally may hit
this. It is a local problem, not a code problem; building from an
apostrophe-free copy works. How the hosted build path is configured has not
been verified.

## 3. The task loop

**Spec.** Add a row to the summary table and a `## Tnn: title` section at the
end of `ORCHESTRATION.md` (context, files to change, acceptance criteria, an
empty `### Report`). Verify facts in source before writing them. Commit and push
to `main`.

**Branch.** Cut `task/tNN-short-name` from current `main` and push it, so the
agent has something to check out.

**Brief.** Give Stone a self-contained relay brief per task: repo, branch,
"read the Tnn section first", what is wrong, what to build, what is out of
scope, acceptance criteria, "append a Report under the Tnn section and push".
Tell the agent to merge `origin/main` into the branch before pushing if it has
fallen behind, which avoids `ORCHESTRATION.md` conflicts.

**Review.** Fresh checkout of the branch, diff against its **fork point** (not
against current `main`, which makes unrelated work look like part of the diff),
then the checks in section 4. Run your own lint, build, and backend syntax
check. Read the agent's Report last, not first.

**Record.** Add an `### Orchestrator review` directly after the task's own
Report. Update the summary row **and** the detail header's `Status:` line; they
have drifted apart before.

**Merge.** `git merge --no-ff`, resolve conflicts (section 6), rerun lint, build
and backend checks **on `main` itself**, then push. Say plainly what could not
be verified from the sandbox: there is no live Supabase session and no browser,
so live click-through, real email delivery and real-data behavior are never
verified here.

**Stone's habits.** He often says "Tasks done" or "Continue" without detail.
Check every task branch. He sometimes reports a task done when nothing was
pushed (T38 and T43 were like that for one round), so confirm commits exist
before reviewing. He also pushes his own pre-built branches (the portal bundle,
T40 to T42); review those with the same rigor. If something looks bundled with
unrelated work, separate the sensitive part and review it on its own.

## 4. How to review: checks that have caught real problems

- **Test the claim, do not read it.** A comment said a route-order hazard did
  not exist; a throwaway Express instance proved it. A comment said the preview
  mock cannot reach production; building with `--mode preview` and grepping
  `dist/` for the mock strings proved it, and starting the dev server in both
  modes showed what `@services/supabase` resolved to.
- **Recompute numbers.** A report quoted 1.9:1 contrast; the real value was
  1.47:1. A report said "same pattern as the portal" about drawer focus; reading
  both files showed they differed.
- **Check reachability.** A proposed "apply" branch handled an empty membership
  status. Reading the schema default and the one insert path showed registered
  accounts can never have an empty status, so the branch would be dead.
- **Look for the interaction, not just the diff.** T39 deactivates committees by
  returning 404; the page's offline fallback would have silently resurrected the
  committee from bundled data. The agent caught it; look for these.
- **Grep for the leftovers.** Wrong addresses, fake names, old class names, mock
  strings in `dist/`, stray `justLoggedIn`.
- **Scope check first.** `git diff --stat` against the fork point. Surprise
  files are the first thing to explain.
- **Stale branches.** All of T40, T41 and the original T42 forked from an old
  commit and would have reverted newer work. Always trial-merge into a scratch
  branch and look at the conflict list before deciding anything.
- **Backend changes.** Test against a fake PostgREST server with the real
  controller (done for `approved_count`), including the failure path.

## 5. Standards in force

- **Orchestration boundary:** section 1, and `ORCHESTRATION.md` near the top.
- **Design/UI task standard (impeccable):** any task that creates, redesigns or
  polishes a UI surface, or touches shared layout or design-system files, must
  run the impeccable `critique` (or the narrower `audit`), put findings in the
  Report, and commit the snapshot under `.impeccable/critique/`. A run that is
  single-context or has no browser must open with the skill's
  `DEGRADED` banner. Small logic fixes and content additions to existing
  surfaces are exempt. The skill lives in `.agents/skills/impeccable/`.
- **Admin role list:** `ADMIN_ROLES` in `lmsa-website/src/utils/constants.js` is
  the single source of truth. Do not hand-type the list elsewhere.
- **Contact email:** `CONTACT_EMAIL` in the same file. Do not hardcode addresses.
- **Caveman skill** is installed at `.agents/skills/caveman/` (terse response
  style, off until someone says `/caveman`). It exempts persisted documents, so
  reports and commit messages stay in normal prose. `skills-lock.json` was not
  updated because its hash algorithm could not be reproduced; see
  `.agents/skills/caveman/SOURCE.md`.

## 6. Gotchas

**Shell**
- Commit messages containing backticks get executed by the shell. Write the
  message to a file and use `git commit -F file`. One commit was corrupted this
  way before it was caught.
- `pkill -f "vite"` kills the shell running the command, because the command
  line contains the string. Kill by port or PID instead.
- `grep -c` exits 1 when the count is zero. That is not an error.
- `git rev-parse --short` rejects two refs in one call.
- `cat >> ORCHESTRATION.md` appends to the end of the file, which is rarely
  where a task's review belongs.

**Editing `ORCHESTRATION.md`**
- Anchor edits on the task's **own** heading and assert the shape before writing.
  `s.index('### T42 rework')` matched the brief heading first and put a review
  in the wrong place; a plain `cat >>` did the same to T37's review. Both were
  caught and fixed, but only because the result was re-read.
- Patch with a short Python script that asserts its anchors, then print the
  seams (the text on each side of every insertion) before committing.
- Branches that forked before another task merged will conflict here in two
  predictable places: the summary table rows (take the `done` version of each
  task) and the end-of-file region where one side has a placeholder
  (`*(agent fills in on completion)*`) and the other has a real report. Take
  the real report, then insert your review after it.
- Task numbers can collide. T43's report proposed a follow-up called T44,
  which already existed. Renumber and say so in the review.

**Git and the repo**
- 49 remote branches exist; see section 8 before deleting any.
- `git status` after every merge; lockfile churn will be there.

## 7. Decisions Stone has made

- Orchestrator specs, others build; direct fixes allowed when small and urgent.
- Students log in to `/`; admin, executive and super_admin go to
  `/admin/dashboard`; `?next=` wins when present (T35).
- Canonical contact address is `dev.lmsa@gmail.com` (T37).
- Veteran membership is real and has no fee. Handled as open to apply, with the
  existing admin review checking alumni status (T38). Voting and office
  eligibility are unknown, so the card lists no limits.
- Committee Status gets built properly: an admin-only list including inactive
  committees, and public pages that stop resolving a deactivated committee
  (T39).
- The 12 committees are the original constitutional ones from
  `lmsa-website/src/utils/committeesData.js`, seeded by migration 008, not the
  generic placeholder names from 006.
- Impeccable critiques are standing process for UI tasks.
- T40 and T41 are closed as superseded. T42 was reworked from a clean branch.
  T43 concluded: keep `main`'s "this month" priority card.
- Past presidents show an honest empty state until real history is entered.

## 8. Current state

**Board** (the table in `ORCHESTRATION.md` is authoritative): T1 to T39 done;
T40 and T41 closed (superseded, branches retained); T42 done (rework merged);
T43 done (report only, no code); **T44 and T45 unassigned**.

**In flight:** T44 (`task/t44-admin-contrast-focus`) and T45
(`task/t45-dashboard-loading-announcement`). Briefs were given to Stone to relay.
Neither had commits at handover. T44 is behind `main` by the T38 merge and
later; the agent should merge `origin/main` first.

**Remote branches:** 49 total, 35 already merged into `main`. Unmerged by git
ancestry: `improvement/ui-frontend` (old, superseded, leave alone), the original
`task/t42-admin-ui-ux`, `task/t40-*`, `task/t41-*` (all intentionally retained),
and `task/t13`, `t18`, `t19`, `t20`, `t21`, `t24`, `t25`, `t26`, `t28`. The last
group's tasks are marked done on the board even though git ancestry says
unmerged, so their work likely landed by another route. Verify before touching
them, and ask Stone before deleting anything.

**Database migrations** live in `lmsa-website/database/` (001 to 008), run by
Stone by hand in the Supabase SQL editor. Whether 007 and 008 have been applied
in production is **unconfirmed**; ask.

## 9. Open items

**A. Needs a decision from Stone**
1. Honorary membership: the Categories, Dues and Membership pages say it is by
   invitation with no application, but the registration form offers it to
   anyone and the backend accepts it. Remove it from the form, or soften the
   wording?
2. Can Veteran members vote or hold office? The card shows no limits until this
   is known.
3. The Benefits page makes organizational claims (textbook discounts,
   scholarships, alumni network) that nothing in the code can verify. Someone
   who knows LMSA's real commitments should confirm them before launch.
4. Cleanup of merged or stale remote branches, and `skills-lock.json` sync.

**B. Candidate specs, none written.** All re-verified as still live on
2026-10-11; confirm again before speccing.
1. `documentService.download()` calls `window.open` after an awaited request, so
   popup blockers can silently block it. Fix: open the window synchronously and
   set its location after the await, or use an anchor-click download.
2. `NominationDialog.jsx` line 83 uses `bg-lmsa-950/60`; there is no 950 shade in
   the Tailwind config, so the scrim is transparent. `bg-black/40` is what the
   newer dialogs use.
3. `Button.jsx` does not forward refs.
4. Password change on the Profile page is an honest "coming soon". Needs a
   backend endpoint and a form.
5. A "promise audit" of About, Membership, Resources, Leadership and
   Partnership for dead links, no-op buttons and copy promising things that do
   not exist. Partly scriptable: diff every `to=` against the route table.
6. Nits in the dev harness: the mock identity (`src/dev/mockApi.js`,
   `mockAuth.js`) uses a real-sounding name and an `lmsa.org.lr` address, the
   domain family T37 removed. Use an obviously fake address.
7. `ORCHESTRATION.md` is 8,570 lines. Consider archiving completed task sections.

**C. Only Stone can do these (config, data, live checks)**
- Brevo env vars on Render: `BREVO_API_KEY`, `SENDER_EMAIL`, `SENDER_NAME`.
- `VITE_SITE_URL` on Cloudflare (canonical and meta tags fall back to a
  placeholder domain until it is set).
- The `election_cycles` row, per-committee recruitment settings (Admin,
  Committee Management, Details, Recruitment), real photography, and real
  past-president records through the admin panel.
- Live click-through, none of which the sandbox can do: password-reset email
  (check `FRONTEND_URL` on Render and Supabase's redirect allowlist for
  `/reset-password`), student and admin login redirects, committee
  deactivate and reactivate, recruitment end to end, My Events cancel, Profile
  save, and the admin shell on a real phone.

## 10. Working with Stone

- He prefers no em dashes in any document you produce. Older text in
  `ORCHESTRATION.md` has plenty; keep new writing free of them.
- He likes confident, direct summaries, and targeted edits over full rewrites.
- He answers decisions inline and moves fast. Offer a recommendation with each
  question instead of an open choice.
- Be plain about what you could not verify. He has consistently preferred that to
  an optimistic "done".

## 11. Mistakes from this stretch, so they are not repeated

1. Implemented a multi-file feature directly instead of speccing it (section 1).
2. The first login-redirect fix added a redundant `/users/me` call in the click
   path and produced "nothing happens". The real cause was `AuthContext`'s
   `loading` flag never resetting after the first auth check (fixed in T35). Find
   the actual race before patching async ordering, and say that no live
   click-through was possible.
3. Review text landed in the wrong section twice (section 6), and a summary row
   was left stale after merge (T34). Always verify the table and the detail
   header together.
4. Reports contain slips even when the work is good. Recompute and cross-check.
5. Agents bundle unrelated work and fork from stale commits. Check scope and fork
   point before reading code.

## 12. First thirty minutes

1. Get a fresh token from Stone. Clone, configure git, install, take the
   baseline in section 2.
2. Read, in order: the top of `ORCHESTRATION.md` (How this works, Orchestration
   boundary, Design/UI standard), then the summary table, then the T44 and T45
   sections.
3. `git fetch --prune` and list branches with commits beyond `main`. That tells
   you what to review.
4. Ask Stone the section 9A questions and whether migrations 007 and 008 have
   been applied.
5. If T44 or T45 have landed, review them with section 4. If not, wait for
   Stone's next instruction; do not invent work.
