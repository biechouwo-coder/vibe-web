'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.85,
    rotateY: dir > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.85,
    rotateY: dir > 0 ? -15 : 15,
  }),
}

export default function VocabCards({ items }: VocabCardsProps) {
  const [[current, dir], setPage] = useState([0, 0])

  const goNext = () => {
    if (current < items.length - 1) setPage([current + 1, 1])
  }
  const goPrev = () => {
    if (current > 0) setPage([current - 1, -1])
  }

  const item = items[current]

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500"
            animate={{ width: `${((current + 1) / items.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium tabular-nums shrink-0">
          {current + 1} / {items.length}
        </span>
      </div>

      {/* Card area */}
      <div className="relative h-[360px] sm:h-[400px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 260, damping: 24 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.25 },
            }}
            className="absolute inset-0"
          >
            <div className="flex h-full flex-col rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 p-6 shadow-lg shadow-purple-200/20 dark:border-purple-800 dark:from-purple-950/30 dark:via-black dark:to-purple-950/20 dark:shadow-purple-950/30">
              {/* Card number badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {current + 1}
                </span>
              </div>

              {/* Term */}
              <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                {item.term}
              </h2>

              {/* Phonetic */}
              {item.phonetic && (
                <p className="mt-1 text-sm text-purple-500 dark:text-purple-400" style={{ fontFamily: 'var(--font-noto-sans)' }}>
                  [{item.phonetic}]
                </p>
              )}

              {/* Divider */}
              <div className="my-4 border-t border-purple-200/50 dark:border-purple-800/50" />

              {/* Definition */}
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.definition}
              </p>

              {/* Example */}
              {item.example && (
                <div className="mt-3 rounded-xl bg-purple-100/40 p-3 dark:bg-purple-950/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Example</p>
                  <p className="mt-1 text-sm italic text-zinc-600 dark:text-zinc-400">
                    &ldquo;{item.example}&rdquo;
                  </p>
                </div>
              )}

              {/* Chinese */}
              {item.chinese && (
                <p className="mt-auto pt-4 text-xs text-zinc-400 dark:text-zinc-500">
                  {item.chinese}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:border-purple-300 hover:text-purple-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:border-purple-600 dark:hover:text-purple-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage([i, i > current ? 1 : -1])}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-purple-500 dark:bg-purple-400'
                  : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={current === items.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all hover:border-purple-300 hover:text-purple-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:border-purple-600 dark:hover:text-purple-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
