'use client'

import { motion } from 'framer-motion'

interface StreakBadgeProps {
  current: number
}

const streakEmojis = [
  { min: 0, emoji: '🌱', label: 'Just started' },
  { min: 3, emoji: '🔥', label: 'On fire!' },
  { min: 7, emoji: '⭐', label: 'Star streak' },
  { min: 14, emoji: '👑', label: 'Champion' },
  { min: 30, emoji: '🏆', label: 'Legendary' },
]

export default function StreakBadge({ current }: StreakBadgeProps) {
  const badge = [...streakEmojis].reverse().find((b) => current >= b.min) ?? streakEmojis[0]

  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <span className="text-lg">{badge.emoji}</span>
      <span className="tabular-nums">{current}</span>
      <span className="text-amber-600 dark:text-amber-400">day{current !== 1 ? 's' : ''}</span>
    </motion.div>
  )
}
