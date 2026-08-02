# AMSA.ORG → LMSA DESIGN ANALYSIS
**Reference Site Analysis & Adaptation Strategy**

---

## 🎯 KEY TAKEAWAYS FROM AMSA.ORG

### What Works Well
1. **Clean, authoritative design** - Befitting a 60+ year medical organization
2. **Clear information hierarchy** - Easy to scan and navigate
3. **Mission-driven layouts** - Every section reinforces organizational values
4. **Persona-based navigation** - "I AM A..." selectors for different audiences
5. **Three-pillar structure** - Advocacy, Education, Networking
6. **Authentic photography** - Real students, real events (not stock)
7. **Generous whitespace** - Breathable, organized content
8. **Text-based CTAs** - "Learn More →" links alongside buttons
9. **Multi-column footer** - Comprehensive link organization
10. **All-caps display headings** - Structural impact for section anchors

---

## 🔄 ADAPTATION FOR LMSA

### Keep (Directly Apply)
✅ **Three-pillar layout** (Advocacy, Education, Networking)
✅ **Persona selector** ("I AM A..." → Student | Faculty | Alumni | Chapter Leader)
✅ **All-caps section headings** (e.g., "FUTURE MEDICAL LEADERS")
✅ **Generous section spacing** (80-120px vertical padding)
✅ **Authentic photography** (Real LMSA students/events)
✅ **Text CTAs with arrows** ("Learn More →", "Join Now →")
✅ **Multi-column footer** (organized link groups)
✅ **Minimalist visual effects** (function over decoration)
✅ **Statement banner** (full-width inspirational quote/mission)

