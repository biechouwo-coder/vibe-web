'use server'

import { Client } from '@notionhq/client'
import { prisma } from './prisma'
import { toShanghaiISODate } from './date'

export async function getNotionClient() {
  const config = await prisma.notionConfig.findFirst()
  if (!config?.token) return null
  return new Client({ auth: config.token })
}

// ── Content-to-Notion-blocks parser ──

interface RichTextSegment {
  type: 'text'
  text: { content: string }
  annotations?: { bold?: boolean; italic?: boolean }
}

/** Split a line into rich-text segments, handling **bold** patterns. */
function parseRichText(line: string): RichTextSegment[] {
  const segments: RichTextSegment[] = []
  const parts = line.split(/(\*\*.+?\*\*)/)
  for (const part of parts) {
    if (!part) continue
    const boldMatch = part.match(/^\*\*(.+)\*\*$/)
    if (boldMatch) {
      segments.push({ type: 'text', text: { content: boldMatch[1] }, annotations: { bold: true } })
    } else {
      segments.push({ type: 'text', text: { content: part } })
    }
  }
  return segments.length > 0 ? segments : [{ type: 'text', text: { content: ' ' } }]
}

/** Parse markdown-like lines into Notion block objects. */
function parseContentToBlocks(text: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks: any[] = []
  const lines = text.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: parseRichText(trimmed.replace(/^##\s+/, '')) },
      })
    } else if (trimmed.startsWith('- ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: parseRichText(trimmed.replace(/^-\s+/, '')) },
      })
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: parseRichText(trimmed) },
      })
    }
  }

  return blocks
}

// ── Push functions ──

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
    Date: { date: { start: toShanghaiISODate(content.date) } },
    Type: { select: { name: content.type } },
    Title: { title: [{ text: { content: content.title } }] },
  }

  if (content.tags) {
    properties.Tags = { multi_select: content.tags.split(',').map((t: string) => ({ name: t.trim() })) }
  }

  const contentBlocks = parseContentToBlocks(content.content)

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
      { object: 'block', type: 'divider', divider: {} },
      ...contentBlocks,
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
    Date: { date: { start: toShanghaiISODate(task.date) } },
    Task: { title: [{ text: { content: task.title } }] },
    Status: { select: { name: task.completed ? 'completed' : 'pending' } },
  }

  if (task.completedAt) {
    properties.CompletedAt = { date: { start: toShanghaiISODate(task.completedAt) } }
  }

  await notion.pages.create({
    parent: { database_id: config.dbPlans },
    properties,
  })
}
