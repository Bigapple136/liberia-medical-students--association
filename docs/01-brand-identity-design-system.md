# LMSA BRAND IDENTITY & DESIGN SYSTEM
**Liberia Medical Students' Association**

---

## 🎨 PRIMARY BRAND COLOR

### Main Brand Color: Medical Green
**Primary:** `#0C8950` - The official LMSA green

This color represents:
- **Healthcare & Medicine** - Universal medical association color
- **Growth & Development** - Student progress and learning
- **Hope & Healing** - The medical profession's mission
- **Liberian Heritage** - Green from the national flag

**Usage:**
- Primary buttons and CTAs
- Navigation highlights
- Logo primary color
- Section accents
- Links and interactive elements

---

## 🌈 EXTENDED COLOR PALETTE

### Supporting Colors

#### **Secondary Green Shades** (LMSA Green Family)
Generated from the primary `#0C8950`:

| Shade | Hex | Usage |
|-------|-----|-------|
| **Green 50** (Lightest) | `#E8F7F0` | Light backgrounds, subtle highlights |
| **Green 100** | `#C1E8D6` | Cards, hover states |
| **Green 200** | `#9ADABC` | Disabled states, borders |
| **Green 400** | `#4DB68E` | Secondary buttons |
| **Green 600** (Primary) | `#0C8950` | **MAIN BRAND COLOR** |
| **Green 700** | `#0A7343` | Hover states on primary buttons |
| **Green 800** | `#085C36` | Text on light green backgrounds |
| **Green 900** (Darkest) | `#064629` | Deep accents |

---

### Accent Colors

#### **Liberian Red** (National Pride)
From Liberia's flag - used sparingly for emphasis

| Shade | Hex | Usage |
|-------|-----|-------|
| **Red 50** | `#FEF0F0` | Alert backgrounds |
| **Red 100** | `#FDD8D8` | Warning states |
| **Red 400** | `#F88B8B` | Error indicators |
| **Red 600** | `#DC143C` | **Liberian flag red** |
| **Red 800** | `#A00F2D` | Text on red backgrounds |

**Usage:** Emergency notifications, urgent deadlines, important announcements

---

#### **Academic Blue** (Knowledge & Trust)
Professional, trustworthy, academic excellence

| Shade | Hex | Usage |
|-------|-----|-------|
| **Blue 50** | `#E6F2FF` | Information backgrounds |
| **Blue 100** | `#B8DAFF` | Info cards |
| **Blue 400** | `#4D9FFF` | Info icons |
| **Blue 600** | `#1976D2` | Academic accents |
| **Blue 800** | `#0D5AA7` | Text on blue backgrounds |

**Usage:** Academic events, symposia, educational content, information notices

---

#### **Gold/Amber** (Achievement & Excellence)
Success, awards, premium features

| Shade | Hex | Usage |
|-------|-----|-------|
| **Amber 50** | `#FFF8E1` | Achievement backgrounds |
| **Amber 100** | `#FFECB3` | Award cards |
| **Amber 400** | `#FFCA28` | Success indicators |
| **Amber 600** | `#FFB300` | Award badges |
| **Amber 800** | `#C68400` | Text on amber backgrounds |

**Usage:** Awards, achievements, featured content, premium badges, success messages

---

### Neutral Colors

#### **Grayscale** (Foundation)
Base colors for text, backgrounds, and UI elements

| Shade | Hex | Usage |
|-------|-----|-------|
| **White** | `#FFFFFF` | Primary background |
| **Gray 50** | `#F9FAFB` | Page background |
| **Gray 100** | `#F3F4F6` | Card backgrounds |
| **Gray 200** | `#E5E7EB` | Borders, dividers |
| **Gray 300** | `#D1D5DB` | Disabled text |
| **Gray 400** | `#9CA3AF` | Placeholder text |
| **Gray 600** | `#4B5563` | Secondary text |
| **Gray 800** | `#1F2937` | Body text |
| **Gray 900** | `#111827` | Headings, primary text |
| **Black** | `#000000` | Reserved for extreme emphasis |

---

## 📝 TYPOGRAPHY

### Font Families

