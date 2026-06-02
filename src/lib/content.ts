import { pushContentDirectly } from './notion'
import { generateConversation } from './ai'
import { prisma } from './prisma'
import {
  getShanghaiDate,
  getShanghaiDateSeed,
  getShanghaiWeekOfYear,
  getShanghaiDayOfWeek,
} from '@/lib/date'

// Static content library for business & green finance English
const conversationContent = [
  // ── 1. 教室 ──
  {
    title: 'Debating Carbon Tax vs. Emissions Trading',
    topic: 'In-Class Policy Debate',
    scenario: 'In a climate policy class, the professor organises a debate on the most effective carbon pricing approach.',
    dialogue: [
      { speaker: 'Professor', text: 'Today we debate: carbon tax versus emissions trading. Which is more effective? You, your opening argument.' },
      { speaker: 'You', text: 'A carbon tax provides price certainty. Firms can plan long-term investments when they know the carbon price trajectory.' },
      { speaker: 'Classmate', text: 'But an ETS sets a hard cap on emissions. A tax only indirectly limits them. If we need absolute reductions, a cap is more reliable.' },
      { speaker: 'You', text: 'That is true in theory. But in practice, volatile allowance prices under an ETS create uncertainty that discourages low-carbon investment.' },
      { speaker: 'Professor', text: 'Good point. Some argue a hybrid design — a carbon price floor within an ETS — offers the best of both worlds. Discuss.' },
    ],
    usefulExpressions: [
      { phrase: 'Which is more effective? You, your opening argument.', usage: 'Used by a moderator or professor to invite someone to begin a debate.', translation: '哪个更有效？你来开场论证。' },
      { phrase: 'That is true in theory. But in practice, ...', usage: 'Use this to concede a point while pivoting to a practical counterargument.', translation: '理论上确实如此。但在实践中……' },
      { phrase: 'Some argue ... offers the best of both worlds.', usage: 'Use this to introduce a compromise or hybrid solution during discussion.', translation: '有些人认为……兼具两者优势。' },
    ],
    toneNote: 'Respectfully argumentative — engage with ideas, not people.',
    practicePrompt: 'Argue for or against carbon taxes in 3 sentences, addressing one counterpoint.',
    translation: '教授：今天我们辩论：碳税还是排放交易——哪个更有效？你来开场论证。\n你：碳税提供了价格确定性。当企业知道碳价的走势时，他们可以规划长期投资。\n同学：但ETS设定了绝对的排放上限。碳税只是间接限制排放。如果我们需要绝对的减排量，总量控制更可靠。\n你：理论上确实如此。但在实践中，ETS下波动的配额价格带来的不确定性会抑制低碳投资。\n教授：说得好。有人认为混合设计——在ETS内设置碳价下限——兼具两者优势。讨论一下。',
    tags: 'conversation,speaking,classroom',
  },
  // ── 2. 健身房 ──
  {
    title: 'Between Sets at the Gym',
    topic: 'Workout Chat',
    scenario: 'You run into a classmate at the university gym while resting between sets.',
    dialogue: [
      { speaker: 'You', text: 'Hey, I did not know you worked out here. What is your split?' },
      { speaker: 'Classmate', text: 'I do push-pull-legs. Today is pull day. You?' },
      { speaker: 'You', text: 'Same actually. Just finished pull. One more set of rows and I am done.' },
      { speaker: 'Classmate', text: 'Nice. Your form on those rows looks solid. Do you do deadlifts too?' },
      { speaker: 'You', text: 'I used to, but my lower back has been acting up. Switched to RDLs and hyperextensions instead.' },
      { speaker: 'Classmate', text: 'Smart. No point ego-lifting if it messes up your back. Wanna spot each other on chest day sometime?' },
    ],
    usefulExpressions: [
      { phrase: 'What is your split?', usage: 'Common gym small talk — ask someone how they organise their weekly workouts.', translation: '你一周怎么分的？' },
      { phrase: 'Your form on ... looks solid.', usage: 'Give a genuine compliment on someone\'s exercise technique.', translation: '你做……的动作很标准。' },
      { phrase: 'No point ... if it messes up your ...', usage: 'Use this to agree that safety is more important than showing off.', translation: '如果伤了……就没必要硬上……' },
    ],
    toneNote: 'Casual and friendly — typical gym chat between sets.',
    practicePrompt: 'Ask a classmate at the gym about their workout routine and give a compliment.',
    translation: '你：嘿，不知道你也在这儿练。你怎么分部位的？\n同学：我推拉腿。今天拉。你呢？\n你：一样，刚练完拉。再做一组划船就结束了。\n同学：不错。你划船的动作看起来很标准。你也练硬拉吗？\n你：以前练，但我下背一直不太舒服。换成罗马尼亚硬拉和背伸展了。\n同学：明智。伤了背就没必要硬上。改天练胸日一起互相保护？',
    tags: 'conversation,speaking,gym',
  },
  // ── 3. 食堂 ──
  {
    title: 'What Is Good Today?',
    topic: 'Cafeteria Food',
    scenario: 'You and a classmate meet at the cafeteria and try to decide what to eat.',
    dialogue: [
      { speaker: 'Classmate', text: 'I am starving. Is the noodle window still open?' },
      { speaker: 'You', text: 'I think so, but the line is always long. The rice combo section looks faster today.' },
      { speaker: 'Classmate', text: 'True. What are you getting?' },
      { speaker: 'You', text: 'Maybe the braised beef — that one is usually decent. Do they still have the soup of the day?' },
      { speaker: 'Classmate', text: 'I think it is tomato-egg. I will grab us a table by the window.' },
      { speaker: 'You', text: 'Perfect. I will queue and text you when I am almost done.' },
    ],
    usefulExpressions: [
      { phrase: 'I am starving. Is the ... window still open?', usage: 'Use this to ask about food availability when you are hungry.', translation: '我饿死了。……窗口还开着吗？' },
      { phrase: 'I will grab us a table by the window.', usage: 'Offer to claim seats while your friend queues for food.', translation: '我去占个靠窗的桌子。' },
      { phrase: 'I will queue and text you when I am almost done.', usage: 'Coordinate with someone so you can sit together without waiting.', translation: '我来排队，快好了发消息给你。' },
    ],
    toneNote: 'Relaxed and natural — everyday cafeteria chat.',
    practicePrompt: 'Ask a friend what they want to eat and coordinate getting food together.',
    translation: '同学：我饿死了。面食窗口还开着吗？\n你：应该还开着，但队伍总是很长。今天套餐区看起来快一些。\n同学：也是。你吃什么？\n你：可能要红烧牛肉那个，那个一般还不错。今天还有例汤吗？\n同学：好像是番茄鸡蛋汤。我去占个靠窗的桌子。\n你：完美。我来排队，快好了发消息给你。',
    tags: 'conversation,speaking,cafeteria',
  },
  // ── 4. 宿舍 ──
  {
    title: 'Weekend Plans in the Dorm',
    topic: 'Dormitory Weekend Talk',
    scenario: 'Friday evening in the dorm. You and your roommate are winding down and making weekend plans.',
    dialogue: [
      { speaker: 'Roommate', text: 'Finally Friday. Any plans for the weekend?' },
      { speaker: 'You', text: 'Thinking of checking out that new board game cafe near the south gate. Heard they have a good selection.' },
      { speaker: 'Roommate', text: 'I went last week! They have Catan and Brass: Birmingham. The matcha latte is decent too.' },
      { speaker: 'You', text: 'Nice. Want to go together tomorrow afternoon? Maybe grab hotpot afterwards.' },
      { speaker: 'Roommate', text: 'You read my mind. I have been craving hotpot all week.' },
    ],
    usefulExpressions: [
      { phrase: 'Finally Friday. Any plans for the weekend?', usage: 'Use this to start a casual conversation about weekend plans.', translation: '终于周五了。周末有什么安排？' },
      { phrase: 'Thinking of checking out ...', usage: 'Use this to mention something you are considering doing.', translation: '想去看看……' },
      { phrase: 'You read my mind.', usage: 'Use this when someone suggests exactly what you were thinking.', translation: '你懂我。' },
    ],
    toneNote: 'Relaxed and warm — natural dormitory conversation between roommates.',
    practicePrompt: 'Ask your roommate about weekend plans and suggest an activity.',
    translation: '室友：终于周五了。周末有什么安排？\n你：想去看看南门新开的那家桌游吧。听说他们家游戏挺多的。\n室友：我上周去了！有卡坦岛和伯明翰。抹茶拿铁也不错。\n你：不错。明天下午一起去？之后可以去吃火锅。\n室友：你懂我。我馋火锅一整个星期了。',
    tags: 'conversation,speaking,dormitory',
  },
  // ── 5. 班级活动 ──
  {
    title: 'Beach Cleanup and Barbecue',
    topic: 'Class Bonding Activity',
    scenario: 'The class organises a beach cleanup event followed by a barbecue. You are on the organising team.',
    dialogue: [
      { speaker: 'Classmate', text: 'How many people signed up for the beach cleanup tomorrow?' },
      { speaker: 'You', text: 'Around twenty. I divided everyone into four groups — each takes a section of the beach.' },
      { speaker: 'Classmate', text: 'Great. I will bring the trash bags and gloves. What time do we meet at the gate?' },
      { speaker: 'You', text: 'Eight thirty. The bus leaves at nine. I also reserved the barbecue pit for the afternoon.' },
      { speaker: 'Classmate', text: 'Nice. Leave the grill to me — I am the designated BBQ master.' },
    ],
    usefulExpressions: [
      { phrase: 'How many people signed up for ...?', usage: 'Use this to check attendance for a group event.', translation: '多少人报名了……？' },
      { phrase: 'I divided everyone into ... groups — each takes ...', usage: 'Use this to explain how you organised a team activity.', translation: '我把大家分成……组——每组负责……' },
      { phrase: 'Leave the ... to me — I am the designated ...', usage: 'Use this to volunteer confidently for a specific role.', translation: '……交给我——我是指定……' },
    ],
    toneNote: 'Energetic and organised — classmates working together on an activity.',
    practicePrompt: 'Coordinate with a classmate about an upcoming class event.',
    translation: '同学：多少人报名了明天的海滩清洁活动？\n你：大概20个。我把大家分成了四组——每组负责一片区域。\n同学：好的。我带垃圾袋和手套来。几点在校门口集合？\n你：八点半。九点出发。我还预订了下午的烧烤位。\n同学：不错。烧烤交给我——我是指定的BBQ大师。',
    tags: 'conversation,speaking,class-activity',
  },
  // ── 6. 外出参观企业 ──
  {
    title: 'Visiting a Solar Manufacturing Plant',
    topic: 'Company Visit',
    scenario: 'Your class tours a solar panel manufacturing facility and meets the sustainability director.',
    dialogue: [
      { speaker: 'Director', text: 'Our latest factory runs entirely on renewable energy. We reduced production emissions by 70 percent compared to last year.' },
      { speaker: 'You', text: 'Impressive. For the remaining 30 percent, are you using carbon offsets or directly investing in abatement technology?' },
      { speaker: 'Director', text: 'We focus on direct abatement: electrifying heating processes and switching to green hydrogen for certain stages.' },
      { speaker: 'Classmate', text: 'What is the biggest challenge in scaling this model to other factories?' },
      { speaker: 'Director', text: 'Grid connectivity and the cost of green hydrogen. Policy support for grid decarbonisation would accelerate the transition significantly.' },
    ],
    usefulExpressions: [
      { phrase: 'Our latest ... runs entirely on renewable energy.', usage: 'Use this to highlight a company\'s sustainability achievement during a presentation.', translation: '我们最新的……完全使用可再生能源运行。' },
      { phrase: 'Impressive. For the remaining ..., are you using ... or ...?', usage: 'Use this to acknowledge progress while probing deeper into unresolved issues.', translation: '很厉害。对于剩下的……，你们在用……还是……？' },
      { phrase: 'What is the biggest challenge in scaling this model?', usage: 'Use this to ask about real-world barriers to growth.', translation: '推广这个模式最大的挑战是什么？' },
    ],
    toneNote: 'Professional and thoughtful — shows genuine interest in the company\'s work.',
    practicePrompt: 'Ask a company representative about their sustainability strategy and the challenges they face.',
    translation: '总监：我们最新的工厂完全使用可再生能源运行。与去年相比，生产排放减少了70%。\n你：很厉害。对于剩下30%，你们是使用碳抵消还是直接投资减排技术？\n总监：我们专注于直接减排：将加热过程电气化，并在某些环节转向绿色氢气。\n同学：将这个模式推广到其他工厂最大的挑战是什么？\n总监：电网连接和绿色氢气的成本。电网脱碳的政策支持将大大加速转型。',
    tags: 'conversation,speaking,company-visit',
  },
  // ── 7. 娱乐活动 ──
  {
    title: 'Karaoke Night',
    topic: 'Post-Exam Celebration',
    scenario: 'After the final exams, a group of classmates goes to karaoke to celebrate.',
    dialogue: [
      { speaker: 'Classmate', text: 'Finals are finally over! You have to sing at least one song.' },
      { speaker: 'You', text: 'No way, I am terrible. I will be the audience.' },
      { speaker: 'Classmate', text: 'Come on, everyone sings. How about a duet? Pick something easy.' },
      { speaker: 'You', text: 'Alright, do not blame me if I ruin it. You pick the song.' },
      { speaker: 'Classmate', text: 'Yes! This is going to be fun. Next round of fruit tea is on me.' },
    ],
    usefulExpressions: [
      { phrase: 'You have to sing at least one song.', usage: 'Use this to gently pressure a friend into participating in karaoke.', translation: '你至少得唱一首歌。' },
      { phrase: 'Come on, everyone sings. How about a duet?', usage: 'Use this to encourage someone who is shy about singing.', translation: '来吧，大家都唱。二重唱怎么样？' },
      { phrase: 'Next round of ... is on me.', usage: 'Use this to treat friends to food or drinks in a casual setting.', translation: '下一轮……我请客。' },
    ],
    toneNote: 'Lively and encouraging — friends having fun together.',
    practicePrompt: 'Encourage a shy classmate to join in a group activity.',
    translation: '同学：期末终于结束了！你至少得唱一首歌。\n你：不行，我唱得很烂。我当观众就好。\n同学：来吧，大家都唱。二重唱怎么样？选一首简单的。\n你：好吧，唱砸了别怪我。你选歌。\n同学：太好了！一定很好玩。下一轮水果茶我请客。',
    tags: 'conversation,speaking,entertainment',
  },
]

