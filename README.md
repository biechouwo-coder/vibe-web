# vibe.web

Personal academic desk for HKUST-GZ CNGF students -- daily English learning and task planning.

Live: https://vibe-web-production-1f28.up.railway.app

## What it does

1. **English learning** -- daily rotating conversation practice, academic vocabulary, and journal excerpts on carbon neutrality and green finance.
2. **Task planner** -- daily to-do list with streak tracking, completion stats, and history view.
3. **Notion sync** -- manually push learning content to Notion (Settings page to configure); task auto-sync is basic (push on completion).

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

Requires Node.js >= 20.9.0.

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev        # http://localhost:3000
```

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
    theme/              # ThemeProvider, ThemeSelector (theme-script replaced by next/script in layout)
  actions/              # Server Actions (learn.ts, plans.ts)
  lib/                  # Prisma client, Notion API, content library, date utils
prisma/
  schema.prisma         # DailyContent, Task, Streak, NotionConfig
  migrations/           # Migration history
```

## Notes

- Dates use Asia/Shanghai timezone throughout.
- The database (`prisma/dev.db`) is not tracked in git.
- Never commit `.env*` files.
- Notion token is stored as plain text in SQLite — suitable for personal/single-user deployment.
- Palette: `#FAF9F4` / `#FFFFFF` / `#C88E4E` / `#F3E6EB`. No shadows, no gradients, no green.
