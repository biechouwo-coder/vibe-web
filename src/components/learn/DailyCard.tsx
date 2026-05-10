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

// ── Tag helpers ──

const STRUCTURAL_TAGS = new Set(['daily', 'conversation', 'vocabulary', 'passage', 'journal'])

function getDisplayTags(tags: string | null): string[] {
  if (!tags) return []
  return tags.split(',').map((t) => t.trim()).filter((t) => !STRUCTURAL_TAGS.has(t))
}

// ── Vocabulary preview ──

function getVocabularyPreview(content: string): string {
  const sections = content.split(/(?=## \d+\.)/)
  const terms: string[] = []
  for (const section of sections) {
    const match = section.match(/## \d+\.\s*([^(\/]+)/)
    if (match) {
      terms.push(match[1].trim())
      if (terms.length >= 3) break
    }
  }
  return terms.length > 0 ? terms.join(' · ') : ''
}

// ── Passage preview ──

/** Extract the value after `**key:**` in content. */
function getMetaValue(content: string, key: string): string | null {
  const prefix = `**${key}:**`
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim()
    }
  }
  return null
}

function getPassageMeta(content: string): string | null {
  const journal = getMetaValue(content, 'Journal')
  const year = getMetaValue(content, 'Year')
  if (journal && year) return `${journal} · ${year}`
  if (journal) return journal
  return null
}

/** Check if a trimmed line is a metadata header (Paper/Authors/Journal/Year/DOI). */
function isMetaLine(trimmed: string): boolean {
  const lower = trimmed.toLowerCase()
  return (
    lower.startsWith('**paper:**') ||
    lower.startsWith('**authors:**') ||
    lower.startsWith('**journal:**') ||
    lower.startsWith('**year:**') ||
    lower.startsWith('**doi:**')
  )
}

function getPassagePreview(content: string): string {
  const lines = content.split('\n')
  const previewLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('**Key Vocabulary:**')) break
    if (!trimmed) continue
    if (isMetaLine(trimmed)) continue
    if (/^["\s]+$/.test(trimmed)) continue
    previewLines.push(trimmed)
    if (previewLines.length >= 3) break
  }

  return previewLines.join(' ')
}

// ── Conversation card ──

function parseConversationDialogue(content: string) {
  const dialogueMatch = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
  return dialogueMatch ? dialogueMatch[1].trim() : ''
}

function ConversationCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const dialogue = parseConversationDialogue(content)
  const firstLine = dialogue.split('\n').find((l) => l.includes(':'))
  const summary = firstLine
    ? firstLine.replace(/^["']|["']$/g, '').replace(/^.*?:\s*/, '').replace(/^["']|["']$/g, '').trim()
    : ''
  const displayTags = getDisplayTags(tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 dark:border-blue-800 dark:from-blue-950/20 dark:to-black"
    >
      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
        💬 Daily Conversation
      </span>
      <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
      {summary && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">{summary}</p>
      )}
      {displayTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <span key={tag} className="rounded-full bg-blue-100/50 px-2.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && (
          <a href={detailHref} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50">
            Read full
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors ${pushed ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800' : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}>
            {pushed ? '✅ Pushed to Notion' : '📤 Push to Notion'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Vocabulary card ──

function VocabularyCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const preview = getVocabularyPreview(content)
  const displayTags = getDisplayTags(tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5 dark:border-purple-800 dark:from-purple-950/20 dark:to-black"
    >
      <span className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
        📚 Vocabulary
      </span>
      <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
      {preview && (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{preview}</p>
      )}
      {displayTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-black/30 dark:text-zinc-400">{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && (
          <a href={detailHref} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50">
            Read full
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors ${pushed ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800' : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}>
            {pushed ? '✅ Pushed to Notion' : '📤 Push to Notion'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Passage card ──

function PassageCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const preview = getPassagePreview(content)
  const meta = getPassageMeta(content)
  const displayTags = getDisplayTags(tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-800 dark:from-amber-950/20 dark:to-black"
    >
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        📖 Reading Passage
      </span>
      <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
      {meta && <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">{meta}</p>}
      {preview && (
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">{preview}</p>
      )}
      {displayTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {displayTags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs text-zinc-500 dark:bg-black/30 dark:text-zinc-400">{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && (
          <a href={detailHref} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50">
            Read full
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition-colors ${pushed ? 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800' : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}>
            {pushed ? '✅ Pushed to Notion' : '📤 Push to Notion'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Router ──

export default function DailyCard(props: DailyCardProps) {
  if (props.type === 'conversation') return <ConversationCard {...props} />
  if (props.type === 'vocabulary') return <VocabularyCard {...props} />
  return <PassageCard {...props} />
}
