# LMSA UI/UX QUICK REFERENCE
**For AI Agents & Developers**

---

## 🎨 BRAND COLORS (Must Use)

### Primary
- **LMSA Green:** `#0C8950` - Main brand color (buttons, links, accents)

### Secondary Greens
- **Green 50:** `#E8F7F0` - Light backgrounds
- **Green 100:** `#C1E8D6` - Card highlights
- **Green 400:** `#4DB68E` - Secondary buttons
- **Green 600:** `#0C8950` - **PRIMARY**
- **Green 700:** `#0A7343` - Hover states
- **Green 800:** `#085C36` - Dark accents
- **Green 900:** `#064629` - Deep accents

### Accent Colors
- **Liberian Red:** `#DC143C` - Urgency, alerts
- **Academic Blue:** `#1976D2` - Academic content
- **Achievement Gold:** `#FFB300` - Awards, badges

### Neutrals
- **White:** `#FFFFFF` - Primary background
- **Gray 50:** `#F9FAFB` - Page background
- **Gray 100:** `#F3F4F6` - Card backgrounds
- **Gray 200:** `#E5E7EB` - Borders
- **Gray 600:** `#4B5563` - Secondary text
- **Gray 800:** `#1F2937` - Body text
- **Gray 900:** `#111827` - Headings

---

## 🖋️ TYPOGRAPHY

### Fonts
```css
/* Primary: Inter (UI elements) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary: Merriweather (editorial content) */
font-family: 'Merriweather', Georgia, serif;
```

### Type Scale
| Element | Size | Weight | Line Height | Notes |
|---------|------|--------|-------------|-------|
| **H1** | 48-56px | 700 | 1.2 | ALL CAPS for sections |
| **H2** | 36px | 600 | 1.3 | Section headings |
| **H3** | 28px | 600 | 1.4 | Sub-sections |
| **H4** | 22px | 600 | 1.4 | Card headings |
| **H5** | 18px | 500 | 1.5 | Component titles |
| **Body** | 16px | 400 | 1.7 | Main content |
| **Body Small** | 14px | 400 | 1.6 | Secondary text |
| **Button** | 15px | 500 | 1 | Buttons, CTAs |

---

## 📐 SPACING (8px Base)

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps |
| sm | 8px | Internal padding |
| md | 16px | Standard spacing |
| lg | 24px | Section padding |
| xl | 32px | Large gaps, card padding |
| 2xl | 48px | Section margins |
| 3xl | 64px | Page sections |
| 4xl | 96px | Major divisions |

---

## 🧩 COMPONENT PATTERNS

### Primary Button
```css
background: #0C8950;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
font-size: 15px;
transition: all 0.2s ease-in-out;
cursor: pointer;
```
**Hover:** `background: #0A7343; transform: translateY(-2px);`
**Focus:** `outline: 2px solid #0C8950; outline-offset: 2px;`
**Active:** `background: #085C36; transform: scale(0.98);`

### Secondary Button
```css
background: transparent;
color: #0C8950;
border: 2px solid #0C8950;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
```
**Hover:** `background: #E8F7F0;`

### Text CTA
```css
color: #0C8950;
text-decoration: none;
font-weight: 500;
```
**Hover:** `text-decoration: underline; color: #0A7343;`
**Format:** `"Learn More →"`, `"Join Now →"`, `"View All →"`

### Card (Standard)
```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
transition: transform 0.2s, box-shadow 0.2s;
```
**Hover:** `transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);`

### Feature Card (Three-Pillar)
```css
padding: 32px 24px;
text-align: center;
background: transparent;
border: none;
```

### Input Field
```css
border: 1px solid #D1D5DB;
border-radius: 8px;
padding: 10px 14px;
font-size: 15px;
```
**Focus:** `border-color: #0C8950; box-shadow: 0 0 0 3px rgba(12, 137, 80, 0.1);`

### Badge/Pill
```css
padding: 4px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 500;
```
**Active:** `background: #E8F7F0; color: #085C36;`
**Pending:** `background: #FFF8E1; color: #C68400;`
**Inactive:** `background: #F3F4F6; color: #4B5563;`

---

## 📱 RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 640px | Single column, hamburger nav |
| Tablet | 640px - 1023px | 2-3 columns |
| Desktop | 1024px - 1279px | Up to 12 columns |
| Wide | 1280px+ | Max content width 1280px |

