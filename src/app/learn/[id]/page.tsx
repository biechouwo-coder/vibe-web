import BackLink from '@/components/ui/BackLink'
import { getContentById } from '@/actions/learn'
import { pushToNotion } from '@/actions/learn'
import ContentDetail from './ContentDetail'

export default async function LearnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const content = await getContentById(id)

  if (!content) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <span className="text-4xl">🔍</span>
        <h1 className="text-xl font-semibold">Content not found</h1>
        <BackLink href="/learn">Back to learning</BackLink>
      </div>
    )
  }

  return <ContentDetail content={content} pushAction={pushToNotion} />
}
