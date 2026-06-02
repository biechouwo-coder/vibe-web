import OpenAI from 'openai'
import { prisma } from './prisma'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'

async function getClient(): Promise<OpenAI | null> {
  // Try env var first (Railway/local), fall back to DB (Settings page)
  const envKey = process.env.DEEPSEEK_API_KEY
  if (envKey) return new OpenAI({ baseURL: DEEPSEEK_BASE_URL, apiKey: envKey })

  const config = await prisma.aiConfig.findFirst()
  if (!config?.apiKey || !config.enabled) return null
  return new OpenAI({ baseURL: DEEPSEEK_BASE_URL, apiKey: config.apiKey })
}

interface AiConversation {
  title: string
  topic: string
  scenario: string
  background: string
  dialogue: { speaker: string; text: string }[]
  usefulExpressions: { phrase: string; usage: string }[]
  toneNote: string
  practicePrompt: string
  translation: string
}

interface SceneContext {
  title: string
  topic: string
  scenario: string
  toneNote: string
  practicePrompt: string
  tags: string
}

export async function generateConversation(scene: SceneContext): Promise<AiConversation | null> {
  const client = await getClient()
  if (!client) return null

  const isAcademic = scene.tags.includes('classroom') || scene.tags.includes('company') || scene.tags.includes('class-activity')

  const prompt = `You are generating an English conversation for a Chinese university student.

Today's conversation scene:
**${scene.scenario}**
Tone: ${scene.toneNote}

Generate a natural conversation that fits this scene.${isAcademic ? ' The conversation should include domain-specific terminology related to carbon neutrality and green finance.' : ' The conversation should be natural everyday English appropriate for the setting.'}

Return ONLY valid JSON (no markdown, no code blocks) matching this structure:
{
  "title": "Short engaging title (max 6 words)",
  "topic": "${scene.topic}",
  "scenario": "${scene.scenario}",
  "background": "2-3 sentence narrative describing the setting before the dialogue starts (do not mention any university or program name)",
  "dialogue": [
    {"speaker": "...", "text": "..."},
    {"speaker": "...", "text": "..."},
    {"speaker": "...", "text": "..."}
  ],
  "usefulExpressions": [
    {"phrase": "Expression 1", "usage": "When to use this expression (context/situation)", "translation": "中文翻译"},
    {"phrase": "Expression 2", "usage": "When to use this expression", "translation": "中文翻译"},
    {"phrase": "Expression 3", "usage": "When to use this expression", "translation": "中文翻译"}
  ],
  "toneNote": "${scene.toneNote}",
  "practicePrompt": "${scene.practicePrompt}",
  "translation": "Speaker1：中文翻译\\nSpeaker2：中文翻译\\n..."
}

Rules:
- 4-6 dialogue exchanges (each exchange = one speaker line)
- Speakers appropriate to the scene (e.g. You, Classmate, Professor, Roommate, Staff)
- Include a 2-3 sentence background narrative that sets the scene (never mention the university, program name, or degree)
- translation: each line starts with the same speaker name + Chinese full-width colon（：）, lines separated by \\n
- translation must be complete, no omissions`

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates academic English conversations. Always return valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const text = response.choices[0]?.message?.content?.trim()
    if (!text) return null

    // Strip markdown code blocks if present
    const json = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(json) as AiConversation

    // Validate required fields
    if (!parsed.title || !parsed.dialogue || !parsed.translation) return null

    return parsed
  } catch (error) {
    console.error('[AI] Failed to generate conversation:', error)
    return null
  }
}
