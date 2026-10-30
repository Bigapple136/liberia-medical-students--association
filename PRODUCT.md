# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: current LMSA members — medical students at A.M. Dogliotti College of Medicine (Monrovia). Their jobs: manage membership and profile in the portal, find events and register, get academic support (resources, mentorship, research, career center), and follow news and announcements. Design decisions for current members win when audiences conflict.

Secondary (confirmed, not leading): prospective members being recruited to join; executive officers and committee admins who manage content through the role-gated admin area; partners and alumni engaging via public pages.

## Product Purpose

The official digital home of the Liberia Medical Students' Association: a professional, trustworthy presence that connects current students across years, communicates news and events, showcases governance transparently (constitution, leadership, committees), distributes academic resources, and onboards new members. Success signals used by the project: registered member adoption, newsletter subscribers, event registrations, partnership inquiries.

## Positioning

A student-led association for better healthcare in Liberia — run by the medical students themselves at Liberia's own medical school. Its claim no neighboring association site (AMSA, UGMSA, MUMSA) can truthfully copy: the Liberian medical-student community, its 12 standing committees, and the "practice at home / train abroad without losing sight of home" framing across its programs.

## Operating Context

Liberia-first usage realities: mobile-dominant, ~3G connections, data-light pages (target < 200KB/page), click-to-call and mainstream email rather than fancy contact systems. Association rhythms: general assembly, dues cycles, annual ceremonies, symposia. Content is managed by student officers with real constraints on time and photography resources.

## Capabilities and Constraints

- Public site: React 18 SPA (Vite, React Router, Tailwind), public pages across About / Leadership / Membership / Academics / Events / News / Get Involved / Contact / Documents.
- Member portal (Supabase auth-gated): dashboard, my events, profile.
- Admin: role-gated dashboards for news, events, committees, documents, membership, leadership.
- API (`lmsa-api`): Node.js 20 / Express 4 / Supabase Postgres / JWT / Nodemailer; public reads for committees, events; member registration for events; admin CRUD.
- News system supports an "Opportunities" category (the closest existing surface to a future career opportunity board).

Explicitly undecided / not built (do not treat as shipped): a dedicated career "opportunity board" surface (copy was softened in Oct 2026 until it exists); online dues payments; forums; elections module; ID-card portal integration; alumni directory. Phase-2/3 items from the 2026 dev plan.

## Brand Commitments

- Official green `#0C8950` with the LMSA shade family (brand guide v1.0); Inter for UI, Merriweather for editorial serif; Lucide outline icons.
- Logo rules per brand guide (clear space, no distortion, no out-of-palette color).
- WCAG 2.1 AA is the required bar: 4.5:1 text contrast, 44px touch targets, keyboard navigation, alt text always.
- Professional medical-association tone with a warm, student-centered editorial voice; editorial design language (cream/green bands, serif pull-notes) is the incumbent world across public pages.
- Binding official contacts: dev.lmsa@gmail.com, +231 77 000 0000, A.M. Dogliotti College of Medicine, Monrovia. The early plan document's blue palette (lmsa_website_plan.md) was superseded by the green brand guide — the blue doc is historical, not binding.

## Evidence on Hand

- Real constitution, leadership structure, 12 committee pages, event/news content in the codebase.
- Photography is currently curated/configured stock (photo config with credit captions); authentic LMSA event photography is listed in the plan's content-to-gather and has not been delivered — future work must not fabricate member testimonials, metrics, alumni quotes, or "live" claims about resources that don't exist.

## Product Principles

1. **Serve the current member daily.** Anything the public site promises (board, portal value, support) must exist or be honestly labeled as coming.
2. **Mobile-first under Liberian connectivity.** Light pages, thumb-friendly, 3G realistic.
3. **Honest affordances.** Every promise gets a link to its real destination; soften or cut what isn't wired yet.
4. **Editorial voice, institutional trust.** Professional association credibility with a warm student voice; specifics over slogans.
5. **Accessibility is the floor, not a feature.** WCAG 2.1 AA on every surface including admin.

## Accessibility & Inclusion

WCAG 2.1 AA required (contrast, touch targets, keyboard, alt text); low-bandwidth users first-class; English primary (Liberian spelling conventions); consider Liberian currency/context references where relevant.
