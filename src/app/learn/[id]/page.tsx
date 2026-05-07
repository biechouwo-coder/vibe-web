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
        <a href="/learn" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
          Back to learning →
        </a>
      </div>
    )
  }

  return <ContentDetail content={content} pushAction={pushToNotion} />
}
