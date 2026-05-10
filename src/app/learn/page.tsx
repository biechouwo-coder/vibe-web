export const dynamic = 'force-dynamic'

import { fetchTodaysContent } from '@/actions/learn'
import { getContentHistory } from '@/actions/learn'
import DailyCard from '@/components/learn/DailyCard'
import ListClient from './ListClient'
import { formatShanghaiDate } from '@/lib/date'

const typeMeta = {
  conversation: { emoji: '💬', label: 'Daily Conversation', color: 'blue', desc: 'Practice real-life dialogue' },
  vocabulary: { emoji: '📚', label: 'Vocabulary', color: 'purple', desc: 'Key terms with IPA phonetics' },
  passage: { emoji: '📖', label: 'Reading Passage', color: 'amber', desc: 'Academic & industry articles' },
}

export default async function LearnPage() {
  const content = await fetchTodaysContent()
  const history = await getContentHistory(20)

  return (
    <div className="space-y-8">
      {/* Header with type tabs */}
      <section>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">English Learning</h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Daily materials for carbon neutrality &amp; green finance
            </p>
          </div>
        </div>
      </section>

      {/* Today's date banner */}
      <section className="group relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 p-5 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-black dark:to-emerald-950/20">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-800/20" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            {formatShanghaiDate('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Study plan for today
          </p>
        </div>
      </section>

      {/* Today's Materials */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Today&apos;s Materials</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <DailyCard
            title={content.conversation.title}
            type="conversation"
            content={content.conversation.content}
            tags={content.conversation.tags}
            pushed={content.conversation.pushed}
            detailHref={`/learn/${content.conversation.id}`}
          />
          <DailyCard
            title={content.vocabulary.title}
            type="vocabulary"
            content={content.vocabulary.content}
            tags={content.vocabulary.tags}
            pushed={content.vocabulary.pushed}
            detailHref={`/learn/${content.vocabulary.id}`}
          />
          <DailyCard
            title={content.passage.title}
            type="passage"
            content={content.passage.content}
            tags={content.passage.tags}
            pushed={content.passage.pushed}
            detailHref={`/learn/${content.passage.id}`}
          />
        </div>
      </section>

      {/* Stats mini-row */}
      <section className="grid grid-cols-3 gap-3">
        {Object.entries(typeMeta).map(([key, meta]) => (
          <div
            key={key}
            className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-black"
          >
            <span className="text-lg">{meta.emoji}</span>
            <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">{meta.label}</p>
          </div>
        ))}
      </section>

      {/* Recent History */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">History</h2>
        <ListClient items={history} />
      </section>
    </div>
  )
}
