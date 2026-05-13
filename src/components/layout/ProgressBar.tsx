'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--task-track)' }}>
      <motion.div
        className="h-full rounded-full" style={{ backgroundColor: 'var(--accent)' }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}
