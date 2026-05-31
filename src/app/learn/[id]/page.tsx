import BackLink from '@/components/ui/BackLink'
import { getContentById, fetchTodaysContent } from '@/actions/learn'
import { pushToNotion } from '@/actions/learn'
import ContentDetail from './ContentDetail'

export default async function LearnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const content = await getContentById(id)

  if (!content) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <span className="text-4xl font-light text-stone-300 dark:text-stone-600">404</span>
        <h1 className="text-xl font-semibold">Content not found</h1>
        <BackLink href="/learn">Back to learning</BackLink>
      </div>
    )
  }

  const today = await fetchTodaysContent()
  const tocItems = [
    { type: 'conversation', title: today.conversation.title, id: today.conversation.id },
    { type: 'vocabulary', title: today.vocabulary.title, id: today.vocabulary.id },
    { type: 'passage', title: today.passage.title, id: today.passage.id },
  ]

  return <ContentDetail content={content} pushAction={pushToNotion} tocItems={tocItems} />
}
