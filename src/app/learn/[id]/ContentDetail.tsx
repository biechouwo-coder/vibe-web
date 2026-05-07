'use client'

import { motion } from 'framer-motion'
import type { DailyContentWithMeta } from '@/types'

interface ContentDetailProps {
  content: DailyContentWithMeta
  pushAction: (id: string) => Promise<{ ok: boolean; message: string }>
}

const typeConfig: Record<string, { emoji: string; label: string; color: string }> = {
  conversation: { emoji: '💬', label: 'Daily Conversation', color: 'text-blue-600 dark:text-blue-400' },
  vocabulary: { emoji: '📚', label: 'Vocabulary', color: 'text-purple-600 dark:text-purple-400' },
  passage: { emoji: '📖', label: 'Reading Passage', color: 'text-amber-600 dark:text-amber-400' },
}

export default function ContentDetail({ content, pushAction }: ContentDetailProps) {
  const cfg = typeConfig[content.type] ?? { emoji: '📝', label: content.type, color: 'text-zinc-600' }

  const handlePush = async () => {
    const result = await pushAction(content.id)
    if (result.ok) {
      window.location.reload()
    } else {
      alert(result.message)
    }
  }

  // Render markdown-like content as styled HTML
  const renderContent = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="mt-6 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="mt-4 mb-1 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {line.slice(2, -2)}
          </p>
        )
      }
      if (line.startsWith('**')) {
        const match = line.match(/^\*\*(.+?)\*\*(.*)/)
        if (match) {
          return (
            <p key={i} className="mt-2 text-sm">
              <strong className="text-zinc-700 dark:text-zinc-300">{match[1]}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{match[2]}</span>
            </p>
          )
        }
      }
      if (line.trim() === '---') {
        return <hr key={i} className="my-4 border-zinc-200 dark:border-zinc-800" />
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />
      }
      return (
        <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {line}
        </p>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <a
        href="/learn"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600"
      >
        ← Back
      </a>

      <div className="mt-2">
        <span className={`text-sm font-medium uppercase tracking-wider ${cfg.color}`}>
          {cfg.emoji} {cfg.label}
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {new Date(content.date).toLocaleDateString()}
          {content.tags &&
            ` · ${content.tags.split(',').map((t) => t.trim()).join(' · ')}`}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        {renderContent(content.content)}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handlePush}
          disabled={content.pushed}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
            content.pushed
              ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900'
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {content.pushed ? '✅ Already pushed to Notion' : '📤 Push to Notion'}
        </button>
        {content.source && (
          <span className="text-xs text-zinc-400">Source: {content.source}</span>
        )}
      </div>
    </motion.div>
  )
}
