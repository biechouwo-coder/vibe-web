'use client'

import { motion } from 'framer-motion'

interface StreakBadgeProps {
  current: number
}

export default function StreakBadge({ current }: StreakBadgeProps) {
  return (
    <motion.div
      className="inline-flex items-baseline gap-1.5 rounded-[var(--radius-small)] border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-stone-400">Streak</span>
      <span className="font-semibold tabular-nums text-stone-900 dark:text-stone-100">{current}</span>
      <span className="text-xs">day{current !== 1 ? 's' : ''}</span>
    </motion.div>
  )
}
