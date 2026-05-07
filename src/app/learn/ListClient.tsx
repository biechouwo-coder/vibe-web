'use client'

import { motion } from 'framer-motion'
import type { DailyContentWithMeta } from '@/types'

interface ListClientProps {
  items: DailyContentWithMeta[]
}

const typeEmoji: Record<string, string> = {
  conversation: '💬',
  vocabulary: '📚',
  passage: '📖',
}

export default function ListClient({ items }: ListClientProps) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-400">No content yet.</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.a
          key={item.id}
          href={`/learn/${item.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700"
        >
          <span className="text-lg">{typeEmoji[item.type] ?? '📝'}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{item.title}</p>
            <p className="text-xs text-zinc-400">
              {new Date(item.date).toLocaleDateString()} · {item.type}
              {item.pushed && ' · ✅ Pushed'}
            </p>
          </div>
          <span className="text-xs text-zinc-400">→</span>
        </motion.a>
      ))}
    </div>
  )
}
