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

function parseConversation(content: string) {
  const dialogueMatch = content.match(/\*\*Dialogue:\*\*([\s\S]*?)(?=\*\*Key Vocabulary:\*\*|\*\*Translation:\*\*|$)/)
  const vocabMatch = content.match(/\*\*Key Vocabulary:\*\*([\s\S]*?)(?=\*\*Translation:\*\*|$)/)
  const transMatch = content.match(/\*\*Translation:\*\*([\s\S]*?)$/)
  return {
    dialogue: dialogueMatch ? dialogueMatch[1].trim() : '',
    vocabulary: vocabMatch ? vocabMatch[1].trim() : '',
    translation: transMatch ? transMatch[1].trim() : '',
  }
}

function parseDialogueLines(text: string) {
  const lines = text.split('\n').filter(Boolean)
  const speakers = ['Professor', 'You', 'Classmate', 'Team Member']
  return lines
    .map((line) => {
      const speaker = speakers.find((s) => line.startsWith(`${s}:`))
      if (speaker) {
        return { speaker, message: line.replace(`${speaker}:`, '').replace(/^["']|["']$/g, '').trim(), isYou: speaker === 'You' }
      }
      return null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function ConversationDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const { dialogue, vocabulary, translation } = parseConversation(content.content)
  const dialogueLines = parseDialogueLines(dialogue)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Conversation</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{formatTags(content.title, content.tags)}</p>
      </div>
      <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Dialogue</p>
        <div className="space-y-2.5">
          {dialogueLines.map((dl, i) => (
            <div key={i} className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${dl.isYou ? 'bg-emerald-800 text-white dark:bg-emerald-700' : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'}`}>
                {!dl.isYou && <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">{dl.speaker}</span>}
                <span>{dl.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {vocabulary && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Key Vocabulary</p>
          <div className="space-y-2">
            {vocabulary.split('\n').filter(l => l.trim()).map((line, i) => {
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
      {translation && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">Translation</p>
          <div className="whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-400">{translation}</div>
        </div>
      )}
      <div className="flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
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
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Vocabulary</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{formatTags(content.title, content.tags)}</p>
      </div>
      {items.length > 0 ? <VocabCards items={items} /> : <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">{fallbackBody(content.content)}</div>}
      <div className="mt-8 flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
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
    return (
      <p key={line} className="text-sm text-stone-600 dark:text-stone-400">
        <span className="font-medium text-stone-500">DOI:</span>{' '}
        <span className="break-all text-stone-500">{val}</span>
      </p>
    )
  }
  return (
    <p key={line} className="text-sm text-stone-600 dark:text-stone-400">
      <span className="font-medium text-stone-500">{key}:</span> {val}
    </p>
  )
}

function extractSection(content: string, startMarker: string, endMarkers: string[]): string[] {
  const lines = content.split('\n')
  let collecting = false
  const result: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!collecting && trimmed.startsWith(startMarker)) { collecting = true; continue }
    if (collecting) {
      if (endMarkers.some((m) => trimmed.startsWith(m))) break
      if (!trimmed) continue
      result.push(trimmed)
    }
  }
  return result
}

function PassageDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const metaKeys = ['Paper', 'Authors', 'Journal', 'Year', 'DOI']
  const lines = content.content.split('\n')
  const metaLines = lines.filter((l) => metaKeys.some((k) => l.trim().startsWith(`**${k}:**`)))

  const excerptBody = extractSection(content.content, '**Excerpt:**', ['**Writing Focus:**', '**Key Vocabulary:**', '**Discussion Questions:**'])
  const writingFocus = extractSection(content.content, '**Writing Focus:**', ['**Key Vocabulary:**', '**Discussion Questions:**'])
  const vocabLines = extractSection(content.content, '**Key Vocabulary:**', ['**Discussion Questions:**'])
  const discussionLines = extractSection(content.content, '**Discussion Questions:**', [])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Journal Article</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
      </div>

      {metaLines.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          {metaLines.map((line) => renderMetaLine(line))}
        </div>
      )}

      {excerptBody.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Excerpt</p>
          <div className="space-y-3 font-serif text-base leading-relaxed text-stone-800 dark:text-stone-200">
            {excerptBody.map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>
      )}

      {writingFocus.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/30">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-500">Writing Focus</p>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{writingFocus.join(' ')}</p>
        </div>
      )}

      {vocabLines.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
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
        <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Discussion Questions</p>
          <div className="space-y-2">
            {discussionLines.map((line, i) => {
              const text = line.replace(/^\d+\.\s*/, '')
              return (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="shrink-0 font-medium text-stone-400">{i + 1}.</span>
                  <span className="text-stone-600 dark:text-stone-400">{text}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'}`}>
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
