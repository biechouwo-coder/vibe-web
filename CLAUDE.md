# vibe.web — Project Rules

## Build & Run
```bash
npm run dev          # dev server (localhost:3000)
npm run build        # node scripts/build.js (DATABASE_URL fallback → prisma generate + next build)
npm start            # node scripts/start.js (DATABASE_URL fallback → prisma db push + next start)
npx prisma studio    # DB GUI
```

## Architecture
- **Framework:** Next.js 16 (App Router), Server Components by default
- **Database:** SQLite via Prisma (`prisma/dev.db`, not tracked in git), DATABASE_URL=`file:./dev.db`
- **Schema unique constraints:** `DailyContent(date+type)`, `Task(date+contentId)`
- **Migrations:** `prisma/migrations/20260507091401_init/` + `20260510091002_add_unique_constraints/`
- **Styling:** Tailwind CSS 4, class-based dark mode via `@custom-variant dark` + `html.dark`
- **Animations:** Framer Motion — `useReducedMotion()` used; cards use `initial={false}`; page transitions via `PageTransition.tsx` (AnimatePresence + key=pathname)
- **Railway DATABASE_URL fix:** `scripts/build.js` + `scripts/start.js` force `file:./dev.db` if DATABASE_URL is missing or non-file (handles stale PostgreSQL URL)
- **Deploy:** Railway (auto-deploy from GitHub `master`)

## UI Components
- **PageTransition:** `src/components/layout/PageTransition.tsx` — wraps page content for 0.2s fade+slide on route change (`AnimatePresence mode="wait"`, `key=pathname`)
- **ProgressBar:** track = `var(--task-track)` (#e8e4dd), fill = `var(--accent)` (#013E75)
- **TaskList (plans):** drag-and-drop via `@dnd-kit/core` + `@dnd-kit/sortable`; pending bg `#ffffff`, delete btn always visible; `DragOverlay` follows cursor while original slot collapses
- **HomeTaskList:** same dnd-kit drag-and-drop; Notion-style rows — `border var(--border)` + bg `#eeece6` / `var(--task-hover)`; 6-dot drag handle (⠿ pattern)
- **Confetti:** 40 particles, 12-color rainbow palette
- **Streak pill badge:** inline in `page.tsx` Progress card — `🔥 N-Day Streak` with `var(--border)` border
- **reorderTasks action:** `src/actions/plans.ts` — persists drag order via `sortOrder` updates on every drop

## UI — Academic Research Desk
- **Design system:** Academic Editorial — full spec in [DESIGN.md](DESIGN.md); Stitch project `projects/1422762201768554961`
- **Layout:** Desktop = left sidebar + rounded-[28px] workspace; Mobile = sticky top nav
- **Background:** Warm Paper `#faf8f3` (outer), Pure White `#ffffff` (workspace) — tonal layering, not shadows
- **Cards:** `rounded-2xl`, `border border-[var(--border)]`, ambient shadow `0_2px_4px_rgba(26,24,23,0.05)` on hover
- **Color tokens:** `--academic-navy: #013E75` (primary), `--academic-red: #A42423` (destructive), `--paper: #faf8f3` (outer bg), `--muted: #706c67` (secondary text), `--border: #e8e4dd`
- **Warm paper palette** — no `stone-*`, no `zinc-*`; all colors via CSS variables in `globals.css`
- **No emerald/green** in UI classes; no emoji; no gradients

## Color Usage
- Navy (`--academic-navy`): progress bars, primary buttons, completed checkboxes, navbar underline, focus-card left-border
- Deep red (`--academic-red`): delete/destructive actions only
- Muted Stone (`--muted`): all labels, secondary text, placeholders
- Warm Gray (`--border`): borders, dividers, structural lines
- Dark mode: navy → `#7fb3df`, red → `#e08a88`

## Key Conventions
- Interactive components → `'use client'`, mutations → Server Actions (`src/actions/`)
- Database queries in Server Actions or `src/lib/`, not in components
- All date/"today" logic uses Asia/Shanghai timezone (`src/lib/date.ts`)
- Page routes: `/` (Study Desk), `/learn` (Readings), `/plans` (Plans), `/settings`
- Components: `src/components/{layout,learn,plans,ui,theme}/`
- Content: `src/lib/content.ts` — uses `findFirst+create` for learning tasks (not upsert); tasks seed once per day, deleted tasks stay deleted
- Task sort: `orderBy: [{ completed: 'asc' }, { sortOrder: 'asc' }]` — completed sink to bottom (both HomeTaskList sorted client-side too)
- Sidebar nav: active item = `text-sm font-bold` + navy underline spring; inactive = `text-xs text-muted`
- Academic keywords: `src/lib/academic-keywords.ts` — shared by DailyCard and ContentDetail
- Notion API: `src/lib/notion.ts`; config returns `hasToken: boolean`, never raw token
- VocabCards: `src/components/learn/VocabCards.tsx` (academic glossary, 40px slide, reduced-motion aware)

## Content Library (`src/lib/content.ts`)
- **Conversations (8)**: topic-based with `formatConversationContent()` — outputs Topic/Scenario/Dialogue/UsefulExpressions/ToneNote/PracticePrompt/Translation
- **Readings (6)**: Journal-based `readingContent` array — paperTitle/authors/journal/year/doi/excerpt/writingFocus/vocabulary/discussionQuestions
- Vocabulary and passage come from the **same** reading item via `getDailyReadingItem()`
- Formatters: `formatReadingContent()` → passage DB, `formatVocabularyFromReading()` → vocabulary DB

## DailyCard CTAs
- Speaking Practice → **Practice**
- Vocabulary → **Review terms**
- Reading → **Read excerpt**

## Important Rules
- Vocabulary entries include IPA phonetic where available
- Vocabulary uses card-carousel display (VocabCards component) with left/right navigation
- Daily conversation cards show scenario preview on Home, full speaking practice note on detail page
- Daily learning content auto-creates 3 tasks inline (findFirst+create, seeded once per day; **not** upsert — so deleted tasks stay deleted)
- Db dates displayed via `formatStoredDate()` in Asia/Shanghai, not browser local timezone
- Never commit `.env*` files (in `.gitignore`); `prisma/dev.db` also in `.gitignore`
- Confetti: 40 particles, 12 rainbow colors — triggers when last incomplete task is toggled complete
