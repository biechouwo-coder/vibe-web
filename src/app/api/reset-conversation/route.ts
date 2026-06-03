import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getShanghaiDate } from '@/lib/date'
import { getDailyConversation } from '@/lib/content'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const date = getShanghaiDate()
    await prisma.dailyContent.deleteMany({ where: { date, type: 'conversation' } })
    await prisma.task.deleteMany({ where: { date, contentId: { contains: 'conv-' } } })
    const conversation = await getDailyConversation()
    return NextResponse.json({ success: true, title: conversation.title })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
