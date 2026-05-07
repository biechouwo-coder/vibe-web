export const dynamic = 'force-dynamic'

import { fetchTodaysContent } from '@/actions/learn'
import { getContentHistory } from '@/actions/learn'
import DailyCard from '@/components/learn/DailyCard'
import ListClient from './ListClient'

export default async function LearnPage() {
  const content = await fetchTodaysContent()
  const history = await getContentHistory(20)

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">English Learning</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Daily materials for green finance & academic English
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Today&apos;s Materials</h2>
        <div className="grid gap-4 sm:grid-cols-3">
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

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent History</h2>
        <ListClient items={history} />
      </section>
    </div>
  )
}
