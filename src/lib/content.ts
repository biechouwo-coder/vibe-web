import { prisma } from './prisma'

// Static content library for business & green finance English
const conversationContent = [
  {
    title: 'Introducing Yourself in Class',
    content: `**Dialogue:**

Professor: "Good morning, everyone. Let's go around and introduce yourselves. Tell us your name, your background, and what brought you to this program."

You: "Good morning. My name is [Name], and I graduated with a degree in Environmental Science. I'm particularly interested in how carbon markets can be designed to achieve both economic efficiency and real emission reductions. I chose this program because it bridges finance and sustainability."

Classmate: "That's fascinating! Do you think carbon pricing alone is sufficient?"

You: "That's a great question. Carbon pricing is essential but not sufficient on its own. We also need regulatory frameworks, green investment incentives, and technological innovation to make the transition work."

**Key Vocabulary:**
- Carbon pricing: 碳定价
- Regulatory framework: 监管框架
- Green investment: 绿色投资
- Emission reduction: 减排

**Translation:**
教授："大家早上好。我们来轮流做一下自我介绍。告诉我们你的名字、背景以及你为什么选择这个项目。"
你："早上好。我叫[名字]，本科毕业于环境科学专业。我对碳市场如何设计才能兼顾经济效率和实际减排效果特别感兴趣。我选择这个项目是因为它连接了金融和可持续发展。"
同学："太有意思了！你认为单靠碳定价就足够了吗？"
你："好问题。碳定价很关键，但单靠它还不够。我们还需要监管框架、绿色投资激励和技术创新来推动转型。"`,
    tags: 'daily,conversation,introduction',
  },
  {
    title: 'Discussing a Group Project',
    content: `**Dialogue:**

Team Member: "For our sustainable finance project, should we analyze Tesla's green bond issuance or look at China's green finance pilot zones?"

You: "I think the green finance pilot zones would be more unique. There's rich data from the five provinces, and we could compare the effectiveness of different policy approaches."

Team Member: "Good point. Let's split the work — I'll gather data on carbon emission trends, you handle the policy analysis?"

You: "Sounds good. I'll also prepare a comparative framework so we can evaluate the pilot zones consistently. Let's set a checkpoint for Friday."

**Key Vocabulary:**
- Green bond: 绿色债券
- Pilot zone: 试点区域
- Policy analysis: 政策分析
- Comparative framework: 比较框架

**Translation:**
队友："我们的可持续金融项目，应该分析特斯拉的绿色债券发行，还是研究中国绿色金融试点区？"
你："我觉得绿色金融试点区更有独特性。五个省份有丰富的数据，我们可以比较不同政策路径的效果。"
队友："说得好。我们分工吧——我收集碳排放趋势数据，你负责政策分析？"
你："没问题。我还会准备一个比较框架，这样我们能一致地评估各试点区。周五我们碰个头对一下进度。"`,
    tags: 'daily,conversation,academic',
  },
  {
    title: 'Presenting Data in Class',
    content: `**Dialogue:**

You: "Today I'd like to present my analysis of the correlation between ESG scores and corporate bond yields in the Asian market."

Professor: "Please go ahead."

You: "Using a sample of 500 corporate bonds from 2019 to 2024, I found that companies with high ESG scores tend to have 15-20 basis points lower borrowing costs. This suggests that the market is already pricing in sustainability performance."

Professor: "Interesting. Did you control for credit ratings?"

You: "Yes, I controlled for credit ratings, industry sector, and bond maturity. The ESG premium remained statistically significant at the 5% level."

**Key Vocabulary:**
- ESG scores: ESG评分
- Corporate bond yields: 公司债券收益率
- Basis points (bps): 基点
- Borrowing costs: 借贷成本
- Statistically significant: 统计显著性

**Translation:**
你："今天我向大家展示我对亚洲市场ESG评分与公司债收益率相关性的分析。"
教授："请开始。"
你："基于2019年至2024年500只公司债券的样本，我发现ESG评分高的公司其借贷成本低15-20个基点。这表明市场已经在为可持续发展表现定价。"
教授："有意思。你控制了信用评级变量吗？"
你："是的，我控制了信用评级、行业板块和债券期限。ESG溢价在5%水平上仍具统计显著性。"`,
    tags: 'daily,conversation,academic,presentation',
  },
]