function pickBySeed<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// ── Weekly article chunk helpers ──

const CHUNK_LABELS = ['Reading 1', 'Reading 2', 'Reading 3', 'Reading 4', 'Vocabulary', 'Discussion'] as const

/**
 * Determine today's chunk index for the weekly article.
 * @returns 0-5 for Mon-Sat, -1 for Sunday (review day)
 */
function getChunkIndex(): number {
  const d = getShanghaiDayOfWeek() // 0=Mon..6=Sun
  return d === 6 ? -1 : d
}

/** Split text into sentences by . or ? or ! followed by space or end. */
function splitSentences(text: string): string[] {
  const result: string[] = []
  // Match sentences ending with punctuation followed by a space or end-of-string.
  // Handles common abbreviations by requiring the next word to start with a capital.
  let remaining = text.trim()
  const re = /[.?!](?:\s+|$)/g
  let match: RegExpExecArray | null
  let prevEnd = 0
  while ((match = re.exec(remaining)) !== null) {
    const end = match.index + match[0].length
    const sentence = remaining.slice(prevEnd, end).trim()
    if (sentence) result.push(sentence)
    prevEnd = end
  }
  const tail = remaining.slice(prevEnd).trim()
  if (tail) {
    // Append to last sentence if it doesn't end with punctuation
    if (result.length > 0 && !/[.?!]$/.test(tail)) {
      result[result.length - 1] += ' ' + tail
    } else if (tail) {
      result.push(tail)
    }
  }
  return result.filter(Boolean)
}

