---
name: LMSA Design System
description: Clinical, border-led visual system for the Liberia Medical Students' Association web presence
colors:
  brand-green: "#0C8950"
  brand-green-deep: "#0A7343"
  brand-green-tint: "#E8F7F0"
  flag-red: "#DC143C"
  academic-blue: "#1976D2"
  achievement-amber: "#FFB300"
  info-teal: "#2C7A7B"
  leadership-purple: "#7E22CE"
  event-orange: "#EA580C"
  welfare-rose: "#E11D48"
  page-bg: "#F9FAFB"
  surface: "#FFFFFF"
  border: "#E5E7EB"
  ink: "#111827"
  ink-secondary: "#4B5563"
  ink-muted: "#6B7280"
typography:
  display:
    fontFamily: "Merriweather, Georgia, serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1.1
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-green}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.brand-green}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-danger:
    backgroundColor: "{colors.flag-red}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: LMSA

## Overview

**Creative North Star: "The Clinic Chart"**

Everything in this system behaves like a well-kept patient chart: ordered, legible, calm, and impossible to misread. LMSA is a medical association; its interfaces borrow clinical discipline — dense but breathable information, hairline rules instead of heavy chrome, one confident brand green where an order-of-magnitude decision needs emphasis. Nothing shouts; everything answers.

Depth is carried by 1px borders and tonal steps, never by stacked shadows. Density is real (`text-sm` is the workhorse size) but always with generous-enough touch targets, because members are often on phones over slow networks. The brand green is the single voice of action and identity; the six semantic color families (flag red, academic blue, achievement gold, health teal, leadership purple, event orange, welfare rose) are informative labels, not decoration.

**Key Characteristics:**
- Border-led, flat surfaces; shadow is a state response, not a resting condition
- One action color (LMSA green `#0C8950`); semantic families carry meaning, never mood
- Compact, scan-friendly density with 44px minimum touch targets
- Inter for interface, Merriweather for editorial/display moments
- Rounded-lg (8px) controls, rounded-xl (12px) cards — gently curved, never bubbly

## Colors

A single authoritative green commands action; six semantic families label meaning; a full grayscale does the quiet work.