### Modify (LMSA-Specific)
🔄 **Brand Color**: Blue (#0089CF) → **Green (#0C8950)**
   - Primary CTAs, links, accents in LMSA Green
   - Represents growth, healing, Liberian heritage

🔄 **Typography**: Myriad Pro → **Inter**
   - Better Google Fonts support
   - More weights available
   - Excellent screen readability

🔄 **Mobile Priority**: Standard responsive → **Mobile-first critical**
   - Liberian internet infrastructure (3G, mobile data)
   - Optimize for slower connections
   - <200KB per page target

🔄 **Cultural Context**: American medical students → **Liberian medical students**
   - Local spelling conventions
   - Liberian national symbols (flag colors)
   - Mobile Money integration
   - Africa-focused medical challenges

### Add (LMSA Unique)
➕ **Liberian flag accent colors** (Red for urgency, Blue for academics)
➕ **Mobile Money payment flows** (for memberships/events)
➕ **Chapter-specific pages** (regional medical schools in Liberia)
➕ **Mentorship program highlights** (connecting students with physicians)
➕ **Liberian healthcare context** (local challenges, opportunities)
➕ **Gold/Amber for achievements** (awards, certifications, milestones)

---

## 🎨 COLOR COMPARISON

| Element | AMSA | LMSA | Rationale |
|---------|------|------|-----------|
| **Primary Brand** | #0089CF (Blue) | **#0C8950 (Green)** | Medical green + Liberian flag |
| **Secondary** | Purple, Red, Green | **Liberian Red (#DC143C), Academic Blue (#1976D2)** | National pride, academic excellence |
| **Accent** | - | **Gold (#FFB300)** | Achievement, excellence |
| **Background** | White/Light gray | **White/Gray 50** | Same clean approach |
| **Text** | Dark charcoal | **Gray 900 (#111827)** | Same high contrast |
| **CTA Buttons** | Blue | **Green 600** | Brand consistency |
| **Links** | Blue | **Green 600** | Brand consistency |

---

## 📐 LAYOUT STRUCTURE (Shared Pattern)

```
┌─────────────────────────────────────┐
│        UTILITY BAR (optional)       │
├─────────────────────────────────────┤
│         PRIMARY NAVIGATION          │
│  Logo | Nav Items | CTA Button      │
├─────────────────────────────────────┤
│                                     │
│          HERO SECTION               │
│   "FUTURE MEDICAL LEADERS"          │
│   [Join LMSA] [Learn More →]       │
│                                     │
├─────────────────────────────────────┤
│       PERSONA SELECTOR              │
│  Student | Faculty | Alumni | ...   │
├─────────────────────────────────────┤
│                                     │
│     THREE-PILLAR FEATURES           │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ADV  │ │EDU  │ │NET  │          │
│  └─────┘ └─────┘ └─────┘          │
│                                     │
├─────────────────────────────────────┤
│    STATEMENT OF BELONGING           │
│   (Full-width banner/quote)         │
├─────────────────────────────────────┤
│                                     │
│    DUAL VALUE PROPOSITIONS          │
│  ┌──────────┐ ┌──────────┐         │
│  │Benefits  │ │Resources │         │
│  └──────────┘ └──────────┘         │
│                                     │
├─────────────────────────────────────┤
│       WHY JOIN LMSA (Grid)          │
│  ┌──┐ ┌──┐ ┌──┐                   │
│  │✓ │ │✓ │ │✓ │  [Join Now]       │
│  └──┘ └──┘ └──┘                   │
├─────────────────────────────────────┤
│    QUICK-ACCESS RESOURCE TILES      │
├─────────────────────────────────────┤
│       LATEST NEWS/BLOG              │
├─────────────────────────────────────┤
│              FOOTER                 │
│  About | Members | Resources | ...  │
└─────────────────────────────────────┘
```

---

## 🖋️ TYPOGRAPHY COMPARISON

| Element | AMSA | LMSA | Notes |
|---------|------|------|-------|
| **Primary Font** | Myriad Pro | **Inter** | Better web support |
| **Secondary Font** | MV Boli (display) | **Merriweather** | Formal documents |
| **H1 (Hero)** | ~56-64px, Bold, ALL CAPS | **48-56px, 700, ALL CAPS** | Slightly smaller for mobile |
| **H2 (Section)** | ~36-42px, Semibold | **36px, 600** | Same scale |
| **Body** | ~16px, Regular | **16px, 400** | Same readability |
| **Links/CTAs** | Blue, underline on hover | **Green 600, underline on hover** | Brand consistency |

---

## 📱 MOBILE CONSIDERATIONS

### AMSA Approach
- Standard responsive breakpoints
- Hamburger menu on mobile
- Stacked single-column layouts
- Reduced section padding

### LMSA Enhancements (Critical for Liberia)
- **Aggressive mobile optimization**
  - Touch targets: 48px minimum (not 44px)
  - Horizontal scroll for resource tiles (swipe-friendly)
  - Fixed bottom nav for key actions (optional)
  - Horizontal persona selector with scroll
- **Performance**
  - WebP images with JPG fallback
  - Lazy loading for below-fold content
  - Font-display: swap (no FOIT)
  - Max 200KB per page initial load
- **Network realities**
  - Graceful degradation on 3G
  - Minimal JavaScript for initial render
  - Critical CSS inlined
  - Defer non-essential scripts

---

## 🎯 COMPONENT PATTERNS

### Navigation
**AMSA:** Mega-menu dropdowns with nested categories
**LMSA:** Same pattern, but simplified
- Desktop: Horizontal nav with dropdowns
- Mobile: Hamburger → slide-out menu
- Sticky on scroll (with shadow on scroll)

### Buttons
**AMSA:** Solid blue buttons with white text
**LMSA:** Solid green buttons with white text
```css
/* Primary */
background: #0C8950;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;

/* Hover */
background: #0A7343;

/* Text CTA */
color: #0C8950;
text-decoration: none;
/* Hover: underline appears */
```

### Cards
**AMSA:** Minimal borders, generous padding
**LMSA:** Same approach
```css
/* Feature card */
padding: 32px 24px;
text-align: center;
background: transparent;
border: none;

/* Content card (blog, resources) */
background: #FFFFFF;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
```

### Hero
**AMSA:** Full-bleed photo with text overlay
**LMSA:** Same pattern
- Full-bleed authentic LMSA event photo
- Dark overlay (if needed for contrast)
- Large all-caps headline
- Subheadline paragraph
- Dual CTAs

---

## 📸 PHOTOGRAPHY STRATEGY

### AMSA Style
- Authentic, documentary-style
- Diverse medical students
- Clinical and advocacy settings
- Avoids corporate stock feel

### LMSA Strategy
- **Real LMSA students** at actual events
- Liberian medical schools, hospitals
- Community health outreach programs
- Natural, candid moments
- Professional quality but authentic
- **Avoid:** Generic stock, overly posed, non-medical

### Technical Specs
- Format: WebP (primary) + JPG (fallback)
- Max size: 200KB per image
- Hero: 1920x1080px minimum (16:9)
- Cards: 800x600px (4:3)
- Profiles: 400x400px (1:1)
- Always include alt text

---

## ♿ ACCESSIBILITY SHARED REQUIREMENTS

Both AMSA and LMSA must meet:
- ✅ WCAG 2.1 AA compliance
- ✅ Color contrast: 4.5:1 minimum for text
- ✅ Touch targets: 44x44px minimum
- ✅ Keyboard navigation support
- ✅ Visible focus indicators
- ✅ Semantic HTML structure
- ✅ ARIA labels where needed
- ✅ Alt text on all images
- ✅ Proper heading hierarchy (h1→h6)
- ✅ Skip navigation links
- ✅ Screen reader optimized

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Core Structure (Week 1-2)
1. Navigation bar (sticky, responsive)
2. Hero section with CTA
3. Three-pillar features section
4. Basic footer

### Phase 2: Content Sections (Week 2-3)
5. Persona selector
6. Statement banner
7. Value proposition tiles
8. Benefits grid

### Phase 3: Dynamic Content (Week 3-4)
9. Resource tiles
10. Blog/news feed
11. Multi-column footer
12. Mobile optimizations

### Phase 4: Polish (Week 4-5)
13. Authentic photography
14. Hover/focus states
15. Performance optimization
16. Accessibility audit

---

## 📋 DESIGN CHECKLIST

Before implementing any page:

- [ ] Follows AMSA-inspired layout structure?
- [ ] Uses LMSA brand colors (Green primary)?
- [ ] Typography follows Inter/Merriweather scale?
- [ ] All-caps display headings for sections?
- [ ] Generous whitespace (80px+ section padding)?
- [ ] Authentic imagery (not stock)?
- [ ] Text CTAs with arrows ("Learn More →")?
- [ ] Mobile-optimized (touch targets, performance)?
- [ ] Accessible (contrast, keyboard, screen readers)?
- [ ] Liberian context considered?

---

**Reference Sites:**
- AMSA.org: https://www.amsa.org/
- LMSA Brand Guide: ./01-brand-identity-design-system.md

**Last Updated:** April 2026
