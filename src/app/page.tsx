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

export default async function Home() {
  const stats = await getDailyStats()
  const content = await fetchTodaysContent()
  const tasks = await getTodaysTasks()

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <section>
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatDate()}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, Raye<span className="text-emerald-500">.</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          BSc Economics · HKUST-GZ Carbon Neutrality &amp; Green Finance
        </p>
      </section>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Tasks Today</p>
          <p className="mt-1 text-2xl font-bold">
            {stats.completedTasks}
            <span className="text-sm font-normal text-zinc-400">/{stats.totalTasks}</span>
          </p>
          <div className="mt-2">
            <ProgressBar value={stats.completionRate} />
          </div>
          <p className="mt-1 text-xs text-zinc-400">{stats.completionRate}% complete</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Streak</p>
          <div className="mt-1">
            <StreakBadge current={stats.streak.currentStreak} />
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Best: {stats.streak.longestStreak} days
          </p>
        </div>

        <Link
          href="/plans"
          className="rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 dark:border-zinc-800 dark:bg-black dark:hover:border-emerald-700"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Quick Action</p>
          <p className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            Manage today&apos;s tasks
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </p>
        </Link>
      </section>

      {/* Today's Tasks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
          <Link
            href="/plans"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
            Manage all
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
          <HomeTaskList tasks={tasks} />
        </div>
      </section>

      {/* Today's learning content */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today&apos;s Learning</h2>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
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
