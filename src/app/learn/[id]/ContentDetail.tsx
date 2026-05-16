'use client'

import VocabCards from '@/components/learn/VocabCards'
import BackLink from '@/components/ui/BackLink'
import { getAcademicKeywords } from '@/lib/academic-keywords'
import { formatStoredDate } from '@/lib/date'
import type { DailyContentWithMeta } from '@/types'

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
  return text.split('\n').filter(Boolean).map((line) => {
    const speaker = speakers.find(s => line.trim().startsWith(`${s}:`))
    if (speaker) {
      return { speaker, message: line.trim().replace(`${speaker}:`, '').replace(/^["']|["']$/g, '').trim(), isYou: speaker === 'You' }
    }
    return null
  }).filter((item): item is NonNullable<typeof item> => item !== null)
}

function ConversationDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const topic = getConvSection(content.content, '**Topic:**', ['**Scenario:**', '**Dialogue:**'])
  const scenario = getConvSection(content.content, '**Scenario:**', ['**Dialogue:**', '**Useful Expressions:**'])
  const dialogueText = getConvSection(content.content, '**Dialogue:**', ['**Useful Expressions:**', '**Tone Note:**', '**Practice Prompt:**', '**Translation:**'])
  const usefulExprText = getConvSection(content.content, '**Useful Expressions:**', ['**Tone Note:**', '**Practice Prompt:**', '**Translation:**'])
  const toneNote = getConvSection(content.content, '**Tone Note:**', ['**Practice Prompt:**', '**Translation:**'])
  const practicePrompt = getConvSection(content.content, '**Practice Prompt:**', ['**Translation:**'])
  const translation = getConvSection(content.content, '**Translation:**', [])

  const dialogueLines = dialogueText ? parseDialogueLines(dialogueText) : []
  const usefulExpressions = usefulExprText ? parseUsefulExpressions(usefulExprText) : []

  const isNewFormat = !!topic
  let legacyDialog: { speaker: string; message: string; isYou: boolean }[] = []
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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Speaking Practice</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
        {topic && <p className="mt-1 text-xs text-stone-500">{topic}</p>}
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{formatTags(content.title, content.tags)}</p>
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
                <div className={`max-w-[85%] rounded-[var(--radius-control)] px-3.5 py-2.5 text-sm leading-relaxed ${dl.isYou ? 'bg-[var(--academic-navy)] text-white dark:bg-[var(--academic-navy)]' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
                  {!dl.isYou && <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">{dl.speaker}</span>}
                  <span>{dl.message}</span>
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
                {ue.note && <p className="mt-0.5 text-xs text-stone-500">{ue.note}</p>}
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

      {(!!translation || !!legacyTrans) && (
        <div className="rounded-[var(--radius-panel)] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-950/30">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Translation</p>
          <div className="space-y-2.5">
            {(dialogueLines.length > 0 ? dialogueLines : legacyDialog).map((dl, i) => {
              const transLines = (translation || legacyTrans).split('\n').filter(Boolean)
              const chinese = transLines[i]?.replace(/^[^：]*：\s*/, '')?.replace(/^["']|["']$/g, '')?.trim() || ''
              if (!chinese) return null
              return (
                <div key={i} className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] rounded-[var(--radius-control)] px-3.5 py-2 text-sm leading-relaxed" style={{ backgroundColor: dl.isYou ? 'var(--academic-navy)' : 'var(--task-surface)' }}>
                    {!dl.isYou && <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">{dl.speaker}</span>}
                    <p className={dl.isYou ? 'text-white' : 'text-stone-700 dark:text-stone-300'}>{dl.message}</p>
                    <p className="mt-1 text-xs opacity-70" style={{ color: dl.isYou ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>{chinese}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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

export default function ContentDetail({ content, pushAction }: ContentDetailProps) {
  const handlePush = async () => {
    const result = await pushAction(content.id)
    if (result.ok) window.location.reload()
    else alert(result.message)
  }

  if (content.type === 'conversation') return <ConversationDetail content={content} handlePush={handlePush} />
  if (content.type === 'vocabulary') return <VocabularyDetail content={content} handlePush={handlePush} />
  return <PassageDetail content={content} handlePush={handlePush} />
}
