'use client'

import { motion } from 'framer-motion'
import { getAcademicKeywords } from '@/lib/academic-keywords'

interface DailyCardProps {
  title: string
  type: 'conversation' | 'vocabulary' | 'passage'
  content: string
  tags: string | null
  pushed: boolean
  onPush?: () => void
  detailHref?: string
}

const NAV_LINK_CLASS =
  'inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200'

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
  const prefix = "Key terms from today’s article"
  return terms.length > 0 ? prefix + ': ' + terms.join(' · ') : prefix
}

// ── Passage preview ──

function getMetaValue(content: string, key: string): string | null {
  const prefix = `**${key}:**`
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length).trim()
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

function getPassagePreview(content: string): string {
  const lines = content.split('\n')
  let inExcerpt = false
  const previewLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Start collecting after **Excerpt:**
    if (trimmed.startsWith('**Excerpt:**')) {
      inExcerpt = true
      continue
    }

    // Stop at known section breaks
    if (inExcerpt) {
      if (trimmed.startsWith('**Writing Focus:**') ||
          trimmed.startsWith('**Key Vocabulary:**') ||
          trimmed.startsWith('**Discussion Questions:**')) break
      if (!trimmed) continue
      previewLines.push(trimmed)
      if (previewLines.length >= 3) break
    }
  }

  return previewLines.join(' ')
}

// ── Conversation card ──

function parseConversationDialogue(content: string) {
  const match = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
  return match ? match[1].trim() : ''
}

function ConversationCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const dialogue = parseConversationDialogue(content)
  const firstLine = dialogue.split('\n').find((l) => l.includes(':'))
  const summary = firstLine
    ? firstLine.replace(/^["']|["']$/g, '').replace(/^.*?:\s*/, '').replace(/^["']|["']$/g, '').trim()
    : ''
  const keywords = getAcademicKeywords(title, tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Conversation</span>
      <h3 className="mt-1.5 font-medium text-stone-800 dark:text-stone-200">{title}</h3>
      {summary && <p className="mt-2 text-xs leading-relaxed text-stone-500 line-clamp-2">{summary}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (
            <span key={kw} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">{kw}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Read note</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
            {pushed ? 'Pushed' : 'Save to Notion'}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Vocabulary card ──

function VocabularyCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const preview = getVocabularyPreview(content)
  const keywords = getAcademicKeywords(title, tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Vocabulary</span>
      <h3 className="mt-1.5 font-medium text-stone-800 dark:text-stone-200">{title}</h3>
      {preview && <p className="mt-2 text-xs leading-relaxed text-stone-500">{preview}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (
            <span key={kw} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">{kw}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Read note</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
            {pushed ? 'Pushed' : 'Save to Notion'}
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
  const keywords = getAcademicKeywords(title, tags)

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Reading</span>
      <h3 className="mt-1.5 font-medium text-stone-800 dark:text-stone-200">{title}</h3>
      {meta && <p className="mt-1 text-[10px] text-stone-400">{meta}</p>}
      {preview && <p className="mt-2 text-xs leading-relaxed text-stone-500 line-clamp-3">{preview}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (
            <span key={kw} className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">{kw}</span>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Read full</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
            {pushed ? 'Pushed' : 'Save to Notion'}
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