const vocabularyContent = [
  {
    title: 'Carbon Market Fundamentals',
    content: `## 1. Carbon Pricing (碳定价)
**Definition:** A policy tool that sets a price on greenhouse gas emissions to incentivize reduction.
**Example:** "The EU Emissions Trading System is the world's largest carbon pricing mechanism."
**Chinese:** 碳定价是一种对温室气体排放设定价格以激励减排的政策工具。

## 2. Carbon Credit (碳信用)
**Definition:** A permit representing the right to emit one tonne of CO₂, often tradeable in carbon markets.
**Example:** "One carbon credit equals one tonne of CO₂ equivalent reduced or removed from the atmosphere."
**Chinese:** 碳信用是一种代表排放一吨CO₂权利的许可，可在碳市场中交易。

## 3. Carbon Footprint (碳足迹)
**Definition:** The total amount of greenhouse gases produced by an individual, organization, or product.
**Example:** "Many companies are now required to disclose their carbon footprint in annual reports."
**Chinese:** 碳足迹是指个人、组织或产品所产生的温室气体总量。

## 4. Net Zero (净零排放)
**Definition:** Balancing the amount of greenhouse gases emitted with an equivalent amount removed.
**Example:** "China has pledged to achieve carbon neutrality by 2060, which is a form of net zero commitment."
**Chinese:** 净零排放是指将排放的温室气体量与等量的移除量相平衡。

## 5. Greenwashing (漂绿)
**Definition:** Misleading claims about environmental benefits of a product or practice.
**Example:** "Investors are increasingly wary of greenwashing in ESG reporting."
**Chinese:** 漂绿是指对产品或实践的环境效益进行误导性宣传。`,
    tags: 'vocabulary,carbon,green-finance',
  },
  {
    title: 'Green Finance Essentials',
    content: `## 1. Green Bond (绿色债券)
**Definition:** A fixed-income instrument specifically earmarked to raise money for climate and environmental projects.
**Example:** "The World Bank issued the first green bond in 2008 to support climate projects."
**Chinese:** 绿色债券是一种专门为气候和环境项目筹集资金的固定收益工具。

## 2. ESG Integration (ESG整合)
**Definition:** The systematic inclusion of environmental, social, and governance factors into investment decisions.
**Example:** "ESG integration has become mainstream among institutional investors."
**Chinese:** ESG整合是指系统性地将环境、社会和治理因素纳入投资决策。

## 3. Climate Risk (气候风险)
**Definition:** Financial risks posed by climate change, including physical risks and transition risks.
**Example:** "Banks are now required to stress-test their portfolios against climate risk scenarios."
**Chinese:** 气候风险是气候变化带来的金融风险，包括物理风险和转型风险。

## 4. Carbon Tax (碳税)
**Definition:** A tax imposed on the burning of carbon-based fuels, proportional to carbon content.
**Example:** "Sweden has one of the highest carbon taxes at approximately €120 per tonne of CO₂."
**Chinese:** 碳税是对含碳燃料燃烧征收的税，与碳含量成比例。

## 5. Sustainable Finance (可持续金融)
**Definition:** Financial services that integrate environmental, social, and governance criteria into business decisions.
**Example:** "The EU Sustainable Finance Disclosure Regulation requires funds to disclose their sustainability risks."
**Chinese:** 可持续金融是将ESG标准融入商业决策的金融服务。`,
    tags: 'vocabulary,finance,green-finance',
  },
  {
    title: 'Academic Research Terms',
    content: `## 1. Methodology (方法论)
**Definition:** A systematic approach used to conduct research, including data collection and analysis methods.
**Example:** "The paper employs a difference-in-differences methodology to estimate the policy impact."
**Chinese:** 方法论是进行研究时使用的系统性方法，包括数据收集和分析方法。

## 2. Endogeneity (内生性)
**Definition:** A situation where an explanatory variable is correlated with the error term, biasing estimates.
**Example:** "The authors use instrumental variables to address endogeneity concerns."
**Chinese:** 内生性是解释变量与误差项相关导致估计偏误的情况。

## 3. Panel Data (面板数据)
**Definition:** Data that tracks the same subjects over multiple time periods.
**Example:** "Panel data allows researchers to control for unobserved heterogeneity."
**Chinese:** 面板数据是追踪同一主体在多个时间周期内变化的数据。

## 4. Causal Inference (因果推断)
**Definition:** The process of determining whether a cause-effect relationship exists.
**Example:** "Randomized controlled trials are considered the gold standard for causal inference."
**Chinese:** 因果推断是确定因果关系是否存在的过程。

## 5. External Validity (外部效度)
**Definition:** The extent to which research findings can be generalized to other contexts.
**Example:** "While the study has strong internal validity, its external validity is limited by the small sample size."
**Chinese:** 外部效度是研究结论能被推广到其他情境的程度。`,
    tags: 'vocabulary,academic,research',
  },
]

