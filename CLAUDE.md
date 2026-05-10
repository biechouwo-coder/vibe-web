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
- **Styling:** Tailwind CSS 4, dark mode via `dark:` prefix
- **Animations:** Framer Motion — all cards/task rows use `initial={false}` to avoid blank flash
- **Deploy:** Railway (auto-deploy from GitHub `master`)

## Key Conventions
- Interactive components → `'use client'`, mutations → Server Actions (`src/actions/`)
- Database queries in Server Actions or `src/lib/`, not in components
- All date/"today" logic uses Asia/Shanghai timezone (`src/lib/date.ts`)
- Page routes: `/` (Dashboard), `/learn`, `/plans`, `/settings`
- Components: `src/components/{layout,learn,plans,ui}/`
- Content library: `src/lib/content.ts` — uses `upsert` for atomic dedup
- Notion API wrapper: `src/lib/notion.ts`; config endpoint returns `hasToken: boolean`, never raw token
- VocabCards: `src/components/learn/VocabCards.tsx` (card carousel with spring animation)

## Content Library (`src/lib/content.ts`)
- **Conversations** (3): Daily scenarios for HKUST-GZ campus life
- **Vocabulary (8 sets)**: 3 general + 5 HKUST-GZ CNGF course-specific (Carbon Trading, Carbon Accounting, ESG Investing, Climate Policy, Energy Economics)
- **Passages** (2): Green finance & climate economics articles

## Important Rules
- All vocabulary entries include IPA phonetic symbols (`[ˈfəʊnetɪk]`)
- Vocabulary uses card-carousel display (VocabCards component) with left/right navigation
- Daily conversation cards show summary on Home, full knowledge card on detail page
- Daily learning content auto-creates 3 tasks in Today's Tasks (upsert by contentId)
- All action buttons use consistent pill-button style with arrow icons
- Db dates displayed via `formatStoredDate()` in Asia/Shanghai, not browser local timezone
- Never commit `.env*` files (in `.gitignore`); `prisma/dev.db` also in `.gitignore`
