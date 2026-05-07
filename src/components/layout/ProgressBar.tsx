'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
    </div>
  )
}
