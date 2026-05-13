# vibe.web

Personal academic desk for HKUST-GZ CNGF students -- daily English learning and task planning.

Live: https://vibe-web-production-1f28.up.railway.app

## What it does

1. **English learning** -- daily rotating conversation practice, academic vocabulary, and journal excerpts on carbon neutrality and green finance.
2. **Task planner** -- daily to-do list with streak tracking, completion stats, and history view.
3. **Notion sync** -- one-click push of learning content to your Notion workspace.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Database | SQLite via Prisma ORM |
| Notion API | @notionhq/client |
| Deploy | Railway |

## Local development

```bash
# Install
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start dev server
npm run dev
```

Open http://localhost:3000

## Environment variables

Create `.env.local`:

```env
DATABASE_URL="file:./dev.db"

# Notion (optional)
NOTION_INTEGRATION_TOKEN=ntn_xxx
NOTION_ENGLISH_DB_ID=xxx
NOTION_PLANS_DB_ID=xxx
```

## Project structure

```
src/
  app/                  # App Router pages
    page.tsx            # Study Desk (home)
    learn/              # Learning content list + detail
    plans/              # Task planner + history
    settings/           # Notion config
  components/
    layout/             # Navbar, ProgressBar
    learn/              # DailyCard, VocabCards
    plans/              # TaskItem, TaskList, AddTaskForm
    ui/                 # BackLink, Confetti, Loading, StreakBadge
    theme/              # ThemeProvider, ThemeScript, ThemeSelector
  actions/              # Server Actions (learn.ts, plans.ts)
  lib/                  # Prisma client, Notion API, content library, date utils
prisma/
  schema.prisma         # Database schema (DailyContent, Task, Streak, NotionConfig)
  migrations/           # Migration history
```

## Notes

- Dates use Asia/Shanghai timezone throughout.
- The database (`prisma/dev.db`) is not tracked in git.
- Never commit `.env*` files.
- UI follows Academic Research Desk style: stone palette, navy accent, no gradients or green.
