'use client'

import { motion } from 'framer-motion'
import type { DailyContentWithMeta } from '@/types'

interface ListClientProps {
  items: DailyContentWithMeta[]
}

const typeConfig: Record<string, { emoji: string; color: string; badge: string }> = {
  conversation: { emoji: '💬', color: 'border-l-blue-400 hover:border-l-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  vocabulary: { emoji: '📚', color: 'border-l-purple-400 hover:border-l-purple-500', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  passage: { emoji: '📖', color: 'border-l-amber-400 hover:border-l-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
}

export default function ListClient({ items }: ListClientProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-12 dark:border-zinc-800">
        <span className="text-3xl">📭</span>
        <p className="text-sm text-zinc-400">No content yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const cfg = typeConfig[item.type] ?? { emoji: '📝', color: 'border-l-zinc-400', badge: 'bg-zinc-100 text-zinc-700' }
        return (
          <motion.a
            key={item.id}
            href={`/learn/${item.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className={`group flex items-center gap-4 rounded-xl border border-zinc-200 border-l-4 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-black ${cfg.color}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50 text-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
              {cfg.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cfg.badge}`}>
                  {item.type}
                </span>
                <span className="text-xs text-zinc-400">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                {item.pushed && (
                  <span className="text-xs text-emerald-500">✅ Notion</span>
                )}
              </div>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-zinc-300 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-500 dark:group-hover:bg-emerald-950/30">
              →
            </span>
          </motion.a>
        )
      })}
    </div>
  )
}
