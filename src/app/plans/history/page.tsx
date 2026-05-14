export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getStreak } from '@/actions/plans'
import StreakBadge from '@/components/ui/StreakBadge'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const streak = await getStreak()

  // Get last 90 days of task completion data
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  ninetyDaysAgo.setHours(0, 0, 0, 0)

  const tasks = await prisma.task.findMany({
    where: { date: { gte: ninetyDaysAgo } },
    orderBy: { date: 'desc' },
  })

  // Aggregate by date
  const dateMap = new Map<string, { total: number; completed: number }>()
  for (const task of tasks) {
    const key = task.date.toISOString().split('T')[0]
    const entry = dateMap.get(key) ?? { total: 0, completed: 0 }
    entry.total++
    if (task.completed) entry.completed++
    dateMap.set(key, entry)
  }

  const dailyData = Array.from(dateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const totalCompleted = tasks.filter((t) => t.completed).length
  const avgCompletion =
    dailyData.length > 0
      ? Math.round(dailyData.reduce((acc, d) => acc + (d.total > 0 ? (d.completed / d.total) * 100 : 0), 0) / dailyData.length)
      : 0

  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">History  Stats</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Your progress over time</p>
        </div>
        <StreakBadge current={streak.currentStreak} />
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Active Days</p>
          <p className="mt-1 text-2xl font-bold">{dailyData.length}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Tasks Done</p>
          <p className="mt-1 text-2xl font-bold">{totalCompleted}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Avg Completion</p>
          <p className="mt-1 text-2xl font-bold">{avgCompletion}%</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Best Streak</p>
          <p className="mt-1 text-2xl font-bold">{streak.longestStreak}d</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Daily Activity</h2>
        <HistoryClient dailyData={dailyData} />
      </section>
    </div>
  )
}
