'use server'

import { Client } from '@notionhq/client'
import { prisma } from './prisma'

export async function getNotionClient() {
  const config = await prisma.notionConfig.findFirst()
  if (!config?.token) return null
  return new Client({ auth: config.token })
}

export async function pushEnglishContent(contentId: string) {
  const config = await prisma.notionConfig.findFirst()
  if (!config?.enabled || !config.dbEnglish) {
    throw new Error('Notion not configured')
  }

  const content = await prisma.dailyContent.findUnique({ where: { id: contentId } })
  if (!content) throw new Error('Content not found')
  if (content.pushed) return { ok: true, message: 'Already pushed' }

  const notion = new Client({ auth: config.token ?? undefined })

  const typeEmoji: Record<string, string> = {
    conversation: '💬',
    vocabulary: '📚',
    passage: '📖',
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Date: { date: { start: content.date.toISOString().split('T')[0] } },
    Type: { select: { name: content.type } },
    Title: { title: [{ text: { content: content.title } }] },
  }

  if (content.tags) {
    properties.Tags = { multi_select: content.tags.split(',').map((t) => ({ name: t.trim() })) }
  }

  await notion.pages.create({
    parent: { database_id: config.dbEnglish },
    properties,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: `${typeEmoji[content.type] ?? '📝'} ${content.title}` } }],
        },
      },
      {
        object: 'block',
        type: 'divider',
        divider: {},
      },
      ...content.content.split('\n').map((line) => ({
        object: 'block' as const,
        type: 'paragraph' as const,
        paragraph: {
          rich_text: [{ text: { content: line || ' ' } }],
        },
      })),
    ],
  })

  await prisma.dailyContent.update({
    where: { id: contentId },
    data: { pushed: true },
  })

  return { ok: true, message: 'Pushed to Notion' }
}

export async function pushTaskToNotion(taskId: string) {
  const config = await prisma.notionConfig.findFirst()
  if (!config?.enabled || !config.dbPlans) return

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) return

  const notion = new Client({ auth: config.token ?? undefined })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Date: { date: { start: task.date.toISOString().split('T')[0] } },
    Task: { title: [{ text: { content: task.title } }] },
    Status: { select: { name: task.completed ? 'completed' : 'pending' } },
  }

  if (task.completedAt) {
    properties.CompletedAt = { date: { start: task.completedAt.toISOString().split('T')[0] } }
  }

  await notion.pages.create({
    parent: { database_id: config.dbPlans },
    properties,
  })
}
