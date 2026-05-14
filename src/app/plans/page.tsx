export const dynamic = 'force-dynamic'

import { getTodaysTasks, getStreak } from '@/actions/plans'
import AddTaskForm from '@/components/plans/AddTaskForm'
import TaskList from '@/components/plans/TaskList'
import ProgressBar from '@/components/layout/ProgressBar'
import StreakBadge from '@/components/ui/StreakBadge'
import { formatShanghaiDate } from '@/lib/date'

export default async function PlansPage() {
  const tasks = await getTodaysTasks()
  const streak = await getStreak()

  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const today = formatShanghaiDate('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Daily Plans</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{today}</p>
        </div>
        <StreakBadge current={streak.currentStreak} />
      </section>

      <section className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            {completedTasks}/{tasks.length} tasks completed
          </p>
          <p className="text-sm font-bold text-stone-500 dark:text-stone-400">{completionRate}%</p>
        </div>
        <ProgressBar value={completionRate} />
      </section>

      <section>
        <AddTaskForm />
      </section>

      <section>
        <TaskList tasks={tasks} />
      </section>

      <section className="text-center">
        <a
          href="/plans/history"
          className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-stone-200 bg-white px-3 py-1.5 shadow-sm shadow-stone-200/40 dark:shadow-stone-950/30 text-xs font-medium text-stone-600 transition-all hover:border-stone-300 hover:shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600"
        >
          View history & stats
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </section>
    </div>
  )
}
