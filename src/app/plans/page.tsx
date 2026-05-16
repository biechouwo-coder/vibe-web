export const dynamic = 'force-dynamic'

import { getTodaysTasks, getStreak, getTemplates } from '@/actions/plans'
import { getShanghaiDateSeed } from '@/lib/date'
import { getGreeting } from '@/lib/greetings'
import AddTaskForm from '@/components/plans/AddTaskForm'
import TaskList from '@/components/plans/TaskList'
import TaskPool from '@/components/plans/TaskPool'
import ProgressBar from '@/components/layout/ProgressBar'
import { formatShanghaiDate } from '@/lib/date'

export default async function PlansPage() {
  const tasks = await getTodaysTasks()
  let templates = await getTemplates()

  // Seed default templates on first ever load
  if (templates.length === 0) {
    const { prisma } = await import('@/lib/prisma')
    const defaults = [
      'Review today\'s English vocabulary',
      'Read today\'s academic passage',
      'Practice speaking dialogue',
      'Write a reflection on today\'s reading',
      'Study 5 new academic terms',
    ]
    await prisma.taskTemplate.createMany({
      data: defaults.map((title, i) => ({ title, sortOrder: i })),
    })
    templates = await getTemplates()
  }
  const streak = await getStreak()
  const seed = getShanghaiDateSeed()
  const greeting = getGreeting(seed * 13 + seed) // mix the seed for more variety

  const completedTasks = tasks.filter((t: { completed: boolean }) => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const today = formatShanghaiDate('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{today}</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {greeting}
        </h1>
      </section>

      {/* Progress */}
      <section className="rounded-[var(--radius-panel)] border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--task-surface)' }}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--muted)]">
            {completedTasks}/{tasks.length} tasks completed
          </p>
          <p className="text-sm font-bold text-[var(--foreground)]">{completionRate}%</p>
        </div>
        <ProgressBar value={completionRate} />
      </section>

      {/* Dual-column layout */}
      <div className="grid gap-6 sm:grid-cols-5">
        {/* Left: today's tasks */}
        <div className="sm:col-span-3">
          <div className="mb-3">
            <AddTaskForm />
          </div>
          <TaskList tasks={tasks} />
        </div>

        {/* Right: task pool */}
        <div className="sm:col-span-2">
          <div className="rounded-[var(--radius-panel)] border p-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <TaskPool templates={templates} />
          </div>
        </div>
      </div>
    </div>
  )
}
