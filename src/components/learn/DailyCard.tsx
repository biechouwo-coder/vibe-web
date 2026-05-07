'use client'

import { motion } from 'framer-motion'

interface DailyCardProps {
  title: string
  type: 'conversation' | 'vocabulary' | 'passage'
  content: string
  tags: string | null
  pushed: boolean
  onPush?: () => void
  detailHref?: string
}

const typeConfig = {
  conversation: { emoji: '💬', color: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', label: 'Daily Conversation' },
  vocabulary: { emoji: '📚', color: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800', label: 'Vocabulary' },
  passage: { emoji: '📖', color: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', label: 'Reading Passage' },
}

export default function DailyCard({ title, type, content, tags, pushed, onPush, detailHref }: DailyCardProps) {
  const cfg = typeConfig[type]
  const preview = content.slice(0, 200).replace(/[#*\[\]]/g, '') + '...'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.color} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{cfg.label}</p>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line line-clamp-4">
        {preview}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {tags?.split(',').map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-black/30 dark:text-zinc-400"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {detailHref && (
          <a
            href={detailHref}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            Read full →
          </a>
        )}
        {onPush && (
          <button
            onClick={onPush}
            disabled={pushed}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              pushed
                ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'
                : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {pushed ? '✅ Pushed to Notion' : '📤 Push to Notion'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