### Primary
- **LMSA Green** (#0C8950, ramp #E8F7F0 → #064629): The voice of the association. Primary buttons, links, active navigation, brand moments, focus rings. Green tints (#E8F7F0, #C1E8D6) provide informational backgrounds — badges, active states, highlighted cards.

### Secondary
- **Academic Blue** (#1976D2): Information and academia — informational chips, "upcoming events" data, educational program tags.
- **Achievement Gold** (#FFB300): Achievement and recognition — awards, honors, milestones.
- **Event Orange** (#EA580C): Events and calls-to-action tagging in public contexts.
- **Leadership Purple** (#7E22CE): Executive council and leadership distinctions.
- **Welfare Rose** (#E11D48): Welfare, wellness, human-interest content.
- **Health Teal** (#2C7A7B): Health information and clinical topics.

### Tertiary
- **Flag Red** (#DC143C): Liberian flag identity moments and destructive actions only. It never decorates.

### Neutral
- **Ink** (#111827): Primary text, headings.
- **Ink Secondary** (#4B5563): Body copy, secondary text.
- **Ink Muted** (#6B7280): Meta text, captions, placeholders.
- **Border** (#E5E7EB): All default 1px borders and dividers.
- **Page** (#F9FAFB): Page background beneath white surfaces.
- **Surface** (#FFFFFF): Cards, sheets, inputs, the portal chrome.

### Named Rules
**The One Voice Rule.** LMSA green is the only color that may signal "act here." The semantic families inform; they never invite.

**The Flag Rule.** Flag red (#DC143C) appears in flag identity and destructive confirmations. Nowhere else.

**The Chart Rule.** Color is data. If a color doesn't tell the member something true (status, category, severity), it doesn't appear.

## Typography

**Display Font:** Merriweather (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** Merriweather carries the institutional, editorial voice — mission statements, page heroes, quotations. Inter does everything else with clinical efficiency. The pairing reads as "a medical journal with a modern charting layer."

### Hierarchy
- **Display** (Merriweather, 800, 48px, 1.1): Public page heroes and landmark statements only. Never in the portal chrome.
- **Headline** (Inter, 700, 30px, 1.2): Page titles (`text-3xl`).
- **Title** (Inter, 700, 20px, 1.3): Section headers and card titles (`text-xl`/`text-lg`).
- **Body** (Inter, 400, 16px, 1.6): Long-form reading. Portal UI defaults one step smaller.
- **Label** (Inter, 500, 14px, 1.4): The interface workhorse — buttons, labels, meta, dense data (`text-sm`).

### Named Rules
**The Workhorse Rule.** `text-sm` (14px) is the default interface size; `text-xs` (12px) only for timestamps and captions. Type steps above `text-lg` are reserved for headings.

## Layout

Single-column flow with max-width containers for reading; utility-grid layouts for dashboards and card fields. The portal is a fixed sidebar (256px, `w-64`) app shell on ≥768px and a slide-over drawer below. Content columns are `flex-1 min-w-0` so long data never forces horizontal scroll on phones. Spacing rhythm steps 12 → 16 → 24 → 32px; section separation is `mb-6` to `mb-8`. Responsive: grids go `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4` for stat rows; padding scales `p-4` → `sm:p-6`/`sm:p-8`.

## Elevation & Depth

**Flat, border-led.** Structure comes from 1px `#E5E7EB` borders and tonal layering (white on #F9FAFB, tints on white). Shadows are a response to state, not a resting condition.

### Shadow Vocabulary
- **shadow-sm** (`0 1px 2px rgba(0,0,0,0.05)`): Resting cards — barely there, just enough to separate from the page tint.
- **shadow-md** (`0 4px 6px -1px rgba(0,0,0,0.1)`): Hover lift on interactive cards; popovers.
- **shadow-lg** (`0 10px 15px -3px rgba(0,0,0,0.1)`): Overlays, mobile drawers, modals, dropdowns.
- **Hero glow** (`0 24px 60px -12px rgba(6,70,41,0.35)`): Deep green-tinted shadow under dark-green public hero panels only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. A shadow appears only as a response (hover, focus, open) or as an overlay boundary. Never stack shadows to imply importance.

## Shapes

Gently curved, never bubbly. Controls (buttons, inputs, small chips) use 8px (`rounded-lg`); cards and panels use 12px (`rounded-xl`); feature/hero panels may use 16px (`rounded-2xl`); avatars, status dots, and icon buttons use full rounds. Forms and borders are 1px solid; the only 2px border in the system is the secondary button's outline. No sharp-cornered elements; no mixed-radius composites (a card's inner elements keep their own smaller radius, never larger).

## Components

The system's components feel precise and reassuring: crisp edges, immediate states, zero ornament. Focus is always a visible 2px ring with offset; active states compress with `scale(0.98)`.

### Buttons
- **Shape:** 8px radius, inline-flex, 200ms transitions
- **Primary:** LMSA Green fill (#0C8950), white text, `px-6 py-3`; hover deepens to #0A7343, active to #085C36
- **Secondary:** transparent with 2px green border, green text; hover floods green tint (#E8F7F0)
- **Ghost:** transparent, ink-secondary text; hover rests on gray-100
- **Danger:** Flag Red fill (#DC143C), white text; destructive confirmations only
- **Sizes:** sm `px-4 py-2 text-sm`, md `px-6 py-3 text-base`, lg `px-8 py-4 text-lg`
- **Focus:** 2px ring, 2px offset, matching the variant's identity color

### Chips
- **Style:** Full-round pills, tint background + strong same-hue text (e.g. green tint #E8F7F0 with #064629 text); 1px same-hue border optional for count contexts
- **State:** Status chips map to membership semantics — active (green), pending (amber), inactive (gray), suspended (red); category chips use their semantic family tint

### Cards / Containers
- **Corner Style:** 12px radius
- **Background:** White on the #F9FAFB page; green tint variant (#E8F7F0) with 2px green border for callout/accent cards
- **Shadow Strategy:** shadow-sm at rest, shadow-md on hover (interactive cards only) — see Elevation
- **Border:** 1px #E5E7EB default
- **Internal Padding:** 24px default; 16px on small screens (`p-4 sm:p-6`)

### Inputs / Fields
- **Style:** White fill, 1px #E5E7EB stroke, 8px radius, `px-4 py-2.5`; labels 14px medium above, helper/error text below
- **Focus:** 2px green ring, border color drops away (`focus:border-transparent`)
- **Error:** #DC143C stroke + alert icon + `role="alert"` message; success mirrors in green

### Navigation
- **Portal sidebar:** White, right border, 256px; brand block on top; items are 40–44px rows with 20px icons, `rounded-lg` hover in gray-100, active state in green tint with green text and a bold weight; identity block (avatar, name, status chip) pinned to the bottom with sign-out
- **Public header:** White sticky bar with bottom border; green links, green underline cues on active
- **Mobile:** Portal nav becomes a slide-over drawer with scrim (shadow-lg); public nav collapses into a full menu panel

### Page Hero (signature, public site)
Dark green panel with a white-grid geometric overlay (1px `white/10` rules forming a chart-grid motif, deep green glow shadow beneath). Headline in Merriweather; a marked emblem column sits to the right on ≥768px. This is the public site's landmark; the portal does not use it.

## Do's and Don'ts

### Do:
- **Do** use LMSA green (#0C8950) for every primary action, link, and active navigation state.
- **Do** carry structure with 1px #E5E7EB borders and tonal steps; keep resting surfaces flat.
- **Do** keep 44px minimum touch targets on interactive rows, links, and icon buttons.
- **Do** use `text-sm` (14px) as the interface default and scale type up only for headings.
- **Do** map status to the semantic families: green active, amber pending, gray inactive, red suspended.

### Don't:
- **Don't** introduce a new accent color or use semantic families decoratively — they carry meaning only.
- **Don't** stack shadows or elevate resting surfaces; if it needs shadow to be noticed, it needs a border or tint instead.
- **Don't** use Flag Red outside flag identity and destructive actions.
- **Don't** mix radius scales within a composite (inner elements get equal or smaller radius than their container).
- **Don't** use Merriweather inside portal chrome or data UI — it belongs to editorial/display moments on the public site.
