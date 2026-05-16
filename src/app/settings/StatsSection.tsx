import { prisma } from '@/lib/prisma'
import { getStreak } from '@/actions/plans'
import HistoryClient from '@/app/plans/history/HistoryClient'

export default async function StatsSection() {
  const streak = await getStreak()

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  ninetyDaysAgo.setHours(0, 0, 0, 0)

  const tasks = await prisma.task.findMany({
    where: { date: { gte: ninetyDaysAgo } },
    orderBy: { date: 'desc' },
  })

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
    <>
      <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-4">History &amp; Stats</h2>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Active Days</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{dailyData.length}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Tasks Done</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalCompleted}</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Avg Completion</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{avgCompletion}%</p>
        </div>
        <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Best Streak</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{streak.longestStreak}d</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">Daily Activity</p>
        <HistoryClient dailyData={dailyData} />
      </div>
    </>
  )
}
