export const dynamic = 'force-dynamic'

import { getDailyStats, getTodaysTasks } from '@/actions/plans'
import { fetchTodaysContent } from '@/actions/learn'
import StreakBadge from '@/components/ui/StreakBadge'
import ProgressBar from '@/components/layout/ProgressBar'
import DailyCard from '@/components/learn/DailyCard'
import HomeTaskList from '@/components/plans/HomeTaskList'
import Link from 'next/link'
import { formatShanghaiDate } from '@/lib/date'

function formatDate(): string {
  return formatShanghaiDate('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const navBtnClass =
  'inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--text-muted)] hover:bg-[var(--task-hover)]'
  + ' '
  + 'border-[var(--border-card)] bg-[var(--card-bg)] text-[var(--text-muted)]'

export default async function Home() {
  // Order matters: content first (ensures today's learning tasks exist),
  // then stats (counts the just-created tasks), then tasks (fetches them).
  const content = await fetchTodaysContent()
  const stats = await getDailyStats()
  const tasks = await getTodaysTasks()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-soft)]">{formatDate()}</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Study Desk</h1>
      </section>

      {/* First row: focus card + summary (desktop 2-col) */}
      <div className="grid gap-4 sm:grid-cols-5">
        {/* Left: Today's Focus */}
        <div className="sm:col-span-3 rounded-[var(--radius-panel)] border p-5" style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)' }}>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-soft)]">Today&rsquo;s Focus</p>
          <h2 className="mt-2 font-serif text-lg font-semibold leading-snug text-[var(--text-main)]">
            {content.passage.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            Journal excerpt for academic writing practice. Read the passage, study the vocabulary, and practise the conversations.
          </p>
          <div className="mt-4">
            <Link
              href={`/learn/${content.passage.id}`}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border px-3 py-1.5 text-xs font-medium transition-colors dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200" style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' }}
            >
              Open reading
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: Tasks summary */}
        <div className="sm:col-span-2 rounded-[var(--radius-panel)] border p-5" style={{ backgroundColor: 'var(--task-dark)', borderColor: 'var(--task-dark-border)', color: 'var(--task-dark-text)' }}>
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-50">Tasks</p>
            <p className="font-semibold tabular-nums">
              {stats.completedTasks}<span className="text-sm font-normal opacity-50">/{stats.totalTasks}</span>
            </p>
          </div>
          <div className="mt-2">
            <ProgressBar value={stats.completionRate} />
          </div>

          <div className="mt-4 flex items-center gap-3 border-t pt-3" style={{ borderColor: 'var(--task-dark-border)' }}>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-50">Streak</p>
            <StreakBadge current={stats.streak.currentStreak} />
          </div>

          <Link
            href="/plans"
            className="mt-4 flex items-center justify-center rounded-[var(--radius-control)] border py-2 text-xs font-medium transition-colors hover:brightness-125"
            style={{ borderColor: 'var(--task-bg)', color: 'var(--text-main)', backgroundColor: 'var(--main-bg)' }}
          >
            Open task planner
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Today&apos;s Tasks</h2>
          <Link href="/plans" className={navBtnClass}>
            Manage all
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="rounded-[var(--radius-panel)] border p-4" style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--task-surface)' }}>
          <HomeTaskList tasks={tasks} />
        </div>
      </section>

      {/* Learning Queue */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Learning Queue</h2>
          <Link href="/learn" className={navBtnClass}>
            View all
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DailyCard
            title={content.conversation.title}
            type="conversation"
            content={content.conversation.content}
            tags={content.conversation.tags}
            pushed={content.conversation.pushed}
            detailHref={`/learn/${content.conversation.id}`}
          />
          <DailyCard
            title={content.vocabulary.title}
            type="vocabulary"
            content={content.vocabulary.content}
            tags={content.vocabulary.tags}
            pushed={content.vocabulary.pushed}
            detailHref={`/learn/${content.vocabulary.id}`}
          />
          <DailyCard
            title={content.passage.title}
            type="passage"
            content={content.passage.content}
            tags={content.passage.tags}
            pushed={content.passage.pushed}
            detailHref={`/learn/${content.passage.id}`}
          />
        </div>
      </section>
    </div>
  )
}
