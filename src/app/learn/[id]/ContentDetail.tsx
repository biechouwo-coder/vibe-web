'use client'

import VocabCards from '@/components/learn/VocabCards'
import Link from 'next/link'
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

// ── Conversation content parsers ──

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

function parseVocabLines(text: string) {
  return text
    .split('\n')
    .filter((l) => l.trim().startsWith('-'))
    .map((l) => {
      // Matches: "- term /phonetic/: 中文" or "- term: 中文"
      const match = l.match(/-\s*(.+?)\s*(?:\/(.+?)\/)?\s*:\s*(.+)/)
      if (match) return { term: match[1].trim(), phonetic: match[2]?.trim() || '', definition: match[3].trim() }
      return null
    })
    .filter((item): item is { term: string; phonetic: string; definition: string } => item !== null)
}

// ── Conversation Knowledge Card ──

function ConversationDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const { dialogue, vocabulary, translation } = parseConversation(content.content)
  const dialogueLines = parseDialogueLines(dialogue)
  const vocabList = parseVocabLines(vocabulary)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-800 hover:shadow-md dark:border-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Header */}
      <div>
        <span className="text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
          💬 Daily Conversation
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {new Date(content.date).toLocaleDateString()}
          {content.tags && ` · ${content.tags.split(',').map((t) => t.trim()).join(' · ')}`}
        </p>
      </div>

      {/* Dialogue Chat */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-blue-800 dark:from-blue-950/20 dark:to-black">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          💬 Dialogue
        </h2>
        <div className="space-y-3">
          {dialogueLines.map((dl, i) => (
            <div key={i} className={`flex ${dl.isYou ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  dl.isYou
                    ? 'rounded-tr-md bg-emerald-500 text-white'
                    : 'rounded-tl-md bg-white text-zinc-700 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700'
                }`}
              >
                {!dl.isYou && (
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                    {dl.speaker}
                  </span>
                )}
                <span>{dl.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Vocabulary */}
      {vocabList.length > 0 && (
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 dark:border-purple-800 dark:from-purple-950/20 dark:to-black">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            📝 Key Vocabulary
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {vocabList.map((v, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/70 p-3.5 shadow-sm ring-1 ring-purple-200/50 dark:bg-zinc-800/70 dark:ring-purple-800/50"
              >
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{v.term}</p>
                {v.phonetic && (
                  <p className="mt-0.5 text-xs text-purple-500 dark:text-purple-400" style={{ fontFamily: 'var(--font-noto-sans)' }}>
                    [{v.phonetic}]
                  </p>
                )}
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{v.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Translation */}
      {translation && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            🌐 Translation
          </h2>
          <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {translation}
          </div>
        </div>
      )}

      {/* Push button */}
      <div className="flex items-center gap-3">
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

// ── Vocabulary Card Detail ──

function VocabularyDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const items = parseVocabSections(content.content)

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-800 hover:shadow-md dark:border-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="mt-4 mb-6">
        <span className="text-sm font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">
          📚 Vocabulary
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {new Date(content.date).toLocaleDateString()}
          {content.tags && ` · ${content.tags.split(',').map((t) => t.trim()).join(' · ')}`}
        </p>
      </div>

      {items.length > 0 ? (
        <VocabCards items={items} />
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
          {renderMarkdown(content.content)}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
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
    </div>
  )
}

// ── Default content renderer (passage / fallback) ──

function renderMarkdown(text: string) {
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

function DefaultDetail({ content, handlePush }: { content: DailyContentWithMeta; handlePush: () => void }) {
  const cfg = typeConfig[content.type] ?? { emoji: '📝', label: content.type, color: 'text-zinc-600' }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/learn" className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-zinc-300 hover:text-zinc-800 hover:shadow-md dark:border-zinc-700 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div className="mt-2">
        <span className={`text-sm font-medium uppercase tracking-wider ${cfg.color}`}>
          {cfg.emoji} {cfg.label}
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{content.title}</h1>
        <p className="mt-1 text-xs text-zinc-400">
          {new Date(content.date).toLocaleDateString()}
          {content.tags && ` · ${content.tags.split(',').map((t) => t.trim()).join(' · ')}`}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        {renderMarkdown(content.content)}
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
    </div>
  )
}

// ── Main component ──

export default function ContentDetail({ content, pushAction }: ContentDetailProps) {
  const handlePush = async () => {
    const result = await pushAction(content.id)
    if (result.ok) {
      window.location.reload()
    } else {
      alert(result.message)
    }
  }

  if (content.type === 'conversation') {
    return <ConversationDetail content={content} handlePush={handlePush} />
  }

  if (content.type === 'vocabulary') {
    return <VocabularyDetail content={content} handlePush={handlePush} />
  }

  return <DefaultDetail content={content} handlePush={handlePush} />
}
