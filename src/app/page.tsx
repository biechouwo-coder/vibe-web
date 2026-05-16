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
  'inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200'

export default async function Home() {
  // Ensure today's content and learning tasks exist before counting stats.
  const content = await fetchTodaysContent()
  const stats = await getDailyStats()
  const tasks = await getTodaysTasks()

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Study Desk</p>
        <h1 className="mt-1 font-serif text-[28px] font-semibold leading-tight tracking-[-0.01em] text-[var(--foreground)]">{formatDate()}</h1>
      </section>

      {/* First row: focus card + summary (desktop 2-col) */}
      <div className="grid gap-4 sm:grid-cols-5">
        {/* Left — Today's Focus with navy left accent */}
        <div className="sm:col-span-3 rounded-[var(--radius-panel)] border border-[var(--border)] border-l-[4px] border-l-[var(--academic-navy)] bg-[var(--surface)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--academic-navy)]">Today&rsquo;s Focus</p>
          <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-[var(--foreground)]">
            {content.passage.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            Journal excerpt for academic writing practice. Read the passage, study the vocabulary, and practise the conversations.
          </p>
          <div className="mt-4">
            <Link
              href={`/learn/${content.passage.id}`}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] text-xs font-semibold uppercase tracking-[0.05em] text-[var(--academic-navy)] transition-all hover:gap-2"
            >
              Open reading
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right — Summary card (light, tonal layered) */}
        <div className="sm:col-span-2 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--background)] p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Progress</p>
            <p className="font-semibold tabular-nums text-[var(--foreground)]">
              {stats.completedTasks}<span className="text-sm font-normal text-[var(--muted)]">/{stats.totalTasks}</span>
            </p>
          </div>
          <div className="mt-3">
            <ProgressBar value={stats.completionRate} />
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Streak</p>
            <StreakBadge current={stats.streak.currentStreak} />
          </div>

          <Link
            href="/plans"
            className="mt-4 flex items-center justify-center rounded-[var(--radius-control)] border border-[var(--border)] bg-[#ffffff] py-2 text-xs font-semibold uppercase tracking-[0.05em] text-[var(--muted)] transition-colors hover:border-[var(--academic-navy)] hover:text-[var(--academic-navy)]"
          >
            Open task planner
          </Link>
        </div>
      </div>

      {/* Today's Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-[var(--foreground)]">Today&apos;s Tasks</h2>
          <Link href="/plans" className={navBtnClass}>
            Manage all
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[#faf9f6] p-5">
          <HomeTaskList tasks={tasks} />
        </div>
      </section>

      {/* Learning Queue */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-[var(--foreground)]">Learning Queue</h2>
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
