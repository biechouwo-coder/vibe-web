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
- **Animations:** Framer Motion — all cards/task rows use `initial={false}` to avoid blank flash
- **Deploy:** Railway (auto-deploy from GitHub `master`)

## Key Conventions
- Interactive components → `'use client'`, mutations → Server Actions (`src/actions/`)
- Database queries in Server Actions or `src/lib/`, not in components
- All date/"today" logic uses Asia/Shanghai timezone (`src/lib/date.ts`)
- Page routes: `/` (Study Desk), `/learn` (Readings), `/plans` (Plans), `/settings`
- Components: `src/components/{layout,learn,plans,ui,theme}/`
- Content: `src/lib/content.ts` — uses `upsert` for atomic dedup
- Academic keywords: `src/lib/academic-keywords.ts` — shared by DailyCard and ContentDetail
- Notion API: `src/lib/notion.ts`; config returns `hasToken: boolean`, never raw token
- VocabCards: `src/components/learn/VocabCards.tsx` (academic glossary card carousel)

## Content Library (`src/lib/content.ts`)
- **Conversations** (3): Daily scenarios for HKUST-GZ campus life
- **Readings (6)**: Journal-based items from `readingContent` array — each includes paperTitle, authors, journal, year, doi, excerpt (academic paragraph), writingFocus, vocabulary (5 terms), discussionQuestions
- Vocabulary and passage for each day come from the **same** reading item via `getDailyReadingItem()`
- Formatters: `formatReadingContent()` → passage DB format, `formatVocabularyFromReading()` → vocabulary DB format

## Important Rules
- Vocabulary entries include IPA phonetic where available
- Vocabulary uses card-carousel display (VocabCards component) with left/right navigation
- Daily conversation cards show summary on Home, full knowledge card on detail page
- Daily learning content auto-creates 3 tasks in Today's Tasks (upsert by contentId)
- Card previews: passage shows Excerpt body (not metadata); vocabulary shows `Key terms from today's article: ...`
- Db dates displayed via `formatStoredDate()` in Asia/Shanghai, not browser local timezone
- Never commit `.env*` files (in `.gitignore`); `prisma/dev.db` also in `.gitignore`
