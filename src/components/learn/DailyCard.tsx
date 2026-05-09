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
  vocabulary: { emoji: '📚', color: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800', label: 'Vocabulary' },
  passage: { emoji: '📖', color: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', label: 'Reading Passage' },
}

// Parse conversation content to extract only the dialogue section
function parseConversationDialogue(content: string) {
  const dialogueMatch = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
  return dialogueMatch ? dialogueMatch[1].trim() : ''
}

function ConversationCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const dialogue = parseConversationDialogue(content)

  // Extract first line of dialogue as summary
  const firstLine = dialogue.split('\n').find((l) => l.includes(':'))
  const summary = firstLine
    ? firstLine.replace(/^["']|["']$/g, '').replace(/^.*?:\s*/, '').replace(/^["']|["']$/g, '').trim()
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-blue-800 dark:from-blue-950/20 dark:to-black"
    >
      {/* Header with type badge */}
      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        💬 Daily Conversation
      </span>

      <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>

      {/* Summary */}
      {summary && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {summary}
        </p>
      )}

      {/* Tags */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {tags?.split(',').map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-100/50 px-2.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
            Read full
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
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

function DefaultCard({ title, type, content, tags, pushed, onPush, detailHref }: DailyCardProps) {
  const cfg = typeConfig[type as 'vocabulary' | 'passage']
  const preview = content.slice(0, 200).replace(/[#*\[\]]/g, '') + '...'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.color} p-5`}
    >
      {/* Type badge at top */}
      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
        type === 'vocabulary'
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      }`}>
        {cfg.emoji} {cfg.label}
      </span>

      <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>

      <div className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-line line-clamp-4">
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
            Read full
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
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

export default function DailyCard(props: DailyCardProps) {
  if (props.type === 'conversation') {
    return <ConversationCard {...props} />
  }
  return <DefaultCard {...props} />
}
