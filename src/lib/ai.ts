import OpenAI from 'openai'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'

function getClient(): OpenAI | null {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return null
  return new OpenAI({ baseURL: DEEPSEEK_BASE_URL, apiKey: key })
}

interface AiConversation {
  title: string
  topic: string
  scenario: string
  dialogue: { speaker: string; text: string }[]
  usefulExpressions: string[]
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
  const client = getClient()
  if (!client) return null

  const topic = TOPICS[seed % TOPICS.length]

  const prompt = `You are generating an English conversation for a Chinese university student in a Carbon Neutrality & Green Finance master's program at HKUST-GZ. The conversation should be academically realistic.

Generate a conversation about: **${topic}**

Return ONLY valid JSON (no markdown, no code blocks) matching this structure:
{
  "title": "Short engaging title (max 6 words)",
  "topic": "${topic}",
  "scenario": "One-sentence scene description (classroom, office hour, group project, etc.)",
  "dialogue": [
    {"speaker": "Professor", "text": "First line..."},
    {"speaker": "You", "text": "Response..."},
    {"speaker": "Classmate", "text": "..."}
  ],
  "usefulExpressions": ["Expression 1", "Expression 2", "Expression 3"],
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