/** Distribute `count` items as evenly as possible across `days` buckets. */
function distributeIndices(count: number, days: number): number[][] {
  if (count === 0 || days === 0) return Array.from({ length: days }, () => [])
  const buckets: number[][] = Array.from({ length: days }, () => [])
  for (let i = 0; i < count; i++) {
    const dayIndex = Math.floor((i * days) / count)
    if (dayIndex < days) buckets[dayIndex].push(i)
  }
  return buckets
}

/** Chunk configuration for each day (Mon-Sat) and Sunday review. */
interface ChunkConfig {
  excerptChunk: number     // excerpt bucket index, -1 = none unless fullContent
  writingFocus: boolean
  vocabChunk: number       // vocab bucket index, -1 = none unless fullVocab
  discussion: boolean
  fullVocab: boolean
  fullContent: boolean     // Sunday review — show everything
}

const CHUNK_CONFIGS: ChunkConfig[] = [
  // Mon            excerpt  WF    vocab    disc  fullV  fullC
  { excerptChunk: 0, writingFocus: false, vocabChunk: 0, discussion: false, fullVocab: false, fullContent: false },
  // Tue
  { excerptChunk: 1, writingFocus: false, vocabChunk: 1, discussion: false, fullVocab: false, fullContent: false },
  // Wed
  { excerptChunk: 2, writingFocus: true,  vocabChunk: 2, discussion: false, fullVocab: false, fullContent: false },
  // Thu
  { excerptChunk: -1, writingFocus: false, vocabChunk: -1, discussion: false, fullVocab: false, fullContent: false },
  // Fri — full vocab
  { excerptChunk: -1, writingFocus: false, vocabChunk: -1, discussion: false, fullVocab: true,  fullContent: false },
  // Sat — discussion
  { excerptChunk: -1, writingFocus: false, vocabChunk: -1, discussion: true,  fullVocab: true,  fullContent: false },
  // Sun (index -1) — review
  { excerptChunk: -1, writingFocus: true,  vocabChunk: -1, discussion: true,  fullVocab: true,  fullContent: true },
]

/** Upsert daily content by date+type (unique constraint ensures no duplicates). */
async function upsertDailyContent(
  date: Date,
  type: string,
  data: { title: string; content: string; tags: string },
) {
  return prisma.dailyContent.upsert({
    where: { date_type: { date, type } },
    update: { title: data.title, content: data.content, tags: data.tags },
    create: { date, type, ...data },
  })
}


function formatConversationContent(item: typeof conversationContent[0]): string {
  const lines: string[] = []
  const transLines = item.translation.split('\n').filter(Boolean)
  lines.push(`**Topic:** ${item.topic}`)
  lines.push(`**Scenario:** ${item.scenario}`)
  lines.push(`
**Dialogue:**`)
  const bg = (item as { background?: string }).background
  if (bg) {
    lines.push(`
*${bg}*`)
  }
  for (let i = 0; i < item.dialogue.length; i++) {
    const d = item.dialogue[i]
    const zh = transLines[i]?.replace(/^[^：]*：\s*/, '').trim() || ''
    lines.push(`
${d.speaker}: ${d.text}`)
    if (zh) lines.push(`
**zh:** ${zh}`)
  }
  lines.push(`
**Useful Expressions:**`)
  for (const e of item.usefulExpressions) {
    const expr = typeof e === 'string' ? e : e.phrase
    const usage = typeof e === 'string' ? '' : e.usage
    const trans = (typeof e !== 'string' && 'translation' in e) ? (e as { translation?: string }).translation || '' : ''
    const note = usage + (trans ? ' || ' + trans : '')
    lines.push(`
- ${expr}${note ? ': ' + note : ''}`)
  }
  lines.push(`
**Tone Note:** ${item.toneNote}`)
  lines.push(`
**Practice Prompt:** ${item.practicePrompt}`)
  return lines.join("")
}

