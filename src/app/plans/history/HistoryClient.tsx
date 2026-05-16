'use client'

import { useState } from 'react'

interface DayData {
  date: string
  total: number
  completed: number
}

interface HistoryClientProps {
  dailyData: DayData[]
}

function getIntensity(rate: number): string {
  if (rate === 0) return 'bg-[var(--border)] dark:bg-[var(--border)]'
  if (rate < 25) return 'bg-[var(--academic-navy)]/15 dark:bg-[var(--academic-navy)]/25'
  if (rate < 50) return 'bg-[var(--academic-navy)]/35 dark:bg-[var(--academic-navy)]/40'
  if (rate < 75) return 'bg-[var(--academic-navy)]/60 dark:bg-[var(--academic-navy)]/60'
  return 'bg-[var(--academic-navy)] dark:bg-[var(--academic-navy)]'
}

function buildMonthGrid(year: number, month: number, dailyData: DayData[]) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // getDay() gives Sunday=0, we need Monday=0
  const startWeekday = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const dataMap = new Map(dailyData.map((d) => [d.date, d]))

  const cells: { day: number; rate: number; label: string }[] = []

  // Empty cells before first day
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: 0, rate: -1, label: '' })
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const found = dataMap.get(dateStr)
    const rate = found && found.total > 0 ? Math.round((found.completed / found.total) * 100) : 0
    cells.push({ day: d, rate, label: String(d) })
  }

  return cells
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function HistoryClient({ dailyData }: HistoryClientProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const cells = buildMonthGrid(year, month, dailyData)

  return (
    <div className="rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4">
      {/* Daily Activity title */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-3">Daily Activity</p>

      {/* Header with month nav */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded p-1 text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-[var(--text-main)]">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="rounded p-1 text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-[var(--text-soft)]">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          cell.day === 0 ? (
            <div key={`e-${i}`} className="h-5 w-full" />
          ) : (
            <div
              key={cell.day}
              className={`h-5 w-full rounded-[var(--radius-small)] ${getIntensity(cell.rate)}`}
              title={`${cell.label}: ${cell.rate}%`}
            />
          )
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--text-soft)]">
        <span>Less</span>
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-[var(--border)]" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-[var(--academic-navy)]/15" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-[var(--academic-navy)]/35" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-[var(--academic-navy)]/60" />
        <div className="h-3 w-3 rounded-[var(--radius-small)] bg-[var(--academic-navy)]" />
        <span>More</span>
      </div>
    </div>
  )
}
