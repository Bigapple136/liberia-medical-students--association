# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (confirmed):** Current medical students of LMSA (A.M. Dogliotti College of Medicine, University of Liberia). Situation: a member signs in to check membership status, find and register for events, and take part in committees. Job: manage their membership life in one place without emailing leadership.

**Secondary (confirmed by code):** Admin/executive/super_admin users have a separate `/admin` surface. The portal deliberately does not hijack them after login (DashboardPage redirects to admin only on the `justLoggedIn` state); an admin who is also a student may intentionally visit their own student portal.

## Product Purpose

Official website of the Liberia Medical Students' Association — connecting medical students in Liberia through education, advocacy, leadership, and service. The member portal is the authenticated home base where a member sees their membership status, upcoming registered events, and association news. Success: members self-serve answers ("Am I active? What's coming up? What's new?") without contacting leadership.

## Positioning

"The voice of Liberia's future physicians" — the national student body for Liberian medical students. The portal is the member's standing relationship with the association, distinct from the public marketing site.

## Operating Context

- **Mobile-first, low bandwidth (confirmed):** members mostly browse on phones, sometimes on slow networks. Small screens and constrained data are the primary case, not the edge case.
- English language. Monrovia, Liberia.

## Capabilities and Constraints

- Auth via Supabase; profile (role, membership_status) merged from the backend API.
- Roles: student, admin, executive, super_admin. Membership statuses: active, pending, inactive, suspended. Membership types: full, associate, honorary, veteran.
- Portal roadmap (confirmed direction, timing undecided): events hub (browse/register/manage registrations), member documents & resources, dues & payments, applications (mentorship, committees) with status tracking. The portal shell must be built to host these sections.
- Live Supabase/API cannot run in the current sandbox (no env vars); data-dependent UI states must be verifiable statically or mocked.
- Undecided: payment provider, resource access model.

## Brand Commitments

- Name: LMSA (Liberia Medical Students' Association); tagline "The voice of Liberia's future physicians."
- Brand green `#0C8950`; WCAG AA-compliant palette committed in `tailwind.config.js` (semantic families: red = Liberian flag, blue = academic, amber = achievement, teal = health/info, purple = leadership, orange = events/CTAs, rose = welfare).
- Fonts: Inter (sans), Merriweather (serif).

## Evidence on Hand

- Real API data model (dashboard.service: membership_status, events_registered_count, committees_count, upcoming events).
- OG copy and favicon/logo assets in `lmsa-website/public/`.
- Existing Playwright-style browser-test harness (`lmsa-website/browser-test/flow.mjs`).
- Absences: no testimonials, press, or benchmark claims exist — do not fabricate any.

## Product Principles

1. **Members self-serve.** The portal answers status and action questions without contacting leadership.
2. **Mobile-first under constrained bandwidth.** Design for the phone on a slow network first; desktop inherits.
3. **Honest data.** Unavailable ≠ zero; partial failures are visible, labeled, and recoverable.
4. **One home base.** Future member capabilities (events, resources, dues, applications) live inside the portal, not scattered across the public site.

## Accessibility & Inclusion

WCAG AA committed (per tailwind config). Skip links, 44px minimum touch targets, and honest empty/error states are already standard in portal code — keep them.
