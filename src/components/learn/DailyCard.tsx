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
  'inline-flex items-center gap-1.5 rounded-[var(--radius-small)] border px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-[var(--text-muted)] hover:bg-[var(--task-hover)]'
  + ' '
  + 'border-[var(--border-card)] bg-[var(--card-bg)] text-[var(--text-muted)]'

// ── Helpers ──

function getConversationTopicKeywords(title: string, tags: string | null): string[] {
  const t = title.toLowerCase()
  if (t.includes('research interest') || t.includes('introducing')) return ['Self Introduction']
  if (t.includes('question') || t.includes('classroom') || t.includes('class')) return ['Classroom Participation']
  if (t.includes('group project') || t.includes('dividing')) return ['Group Project']
  if (t.includes('presentation') || t.includes('qa') || t.includes('q&a')) return ['Presentation & Q&A']
  if (t.includes('office hour') || t.includes('feedback')) return ['Office Hour']
  if (t.includes('networking') || t.includes('chatting') || t.includes('conference')) return ['Networking']
  if (t.includes('register') || t.includes('campus') || t.includes('admin')) return ['Campus Life']
  if (t.includes('career') || t.includes('internship')) return ['Career']
  if (tags) {
    const ignore = new Set(['daily', 'conversation', 'speaking', 'vocabulary', 'passage', 'journal', 'core', 'cnf', 'academic'])
    const topic = tags.split(',').map(t => t.trim().toLowerCase()).find(t => !ignore.has(t))
    if (topic) return [topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')]
  }
  return []
}

function parseConversationContent(content: string): string {
  const m = content.match(/\*\*Scenario:\*\*\s*([\s\S]*?)(?=\*\*Dialogue:\*\*)/)
  if (m) return m[1].trim()
  const d = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*|$)/)
  const first = d ? d[1].split('\n').find(l => l.includes(':')) : ''
  return first ? first.replace(/^["']|["']$/g, '').replace(/^.*?:\s*/, '').trim() : ''
}

function getVocabularyPreview(content: string): string {
  const sections = content.split(/(?=## \d+\.)/)
  const terms: string[] = []
  for (const section of sections) {
    const match = section.match(/## \d+\.\s*([^(\/]+)/)
    if (match) { terms.push(match[1].trim()); if (terms.length >= 3) break }
  }
  const prefix = "Key terms from today's article"
  return terms.length > 0 ? prefix + ': ' + terms.join(' · ') : prefix
}

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
    if (trimmed.startsWith('**Excerpt:**')) { inExcerpt = true; continue }
    if (inExcerpt) {
      if (trimmed.startsWith('**Writing Focus:**') || trimmed.startsWith('**Key Vocabulary:**') || trimmed.startsWith('**Discussion Questions:**')) break
      if (!trimmed) continue
      previewLines.push(trimmed)
      if (previewLines.length >= 3) break
    }
  }
  return previewLines.join(' ')
}

// ── Conversation card ──

function ConversationCard({ title, content, tags, pushed, onPush, detailHref }: Omit<DailyCardProps, 'type'>) {
  const summary = parseConversationContent(content)
  const keywords = getConversationTopicKeywords(title, tags)

  return (
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--radius-panel)] border p-4 transition-colors hover:border-[var(--accent)]"
      style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)' }}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Speaking Practice</span>
      <h3 className="mt-1.5 font-medium text-[var(--text-main)]">{title}</h3>
      {summary && <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] line-clamp-2">{summary}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (<span key={kw} className="rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]" style={{ backgroundColor: 'var(--task-hover)' }}>{kw}</span>))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Practice</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-[var(--radius-small)] px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-[var(--task-track)] text-[var(--text-soft)]' : 'bg-[var(--accent)] text-white hover:brightness-110'}`}>
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
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--radius-panel)] border p-4 transition-colors hover:border-[var(--accent)]"
      style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)' }}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Vocabulary</span>
      <h3 className="mt-1.5 font-medium text-[var(--text-main)]">{title}</h3>
      {preview && <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{preview}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (<span key={kw} className="rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]" style={{ backgroundColor: 'var(--task-hover)' }}>{kw}</span>))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Review terms</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-[var(--radius-small)] px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-[var(--task-track)] text-[var(--text-soft)]' : 'bg-[var(--accent)] text-white hover:brightness-110'}`}>
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
    <motion.div initial={false} animate={{ opacity: 1, y: 0 }}
      className="rounded-[var(--radius-panel)] border p-4 transition-colors hover:border-[var(--accent)]"
      style={{ borderColor: 'var(--border-card)', backgroundColor: 'var(--card-bg)' }}>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Reading</span>
      <h3 className="mt-1.5 font-medium text-[var(--text-main)]">{title}</h3>
      {meta && <p className="mt-1 text-[10px] text-[var(--text-soft)]">{meta}</p>}
      {preview && <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] line-clamp-3">{preview}</p>}
      {keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {keywords.map((kw) => (<span key={kw} className="rounded px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]" style={{ backgroundColor: 'var(--task-hover)' }}>{kw}</span>))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        {detailHref && <a href={detailHref} className={NAV_LINK_CLASS}>Read excerpt</a>}
        {onPush && (
          <button onClick={onPush} disabled={pushed}
            className={`ml-auto rounded-[var(--radius-small)] px-2.5 py-1.5 text-xs font-medium transition-colors ${pushed ? 'bg-[var(--task-track)] text-[var(--text-soft)]' : 'bg-[var(--accent)] text-white hover:brightness-110'}`}>
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
