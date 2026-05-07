'use server'

import { revalidatePath } from 'next/cache'
import { getAllTodaysContent } from '@/lib/content'
import { pushEnglishContent } from '@/lib/notion'
import { prisma } from '@/lib/prisma'

export async function fetchTodaysContent() {
  return getAllTodaysContent()
}

export async function pushToNotion(contentId: string) {
  try {
    const result = await pushEnglishContent(contentId)
    revalidatePath('/learn')
    revalidatePath('/learn/[id]')
    return result
  } catch {
    return { ok: false, message: 'Notion not configured. Go to Settings first.' }
  }
}

export async function getContentById(id: string) {
  return prisma.dailyContent.findUnique({ where: { id } })
}

export async function getContentHistory(limit = 30) {
  return prisma.dailyContent.findMany({
    orderBy: { date: 'desc' },
    take: limit,
  })
}

export async function getNotionConfig() {
  const config = await prisma.notionConfig.findFirst()
  return config ?? null
}

export async function saveNotionConfig(formData: FormData) {
  const token = formData.get('token') as string
  const dbEnglish = formData.get('dbEnglish') as string
  const dbPlans = formData.get('dbPlans') as string
  const enabled = formData.get('enabled') === 'on'

  await prisma.notionConfig.upsert({
    where: { id: 'default' },
    update: { token, dbEnglish, dbPlans, enabled },
    create: { id: 'default', token, dbEnglish, dbPlans, enabled },
  })

  revalidatePath('/settings')
}