export async function getDailyConversation()
 {
  const date = getShanghaiDate()
  const seed = getShanghaiDateSeed()

  // Skip API if today's conversation already exists in DB
  const existing = await prisma.dailyContent.findUnique({
    where: { date_type: { date, type: 'conversation' } },
  })
  if (existing) return existing

  // Pick today's scene from the 7 daily-life scenarios
  const scene = pickBySeed(conversationContent, seed)

  // Try AI-generated conversation first
  const aiItem = await generateConversation(scene)
  if (aiItem) {
    return upsertDailyContent(date, 'conversation', {
      title: aiItem.title,
      content: formatConversationContent(aiItem as unknown as typeof conversationContent[0]),
      tags: scene.tags,
    })
  }

  // Fall back to static content
  return upsertDailyContent(date, 'conversation', {
    title: scene.title,
    content: formatConversationContent(scene),
    tags: scene.tags,
  })
}

/**
 * Select this week's reading item from readingContent.
 * Uses ISO week number so the same article persists Mon-Sun and
 * changes on Monday.
 */
function getWeeklyReadingItem(): ReadingContentItem {
  const week = getShanghaiWeekOfYear()
  return pickBySeed(readingContent, week)
}

export async function getDailyVocabulary(reading?: ReadingContentItem) {
  const date = getShanghaiDate()
  const r = reading ?? getWeeklyReadingItem()
  const ci = getChunkIndex() // 0-5 for Mon-Sat, -1 for Sun
  const label = ci === -1 ? 'Review' : CHUNK_LABELS[ci]
  return upsertDailyContent(date, 'vocabulary', {
    title: 'Key Terms: ' + r.title + ' — ' + label,
    content: formatWeeklyVocabularyContent(r, ci),
    tags: 'vocabulary,from-reading,' + r.tags,
  })
}

export async function getDailyPassage(reading?: ReadingContentItem) {
  const date = getShanghaiDate()
  const r = reading ?? getWeeklyReadingItem()
  const ci = getChunkIndex() // 0-5 for Mon-Sat, -1 for Sun
  const label = ci === -1 ? 'Review' : CHUNK_LABELS[ci]
  return upsertDailyContent(date, 'passage', {
    title: r.title + ' — ' + label,
    content: formatWeeklyPassageContent(r, ci),
    tags: r.tags,
  })
}

export async function getAllTodaysContent() {
  let conversation, vocabulary, passage
  try {
    const date = getShanghaiDate()
    const reading = getWeeklyReadingItem()
    const ci = getChunkIndex()

    const needsSeed = await (async () => {
      const anyTask = await prisma.task.findFirst({ where: { date } })
      if (anyTask) return false
      const anyContent = await prisma.dailyContent.findFirst({ where: { date } })
      return !anyContent
    })()

    conversation = await getDailyConversation()
    vocabulary = await getDailyVocabulary(reading)
    passage = await getDailyPassage(reading)

    if (needsSeed) {
      await seedLearningTasks(conversation, vocabulary, passage)
    }
  } catch {
    // DB unavailable (e.g. SQLite schema on Railway PostgreSQL) — use fallback
    const seed = getShanghaiDateSeed()
    const convItem = pickBySeed(conversationContent, seed)
    const readingItem = getWeeklyReadingItem()
    const ci = getChunkIndex()
    const label = ci === -1 ? 'Review' : CHUNK_LABELS[ci]
    conversation = { id: 'conv-' + seed, title: convItem.title, content: formatConversationContent(convItem), tags: convItem.tags, date: getShanghaiDate(), pushed: false }
    vocabulary = { id: 'vocab-' + seed, title: 'Key Terms: ' + readingItem.title + ' — ' + label, content: formatWeeklyVocabularyContent(readingItem, ci), tags: readingItem.tags, date: getShanghaiDate(), pushed: false }
    passage = { id: 'passage-' + seed, title: readingItem.title + ' — ' + label, content: formatWeeklyPassageContent(readingItem, ci), tags: readingItem.tags, date: getShanghaiDate(), pushed: false }
  }

  // Auto-push to Notion if configured (silent, non-blocking)
  Promise.all([
    pushContentDirectly({
      title: conversation.title,
      type: 'conversation',
      content: conversation.content,
      tags: conversation.tags,
      date: getShanghaiDate(),
    }).catch(() => {}),
    pushContentDirectly({
      title: vocabulary.title,
      type: 'vocabulary',
      content: vocabulary.content,
      tags: vocabulary.tags,
      date: getShanghaiDate(),
    }).catch(() => {}),
    pushContentDirectly({
      title: passage.title,
      type: 'passage',
      content: passage.content,
      tags: passage.tags,
      date: getShanghaiDate(),
    }).catch(() => {}),
  ])

  return { conversation, vocabulary, passage }
}

async function seedLearningTasks(
  conversation: { id: string; title: string },
  vocabulary: { id: string; title: string },
  passage: { id: string; title: string }
) {
  const date = getShanghaiDate()

  const taskDefs = [
    { title: `💬 ${conversation.title}`, contentId: conversation.id },
    { title: `📝 ${vocabulary.title}`, contentId: vocabulary.id },
    { title: `📄 ${passage.title}`, contentId: passage.id },
  ]

  for (const [i, t] of taskDefs.entries()) {
    await prisma.task.create({
      data: {
        date,
        title: t.title,
        contentId: t.contentId,
        description: 'Daily learning task',
        sortOrder: i,
        completed: false,
      },
    })
  }
}

// ── Unified Reading content (vocabulary + excerpt from journal articles) ──
// Each reading item provides an academic excerpt plus curated vocabulary.
// Vocabulary and passage now come from readingContent via getDailyReadingItem().

interface ReadingVocabularyItem {
  term: string
  phonetic: string
  definition: string
  example: string
  chinese: string
}

interface ReadingContentItem {
  title: string
  paperTitle: string
  authors: string
  journal: string
  year: number
  doi: string
  excerpt: string
  writingFocus: string
  vocabulary: ReadingVocabularyItem[]
  discussionQuestions: string[]
  tags: string
  translation: string
}


/**
 * Format a reading item into passage-style markdown content.
 * Compatible with the existing passage detail page rendering.
 */
