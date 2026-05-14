'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface VocabItem {
  term: string
  phonetic: string
  definition: string
  example: string
  chinese: string
}

interface VocabCardsProps {
  items: VocabItem[]
}

export default function VocabCards({ items }: VocabCardsProps) {
  const [[current, dir], setPage] = useState([0, 0])
  const reduced = useReducedMotion()
  const moveX = reduced ? 0 : 40

  const cardVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? moveX : -moveX }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -moveX : moveX }),
  }

  const goNext = () => {
    if (current < items.length - 1) setPage([current + 1, 1])
  }
  const goPrev = () => {
    if (current > 0) setPage([current - 1, -1])
  }

  const item = items[current]

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-medium text-stone-500 tabular-nums">
          Term {current + 1} of {items.length}
        </span>
        <div className="flex-1 h-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--academic-navy)] dark:bg-[var(--academic-navy)]"
            animate={{ width: `${((current + 1) / items.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ opacity: { duration: 0.2 }, x: { duration: 0.28 } }}
            className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
          >
            <h2 className="font-serif text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {item.term}
            </h2>
            {item.phonetic && (
              <p className="mt-1 text-xs text-stone-400" style={{ fontFamily: 'var(--font-noto-sans)' }}>
                [{item.phonetic}]
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {item.definition}
            </p>
            {item.example && (
              <div className="mt-3 border-l-2 border-stone-200 pl-3 dark:border-stone-700">
                <p className="text-xs font-medium text-stone-400">Usage</p>
                <p className="mt-0.5 text-sm italic text-stone-500 dark:text-stone-400">
                  &ldquo;{item.example}&rdquo;
                </p>
              </div>
            )}
            {item.chinese && (
              <p className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
                {item.chinese}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="inline-flex items-center gap-1 rounded-[var(--radius-small)] border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <span className="text-xs text-stone-400 tabular-nums">
          {current + 1} / {items.length}
        </span>

        <button
          onClick={goNext}
          disabled={current === items.length - 1}
          className="inline-flex items-center gap-1 rounded-[var(--radius-small)] border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          Next
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
