# vibe.web — Project Rules

## Build & Run
```bash
npm run dev          # dev server (localhost:3000)
npm run build        # prisma generate + next build
npm start            # prisma db push + next start
npx prisma studio    # DB GUI
```

## Architecture
- **Framework:** Next.js 16 (App Router), Server Components by default
- **Database:** SQLite via Prisma (`prisma/dev.db`), DATABASE_URL=`file:./dev.db`
- **Styling:** Tailwind CSS 4, dark mode via `dark:` prefix
- **Animations:** Framer Motion
- **Deploy:** Railway (auto-deploy from GitHub `master`)

## Key Conventions
- Interactive components → `'use client'`, mutations → Server Actions (`src/actions/`)
- Database queries in Server Actions or `src/lib/`, not in components
- Page routes: `/` (Dashboard), `/learn`, `/plans`, `/settings`
- Components: `src/components/{layout,learn,plans,ui}/`
- Content library: `src/lib/content.ts` (static daily rotation)
- Notion API wrapper: `src/lib/notion.ts`
- VocabCards: `src/components/learn/VocabCards.tsx` (card carousel with spring animation)

## Content Library (`src/lib/content.ts`)
- **Conversations** (3): Daily scenarios for HKUST-GZ campus life
- **Vocabulary (8 sets)**: 3 general + 5 HKUST-GZ CNGF course-specific (Carbon Trading, Carbon Accounting, ESG Investing, Climate Policy, Energy Economics)
- **Passages** (2): Green finance & climate economics articles

## Important Rules
- All vocabulary entries include IPA phonetic symbols (`[ˈfəʊnetɪk]`)
- Vocabulary uses card-carousel display (VocabCards component) with left/right navigation
- Daily conversation cards show summary on Home, full knowledge card on detail page
- Daily learning content auto-creates 3 tasks in Today's Tasks
- All action buttons use consistent pill-button style with arrow icons
- Never commit `.env*` files (in `.gitignore`)
