# vibe.web — Academic Research Desk Design System

## Visual Identity
An academic daily English study tool. Warm, scholarly, refined — feels like a well-appointed university library reading room. Clean, calm, focused. No gradients, no emoji outside data content, no green/emerald tones.

## Color Palette

### Light Mode
| Token | Value | Role |
|-------|-------|------|
| Page Background | #faf8f3 | Outer page, warm paper |
| Workspace Background | #fefcf9 | Main content area |
| Sidebar Background | #f5f0e8 | Left navigation, tinted |
| Card Surface | #ffffff | Cards, panels |
| Card Border | #e8e4dd | Subtle warm gray borders |
| Text Primary | #1c1917 | Headings, body text |
| Text Secondary | #78716c | Metadata, descriptions |
| Text Muted | #a8a29e | Captions, labels |
| Accent Navy | #013E75 | Primary buttons, links, active states |
| Accent Navy Hover | #012d5a | Button hover state |
| Academic Red | #A42423 | Destructive, streak badges |
| Progress Bar Track | #e8e4dd | Unfilled progress |
| Progress Bar Fill | #013E75 | Completed progress |

### Dark Mode
| Token | Value | Role |
|-------|-------|------|
| Page Background | #1c1917 | Outer page |
| Workspace Background | #131210 | Main content area |
| Sidebar Background | #1a1715 | Left navigation |
| Card Surface | #1f1d1b | Cards |
| Card Border | #292524 | Subtle borders |
| Text Primary | #e7e5e4 | Headings, body |
| Text Secondary | #78716c | Metadata |
| Text Muted | #57534e | Captions |
| Accent Navy | #7fb3df | Primary, lighter for dark |
| Accent Navy Hover | #a5cce9 | Hover state |
| Academic Red | #e08a88 | Destructive |
| Progress Bar Track | #292524 | Unfilled |
| Progress Bar Fill | #7fb3df | Completed |

## Typography

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Page Title (H1) | Source Serif 4 / Noto Serif | 600 (Semibold) | 24-30px | -0.02em |
| Section Title (H2) | Source Serif 4 / Noto Serif | 600 (Semibold) | 18-20px | -0.01em |
| Body Text | Inter / Geist Sans | 400 (Regular) | 14-15px | 0 |
| Labels (Uppercase) | Inter / Geist Sans | 500 (Medium) | 10-11px | 0.08em |
| Metadata | Inter / Geist Sans | 400 (Regular) | 12-13px | 0 |
| Navigation | Inter / Geist Sans | 500 (Medium) | 10px | 0 |
| Button Text | Inter / Geist Sans | 500 (Medium) | 12-13px | 0 |
| Card Titles | Source Serif 4 / Noto Serif | 600 (Semibold) | 16-18px | -0.01em |
| Card Body | Inter / Geist Sans | 400 (Regular) | 13-14px | 0 |

## Radius

| Level | Value | Usage |
|-------|-------|-------|
| Shell | 24px | Main content area, layout containers |
| Panel | 16px | Cards, sections, modals |
| Control | 10px | Buttons, inputs, form fields |
| Small | 6px | Badges, chips, tags |

## Spacing
- Page sections: 32px (space-y-8)
- Within sections: 24px grid
- Card padding: 20px (p-5)
- Button padding: 6px 12px (py-1.5 px-3)
- Icon size: 12-16px

## Layout
- Desktop: Left sidebar (64-96px wide) + main workspace (flex-1)
- Sidebar contains: Logo (v.w) at top, vertical nav items with active indicator dot
- Main workspace: Max width 1024px centered, scrollable
- Mobile: Top navigation bar, stacked content
- Outer shell has 16-24px padding around the entire app

## Component Styles

### Cards
- White (#ffffff) surface with 1px warm gray border
- 16px border radius
- 20px inner padding
- Subtle shadow: shadow-sm with warm tint in light mode
- Dark mode: deep ink surface with subtle border

### Buttons
- Text buttons: Minimal, bordered, hover changes border and bg
- Primary links: Inline flex with arrow icon, navy text
- Full-width buttons: Centered text, subtle border, used in dark accent cards
- Border radius: 10px

### Task Items
- Checkbox + label layout
- Completed: strikethrough, muted text
- Spacing: 8px between items

### Progress Bar
- Height: 4-6px
- Full width, rounded
- Light track background, navy fill
- Smooth transition on value change

### Tags/Badges
- Small pills with muted background
- 6px radius
- 10-11px font, medium weight

### Navigation Sidebar
- Minimal, icon-free text labels
- Active indicator: small navy underline dot (4px wide, 2px tall, round)
- Framer Motion animated indicator (spring transition)

## Pages

1. **Study Desk (/)**: Date → Title → Hero row (Focus card 60% + Task summary 40%) → Tasks list → Learning Queue (3 cards)
2. **Readings (/learn)**: Title → 3-card grid → History list
3. **Plans (/plans)**: Title + Streak → Progress → Add form → Task list → History link
4. **Settings (/settings)**: Title → Theme selector → Notion config → Footer
