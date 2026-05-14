'use client'

import { motion } from 'framer-motion'

interface DayData {
  date: string
  total: number
  completed: number
}

interface HistoryClientProps {
  dailyData: DayData[]
}

function getIntensity(rate: number): string {
  if (rate === 0) return 'bg-stone-100 dark:bg-stone-900'
  if (rate < 25) return 'bg-blue-200 dark:bg-blue-950'
  if (rate < 50) return 'bg-blue-300 dark:bg-blue-900'
  if (rate < 75) return 'bg-blue-400 dark:bg-blue-700'
  return 'bg-blue-500 dark:bg-blue-500'
}

export default function HistoryClient({ dailyData }: HistoryClientProps) {
  // Build a heatmap grid - show last 12 weeks (84 days)
  const today = new Date()
  const cells: { date: string; rate: number; day: number; month: string }[] = []

  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const found = dailyData.find((dd) => dd.date === key)
    const rate = found && found.total > 0 ? Math.round((found.completed / found.total) * 100) : 0
    cells.push({
      date: key,
      rate,
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }

  // Group into weeks
  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Month labels
  const monthLabels: { index: number; label: string }[] = []
  cells.forEach((c, i) => {
    if (c.day <= 7 && !monthLabels.some((m) => m.label === c.month)) {
      monthLabels.push({ index: Math.floor(i / 7), label: c.month })
    }
  })

  return (
    <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pt-5">
          {monthLabels.map((m) => (
            <span
              key={m.label}
              className="text-xs text-stone-400"
              style={{ marginTop: m.index === 0 ? '0' : undefined }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell) => (
                <motion.div
                  key={cell.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: wi * 0.02 }}
                  className={`h-3 w-3 rounded-[var(--radius-small)] ${getIntensity(cell.rate)}`}
                  title={`${cell.date}: ${cell.rate}%`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-stone-400">
        <span>Less</span>
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-stone-100 dark:bg-stone-900" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-blue-200 dark:bg-blue-950" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-blue-300 dark:bg-blue-900" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-blue-400 dark:bg-blue-700" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-blue-500 dark:bg-blue-500" />
        <span>More</span>
      </div>
    </div>
  )
}
