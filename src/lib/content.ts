import { prisma } from './prisma'
import {
  getShanghaiDate,
  getShanghaiDateSeed,
} from '@/lib/date'

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
- Carbon pricing /ˈkɑːbən ˈpraɪsɪŋ/: 碳定价
- Regulatory framework /ˈreɡjələtɔːri ˈfreɪmwɜːrk/: 监管框架
- Green investment /ɡriːn ɪnˈvestmənt/: 绿色投资
- Emission reduction /ɪˈmɪʃən rɪˈdʌkʃən/: 减排

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
- Green bond /ɡriːn bɒnd/: 绿色债券
- Pilot zone /ˈpaɪlət zoʊn/: 试点区域
- Policy analysis /ˈpɒləsi əˈnæləsɪs/: 政策分析
- Comparative framework /kəmˈpærətɪv ˈfreɪmwɜːrk/: 比较框架

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
- ESG scores /iː es dʒiː skɔːrz/: ESG评分
- Corporate bond yields /ˈkɔːrpərət bɒnd jiːldz/: 公司债券收益率
- Basis points (bps) /ˈbeɪsɪs pɔɪnts/: 基点
- Borrowing costs /ˈbɒroʊɪŋ kɒsts/: 借贷成本
- Statistically significant /stəˈtɪstɪkli sɪɡˈnɪfɪkənt/: 统计显著性

**Translation:**
你："今天我向大家展示我对亚洲市场ESG评分与公司债收益率相关性的分析。"
教授："请开始。"
你："基于2019年至2024年500只公司债券的样本，我发现ESG评分高的公司其借贷成本低15-20个基点。这表明市场已经在为可持续发展表现定价。"
教授："有意思。你控制了信用评级变量吗？"
你："是的，我控制了信用评级、行业板块和债券期限。ESG溢价在5%水平上仍具统计显著性。"`,
    tags: 'daily,conversation,academic,presentation',
  },
]



function pickBySeed<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

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

export async function getDailyConversation() {
  const date = getShanghaiDate()
  const seed = getShanghaiDateSeed()
  const item = pickBySeed(conversationContent, seed)
  return upsertDailyContent(date, 'conversation', {
    title: item.title,
    content: item.content,
    tags: item.tags,
  })
}

/**
 * Select today's reading item from readingContent.
 * Uses the same date seed as conversations for consistent pairing.
 */
function getDailyReadingItem(): ReadingContentItem {
  const seed = getShanghaiDateSeed()
  return pickBySeed(readingContent, seed)
}

export async function getDailyVocabulary(reading?: ReadingContentItem) {
  const date = getShanghaiDate()
  const r = reading ?? getDailyReadingItem()
  return upsertDailyContent(date, 'vocabulary', {
    title: 'Key Terms: ' + r.title,
    content: formatVocabularyFromReading(r),
    tags: 'vocabulary,from-reading,' + r.tags,
  })
}

export async function getDailyPassage(reading?: ReadingContentItem) {
  const date = getShanghaiDate()
  const r = reading ?? getDailyReadingItem()
  return upsertDailyContent(date, 'passage', {
    title: r.title,
    content: formatReadingContent(r),
    tags: r.tags,
  })
}

export async function getAllTodaysContent() {
  const reading = getDailyReadingItem()
  const conversation = await getDailyConversation()
  const vocabulary = await getDailyVocabulary(reading)
  const passage = await getDailyPassage(reading)

  await ensureLearningTasks(conversation, vocabulary, passage)

  return { conversation, vocabulary, passage }
}

async function ensureLearningTasks(
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
    await prisma.task.upsert({
      where: { date_contentId: { date, contentId: t.contentId } },
      update: {},
      create: {
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
// In a future step, getDailyReading() will replace getDailyVocabulary()
// and getDailyPassage().

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
      { term: 'Carbon-linked bond', phonetic: '', definition: 'A bond whose coupon payments are tied to the carbon price.', example: 'A carbon-linked bond compensates investors when carbon prices rise.', chinese: '\u78b3\u8054\u7ed3\u50b6\u5238' },
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
  },
]

