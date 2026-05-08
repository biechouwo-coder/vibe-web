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

// Parse conversation content into sections
function parseConversation(content: string) {
  const parts = content.split(/\*\*Dialogue:\*\*|\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*/).filter(Boolean)

  let dialogue = ''
  let vocabulary = ''
  let translation = ''

  // Determine which section is which based on content markers
  const rawSections = content.match(/\*\*(Dialogue|Key Vocabulary|Translation):\*\*/g) || []
  const sectionTexts = content.split(/\*\*(Dialogue|Key Vocabulary|Translation):\*\*/).filter(Boolean)

  let i = 0
  const sections: Record<string, string> = {}
  while (i < rawSections.length && i + 1 < sectionTexts.length) {
    // The sectionTexts alternate between section names and content
    // Find the index in sectionTexts
    const nameIdx = sectionTexts.findIndex((s) => rawSections[i].includes(s))
    break
  }

  // Simpler approach: find each section by header
  const dialogueMatch = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
  const vocabMatch = content.match(/\*\*Key Vocabulary:\*\*([\s\S]*?)(?=\*\*Translation:\*\*|$)/)
  const transMatch = content.match(/\*\*Translation:\*\*([\s\S]*?)$/)

  return {
    dialogue: dialogueMatch ? dialogueMatch[1].trim() : '',
    vocabulary: vocabMatch ? vocabMatch[1].trim() : '',
    translation: transMatch ? transMatch[1].trim() : '',
  }
}

// Parse dialogue lines into speaker-message pairs
function parseDialogueLines(text: string) {
  const lines = text.split('\n').filter(Boolean)
  const speakers = ['Professor', 'You', 'Classmate', 'Team Member']

  return lines
    .map((line) => {
      const speaker = speakers.find((s) => line.startsWith(`${s}:`))
      if (speaker) {
        return {
          speaker,
          message: line.replace(`${speaker}:`, '').replace(/^["']|["']$/g, '').trim(),
          isYou: speaker === 'You',
        }
      }
      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

interface VocabItem { term: string; definition: string }

// Parse vocabulary lines
function parseVocabLines(text: string): VocabItem[] {
  return text
    .split('\n')
    .filter((l) => l.trim().startsWith('-'))
    .map((l) => {
      const match = l.match(/-\s*(.+?):\s*(.+)/)
      if (match) return { term: match[1].trim(), definition: match[2].trim() }
      return null
    })
    .filter((item): item is VocabItem => item !== null)
}

function ConversationCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const { dialogue, vocabulary, translation } = parseConversation(content)
  const dialogueLines = parseDialogueLines(dialogue)
  const vocabList = parseVocabLines(vocabulary)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-blue-800 dark:from-blue-950/20 dark:to-black"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-lg dark:bg-blue-900/50">💬</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Daily Conversation</p>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
          </div>
        </div>
      </div>

      {/* Dialogue bubbles */}
      {dialogueLines.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {dialogueLines.slice(0, 6).map((dl, i) => (
            <div
              key={i}
              className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  dl.isYou
                    ? 'rounded-tr-md bg-emerald-500 text-white'
                    : 'rounded-tl-md bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700'
                }`}
              >
                {!dl.isYou && (
                  <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                    {dl.speaker}
                  </span>
                )}
                <span>{dl.message.length > 120 ? dl.message.slice(0, 120) + '...' : dl.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vocabulary chips */}
      {vocabList.length > 0 && (
        <div className="mt-4 border-t border-blue-200/50 pt-3 dark:border-blue-800/50">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Key Vocabulary</p>
          <div className="flex flex-wrap gap-1.5">
            {vocabList.slice(0, 4).map((v, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-lg bg-white/70 px-2.5 py-1 text-xs shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800/70 dark:ring-zinc-700"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{v.term}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">{v.definition}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags & actions */}
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

function DefaultCard({ title, type, content, tags, pushed, onPush, detailHref }: DailyCardProps) {
  const cfg = typeConfig[type as 'vocabulary' | 'passage']
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

export default function DailyCard(props: DailyCardProps) {
  if (props.type === 'conversation') {
    return <ConversationCard {...props} />
  }
  return <DefaultCard {...props} />
}
