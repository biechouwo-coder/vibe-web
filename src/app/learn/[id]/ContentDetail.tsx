'use client'

import VocabCards from '@/components/learn/VocabCards'
import BackLink from '@/components/ui/BackLink'
import { formatStoredDate } from '@/lib/date'
import type { DailyContentWithMeta } from '@/types'

interface ContentDetailProps {
  content: DailyContentWithMeta
  pushAction: (id: string) => Promise<{ ok: boolean; message: string }>
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

function ConversationDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const { dialogue, vocabulary, translation } = parseConversation(content.content)
  const dialogueLines = parseDialogueLines(dialogue)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/learn" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Conversation</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{content.tags && ` · ${content.tags.split(',').map((t) => t.trim()).filter(t => !['daily','conversation','vocabulary','passage','journal','core','cnf','academic'].includes(t)).join(' · ')}`}</p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">Dialogue</p>
        <div className="space-y-2.5">
          {dialogueLines.map((dl, i) => (
            <div key={i} className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                dl.isYou
                  ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                  : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}>
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
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
          }`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
        {content.source && <span className="text-xs text-stone-400">Source: {content.source}</span>}
      </div>
    </div>
  )
}

// ── Vocabulary card parser ──

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
        <p className="mt-0.5 text-xs text-stone-400">{formatStoredDate(content.date)}{content.tags && ` · ${content.tags.split(',').map((t) => t.trim()).filter(t => !['daily','conversation','vocabulary','passage','journal','core','cnf','academic'].includes(t)).join(' · ')}`}</p>
      </div>

      {items.length > 0 ? <VocabCards items={items} /> : <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">{renderFallback(content.content)}</div>}

      <div className="mt-8 flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
          }`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
        {content.source && <span className="text-xs text-stone-400">Source: {content.source}</span>}
      </div>
    </div>
  )
}

// ── Passage ──

function renderFallback(text: string) {
  return <div className="whitespace-pre-line text-sm leading-relaxed text-stone-600 dark:text-stone-400">{text}</div>
}

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

function PassageDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const source = getMetaValue(content.content, 'Source') || ''

  const lines = content.content.split('\n')
  const metaLines: string[] = []
  const bodyLines: string[] = []
  let inMeta = true

  for (const line of lines) {
    const trimmed = line.trim()
    if (inMeta && (trimmed.startsWith('**') || !trimmed)) {
      if (trimmed.startsWith('**') && !trimmed.startsWith('**Source:**')) {
        metaLines.push(trimmed)
      } else if (!trimmed) {
        inMeta = false
      }
    } else {
      bodyLines.push(line)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <BackLink href="/learn" />
      {source && <p className="text-xs text-stone-400">{source.replace('**Source:** ', '')}</p>}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Journal Article</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{content.title}</h1>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        {metaLines.map((line) => renderMetaLine(line))}
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 leading-relaxed dark:border-stone-800 dark:bg-stone-900">
        <div className="whitespace-pre-line text-sm text-stone-700 dark:text-stone-300">
          {bodyLines.map((line, i) => {
            const trimmed = line.trim()
            if (!trimmed) return <br key={i} />
            if (trimmed.startsWith('**Key Vocabulary:**')) {
              return <p key={i} className="mt-4 mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">{trimmed.replace(/\*\*/g, '')}</p>
            }
            if (trimmed.startsWith('**Discussion Questions:**')) {
              return <p key={i} className="mt-4 mb-2 text-xs font-semibold uppercase tracking-widest text-stone-500">{trimmed.replace(/\*\*/g, '')}</p>
            }
            if (trimmed.startsWith('- ')) {
              const text = trimmed.replace(/^-\s+/, '')
              const parts = text.split(': ')
              if (parts.length >= 2) {
                return <p key={i} className="ml-3 text-sm text-stone-600 dark:text-stone-400">· <strong>{parts[0]}</strong>: {parts.slice(1).join(': ')}</p>
              }
              return <p key={i} className="ml-3 text-sm text-stone-600 dark:text-stone-400">· {text}</p>
            }
            if (/^\d+\./.test(trimmed)) {
              return <p key={i} className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">{trimmed}</p>
            }
            return <p key={i} className="text-sm text-stone-700 dark:text-stone-300">{trimmed}</p>
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pb-6">
        <button onClick={handlePush} disabled={content.pushed}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            content.pushed ? 'bg-stone-100 text-stone-400 dark:bg-stone-800' : 'bg-emerald-800 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
          }`}>
          {content.pushed ? 'Saved to Notion' : 'Save to Notion'}
        </button>
      </div>
    </div>
  )
}

function getMetaValue(content: string, key: string): string | null {
  const prefix = `**${key}:**`
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length).trim()
  }
  return null
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
