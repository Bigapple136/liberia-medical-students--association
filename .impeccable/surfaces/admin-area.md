# Surface Brief: Admin Area UI/UX + Responsive (T42)

Confirmed via `$impeccable shape` (approved by user 2026-10-06). Branch:
`task/t42-admin-ui-ux`, stacked on the T33 WIP checkpoint commit.

## Job and audience
Admin-tier members (admin/executive/super_admin, role-gated) running LMSA
operations — reviewing applications, managing committees, events, documents,
news, leadership — from phones between classes as often as desktops. Operate mode.

## Outcome and proof
Every admin page renders logically at 375/768/1024/1440px, verified by a
dev-only mock-auth preview + headless Chrome probe (computed-style facts per
viewport), not just code reasoning. Zero real contrast defects. An admin can
sign out from inside the panel.

## Direction (refinement on T25's foundation, Clinic Chart rules)
1. Shell parity with the portal (T40 pattern): identity block (initials, name,
   role chip) + Sign out; drawer focus trap/Escape/scroll-lock/aria-expanded.
2. Truthful nav: dead `/admin/announcements` item removed (no route existed).
3. Container rhythm: dashboard gains the missing container; pages standardize
   to `max-w-6xl mx-auto p-4 sm:p-6`; CommitteeAdminDashboard stays full-bleed
   (legitimate two-pane app).
4. Contrast per design system: destructive icon hover pairs gray->red-700 on
   red-50; public-access chips green-50/green-700 -> lmsa-50/lmsa-800.
5. Active nav items carry tint + weight, never colored side-borders.

## Scope and boundaries
AdminLayout + 7 admin pages + dev-only preview harness (admin-preview.html,
src/dev/*, .env.preview, `npm run dev:admin-preview`). AuthContext gained a
VITE_PREVIEW_MODE-gated dev hook (documented deviation: the only production-file
coupling; no-op unless the env var is set). Anti-goals honored: no committee-page
redesign, no IA rewrite, no new colors, no Merriweather.

## User decisions
Whole admin area (not shell+dashboard only); full shell parity; mock-auth
preview verification (chosen over code-reasoned-only).
