# vibe.web — Project Rules

## Build & Run
```bash
npm run dev          # dev server (localhost:3000)
npm run build        # prisma generate + next build
npm start            # prisma db push + next start (via scripts/start.js)
npx prisma studio    # DB GUI
```

## Architecture
- **Framework:** Next.js 16 (App Router), Server Components by default
- **Database:** SQLite via Prisma (`prisma/dev.db`, not tracked in git), DATABASE_URL=`file:./dev.db`
- **Schema unique constraints:** `DailyContent(date+type)`, `Task(date+contentId)`
- **Migrations:** `prisma/migrations/20260507091401_init/` + `20260510091002_add_unique_constraints/`
- **Styling:** Tailwind CSS 4, class-based dark mode via `@custom-variant dark` + `html.dark`
- **Animations:** Framer Motion — `useReducedMotion()` used; cards use `initial={false}`
- **Deploy:** Railway (auto-deploy from GitHub `master`)

## UI — Academic Research Desk
- **Layout:** Desktop = left sidebar + rounded-[28px] workspace; Mobile = sticky top nav
- **Background:** `stone-200` / `stone-950` (outer), `stone-50` / `stone-950` (workspace)
- **Cards:** `rounded-2xl`, `border border-stone-200`, `shadow-sm shadow-stone-200/40`
- **Color tokens:** `--academic-navy: #013E75` (primary accent), `--academic-red: #A42423` (destructive)
- **No emerald/green** in UI classes; no emoji; no gradients
- **Unified palette:** `stone-*` throughout (no `zinc-*`)

## Color Usage
- Navy (`--academic-navy`): progress bars, primary buttons, completed checkboxes, navbar underline
- Deep red (`--academic-red`): delete/destructive actions only
- Stone: all labels, secondary text, borders, backgrounds
- Dark mode: navy → `#7fb3df`, red → `#e08a88`

## Key Conventions
- Interactive components → `'use client'`, mutations → Server Actions (`src/actions/`)
- Database queries in Server Actions or `src/lib/`, not in components
- All date/"today" logic uses Asia/Shanghai timezone (`src/lib/date.ts`)
- Page routes: `/` (Study Desk), `/learn` (Readings), `/plans` (Plans), `/settings`
- Components: `src/components/{layout,learn,plans,ui,theme}/`
- Content: `src/lib/content.ts` — uses `upsert` for atomic dedup
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
- Daily learning content auto-creates 3 tasks in Today's Tasks (upsert by contentId)
- Db dates displayed via `formatStoredDate()` in Asia/Shanghai, not browser local timezone
- Never commit `.env*` files (in `.gitignore`); `prisma/dev.db` also in `.gitignore`
