export const dynamic = 'force-dynamic'

import { getTodaysTasks, getStreak } from '@/actions/plans'
import AddTaskForm from '@/components/plans/AddTaskForm'
import TaskList from '@/components/plans/TaskList'
import ProgressBar from '@/components/layout/ProgressBar'
import StreakBadge from '@/components/ui/StreakBadge'

export default async function PlansPage() {
  const tasks = await getTodaysTasks()
  const streak = await getStreak()

  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daily Plans</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{today}</p>
        </div>
        <StreakBadge current={streak.currentStreak} />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {completedTasks}/{tasks.length} tasks completed
          </p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</p>
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
          className="text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          View history & stats →
        </a>
      </section>
    </div>
  )
}
