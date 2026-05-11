'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
      <motion.div
        className="h-full rounded-full bg-emerald-800 dark:bg-emerald-600"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}