export function formatReadingContent(item: ReadingContentItem): string {
  const lines: string[] = []
  lines.push('**Paper:** ' + item.paperTitle)
  lines.push('**Authors:** ' + item.authors)
  lines.push('**Journal:** ' + item.journal)
  lines.push('**Year:** ' + String(item.year))
  lines.push('**DOI:** https://doi.org/' + item.doi)
  lines.push('')
  lines.push("**Excerpt:**")
  lines.push(item.excerpt)
  lines.push('')
  lines.push('**Writing Focus:**')
  lines.push(item.writingFocus)
  lines.push('')
  lines.push('**Key Vocabulary:**')
  for (const v of item.vocabulary) {
    const phonetic = v.phonetic ? '/' + v.phonetic + '/' : ''
    lines.push('- ' + v.term + (phonetic ? ' ' + phonetic : '') + ': ' + v.chinese)
  }
  lines.push('')
  lines.push('**Discussion Questions:**')
  item.discussionQuestions.forEach((q, i) => {
    lines.push(String(i + 1) + '. ' + q)
  })
  return lines.join('\n')
}

/**
 * Format a reading item's vocabulary into vocabulary-style markdown.
 * Each term becomes a heading-2 entry compatible with parseVocabSections().
 * Format: ## N. Term /phonetic/ (Chinese)
 *         **Definition:** ...
 *         **Example:** ...
 *         **Chinese:** ...
 */
export function formatVocabularyFromReading(item: ReadingContentItem): string {
  return item.vocabulary.map((v, i) => {
    const parts: string[] = []
    const num = i + 1
    const phonetic = v.phonetic ? ' /' + v.phonetic + '/' : ''
    parts.push('## ' + String(num) + '. ' + v.term + phonetic + ' (' + v.chinese + ')')
    parts.push('**Definition:** ' + v.definition)
    parts.push('**Example:** "' + v.example + '"')
    parts.push('**Chinese:** ' + v.chinese)
    return parts.join('\n')
  }).join('\n')
}


// ── Weekly chunked formatters ──

function formatWeeklyPassageContent(item: ReadingContentItem, chunkIndex: number): string {
  const cfg = chunkIndex === -1 ? CHUNK_CONFIGS[6] : CHUNK_CONFIGS[chunkIndex]
  const lines: string[] = []

  // Always show paper metadata
  lines.push('**Paper:** ' + item.paperTitle)
  lines.push('**Authors:** ' + item.authors)
  lines.push('**Journal:** ' + item.journal)
  lines.push('**Year:** ' + String(item.year))
  lines.push('**DOI:** https://doi.org/' + item.doi)
  lines.push('')

  // Excerpt
  const sentences = splitSentences(item.excerpt)
  const excerptDays = Math.min(sentences.length, 3) // Mon-Wed for excerpt chunks
  const excerptBuckets = distributeIndices(sentences.length, excerptDays)

  if (cfg.fullContent) {
    // Sunday review — show everything
    lines.push('**Excerpt:**')
    lines.push(item.excerpt)
    lines.push('')
    lines.push('**Writing Focus:**')
    lines.push(item.writingFocus)
    lines.push('')
  } else if (cfg.excerptChunk >= 0 && cfg.excerptChunk < excerptBuckets.length) {
    lines.push('**Excerpt:**')
    for (const idx of excerptBuckets[cfg.excerptChunk]) {
      lines.push(sentences[idx])
    }
    lines.push('')
    if (cfg.writingFocus) {
      lines.push('**Writing Focus:**')
      lines.push(item.writingFocus)
      lines.push('')
    }
  } else if (cfg.excerptChunk === -1 && !cfg.fullContent) {
    // No excerpt on Thu (excerptChunk=-1) — show writing focus or vocab instead
    if (chunkIndex === 3) {
      // Thu — show remaining excerpt if any, plus full vocab (handled below)
      const allDone = excerptDays >= 3 && excerptBuckets.flat().length >= sentences.length
      if (!allDone) {
        // Show any leftover sentences
        const done = new Set(excerptBuckets.flat())
        const remaining = sentences.filter((_, i) => !done.has(i))
        if (remaining.length > 0) {
          lines.push('**Excerpt:**')
          for (const s of remaining) lines.push(s)
          lines.push('')
        }
      }
    }
  }

  // Key Vocabulary
  if (cfg.fullVocab || cfg.fullContent) {
    lines.push('**Key Vocabulary:**')
    for (const v of item.vocabulary) {
      const phonetic = v.phonetic ? '/' + v.phonetic + '/' : ''
      lines.push('- ' + v.term + (phonetic ? ' ' + phonetic : '') + ': ' + v.chinese)
    }
    lines.push('')
  }

  // Discussion
  if (cfg.discussion || cfg.fullContent) {
    lines.push('**Discussion Questions:**')
    item.discussionQuestions.forEach((q, i) => {
      lines.push(String(i + 1) + '. ' + q)
    })
  }

  // Translation
  lines.push('')
  lines.push('**Translation:**')
  lines.push(item.translation)

  return lines.join('\n')
}

function formatWeeklyVocabularyContent(item: ReadingContentItem, chunkIndex: number): string {
  const cfg = chunkIndex === -1 ? CHUNK_CONFIGS[6] : CHUNK_CONFIGS[chunkIndex]

  let termIndices: number[]
  if (cfg.fullVocab || cfg.fullContent) {
    termIndices = item.vocabulary.map((_, i) => i)
  } else if (cfg.vocabChunk >= 0) {
    const vocabBuckets = distributeIndices(item.vocabulary.length, 3)
    termIndices = vocabBuckets[cfg.vocabChunk] ?? []
  } else {
    termIndices = []
  }

  return termIndices.map((idx) => {
    const v = item.vocabulary[idx]
    const parts: string[] = []
    const num = idx + 1
    const phonetic = v.phonetic ? ' /' + v.phonetic + '/' : ''
    parts.push('## ' + String(num) + '. ' + v.term + phonetic + ' (' + v.chinese + ')')
    parts.push('**Definition:** ' + v.definition)
    parts.push('**Example:** "' + v.example + '"')
    parts.push('**Chinese:** ' + v.chinese)
    return parts.join('\n')
  }).join('\n')
}

