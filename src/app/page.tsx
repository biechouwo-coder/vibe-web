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
  'inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200'

export default async function Home() {
  const stats = await getDailyStats()
  const content = await fetchTodaysContent()
  const tasks = await getTodaysTasks()

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{formatDate()}</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Study Desk</h1>
        <p className="mt-1 text-sm text-stone-500">BSc Economics · HKUST-GZ Carbon Neutrality &amp; Green Finance</p>
      </section>

      {/* Today's focus */}
      <section className="border-l-2 border-stone-300 pl-3 dark:border-stone-700">
        <p className="text-xs font-medium uppercase tracking-widest text-stone-400">Today&rsquo;s Focus</p>
        <p className="mt-0.5 text-sm text-stone-700 dark:text-stone-300">{content.passage.title}</p>
      </section>

      {/* Stats summary */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Tasks Today</p>
          <p className="mt-0.5 font-semibold text-stone-800 dark:text-stone-200">
            {stats.completedTasks}<span className="text-sm font-normal text-stone-400">/{stats.totalTasks}</span>
          </p>
          <div className="mt-1.5"><ProgressBar value={stats.completionRate} /></div>
        </div>
        <div className="flex-1 rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Streak</p>
          <p className="mt-0.5 font-semibold text-stone-800 dark:text-stone-200">
            <StreakBadge current={stats.streak.currentStreak} />
          </p>
        </div>
        <Link href="/plans" className="flex flex-1 items-center justify-center rounded-lg border border-stone-200 bg-white p-3 transition-colors hover:border-stone-300 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700 dark:hover:bg-stone-800">
          <span className="text-xs font-medium text-stone-600 dark:text-stone-400">Open planner</span>
        </Link>
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
        <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <HomeTaskList tasks={tasks} />
        </div>
      </section>

      {/* Today's Readings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold">Today&apos;s Readings</h2>
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