#### **Primary Font: Inter** (Sans-serif)
Clean, modern, highly readable - excellent for screens

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Download:** [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)

**Weights to Include:**
- 400 (Regular) - Body text
- 500 (Medium) - Subheadings, emphasis
- 600 (Semi-bold) - Section headings
- 700 (Bold) - Major headings

**Usage:**
- All UI elements
- Navigation
- Buttons
- Body text
- Headings

---

#### **Secondary Font: Merriweather** (Serif)
For editorial content, formal documents, constitution

```css
font-family: 'Merriweather', Georgia, serif;
```

**Download:** [Google Fonts - Merriweather](https://fonts.google.com/specimen/Merriweather)

**Weights:**
- 400 (Regular)
- 700 (Bold)

**Usage:**
- Long-form articles
- President's message
- Constitution/formal documents
- Quoted text
- Historical content

---

### Typography Scale

| Element | Font | Size | Weight | Line Height | Usage |
|---------|------|------|--------|-------------|-------|
| **H1** | Inter | 48px | 700 | 1.2 | Page titles |
| **H2** | Inter | 36px | 600 | 1.3 | Section headings |
| **H3** | Inter | 28px | 600 | 1.4 | Sub-sections |
| **H4** | Inter | 22px | 600 | 1.4 | Card headings |
| **H5** | Inter | 18px | 500 | 1.5 | Component titles |
| **H6** | Inter | 16px | 500 | 1.5 | Small headings |
| **Body Large** | Inter | 18px | 400 | 1.7 | Intro paragraphs |
| **Body** | Inter | 16px | 400 | 1.7 | Main content |
| **Body Small** | Inter | 14px | 400 | 1.6 | Secondary text |
| **Caption** | Inter | 12px | 400 | 1.5 | Labels, meta |
| **Button** | Inter | 15px | 500 | 1 | Buttons, CTAs |

---

### Text Colors

| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| **Primary text** | Gray 900 (#111827) | Gray 100 (#F3F4F6) |
| **Secondary text** | Gray 600 (#4B5563) | Gray 400 (#9CA3AF) |
| **Tertiary text** | Gray 400 (#9CA3AF) | Gray 600 (#4B5563) |
| **Disabled text** | Gray 300 (#D1D5DB) | Gray 700 (#374151) |
| **Link text** | Green 600 (#0C8950) | Green 400 (#4DB68E) |
| **Link hover** | Green 700 (#0A7343) | Green 300 (#9ADABC) |

---

## 🏗️ SPACING & LAYOUT

### Spacing Scale
Consistent spacing using 8px base unit

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, tight spacing |
| `sm` | 8px | Internal component padding |
| `md` | 16px | Standard spacing |
| `lg` | 24px | Section padding |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Section margins |
| `3xl` | 64px | Page sections |
| `4xl` | 96px | Major divisions |

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Badges, pills, small elements |
| `md` | 8px | Buttons, inputs, small cards |
| `lg` | 12px | Cards, modals |
| `xl` | 16px | Large cards, hero sections |
| `2xl` | 24px | Feature boxes |
| `full` | 9999px | Circles, rounded pills |

---

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| **Mobile** | 100% | < 640px |
| **Tablet** | 640px | Small tablets |
| **Desktop** | 1024px | Standard desktop |
| **Wide** | 1280px | Large screens |
| **Max** | 1440px | Maximum content width |

---

## 🎯 COMPONENTS

### Buttons

#### **Primary Button**
```css
background: #0C8950;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
```
**Hover:** `background: #0A7343`
**Active:** `background: #085C36`

#### **Secondary Button**
```css
background: transparent;
color: #0C8950;
border: 2px solid #0C8950;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
```
**Hover:** `background: #E8F7F0`

#### **Tertiary Button**
```css
background: transparent;
color: #4B5563;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
```
**Hover:** `background: #F3F4F6`

---

### Cards

#### **Standard Card**
```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

#### **Elevated Card**
```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 24px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.05);
```

#### **Accent Card** (with LMSA Green)
```css
background: #E8F7F0;
border: 2px solid #0C8950;
border-radius: 12px;
padding: 24px;
```

---

### Badges & Pills

#### **Status Badge**
```css
padding: 4px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 500;
```

**Variants:**
- **Active:** `background: #E8F7F0; color: #085C36`
- **Pending:** `background: #FFF8E1; color: #C68400`
- **Inactive:** `background: #F3F4F6; color: #4B5563`

---

### Forms

#### **Input Fields**
```css
border: 1px solid #D1D5DB;
border-radius: 8px;
padding: 10px 14px;
font-size: 15px;
```
**Focus:** `border-color: #0C8950; box-shadow: 0 0 0 3px rgba(12, 137, 80, 0.1)`

#### **Labels**
```css
font-size: 14px;
font-weight: 500;
color: #1F2937;
margin-bottom: 6px;
```

---

## 🖼️ LOGO SPECIFICATIONS

### Logo Variations

#### **Primary Logo**
- Full color on white background
- Green (#0C8950) wordmark + symbol
- Minimum size: 120px wide
- Clear space: 20px on all sides

#### **Reverse Logo**
- White on dark backgrounds (Green 800 or darker)
- Maintain same proportions

#### **Icon/Symbol Only**
- Minimum size: 32px × 32px
- Use when space is limited (favicon, app icon)

#### **Monochrome**
- All black or all white
- Use when color is not available

---

### Logo Usage Rules

✅ **DO:**
- Maintain minimum clear space
- Use approved color variations
- Maintain aspect ratio
- Use on solid backgrounds

❌ **DON'T:**
- Stretch or distort
- Change colors outside approved palette
- Add effects (shadows, glows, outlines)
- Place on busy backgrounds
- Rotate or skew

---

## 📐 GRID SYSTEM

### 12-Column Grid
Standard responsive grid for layouts

**Gutter:** 24px
**Margin:** 40px (desktop), 20px (mobile)

**Breakpoints:**
- Mobile: < 640px (1 column layouts)
- Tablet: 640px - 1023px (2-3 column layouts)
- Desktop: 1024px+ (up to 12 columns)

---

## 📄 LAYOUT PATTERNS (AMSA-Inspired)

### Homepage Structure
Following the AMSA.org model of clean, mission-driven layouts:

#### **1. Utility Bar** (Optional)
- Skip to content link
- Portal login, quick links
- Background: Gray 100

#### **2. Primary Navigation**
- Sticky navbar with mega-menu dropdowns
- Logo (left) + Navigation items (center) + CTA button (right)
- Mobile: Hamburger menu

#### **3. Hero Section**
- Full-bleed background image or solid color (Green 600 or image overlay)
- Large all-caps headline: "FUTURE MEDICAL LEADERS" (H1, 56-64px desktop)
- Subheadline paragraph (18-20px, max 65 characters per line)
- Primary CTA buttons: "Join LMSA" + "Learn More →"
- Generous padding: 80-120px vertical

#### **4. Persona Selector** ("I AM A...")
- Horizontal pill/toggle system
- Options: Student | Faculty | Alumni | Chapter Leader | Partner
- Active state: Green 600 background, white text
- Mobile: Horizontal scroll or dropdown

#### **5. Three-Pillar Feature Section**
- Three-column grid layout
- Cards: ADVOCACY | EDUCATION | NETWORKING
- Each with: Icon (48px), heading (H3), description (2-3 lines), "Learn More →" link
- Equal height cards with consistent padding
- Background: White or Green 50

#### **6. Statement of Belonging Banner**
- Full-width section with contrasting background
- Could be: Green 600 with white text, or image with overlay
- Inspirational quote or mission statement
- Centered, large text (24-28px, italic or Merriweather serif)

#### **7. Dual Value Proposition Tiles**
- Two-column layout
- Each tile: Icon/image, heading, description, CTA
- Example: "Member Benefits" | "Chapter Resources"
- Hover: Slight lift + shadow

#### **8. CTA + Benefits Grid**
- "Why Join LMSA?" section
- 2x2 or 3x2 grid of benefit cards
- Each card: Checkmark icon, benefit title, short description
- Primary CTA button: "Join Now"

#### **9. Quick-Access Resource Tiles**
- Horizontal scroll (mobile) or grid (desktop)
- Tiles: Constitution, Events, Mentorship, Career Center, etc.
- Icon + label format
- Background: Gray 50

#### **10. Blog/News Feed**
- "Latest from LMSA" section
- 3-card grid showing recent posts
- Each card: Featured image, category badge, title, excerpt, date
- "View All News →" link

#### **11. Footer** (Multi-column)
- 4-5 columns: About | Membership | Resources | Events | Connect
- Logo + social icons (top or bottom)
- Contact information
- Copyright + legal links
- Background: Gray 900 or Green 900, white text

---

### Card Layout Patterns

#### **Feature Card** (Three-Pillar Section)
```css
padding: 32px 24px;
text-align: center; /* or left-aligned for modern feel */
background: transparent;
border: none; /* or subtle: 1px solid Gray 200 */
```

#### **Content Card** (Blog, Resources)
```css
background: #FFFFFF;
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
transition: transform 0.2s, box-shadow 0.2s;
```
**Hover:** `transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);`

#### **CTA Card** (Value Proposition)
```css
background: #E8F7F0; /* Green 50 */
border: 2px solid #0C8950;
border-radius: 12px;
padding: 32px;
text-align: center;
```

---

### Section Spacing

| Element | Desktop | Mobile |
|---------|---------|--------|
| **Hero vertical padding** | 120px | 80px |
| **Section vertical padding** | 80px | 48px |
| **Between cards (grid)** | 32px | 24px |
| **Container max-width** | 1280px | 100% |
| **Content padding** | 0 40px | 0 20px |

---

## 🎭 DESIGN PRINCIPLES

### Reference Inspiration: AMSA.org
**Design Philosophy:** Modern institutional/advocacy design that prioritizes clarity, accessibility, and mission-driven messaging.

**What We're Adopting:**
- Clean, structured grid layouts with generous whitespace
- All-caps display headings for section anchors (e.g., "FUTURE PHYSICIANS", "ADVOCACY")
- Three-pillar feature layouts (Advocacy, Education, Networking)
- Persona-based navigation ("I AM A..." selectors for different user types)
- Authentic, documentary-style photography of real LMSA students/events
- Minimalist visual effects - function over decoration
- Text-based CTAs with arrow indicators ("Learn More →")
- Multi-column footer with organized link groups

**What Makes LMSA Unique:**
- **Medical Green** as primary brand color (vs AMSA's blue) - representing growth, healing, and Liberian heritage
- **Liberian cultural elements** - national flag colors, local context
- **Mobile-first optimization** for Liberian internet infrastructure
- **Student-centered focus** for medical students (not all physicians yet)

---

### 1. **Medical Professionalism + African Vitality**
- Clean, trustworthy, authoritative
- Professional but warm and community-focused
- Avoid overly playful or casual design
- Maintain credibility while celebrating African medical excellence

### 2. **Accessibility First**
- WCAG 2.1 AA compliant
- Color contrast ratios: 4.5:1 for text
- Touch targets: minimum 44px × 44px
- Keyboard navigation support
- Visible focus indicators

### 3. **Mobile-Optimized (Critical for Liberia)**
- Mobile-first approach (most Liberian users on mobile)
- Lightweight assets (<200KB per page)
- Fast loading on 3G networks
- Progressive enhancement
- Thumb-friendly navigation zones

### 4. **Student-Centered**
- Clear, predictable navigation
- Easy access to key functions (max 3 clicks)
- Student-friendly language (not overly formal)
- Persona-based content organization (Student, Faculty, Alumni)

### 5. **Liberian Context**
- Load quickly on slower connections
- Optimize for mobile data usage
- Consider local internet infrastructure
- Mobile Money integration for payments
- Liberian English spelling conventions

### 6. **Mission-Driven Storytelling**
- Alternating full-width narrative blocks and multi-column grids
- Authentic photography over stock images
- Clear advocacy and education pillars
- Impact statistics and success stories

---

## 🖱️ INTERACTIVE STATES

### Hover States
```css
transition: all 0.2s ease-in-out;
```
- Buttons: Background darkens 10%
- Cards: Lift 2-4px with subtle shadow
- Links: Color shifts to darker shade

### Focus States
```css
outline: 2px solid #0C8950;
outline-offset: 2px;
```

### Active States
- Buttons: Scale down slightly (0.98)
- Background slightly darker than hover

### Disabled States
```css
opacity: 0.5;
cursor: not-allowed;
```

---

## 📷 IMAGERY GUIDELINES

### Photography Style

**Preferred:**
- Authentic photos of LMSA students/events
- Natural, candid moments
- Diverse representation of student body
- Well-lit, professional quality

**Avoid:**
- Stock photos that look generic
- Overly posed or staged shots
- Poor quality mobile photos
- Non-medical or irrelevant imagery

### Image Treatments
- **Aspect Ratios:** 16:9 (hero), 4:3 (cards), 1:1 (profiles)
- **File Format:** WebP with JPG fallback
- **Optimization:** < 200KB per image
- **Alt Text:** Always required for accessibility

---

## 🎨 ICONOGRAPHY

### Icon System

**Library:** Lucide Icons (or Heroicons as alternative)  
**Style:** Outline (2px stroke)  
**Size Scale:** 16px, 20px, 24px, 32px, 48px

**Color Usage:**
- Default: Gray 600 (#4B5563)
- Active/Selected: Green 600 (#0C8950)
- Disabled: Gray 300 (#D1D5DB)

**Usage:**
- Navigation icons: 20px
- Feature icons: 32px
- Hero section icons: 48px
- Inline icons: 16px

---

## 📱 MOBILE CONSIDERATIONS

### Touch Targets
- Minimum: 44px × 44px
- Recommended: 48px × 48px
- Spacing between: 8px minimum

### Mobile Typography
Scale down 10-20% on mobile:
- H1: 36px (mobile) vs 48px (desktop)
- Body: 15px (mobile) vs 16px (desktop)

### Mobile Navigation
- Hamburger menu for < 768px
- Fixed bottom navigation for key actions
- Thumb-friendly zones (bottom 2/3 of screen)

---

## ♿ ACCESSIBILITY REQUIREMENTS

### Color Contrast
- **Normal text:** 4.5:1 minimum
- **Large text (18px+):** 3:1 minimum
- **UI components:** 3:1 minimum

### Text Requirements
- Minimum font size: 14px
- Line height: 1.5 minimum
- Paragraph width: 65-75 characters maximum
- Text resizable up to 200%

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip navigation links
- Focus indicators visible

### Screen Readers
- Semantic HTML
- ARIA labels where needed
- Alt text on all images
- Proper heading hierarchy

---

## 🌍 LOCALIZATION NOTES

### Language Support
**Primary:** English  
**Future:** Consider Liberian English variations

### Cultural Considerations
- Use Liberian spelling conventions
- Include Liberian national symbols appropriately
- Reference local landmarks and institutions
- Use local currency (LRD) with USD equivalent

---

## 📦 ASSET DELIVERY

### Design Files Format
- Figma (primary design tool)
- SVG for logos and icons
- PNG for raster images (WebP preferred)
- PDF for print materials

### Naming Conventions
```
lmsa-logo-primary.svg
lmsa-icon-academics-24px.svg
lmsa-photo-event-symposium-2026.webp
```

---

## 🔄 VERSION CONTROL

**Current Version:** 1.0  
**Last Updated:** April 2026  
**Next Review:** January 2027

**Changelog:**
- v1.0 (April 2026): Initial brand system established

---

## 📋 BRAND CHECKLIST

Before launching any LMSA branded material, verify:

- [ ] Uses approved color palette
- [ ] Typography follows scale and hierarchy
- [ ] Logo used correctly (size, clear space, colors)
- [ ] Meets accessibility standards (WCAG 2.1 AA)
- [ ] Mobile-optimized and responsive
- [ ] Images optimized (< 200KB)
- [ ] Text is clear and student-friendly
- [ ] Maintains professional medical association tone
- [ ] All links and buttons functional
- [ ] Passes browser compatibility testing

---

**Questions about brand usage?**  
Contact: LMSA Media & Publicity Committee  
Email: media@lmsa.org.lr