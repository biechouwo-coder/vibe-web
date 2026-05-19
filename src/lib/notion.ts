'use server'

import { Client } from '@notionhq/client'
import { prisma } from './prisma'

function getEnvNotionConfig() {
  const token = process.env.NOTION_TOKEN
  const dbEnglish = process.env.NOTION_ENGLISH_DB_ID
  const dbPlans = process.env.NOTION_PLANS_DB_ID
  if (token && dbEnglish) return { token, dbEnglish, dbPlans: dbPlans ?? null }
  return null
}

export async function getNotionClient() {
  // Try env vars first (persists across Railway deploys)
  const env = getEnvNotionConfig()
  if (env) return new Client({ auth: env.token })
  // Fallback to DB (local dev via Settings page)
  const config = await prisma.notionConfig.findFirst()
  if (!config?.token) return null
  return new Client({ auth: config.token })
}

/** Get Notion config from env vars or DB. */
export async function getNotionConfig() {
  const env = getEnvNotionConfig()
  if (env) return { ...env, enabled: true, hasToken: true }
  const config = await prisma.notionConfig.findFirst()
  if (!config) return null
  return {
    token: config.token ?? null,
    dbEnglish: config.dbEnglish ?? null,
    dbPlans: config.dbPlans ?? null,
    enabled: config.enabled,
    hasToken: Boolean(config.token),
  }
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

/** Push content to Notion by contentId (from DB). */
export async function pushEnglishContent(contentId: string) {
  const config = await getNotionConfig()
  if (!config?.enabled || !config.dbEnglish) {
    throw new Error('Notion not configured')
  }

  const content = await prisma.dailyContent.findUnique({ where: { id: contentId } })
  if (!content) throw new Error('Content not found')
  // Dedup check: skip if already pushed (DB available) or just push (no DB)
  if (content.pushed) return { ok: true, message: 'Already pushed' }

  const notion = new Client({ auth: config.token })

  const blocks = buildNotionPageBlocks(content)
  await notion.pages.create({
    parent: { database_id: config.dbEnglish },
    properties: buildNotionProperties(content),
    children: blocks,
  })

  // Mark as pushed (DB may not be available in production, catch silently)
  try {
    await prisma.dailyContent.update({
      where: { id: contentId },
      data: { pushed: true },
    })
  } catch { /* DB not available */ }

  return { ok: true, message: 'Pushed to Notion' }
}

/** Push content directly from in-memory data (no DB lookup needed). Used by auto-push. */
export async function pushContentDirectly(content: {
  title: string
  type: string
  content: string
  tags: string | null
  date: Date
}) {
  const config = await getNotionConfig()
  if (!config?.enabled || !config.dbEnglish) return

  // Skip if already pushed (DB available)
  try {
    const existing = await prisma.dailyContent.findUnique({
      where: { date_type: { date: content.date, type: content.type } },
    })
    if (existing?.pushed) return
  } catch { /* DB not available */ }

  const notion = new Client({ auth: config.token })
  await notion.pages.create({
    parent: { database_id: config.dbEnglish },
    properties: buildNotionProperties(content),
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: `${typeEmoji[content.type] ?? ''} ${content.title}` } }],
        },
      },
      { object: 'block', type: 'divider', divider: {} },
      ...parseContentToBlocks(content.content),
    ],
  })

  // Mark as pushed
  try {
    await prisma.dailyContent.update({
      where: { date_type: { date: content.date, type: content.type } },
      data: { pushed: true },
    })
  } catch { /* DB not available */ }
}

const typeEmoji: Record<string, string> = {
  conversation: '💬',
  vocabulary: '📚',
  passage: '📖',
}

function buildNotionProperties(content: {
  title: string
  type: string
  tags: string | null
  date: Date
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    Date: { date: { start: content.date.toISOString().split('T')[0] } },
    Type: { select: { name: content.type } },
    Title: { title: [{ text: { content: content.title } }] },
  }
  if (content.tags) {
    properties.Tags = { multi_select: content.tags.split(',').map((t) => ({ name: t.trim() })) }
  }
  return properties
}

function buildNotionPageBlocks(content: {
  title: string
  type: string
  content: string
}) {
  return [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: `${typeEmoji[content.type] ?? '📝'} ${content.title}` } }],
      },
    },
    { object: 'block', type: 'divider', divider: {} },
    ...parseContentToBlocks(content.content),
  ]
}

export async function pushTaskToNotion(taskId: string) {
  const config = await getNotionConfig()
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
