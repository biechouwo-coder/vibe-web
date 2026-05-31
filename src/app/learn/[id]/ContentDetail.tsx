'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import VocabCards from '@/components/learn/VocabCards'
import BackLink from '@/components/ui/BackLink'
import { getAcademicKeywords } from '@/lib/academic-keywords'
import { formatStoredDate } from '@/lib/date'
import type { DailyContentWithMeta } from '@/types'

interface SceneStyle { emoji: string; bg: string; label: string }
const SCENE_STYLES: Record<string, SceneStyle> = {
  classroom:       { emoji: '📖', bg: '#eef0fc', label: 'Classroom' },
  gym:             { emoji: '💪', bg: '#eef7ee', label: 'Gym' },
  cafeteria:       { emoji: '🍽️', bg: '#fef5e6', label: 'Cafeteria' },
  dormitory:       { emoji: '🛏️', bg: '#f5edfc', label: 'Dormitory' },
  'class-activity':{ emoji: '🌿', bg: '#e8f7f0', label: 'Class Activity' },
  'company-visit': { emoji: '🏭', bg: '#eef2f6', label: 'Company Visit' },
  entertainment:   { emoji: '🎤', bg: '#fce8f0', label: 'Entertainment' },
}

function getSceneStyle(tags: string | null, topic: string | null): SceneStyle {
  if (tags) {
    const p = tags.split(',').map(t => t.trim())
    for (const key of Object.keys(SCENE_STYLES)) {
      if (p.includes(key)) return SCENE_STYLES[key]
    }
  }
  return { emoji: '💬', bg: '#f0f0f4', label: topic || 'Speaking' }
}

interface ContentDetailProps {
  content: DailyContentWithMeta
  pushAction: (id: string) => Promise<{ ok: boolean; message: string }>
}

function formatTags(title: string, tags: string | null): string {
  const keywords = getAcademicKeywords(title, tags)
  return keywords.length > 0 ? ' · ' + keywords.join(' · ') : ''
}

// ── Conversation ──

function extractConvSection(content: string, marker: string, endMarkers: string[]): string[] {
  const lines = content.split('\n')
  let collect = false
  const result: string[] = []
  for (const line of lines) {
    const t = line.trim()
    if (!collect && t.startsWith(marker)) { collect = true; continue }
    if (collect) {
      if (endMarkers.some(m => t.startsWith(m))) break
      if (!t) continue
      result.push(line)
    }
  }
  return result
}

function getConvSection(content: string, marker: string, endMarkers: string[]): string {
  return extractConvSection(content, marker, endMarkers).join('\n').trim()
}

function parseUsefulExpressions(text: string): { expr: string; note: string }[] {
  return text.split('\n').filter(l => l.trim().startsWith('- ')).map(l => {
    const m = l.trim().match(/^-\s*(.+?)(?::\s*(.+))?$/)
    if (m) return { expr: m[1].trim(), note: (m[2] || '').trim() }
    return { expr: l.trim().replace(/^-\s*/, ''), note: '' }
  }).filter(Boolean)
}