### Mobile Adjustments
- Touch targets: **48px minimum** (not 44px)
- H1: Scale down to 36px (from 48-56px)
- Body: 15px (from 16px)
- Section padding: 48px (from 80px)
- Horizontal scroll for tile rows

---

## 🎯 LAYOUT PATTERNS

### Homepage Sections (in order)
1. Utility Bar (optional)
2. Primary Navigation (sticky)
3. Hero Section (full-bleed image/color)
4. Persona Selector ("I AM A...")
5. Three-Pillar Features (Advocacy, Education, Networking)
6. Statement Banner (full-width quote/mission)
7. Dual Value Propositions (2-column)
8. Benefits Grid (2x2 or 3x2)
9. Quick-Access Resource Tiles
10. Blog/News Feed (3-card grid)
11. Multi-column Footer

### Section Spacing
```css
/* Desktop */
padding: 80px 40px;

/* Mobile */
padding: 48px 20px;

/* Hero (Desktop) */
padding: 120px 40px;

/* Hero (Mobile) */
padding: 80px 20px;
```

---

## 🖼️ IMAGERY

### Photo Style
- Authentic LMSA students/events
- Natural, candid moments
- Professional quality, not stock
- Diverse representation

### Technical Specs
- Format: **WebP** (primary) + JPG (fallback)
- Max size: **200KB** per image
- Hero: 1920x1080px minimum (16:9)
- Cards: 800x600px (4:3)
- Profiles: 400x400px (1:1)
- Always include **alt text**

### Iconography
- Library: **Lucide Icons** (or Heroicons)
- Style: Outline (2px stroke)
- Sizes: 16px, 20px, 24px, 32px, 48px
- Default color: Gray 600
- Active: Green 600

---

## ♿ ACCESSIBILITY MUST-HAVES

- ✅ Color contrast: **4.5:1** minimum for normal text
- ✅ Touch targets: **48x48px** minimum
- ✅ Focus indicators: `outline: 2px solid #0C8950; outline-offset: 2px;`
- ✅ Keyboard navigation: Logical tab order
- ✅ Alt text on all images
- ✅ Semantic HTML (header, nav, main, section, footer)
- ✅ ARIA labels for icon-only buttons
- ✅ Skip navigation link
- ✅ Proper heading hierarchy (h1→h6, no skips)
- ✅ Form labels always visible (not placeholder-only)

---

## 🚀 PERFORMANCE TARGETS

- Initial page load: **< 200KB**
- Image optimization: WebP with fallback
- Font loading: `font-display: swap`
- Lazy load below-fold images
- Defer non-critical JavaScript
- Critical CSS inlined
- Optimized for **3G networks**

---

## 🎨 DESIGN STYLE

### What We're Going For
- **Modern institutional** (like AMSA.org)
- Clean, structured, mission-driven
- Generous whitespace
- Minimal visual effects (function over decoration)
- Professional but warm
- Mobile-first (critical for Liberia)

### What We're Avoiding
- ❌ Emojis as icons (use SVG: Lucide/Heroicons)
- ❌ Heavy gradients or decorative effects
- ❌ Mixing design styles randomly
- ❌ Stock photography feel
- ❌ Overly playful or casual design
- ❌ Cluttered layouts
- ❌ Small touch targets (< 48px)

---

## 📝 NAMING CONVENTIONS

### CSS Classes (Tailwind-style)
```
navbar, navbar-sticky
hero, hero-content
persona-selector, persona-pill, persona-pill-active
three-pillars, pillar-card
statement-banner
benefits-grid, benefit-card
resource-tiles, resource-tile
footer, footer-column
```

### Component Files
```
Navbar.tsx
HeroSection.tsx
PersonaSelector.tsx
FeaturePillars.tsx
StatementBanner.tsx
BenefitsGrid.tsx
ResourceTiles.tsx
BlogFeed.tsx
Footer.tsx
```

### Asset Files
```
lmsa-logo-primary.svg
lmsa-logo-icon.svg
lmsa-photo-event-symposium-2026.webp
lmsa-icon-academics-24px.svg
```

---

## 🔗 REFERENCE DOCS

- Brand Identity: `./01-brand-identity-design-system.md`
- AMSA Design Analysis: `./06-amsa-design-analysis.md`
- Tech Stack: `./02-tech-stack-analysis.md`
- Technical Docs: `./03-technical-documentation.md`
- Database Schema: `./04-database-schema.sql`

---

**Last Updated:** April 2026
**Version:** 1.0
