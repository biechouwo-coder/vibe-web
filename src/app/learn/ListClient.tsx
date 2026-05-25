'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAcademicKeywords } from '@/lib/academic-keywords'
import { formatStoredDate } from '@/lib/date'
import type { DailyContentWithMeta } from '@/types'

interface ListClientProps {
  items: DailyContentWithMeta[]
}

const typeLabel: Record<string, string> = {
  conversation: 'Conversation',
  vocabulary: 'Vocabulary',
  passage: 'Article',
}

function getDateKey(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function ListClient({ items }: ListClientProps) {
  const groups = useMemo(() => {
    const map = new Map<string, DailyContentWithMeta[]>()
    for (const item of items) {
      const key = getDateKey(item.date)
      const group = map.get(key) ?? []
      group.push(item)
      map.set(key, group)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [items])

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-[var(--radius-panel)] border border-dashed border-stone-200 py-12 dark:border-stone-800">
        <p className="text-sm text-stone-400">No readings archived yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map(([dateKey, dayItems]) => {
        const dateDisplay = formatStoredDate(dateKey, 'en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })

        return (
          <div key={dateKey}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
              {dateDisplay}
            </p>
            <div className="space-y-1.5">
              {dayItems.map((item, i) => {
                const label = typeLabel[item.type] ?? item.type
                const keywords = getAcademicKeywords(item.title, item.tags)

                return (
                  <Link key={item.id} href={`/learn/${item.id}`} className="block">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.015 }}
                      className="group flex items-center gap-3 rounded-[var(--radius-panel)] border border-stone-200 bg-white px-4 py-3 shadow-sm shadow-stone-200/40 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-stone-800"
                    >
                      <span className="shrink-0 rounded border border-stone-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-stone-500 dark:border-stone-700 dark:text-stone-400">
                        {label}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-800 transition-colors group-hover:text-stone-950 dark:text-stone-200 dark:group-hover:text-white truncate">
                          {item.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-stone-400">
                          {keywords.length > 0 && <span>{keywords.join(' · ')}</span>}
                          {item.pushed && <span>Saved</span>}
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-stone-400 transition-colors group-hover:text-stone-600 dark:group-hover:text-stone-300">
                        Open
                      </span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