export const readingContent: ReadingContentItem[] = [
  {
    title: 'Carbon Pricing Meta-Analysis',
    paperTitle: 'Systematic review and meta-analysis of ex-post evaluations on the effectiveness of carbon pricing',
    authors: 'Döbbeling-Hildebrandt, N., Miersch, K., Khanna, T.M., Bachelet, M., Kalkuhl, M., Koch, N., Edenhofer, O., Steckel, J.C.',
    journal: 'Nature Communications',
    year: 2024,
    doi: '10.1038/s41467-024-48512-w',
    excerpt: 'Carbon pricing is widely regarded as a central instrument for achieving climate mitigation targets. However, the ex-post empirical evidence on its effectiveness has been fragmented across disciplines, methods, and policy contexts. This study presents a systematic review and meta-analysis of 483 effect sizes from 80 causal ex-post evaluations covering 21 carbon pricing schemes worldwide. The results show that carbon pricing has led to statistically significant emission reductions ranging from 5% to 21% across different policies and contexts. After correcting for publication bias, the average reduction effect is estimated at 4% to 15%. Notably, at least 17 of the 21 policies evaluated produced immediate and substantial emission reductions.',
    writingFocus: 'Summarising meta-analysis findings for a policy audience',
    vocabulary: [
      { term: 'Meta-analysis', phonetic: '\u02ccmet\u0259 \u0259\u02c8n\u00e6l\u0259s\u026as', definition: 'A statistical technique for combining findings from independent studies.', example: 'The meta-analysis synthesised 80 evaluations of carbon pricing schemes.', chinese: '荟萃分析' },
      { term: 'Ex-post evaluation', phonetic: 'eks po\u028ast \u026a\u02ccv\u00e6lju\u02c8e\u026a\u0283\u0259n', definition: 'An assessment conducted after a policy has been implemented.', example: 'Ex-post evaluations measure actual emission reductions.', chinese: '事后评估' },
      { term: 'Publication bias', phonetic: '\u02ccp\u028cbl\u026a\u02c8ke\u026a\u0283\u0259n \u02c8ba\u026a\u0259s', definition: 'The tendency to publish only studies with significant results.', example: 'After correcting for publication bias the estimated effect was smaller.', chinese: '出版偏倿' },
      { term: 'Effect size', phonetic: '\u026a\u02c8fekt sa\u026az', definition: 'The magnitude of a measured change caused by an intervention.', example: 'The effect size varied from 5% to 21% across policies.', chinese: '效应量' },
      { term: 'Causal evaluation', phonetic: '\u02c8k\u0254\u02d0z\u0259l \u026a\u02ccv\u00e6lju\u02c8e\u026a\u0283\u0259n', definition: 'Analysis that identifies cause-and-effect relationships.', example: 'Only causal evaluations were included in the systematic review.', chinese: '因果评估' },
    ],
    discussionQuestions: [
      'Why is a meta-analysis more reliable than a single empirical study?',
      'How might publication bias affect the perceived effectiveness of carbon pricing?',
      'What policy implications follow from the finding that 17 of 21 schemes reduced emissions?',
    ],
    tags: 'carbon-pricing,meta-analysis,policy',
    translation: '碳定价被广泛认为是实现气候缓解目标的核心工具。然而，关于其有效性的事后实证证据长期分散在不同的学科、方法和政策背景中。本研究对全球21个碳定价方案的80项因果事后评估中的483个效应量进行了系统综述和荟萃分析。结果表明，碳定价在不同政策和背景下可带来5%至21%的统计显著减排。在纠正出版偏倚后，平均减排效果估计为4%至15%。值得注意的是，在所评估的21项政策中，至少有17项产生了即时且显著的减排效果。',
  },
  {
    title: 'EU ETS Firm-Level Evidence',
    paperTitle: 'Does Pricing Carbon Mitigate Climate Change? Firm-Level Evidence from the European Union Emissions Trading System',
    authors: 'Colmer, J., Martin, R., Mu\u00fbls, M., Wagner, U.',
    journal: 'The Review of Economic Studies',
    year: 2024,
    doi: '10.1093/restud/rdae055',
    excerpt: 'The European Union Emissions Trading System (EU ETS) is the world\u2019s largest carbon market and a cornerstone of EU climate policy. This paper provides rigorous firm-level evidence on the impact of the EU ETS on CO\u2082 emissions and economic performance. Using administrative data covering regulated manufacturing firms the authors find that the EU ETS induced firms to reduce CO\u2082 emissions by 14% to 16% relative to unregulated firms. These emission reductions were achieved without detectable contractions in economic activity.',
    writingFocus: 'Reporting causal empirical results for an economics journal',
    vocabulary: [
      { term: 'Firm-level evidence', phonetic: 'f\u025c\u02d0rm \u02c8lev\u0259l \u02c8ev\u026ad\u0259ns', definition: 'Data and analysis conducted at the individual company level.', example: 'Firm-level evidence shows regulated companies reduced emissions.', chinese: '企业层面证据' },
      { term: 'Emissions Trading System', phonetic: '\u026a\u02c8m\u026a\u0283\u0259nz \u02c8tre\u026ad\u026a\u014b \u02c8s\u026ast\u0259m', definition: 'A market-based approach to controlling pollution by trading emission allowances.', example: 'The EU ETS is the world\u2019s largest carbon market.', chinese: '碳排放交易体系' },
      { term: 'Carbon leakage', phonetic: '\u02c8k\u0251\u02d0b\u0259n \u02c8li\u02d0k\u026ad\u0292', definition: 'The relocation of production to regions with weaker climate policies.', example: 'The study found no evidence of carbon leakage within the EU.', chinese: '碳泄漏' },
      { term: 'Administrative data', phonetic: '\u0259d\u02c8m\u026an\u026astre\u026at\u026av \u02c8de\u026at\u0259', definition: 'Data collected by government agencies for regulatory purposes.', example: 'Administrative data on manufacturing firms was used.', chinese: '行政数据' },
      { term: 'Counterfactual', phonetic: '\u02ccka\u028ant\u0259r\u02c8f\u00e6kt\u0283u\u0259l', definition: 'What would have happened in the absence of the policy.', example: 'The study constructed a counterfactual using unregulated firms.', chinese: '反事实' },
    ],
    discussionQuestions: [
      'Why is firm-level evidence important for evaluating carbon pricing policies?',
      'What does the absence of carbon leakage suggest about EU ETS design?',
      'How might these results differ for carbon pricing in developing economies?',
    ],
    tags: 'eu-ets,carbon-pricing,firm-level',
    translation: '欧盟排放交易体系（EU ETS）是全球最大的碳市场，也是欧盟气候政策的基石。本文提供了关于EU ETS对二氧化碳排放和经济绩效影响的企业层面严格证据。作者利用覆盖受监管制造企业的行政数据发现，EU ETS促使企业相对于未受监管企业减少了14%至16%的二氧化碳排放。这些减排是在未检测到经济活动收缩的情况下实现的。',
  },
  {
    title: 'Quasi-Experimental Carbon Pricing',
    paperTitle: 'Quasi-Experimental Evidence on Carbon Pricing',
    authors: 'Vrolijk, K., Sato, M.',
    journal: 'The World Bank Research Observer',
    year: 2023,
    doi: '10.1093/wbro/lkad001',
    excerpt: 'A central challenge in the literature on carbon pricing is establishing whether observed emission reductions can be causally attributed to the policy rather than to concurrent trends. Quasi-experimental methods address this by constructing a credible counterfactual: what would have happened in the absence of the policy. Studies of the EU ETS, British Columbia\'s carbon tax, and Nordic carbon tax schemes consistently find that carbon pricing led to significant emission reductions, with effects ranging from modest to substantial depending on sector coverage and complementary policies. However, the evidence on economic outcomes such as employment and competitiveness remains mixed, partly because the effects are context-dependent and partly because the available studies differ in their identification strategies.',
    writingFocus: 'Comparing identification strategies across quasi-experimental studies',
    vocabulary: [
      { term: 'Quasi-experimental', phonetic: '', definition: 'A research design that estimates causal effects without random assignment.', example: 'Quasi-experimental methods construct a counterfactual using untreated comparison groups.', chinese: '\u51c6\u5b9e\u9a8c' },
      { term: 'Counterfactual', phonetic: '', definition: 'The hypothetical outcome that would have occurred without the intervention.', example: 'Constructing a credible counterfactual is the central methodological challenge.', chinese: '\u53cd\u4e8b\u5b9e' },
      { term: 'Identification strategy', phonetic: '', definition: 'The statistical approach used to isolate causal effects from confounding factors.', example: 'Studies differ in their identification strategies, which affects the comparability of results.', chinese: '\u8bc6\u522b\u7b56\u7565' },
      { term: 'Complementary policies', phonetic: '', definition: 'Additional regulations or incentives that support the primary policy.', example: 'Emission reductions depend on sector coverage and complementary policies.', chinese: '\u8865\u5145\u653f\u7b56' },
      { term: 'Context-dependent', phonetic: '', definition: 'Varying in magnitude or direction according to the setting.', example: 'The employment effects of carbon pricing are highly context-dependent.', chinese: '\u60c5\u5883\u4f9d\u8d56' },
    ],
    discussionQuestions: [
      'Why is constructing a counterfactual important for evaluating carbon pricing?',
      'What factors might explain the mixed evidence on economic outcomes?',
      'How could researchers improve the evidence base for developing countries?',
    ],
    tags: 'carbon-pricing,quasi-experimental,identification',
    translation: '碳定价文献中的一个核心挑战是，能否将观察到的减排效果因果地归因于该政策而非同期其他趋势。准实验方法通过构建可信的反事实——即没有该政策情况下会发生什么——来解决这一问题。对EU ETS、不列颠哥伦比亚省碳税和北欧碳税方案的研究一致发现，碳定价带来了显著减排，效果从温和到显著不等，具体取决于行业覆盖范围和配套政策。然而，关于就业和竞争力等经济结果的证据仍然不一，部分原因是效果具有情境依赖性，部分原因是现有研究的识别策略不同。',
  },
  {
    title: 'Carbon-Linked Bond Design',
    paperTitle: 'The new bond on the block \u2014 Designing a carbon-linked bond for sustainable investment projects',
    authors: 'Dahlen, N., Fehrenk\u00f6tter, R., Schreiter, M.',
    journal: 'The Quarterly Review of Economics and Finance',
    year: 2024,
    doi: '10.1016/j.qref.2024.04.010',
    excerpt: 'Traditional green bonds raise capital for environmental projects but do not align investors\' financial returns with the environmental performance of those projects. This paper addresses this gap by proposing a carbon-linked bond whose coupon payments are tied directly to the carbon price. When carbon prices rise, indicating greater environmental scarcity or stricter regulation, the bond pays a higher coupon, thereby compensating investors for the increased risk and rewarding them for supporting emission-reducing activities. The authors demonstrate that such a bond can be priced within a standard term-structure framework, and that the coupon calibration can be adjusted to reflect both current carbon prices and expected future price pathways under different policy scenarios.',
    writingFocus: 'Proposing a novel financial instrument with a clear pricing mechanism',
    vocabulary: [
      { term: 'Carbon-linked bond', phonetic: '', definition: 'A bond whose coupon payments are tied to the carbon price.', example: 'A carbon-linked bond compensates investors when carbon prices rise.', chinese: '\u78b3\u8054\u7ed3\u503a\u5238' },
      { term: 'Coupon payment', phonetic: '', definition: 'The periodic interest payment made to bondholders.', example: 'Coupon payments increase when the carbon price exceeds a predefined threshold.', chinese: '\u7968\u606f\u652f\u4ed8' },
      { term: 'Term-structure framework', phonetic: '', definition: 'A model that relates bond yields to different maturity dates.', example: 'The bond is priced within a standard term-structure framework.', chinese: '\u671f\u9650\u7ed3\u6784\u6846\u67b6' },
      { term: 'Calibration', phonetic: '', definition: 'The process of setting model parameters to match observed data.', example: 'Coupon calibration can be adjusted for different carbon price pathways.', chinese: '\u6821\u51c6' },
      { term: 'Policy scenario', phonetic: '', definition: 'A projected path of regulatory or market conditions.', example: 'Expected future carbon prices depend on alternative policy scenarios.', chinese: '\u653f\u7b56\u573a\u666f' },
    ],
    discussionQuestions: [
      'How does a carbon-linked bond differ from a traditional green bond in aligning incentives?',
      'What are the key challenges in calibrating the coupon to future carbon prices?',
      'How might carbon-linked bonds affect investor behaviour in carbon-intensive sectors?',
    ],
    tags: 'green-bond,carbon-finance,bond-pricing',
    translation: '传统绿色债券为环境项目筹集资金，但未能将投资者的财务回报与这些项目的环境绩效挂钩。本文通过提出一种碳联结债券来填补这一空白，其票息支付直接与碳价格挂钩。当碳价上涨——表明环境稀缺性加剧或监管趋严——债券支付更高的票息，从而补偿投资者增加的风险，并奖励他们支持减排活动。作者证明，这种债券可以在标准的期限结构框架内定价，票息校准可以根据不同政策情景下的当前碳价和预期未来碳价路径进行调整。',
  },
  {
    title: 'ESG Differentiated Pricing',
    paperTitle: 'Transitioning to a low-GHG economy: ESG differentiated pricing as a dynamic transition tool and its calibration',
    authors: 'Ozdemir, B.',
    journal: 'Journal of Risk Management in Financial Institutions',
    year: 2024,
    doi: '10.69554/CIES4502',
    excerpt: 'Financial institutions seeking to align their lending portfolios with climate goals face a tension between profitability and sustainability. This paper develops a three-layer framework that resolves this tension by integrating ESG scores into loan pricing in a dynamic, calibrated manner. At the first layer, borrower-level ESG scores are incorporated into standard credit risk assessment, so that firms with stronger environmental performance receive more favourable rates. The second layer adjusts pricing at the sector level according to transition risk exposure \u2014 high-emission industries face a premium that reflects the likelihood of future regulatory tightening. The third layer introduces a time-varying calibration mechanism that adjusts these pricing parameters as the economy transitions, ensuring that the framework remains effective even as baseline conditions shift.',
    writingFocus: 'Articulating a multi-layered risk-pricing mechanism for financial practitioners',
    vocabulary: [
      { term: 'ESG integration', phonetic: '', definition: 'The systematic inclusion of environmental, social, and governance criteria in financial decisions.', example: 'ESG integration into loan pricing aligns financial incentives with climate goals.', chinese: 'ESG\u6574\u5408' },
      { term: 'Transition risk', phonetic: '', definition: 'Financial risk arising from the shift to a low-carbon economy.', example: 'Sector-level transition risk exposure determines the premium applied to high-emission industries.', chinese: '\u8f6c\u578b\u98ce\u9669' },
      { term: 'Time-varying calibration', phonetic: '', definition: 'The continuous adjustment of model parameters as economic conditions evolve.', example: 'Time-varying calibration ensures the framework adapts as the economy transitions.', chinese: '\u65f6\u53d8\u6821\u51c6' },
      { term: 'Regulatory tightening', phonetic: '', definition: 'The strengthening of government rules or standards over time.', example: 'High-emission industries face a premium reflecting expected regulatory tightening.', chinese: '\u76d1\u7ba1\u6536\u7d27' },
      { term: 'Baseline conditions', phonetic: '', definition: 'The underlying economic or market environment at a given point in time.', example: 'The calibration adjusts as baseline conditions shift towards a low-carbon equilibrium.', chinese: '\u57fa\u7ebf\u6761\u4ef6' },
    ],
    discussionQuestions: [
      'How does the three-layer framework resolve the tension between profitability and sustainability?',
      'What are the potential drawbacks of incorporating ESG scores directly into loan pricing?',
      'Why is time-varying calibration essential for the long-term effectiveness of the framework?',
    ],
    tags: 'esg,risk-management,loan-pricing',
    translation: '寻求使其贷款组合与气候目标对齐的金融机构面临着盈利性与可持续性之间的张力。本文开发了一个三层框架，通过以动态、可校准的方式将ESG评分整合到贷款定价中来解决这一张力。第一层，借款人级别的ESG评分被纳入标准信用风险评估，使环境表现较好的企业获得更优惠的利率。第二层根据转型风险暴露在行业层面调整定价——高排放行业面临反映未来监管收紧可能性的溢价。第三层引入了一个时变校准机制，随着经济转型调整这些定价参数，确保框架即使在基准条件变化时仍然有效。',
  },
  {
    title: 'Carbon Pricing & Credit Risk',
    paperTitle: 'Corporate credit risk modeling under carbon pricing uncertainty: A Knightian uncertainty approach',
    authors: 'Dominique, C.M.D., Tian, Y.',
    journal: 'Sustainable Futures',
    year: 2024,
    doi: '10.1016/j.sftr.2024.100283',
    excerpt: 'Standard credit risk models assume that the probability distribution of future costs is known or can be estimated with reasonable precision. Yet carbon pricing introduces a form of Knightian uncertainty: the future path of carbon costs depends on political decisions, technological breakthroughs, and international coordination \u2014 factors for which probabilities cannot be meaningfully assigned. This paper develops a dynamic behavioural credit risk model that relaxes the standard assumption by allowing decision-makers to operate under ambiguity. The model shows that when firms face Knightian uncertainty about carbon costs, they behave more cautiously, which increases default probabilities beyond what standard models predict. This effect is especially pronounced in carbon-intensive industries, where carbon costs represent a larger share of total operating expenses.',
    writingFocus: 'Modelling financial risk under deep uncertainty about climate policy',
    vocabulary: [
      { term: 'Knightian uncertainty', phonetic: '', definition: 'A situation in which probabilities cannot be assigned to future outcomes.', example: 'Carbon pricing introduces Knightian uncertainty because future policy paths are unknown.', chinese: '\u5948\u7279\u4e0d\u786e\u5b9a\u6027' },
      { term: 'Default probability', phonetic: '', definition: 'The likelihood that a borrower will fail to meet its debt obligations.', example: 'Default probabilities increase when firms face ambiguity about future carbon costs.', chinese: '\u8fdd\u7ea6\u6982\u7387' },
      { term: 'Ambiguity', phonetic: '', definition: 'Uncertainty about which probability distribution governs future outcomes.', example: 'Decision-makers operating under ambiguity behave more cautiously.', chinese: '\u6a21\u7cca' },
      { term: 'Carbon-intensive', phonetic: '', definition: 'Characterised by high levels of greenhouse gas emissions per unit of output.', example: 'The effect is especially pronounced in carbon-intensive industries.', chinese: '\u78b3\u5bc6\u96c6\u578b' },
      { term: 'Behavioural model', phonetic: '', definition: 'A model that incorporates psychological factors such as ambiguity aversion.', example: 'The behavioural model captures how firms respond to unquantifiable policy risk.', chinese: '\u884c\u4e3a\u6a21\u578b' },
    ],
    discussionQuestions: [
      'How does Knightian uncertainty differ from standard risk in credit modelling?',
      'Why might standard credit risk models underestimate the impact of carbon pricing on firm default?',
      'What implications does this study have for financial regulators assessing systemic risk?',
    ],
    tags: 'credit-risk,carbon-pricing,uncertainty',
    translation: '标准信用风险模型假设未来成本的概率分布是已知的或可以合理精确地估计。然而，碳定价引入了一种奈特不确定性：碳成本的未来路径取决于政治决策、技术突破和国际协调——这些因素的概率无法有意义地分配。本文开发了一个动态行为信用风险模型，放宽了标准假设，允许决策者在模糊性下运作。模型表明，当企业面临碳成本的奈特不确定性时，它们的行为会更加谨慎，这提高了超出标准模型预测的违约概率。这种效应在碳密集型行业中尤为显著，因为碳成本在总运营支出中占比较大。',
  },
]

