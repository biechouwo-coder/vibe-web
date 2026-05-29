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
  dialogue: { speaker: string; text: string }[]
  usefulExpressions: { phrase: string; usage: string }[]
  toneNote: string
  practicePrompt: string
  translation: string
}

const TOPICS = [
  'carbon pricing mechanisms',
  'ESG investing strategies',
  'green bond markets',
  'climate risk assessment',
  'carbon accounting methods',
  'renewable energy finance',
  'sustainable supply chains',
  'net-zero policy frameworks',
  'carbon credit markets',
  'climate scenario analysis',
  'green technology investment',
  'corporate sustainability reporting',
]

export async function generateConversation(seed: number): Promise<AiConversation | null> {
  const client = await getClient()
  if (!client) return null

  const topic = TOPICS[seed % TOPICS.length]

  const prompt = `You are generating an English conversation for a Chinese university student in a Carbon Neutrality & Green Finance master's program at HKUST-GZ. The conversation should be academically realistic.

Generate a conversation about: **${topic}**

Return ONLY valid JSON (no markdown, no code blocks) matching this structure:
{
  "title": "Short engaging title (max 6 words)",
  "topic": "${topic}",
  "scenario": "One-sentence scene description (classroom, gym, cafeteria, dormitory, class activity, company visit, entertainment, etc.)",
  "dialogue": [
    {"speaker": "Professor", "text": "First line..."},
    {"speaker": "You", "text": "Response..."},
    {"speaker": "Classmate", "text": "..."}
  ],
  "usefulExpressions": [
    {"phrase": "Expression 1", "usage": "When to use this expression (context/situation)", "translation": "中文翻译"},
    {"phrase": "Expression 2", "usage": "When to use this expression", "translation": "中文翻译"},
    {"phrase": "Expression 3", "usage": "When to use this expression", "translation": "中文翻译"}
  ],
  "toneNote": "Tone description",
  "practicePrompt": "Practice prompt for the student",
  "translation": "Speaker1：中文翻译\\nSpeaker2：中文翻译\\n..."
}

Rules:
- 4-6 dialogue exchanges (each exchange = one speaker line)
- Speakers: Professor, You, Classmate, Team Member, Other Student, Staff, Advisor
- Dialogue must be natural academic English with domain-specific terminology
- translation: each line starts with the SAME speaker name + Chinese full-width colon（：）, lines separated by \\n
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
