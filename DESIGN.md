# Design System: vibe.web — Academic Research Desk
**Project ID:** `projects/1422762201768554961`
**Stitch Design System:** Academic Editorial (`assets/cef43e489e1c4963a436826f5f2a5e1b`)

---

## 1. Visual Theme & Atmosphere

The aesthetic is **New Academic Editorial** — a fusion of Modern Minimalism and Classical Editorial design. The interface evokes the quiet authority of a professor's organized desk: warm paper textures, generous whitespace, and editorial-quality typography create a calm, focused research environment.

The emotional response is one of **intellectual clarity** and **archival permanence**. There are no decorative flourishes, no gradients, no emojis, no green hues anywhere. Every element serves the content. The design communicates "serious tool for serious work" through sharp typographic hierarchy and tonal layering rather than heavy shadows.

**Density:** Airy and breathable. Large section gaps (40-48px) allow the eye to rest between conceptual units. Content is never cramped.

---

## 2. Color Palette & Roles

### Foundation Colors

| Token | Hex | Role |
|-------|-----|------|
| **Warm Paper** | `#faf8f3` | Outer desk background — the "desk surface" |
| **Pure White** | `#ffffff` | Workspace panel, cards — the "sheet of paper" |
| **Deep Charcoal** | `#1a1817` | Primary text, dark sidebar background |
| **Subtle Warm Gray** | `#e8e4dd` | Card borders, dividers, structural lines |
| **Muted Stone** | `#706c67` | Secondary text, metadata, labels, placeholders |

### Accent Colors

| Token | Hex | Role |
|-------|-----|------|
| **Academic Navy** | `#013E75` | Primary actions, progress bars, active states, navigation indicators, focus borders, checkbox fills |
| **Academic Red** | `#A42423` | **Exclusively** for destructive/delete actions |

### Semantic Rules

- **Navy is sacred.** It is the only accent used for all positive/functional UI states — no green for "success," navy conveys completion, progress, and affirmation.
- **Red is restricted.** Used ONLY for delete buttons and destructive confirmations.
- **Green is prohibited.** All success/positive states use navy or layout shifts (strikethrough, opacity changes).
- **No gradients.** All colors are solid and intentional.

### Dark Mode Adaptations

| Token | Light | Dark |
|-------|-------|------|
| Background | `#faf8f3` | `#0c0a09` |
| Workspace | `#ffffff` | `#131210` |
| Primary Text | `#1a1817` | `#e7e5e4` |
| Navy Accent | `#013E75` | `#7fb3df` |
| Red Accent | `#A42423` | `#e08a88` |

---

## 3. Typography Rules

### Font Stack

| Role | Family | Style |
|------|--------|-------|
| **Headlines** | Source Serif 4 | Serif — authoritative, literary, scholarly |
| **Body & UI** | Inter | Sans-serif — clean, functional, modern |
| **IPA/Phonetics** | Noto Sans | Sans-serif — wide Unicode coverage |

### Hierarchy Scale

| Level | Family | Size | Weight | Line Height | Tracking |
|-------|--------|------|--------|-------------|----------|
| **Display XL** | Source Serif 4 | 48px | 600 | 1.1 | -0.02em |
| **Headline LG** | Source Serif 4 | 32px | 600 | 1.2 | -0.01em |
| **Headline MD** | Source Serif 4 | 24px | 600 | 1.3 | 0 |
| **Headline SM** | Source Serif 4 | 20px | 600 | 1.4 | 0 |
| **Body LG** | Inter | 18px | 400 | 1.6 | 0 |
| **Body MD** | Inter | 16px | 400 | 1.5 | 0 |
| **Body SM** | Inter | 14px | 400 | 1.5 | 0 |
| **Label Caps** | Inter | 12px | 600 | 1.0 | 0.1em |

### Typography Rules

- **Headlines use serif.** All page titles and section headings are in Source Serif 4 with tight tracking.
- **Labels use uppercase.** UI labels (tags, section markers, metadata) are set in Label Caps: Inter 12px, all-caps, wide letter-spacing (0.1em).
- **Numbers use tabular-nums.** All numeric displays (streaks, stats, dates) use `tabular-nums` for even alignment.
- **Line heights are generous.** Body text gets 1.5-1.6x line height for extended reading comfort.

---

## 4. Shape Language

| Element | Radius | Description |
|---------|--------|-------------|
| **Workspace Panel** | 28px (`rounded-[28px]`) | Generously curved — like modern stationery |
| **Cards** | 16px (`rounded-2xl`) | Softly rounded — modern, approachable |
| **Buttons & Inputs** | 10px (`rounded-lg`) | Tighter curve — distinguishes "actionable" from "container" |
| **Tags & Chips** | 4px (`rounded-sm`) | Nearly squared — archival label feel |

