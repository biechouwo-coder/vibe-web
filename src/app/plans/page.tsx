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

  const completedTasks = tasks.filter((t: { completed: boolean }) => t.completed).length
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
          <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-stone-400">{today}</p>
        </div>
        <StreakBadge current={streak.currentStreak} />
      </section>

      <section className="rounded-[var(--radius-panel)] border p-5" style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--task-surface)' }}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--text-muted)] dark:text-stone-400">
            {completedTasks}/{tasks.length} tasks completed
          </p>
          <p className="text-sm font-bold text-[var(--text-main)] dark:text-stone-400">{completionRate}%</p>
        </div>
        <ProgressBar value={completionRate} />
      </section>

      <section>
        <AddTaskForm />
      </section>

      <section>
        <TaskList tasks={tasks} />
      </section>
    </div>
  )
}
