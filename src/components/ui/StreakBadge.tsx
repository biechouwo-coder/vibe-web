'use client'

import { motion } from 'framer-motion'

interface StreakBadgeProps {
  current: number
}

export default function StreakBadge({ current }: StreakBadgeProps) {
  return (
    <motion.div
      className="inline-flex items-baseline gap-1.5 rounded-[var(--radius-small)] border px-3 py-1.5 text-sm"
      style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-soft)' }}>Streak</span>
      <span className="font-semibold tabular-nums" style={{ color: 'var(--text-main)' }}>{current}</span>
      <span className="text-xs">day{current !== 1 ? 's' : ''}</span>
    </motion.div>
  )
}