const passageContent = [
  {
    title: 'The Economics of Climate Change',
    content: `**Source:** Adapted from the Stern Review (2006) and recent IPCC reports

"Climate change presents a unique challenge for economics: it is the greatest and widest-ranging market failure ever seen. The scientific evidence points to increasing risks of serious, irreversible impacts from climate change associated with business-as-usual paths.

The benefits of strong, early action considerably outweigh the costs. The estimated annual cost of achieving stabilization at 550ppm CO₂e is around 1% of global GDP by 2050 — a significant but manageable figure. In contrast, the potential damages from unmitigated climate change could reach 5-20% of global GDP or more.

This asymmetry between the costs of action and the costs of inaction creates a compelling economic case for ambitious climate policy. The key lies in carbon pricing, technology policy, and removing barriers to behavioral change."

**Key Vocabulary:**
- Market failure: 市场失灵
- Irreversible impacts: 不可逆影响
- Business-as-usual: 一切照旧（情景）
- Stabilization: 稳定化
- Ambitious: 有雄心的

**Discussion Questions:**
1. Why does Stern describe climate change as a "market failure"?
2. What is the cost-benefit ratio of early climate action according to the text?
3. Do you agree that carbon pricing is the "key" solution? Why or why not?`,
    tags: 'passage,economics,climate',
  },
  {
    title: 'Green Finance in China',
    content: `**Source:** Adapted from the People's Bank of China & NGFS reports

"China has established the world's largest green finance market. By 2024, China's cumulative green bond issuance exceeded RMB 3 trillion, and the green loan balance reached over RMB 20 trillion. The country has developed a comprehensive policy framework that includes green credit guidelines, green bond standards, environmental information disclosure requirements, and a national carbon emissions trading market.

However, challenges remain. These include: (1) the need for standardized definitions of 'green' across financial products, (2) improved transparency in ESG disclosure, (3) better management of transition risks as high-carbon industries restructure, and (4) the development of a more mature carbon derivatives market.

China's experience offers valuable lessons for other emerging economies developing their green finance systems."

**Key Vocabulary:**
- Cumulative: 累计的
- Green loan balance: 绿色贷款余额
- Comprehensive policy framework: 综合政策框架
- Transition risks: 转型风险
- Carbon derivatives: 碳衍生品

**Discussion Questions:**
1. What are the key components of China's green finance policy framework?
2. Which of the four challenges do you think is most critical and why?
3. How could China's experience apply to other emerging economies?`,
    tags: 'passage,china,green-finance',
  },
]

function getDailySeed(): number {
  const today = new Date()
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
}

function pickBySeed<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function getDateOnly(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getDailyConversation() {
  const date = getDateOnly()
  const existing = await prisma.dailyContent.findFirst({
    where: { date, type: 'conversation' },
  })
  if (existing) return existing

  const seed = getDailySeed()
  const item = pickBySeed(conversationContent, seed)

  return prisma.dailyContent.create({
    data: {
      date,
      type: 'conversation',
      title: item.title,
      content: item.content,
      tags: item.tags,
    },
  })
}

export async function getDailyVocabulary() {
  const date = getDateOnly()
  const existing = await prisma.dailyContent.findFirst({
    where: { date, type: 'vocabulary' },
  })
  if (existing) return existing

  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (7 * 86400000))
  const item = pickBySeed(vocabularyContent, weekOfYear)

  return prisma.dailyContent.create({
    data: {
      date,
      type: 'vocabulary',
      title: item.title,
      content: item.content,
      tags: item.tags,
    },
  })
}

export async function getDailyPassage() {
  const date = getDateOnly()
  const existing = await prisma.dailyContent.findFirst({
    where: { date, type: 'passage' },
  })
  if (existing) return existing

  // New passage every 3 days
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const passageIndex = Math.floor(dayOfYear / 3)
  const item = pickBySeed(passageContent, passageIndex)

  return prisma.dailyContent.create({
    data: {
      date,
      type: 'passage',
      title: item.title,
      content: item.content,
      tags: item.tags,
    },
  })
}

export async function getAllTodaysContent() {
  const conversation = await getDailyConversation()
  const vocabulary = await getDailyVocabulary()
  const passage = await getDailyPassage()

  // Auto-create tasks for today's learning content
  await ensureLearningTasks(conversation, vocabulary, passage)

  return { conversation, vocabulary, passage }
}

async function ensureLearningTasks(
  conversation: { id: string; title: string },
  vocabulary: { id: string; title: string },
  passage: { id: string; title: string }
) {
  const date = getDateOnly()
  const taskDefs = [
    { title: `💬 ${conversation.title}`, contentId: conversation.id },
    { title: `📝 ${vocabulary.title}`, contentId: vocabulary.id },
    { title: `📄 ${passage.title}`, contentId: passage.id },
  ]

  const existingTasks = await prisma.task.findMany({
    where: { date },
    select: { title: true },
  })
  const existingTitles = new Set(existingTasks.map((t) => t.title))

  const newTasks = taskDefs
    .filter((t) => !existingTitles.has(t.title))
    .map((t, i) => ({
      date,
      title: t.title,
      description: 'Daily learning task',
      sortOrder: i,
      completed: false,
    }))

  if (newTasks.length > 0) {
    await prisma.task.createMany({ data: newTasks })
  }
}