---

## 5. Component Stylings

### Layout Shell
- **Sidebar:** 80px wide, dark charcoal (`#1a1817`) background. Icon-only navigation (no text labels). Active item marked by navy underline indicator. Brand mark "v.w" at top.
- **Workspace Panel:** Rounded-28px white container centered on warm paper background. Inner content max-width ~960px with 48px desktop margins.

### Cards
- White (`#ffffff`) background with 16px corner radius
- 1px border in Subtle Warm Gray (`#e8e4dd`)
- 24px minimum internal padding
- No shadow by default; subtle shadow-sm (`0 2px 4px rgba(26, 24, 23, 0.05)`) on hover
- Highlighted variant: 4px navy left border accent (for "Today's Focus" cards)

### Buttons
- **Primary:** Solid Academic Navy (`#013E75`) background, white text, 10px radius
- **Secondary:** 1px navy border, transparent background, navy text
- **Link/CTA:** Navy text with directional arrow icon (`→`), no background
- Hover: darken navy slightly; NO glows or scale transforms

### Input Fields
- White background, 10px radius, 1px Subtle Warm Gray border
- Focus: border transitions to 2px Academic Navy
- Labels above field in Label Caps style
- Placeholder text in Muted Stone (`#706c67`)

### Checkboxes
- Circular, 20px diameter
- Unchecked: 1px Subtle Warm Gray border
- Checked: Navy (`#013E75`) fill with white checkmark
- Completed tasks: strikethrough text in Muted Stone

### Tags & Chips
- Label Caps typography (Inter 12px, all-caps, wide tracking)
- Light stone background with Muted Stone or Navy text
- 4px radius — rectangular, not pill-shaped

### Progress Bars
- Thin 4px height, Academic Navy fill
- Flat ends (not rounded caps) — technical, precise
- Stone-200 background track

### Lists
- Items separated by 1px Subtle Warm Gray horizontal dividers
- 12px vertical padding per item
- Optional red delete icon (appears on hover)

### Dividers
- Always 1px solid in Subtle Warm Gray (`#e8e4dd`)
- No double lines or decorative separators

---

## 6. Elevation & Depth

This system uses **Tonal Layering** instead of heavy shadows:

| Layer | Color | Usage |
|-------|-------|-------|
| **Level 0 (Desk)** | Warm Paper `#faf8f3` | Application background — the "desk surface" |
| **Level 1 (Workspace)** | Pure White `#ffffff` | Main content panel — 1px border defines edge |
| **Level 2 (Cards)** | Pure White `#ffffff` | Cards within workspace — 1px border + ambient shadow on hover |

- **Shadows are ambient and whisper-soft:** `0px 2px 4px rgba(26, 24, 23, 0.05)` when needed for hover/focus
- **Modals/Dropdowns:** 1px border + heavy backdrop dim (80% opacity)
- **No colorful shadows.** No glow effects.

---

## 7. Layout Principles

### The Desk Model
- **Outer:** Warm Paper background filling viewport
- **Inner:** White workspace panel with 28px border radius, centered
- **Sidebar:** 80px dark vertical bar on the left

### Spacing Rhythm
- Base unit: **8px**
- Section gap: **40-48px** between major content blocks
- Card gap: **24px** in grid layouts
- Card padding: **24px** minimum internal
- Desktop margins: **48px**
- Mobile margins: **16px**

### Grid
- 12-column grid within workspace
- Content max-width: **960px** centered in the workspace panel
- Cards use equal-width columns (3-up, 2-up, or 1-up based on content)

### Responsive Strategy
- Desktop-first design
- Mobile: sidebar collapses to sticky top bar, margins reduce, cards stack vertically

---

## 8. Pages & Screens

| Screen | Stitch ID | Description |
|--------|-----------|-------------|
| **Study Desk** | `b373ed18a10341d396100f53c8aac57b` | Home dashboard with date, focus card, progress, daily cards, task list |
| **Today's Readings** | `7391375928e6435e9daf4b25a785d037` | Learning content with 3 daily cards (Conversation, Vocabulary, Reading) + history |
| **Daily Plans** | `739f3ed5f9ce4e8b926ab5b8612612bb` | Task management with progress summary, add form, task list with checkboxes |
| **Settings** | `283df326d8f64cc791a4753692113e72` | Configuration: Appearance (theme selector), Notion integration, About section |

---

## 9. Design Constraints

- **No gradients** — all colors are solid blocks
- **No emojis** — use typography and color for expression
- **No green colors** — success states use navy or layout changes
- **No pill shapes** — tags and chips are rectangular (4px radius)
- **No heavy shadows** — depth is tonal, not shadow-based
- **Red only for destruction** — Academic Red (`#A42423`) used exclusively for delete actions