function parseDialogueLines(text: string) {
  const speakers = ['Professor', 'You', 'Classmate', 'Team Member', 'Other Student', 'Staff', 'Advisor']
  const raw = text.split('\n').filter(Boolean)
  const result: { speaker: string; message: string; isYou: boolean; chinese: string }[] = []
  for (let i = 0; i < raw.length; i++) {
    const line = raw[i].trim()
    const speaker = speakers.find(s => line.startsWith(`${s}:`))
    if (speaker) {
      const message = line.replace(`${speaker}:`, '').replace(/^["']|["']$/g, '').trim()
      const isYou = speaker === 'You'
      // Look ahead for **zh:** marker on the next line
      let chinese = ''
      if (i + 1 < raw.length && raw[i + 1].trim().startsWith('**zh:**')) {
        chinese = raw[i + 1].trim().replace('**zh:**', '').trim()
      }
      result.push({ speaker, message, isYou, chinese })
    }
  }
  return result
}

function ConversationDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const topic = getConvSection(content.content, '**Topic:**', ['**Scenario:**', '**Dialogue:**'])
  const scenario = getConvSection(content.content, '**Scenario:**', ['**Dialogue:**', '**Useful Expressions:**'])
  const dialogueText = getConvSection(content.content, '**Dialogue:**', ['**Useful Expressions:**', '**Tone Note:**', '**Practice Prompt:**', '**Translation:**'])
  const usefulExprText = getConvSection(content.content, '**Useful Expressions:**', ['**Tone Note:**', '**Practice Prompt:**', '**Translation:**'])
  const toneNote = getConvSection(content.content, '**Tone Note:**', ['**Practice Prompt:**'])
  const practicePrompt = getConvSection(content.content, '**Practice Prompt:**', [])

  const dialogueLines = dialogueText ? parseDialogueLines(dialogueText) : []
  const usefulExpressions = usefulExprText ? parseUsefulExpressions(usefulExprText) : []

  const isNewFormat = !!topic
  let legacyDialog: { speaker: string; message: string; isYou: boolean; chinese: string }[] = []
  let legacyVocab = ''
  let legacyTrans = ''

  if (!isNewFormat) {
    const old = content.content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
    legacyDialog = old ? parseDialogueLines(old[1].trim()) : []
    const v = content.content.match(/\*\*Key Vocabulary:\*\*([\s\S]*?)(?=\*\*Translation:\*\*|$)/)
    legacyVocab = v ? v[1].trim() : ''
    const t = content.content.match(/\*\*Translation:\*\*([\s\S]*?)$/)
    legacyTrans = t ? t[1].trim() : ''
  }

  const scene = getSceneStyle(content.tags, topic)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Speaking Practice
          {scene.label !== 'Speaking' && (
            <span className="ml-2 rounded bg-[var(--task-hover)] px-1.5 py-0.5 text-[10px] font-normal tracking-normal text-[var(--muted)]">
              {scene.emoji} {scene.label}
            </span>
          )}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)]">{content.title}</h1>
        {topic && <p className="mt-1 text-xs text-[var(--text-soft)]">{topic}</p>}
        <p className="mt-0.5 text-xs text-[var(--text-soft)]">{formatStoredDate(content.date)}{formatTags(content.title, content.tags)}</p>
      </div>

      {scenario && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">Scenario</p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{scenario}</p>
        </div>
      )}

      {(dialogueLines.length > 0 || legacyDialog.length > 0) && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Dialogue</p>
          <div className="space-y-2.5">
            {(dialogueLines.length > 0 ? dialogueLines : legacyDialog).map((dl, i) => (
              <div key={i} className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[var(--radius-control)] px-3.5 py-2.5 text-sm leading-relaxed ${
                  dl.isYou
                    ? 'bg-[var(--academic-navy)] text-white dark:bg-[var(--academic-navy)]'
                    : dl.speaker === 'Professor'
                      ? 'border-l-2 border-[var(--academic-navy)] bg-stone-50 text-stone-700 dark:border-[var(--academic-navy)] dark:bg-stone-800/50 dark:text-stone-300'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}>
                  {!dl.isYou && (
                    <span className={`mb-0.5 block text-[10px] font-semibold uppercase tracking-wider ${
                      dl.speaker === 'Professor' ? 'text-[var(--academic-navy)]' : 'text-stone-500'
                    }`}>
                      {dl.speaker}
                    </span>
                  )}
                  <span>{dl.message}</span>
                  {dl.chinese && (
                    <p className="mt-1.5 text-xs leading-relaxed opacity-75" style={{ color: dl.isYou ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>{dl.chinese}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {usefulExpressions.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Useful Expressions</p>
          <div className="space-y-3">
            {usefulExpressions.map((ue, i) => (
              <div key={i} className="border-l-2 border-stone-200 pl-3 dark:border-stone-700">
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{ue.expr}</p>
                <UsefulExprNote note={ue.note || ''} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!isNewFormat && !!legacyVocab && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Key Vocabulary</p>
          <div className="space-y-2">
            {legacyVocab.split('\n').filter(l => l.trim()).map((line, i) => {
              const m = line.match(/-\s*([^/]+?)\s*(?:\/(.+?)\/)?\s*:\s*(.+)/)
              if (!m) return null
              return (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium text-stone-800 dark:text-stone-200">{m[1].trim()}</span>
                  {m[2] && <span className="text-xs text-stone-400" style={{ fontFamily: 'var(--font-noto-sans)' }}>[{m[2].trim()}]</span>}
                  <span className="text-xs text-stone-500">— {m[3].trim()}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {toneNote && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">Tone</p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{toneNote}</p>
        </div>
      )}

      {practicePrompt && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">Practice</p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{practicePrompt}</p>
        </div>
      )}

      {/* Translation is now inline after each dialogue line */}

      <div className="flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-[var(--radius-small)] px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-[var(--academic-navy)] text-white hover:brightness-110 dark:bg-[var(--academic-navy)] dark:hover:brightness-110'}`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
        {content.source && <span className="text-xs text-stone-400">Source: {content.source}</span>}
      </div>
    </div>
  )
}

// ── Vocabulary ──

function parseVocabSections(text: string) {
  const sections = text.split(/(?=## \d+\.)/).filter(Boolean)
  return sections.map((section) => {
    const termMatch = section.match(/## \d+\.\s*([^(\/]+)\s*(?:\/([^\/]+)\/)?\s*(?:\((.+)\))?/)
    const defMatch = section.match(/\*\*Definition:\*\*\s*(.+)/)
    const exampleMatch = section.match(/\*\*Example:\*\*\s*"(.+)"|\*\*Example:\*\*\s*(.+)/)
    const chineseMatch = section.match(/\*\*Chinese:\*\*\s*(.+)/)
    return {
      term: termMatch?.[1]?.trim() || '',
      phonetic: termMatch?.[2]?.trim() || '',
      definition: defMatch?.[1]?.trim() || '',
      example: (exampleMatch?.[1] || exampleMatch?.[2] || '').trim(),
      chinese: chineseMatch?.[1]?.trim() || '',
    }
  }).filter((v) => v.term)
}

function VocabularyDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const items = parseVocabSections(content.content)
  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/learn" />
      <div className="mt-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Vocabulary</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{formatTags(content.title, content.tags)}</p>
      </div>
      {items.length > 0 ? <VocabCards items={items} /> : <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">{fallbackBody(content.content)}</div>}
      <div className="mt-8 flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-[var(--radius-small)] px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-[var(--academic-navy)] text-white hover:brightness-110 dark:bg-[var(--academic-navy)] dark:hover:brightness-110'}`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
        {content.source && <span className="text-xs text-stone-400">Source: {content.source}</span>}
      </div>
    </div>
  )
}

function UsefulExprNote({ note }: { note: string }) {
  const parts = note.split(' || ')
  const usageNote = parts[0] || ''
  const trans = parts[1] || ''
  return (
    <>
      {usageNote && <p className="mt-0.5 text-xs text-stone-500">{usageNote}</p>}
      {trans && <p className="mt-0.5 text-xs text-stone-400">{trans}</p>}
    </>
  )
}

function fallbackBody(text: string) {
  return <div className="whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-400">{text}</div>
}

// ── Passage (Reading) ──

function renderMetaLine(line: string) {
  const match = line.match(/^\*\*(.+?):\*\*\s*(.*)$/)
  const key = match?.[1]?.trim() ?? ''
  const val = match?.[2]?.trim() ?? ''
  if (!key || !val) return null
  if (key.toLowerCase() === 'doi') {
    return <p key={line} className="text-sm text-stone-600 dark:text-stone-400"><span className="font-medium text-stone-500">DOI:</span> <span className="break-all text-stone-500">{val}</span></p>
  }
  return <p key={line} className="text-sm text-stone-600 dark:text-stone-400"><span className="font-medium text-stone-500">{key}:</span> {val}</p>
}

function extractSection(content: string, startMarker: string, endMarkers: string[]): string[] {
  const lines = content.split('\n')
  let collecting = false
  const result: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!collecting && trimmed.startsWith(startMarker)) { collecting = true; continue }
    if (collecting) {
      if (endMarkers.some(m => trimmed.startsWith(m))) break
      if (!trimmed) continue
      result.push(trimmed)
    }
  }
  return result
}

function PassageDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const metaKeys = ['Paper', 'Authors', 'Journal', 'Year', 'DOI']
  const lines = content.content.split('\n')
  const metaLines = lines.filter(l => metaKeys.some(k => l.trim().startsWith(`**${k}:**`)))
  const excerptBody = extractSection(content.content, '**Excerpt:**', ['**Writing Focus:**', '**Key Vocabulary:**', '**Discussion Questions:**'])
  const writingFocus = extractSection(content.content, '**Writing Focus:**', ['**Key Vocabulary:**', '**Discussion Questions:**'])
  const vocabLines = extractSection(content.content, '**Key Vocabulary:**', ['**Discussion Questions:**'])
  const discussionLines = extractSection(content.content, '**Discussion Questions:**', [])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Journal Article</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
      </div>
      {metaLines.length > 0 && <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">{metaLines.map(line => renderMetaLine(line))}</div>}
      {excerptBody.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Excerpt</p>
          <div className="space-y-3 font-serif text-base leading-relaxed text-stone-800 dark:text-stone-200">{excerptBody.map((para, i) => <p key={i}>{para}</p>)}</div>
        </div>
      )}
      {writingFocus.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">Writing Focus</p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{writingFocus.join(' ')}</p>
        </div>
      )}
      {vocabLines.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Key Vocabulary</p>
          <div className="space-y-2">
            {vocabLines.map((line, i) => {
              const m = line.match(/-\s*([^/]+?)\s*(?:\/(.+?)\/)?\s*:\s*(.+)/)
              if (!m) return <p key={i} className="text-sm text-stone-500">{line}</p>
              return (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-medium text-stone-800 dark:text-stone-200">{m[1].trim()}</span>
                  {m[2] && <span className="text-xs text-stone-400" style={{ fontFamily: 'var(--font-noto-sans)' }}>[{m[2].trim()}]</span>}
                  <span className="text-xs text-stone-500">— {m[3].trim()}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {discussionLines.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Discussion Questions</p>
          <div className="space-y-2">
            {discussionLines.map((line, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="shrink-0 font-medium text-stone-400">{i + 1}.</span>
                <span className="text-stone-600 dark:text-stone-400">{line.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-[var(--radius-small)] px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-[var(--academic-navy)] text-white hover:brightness-110 dark:bg-[var(--academic-navy)] dark:hover:brightness-110'}`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
      </div>
    </div>
  )
}

// ── Main ──

interface TocItem { type: string; title: string; id: string }

function TocSidebar({ items, currentId, onNavigate }: { items: TocItem[]; currentId: string; onNavigate: (href: string) => void }) {
  const labelMap: Record<string, string> = { conversation: 'Speaking', vocabulary: 'Vocabulary', passage: 'Reading' }

  return (
    <aside className="w-48 shrink-0 hidden lg:block pt-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)] px-3 mb-3">
        Contents
      </p>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.id === currentId
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(`/learn/${item.id}`)}
              className={`group relative w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--soft-panel-bg)] font-medium text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:bg-[var(--task-hover)] hover:text-[var(--foreground)]'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--accent)]" />
              )}
              <p className="text-xs">{labelMap[item.type] || item.type}</p>
              <p className="mt-0.5 truncate text-[10px] text-inherit opacity-60">{item.title}</p>
            </button>
          )
        })}
      </nav>
      <div className="mx-3 mt-4 h-px" style={{ backgroundColor: 'var(--border)' }} />
      <Link
        href="/learn"
        className="mx-3 mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.05em] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to all
      </Link>
    </aside>
  )
}

export default function ContentDetail({ content, pushAction, tocItems }: ContentDetailProps & { tocItems: TocItem[] }) {
  const router = useRouter()
  const [flipping, setFlipping] = useState(false)

  // Keep flip visible briefly after navigation completes, then hide
  useEffect(() => {
    const timer = setTimeout(() => setFlipping(false), 100)
    return () => clearTimeout(timer)
  }, [content.id])

  const handlePush = async () => {
    const result = await pushAction(content.id)
    if (result.ok) window.location.reload()
    else alert(result.message)
  }

  const handleTocNavigate = (href: string) => {
    if (href === `/learn/${content.id}`) return
    setFlipping(true)
    router.push(href)
  }

  const renderDetail = () => {
    if (content.type === 'conversation') return <ConversationDetail content={content} handlePush={handlePush} />
    if (content.type === 'vocabulary') return <VocabularyDetail content={content} handlePush={handlePush} />
    return <PassageDetail content={content} handlePush={handlePush} />
  }

  return (
    <div className="flex gap-8 relative">
      <TocSidebar items={tocItems} currentId={content.id} onNavigate={handleTocNavigate} />

      <div className="flex-1 min-w-0 relative">
        {/* Page-flip overlay */}
        {flipping && (
          <div className="absolute inset-0 z-40" style={{ perspective: '800px', backgroundColor: 'var(--surface)' }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-y-0 right-0"
                style={{
                  width: `${85 - i * 3}%`,
                  backgroundColor: 'var(--surface, #ffffff)',
                  transformOrigin: '0 50%',
                  zIndex: 10 - i,
                  boxShadow: '-1px 0 3px rgba(26,24,23,0.07)',
                  borderRight: '1px solid var(--border, #e8e4dd)',
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{ duration: 0.22, delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
              />
            ))}
          </div>
        )}

        {renderDetail()}
      </div>
    </div>
  )
}
