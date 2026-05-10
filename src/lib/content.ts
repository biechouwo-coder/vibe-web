import { prisma } from './prisma'
import {
  getShanghaiDate,
  getShanghaiDateSeed,
  getShanghaiWeekOfYear,
  getShanghaiDayOfYear,
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

const vocabularyContent = [
  {
    title: 'Carbon Market Fundamentals',
    content: `## 1. Carbon Pricing /ˈkɑːbən ˈpraɪsɪŋ/ (碳定价)
**Definition:** A policy tool that sets a price on greenhouse gas emissions to incentivize reduction.
**Example:** "The EU Emissions Trading System is the world's largest carbon pricing mechanism."
**Chinese:** 碳定价是一种对温室气体排放设定价格以激励减排的政策工具。

## 2. Carbon Credit /ˈkɑːbən ˈkredɪt/ (碳信用)
**Definition:** A permit representing the right to emit one tonne of CO₂, often tradeable in carbon markets.
**Example:** "One carbon credit equals one tonne of CO₂ equivalent reduced or removed from the atmosphere."
**Chinese:** 碳信用是一种代表排放一吨CO₂权利的许可，可在碳市场中交易。

## 3. Carbon Footprint /ˈkɑːbən ˈfʊtprɪnt/ (碳足迹)
**Definition:** The total amount of greenhouse gases produced by an individual, organization, or product.
**Example:** "Many companies are now required to disclose their carbon footprint in annual reports."
**Chinese:** 碳足迹是指个人、组织或产品所产生的温室气体总量。

## 4. Net Zero /net ˈzɪroʊ/ (净零排放)
**Definition:** Balancing the amount of greenhouse gases emitted with an equivalent amount removed.
**Example:** "China has pledged to achieve carbon neutrality by 2060, which is a form of net zero commitment."
**Chinese:** 净零排放是指将排放的温室气体量与等量的移除量相平衡。

## 5. Greenwashing /ˈɡriːnwɒʃɪŋ/ (漂绿)
**Definition:** Misleading claims about environmental benefits of a product or practice.
**Example:** "Investors are increasingly wary of greenwashing in ESG reporting."
**Chinese:** 漂绿是指对产品或实践的环境效益进行误导性宣传。`,
    tags: 'vocabulary,carbon,green-finance',
  },
  {
    title: 'Green Finance Essentials',
    content: `## 1. Green Bond /ɡriːn bɒnd/ (绿色债券)
**Definition:** A fixed-income instrument specifically earmarked to raise money for climate and environmental projects.
**Example:** "The World Bank issued the first green bond in 2008 to support climate projects."
**Chinese:** 绿色债券是一种专门为气候和环境项目筹集资金的固定收益工具。

## 2. ESG Integration /iː es dʒiː ˌɪntɪˈɡreɪʃən/ (ESG整合)
**Definition:** The systematic inclusion of environmental, social, and governance factors into investment decisions.
**Example:** "ESG integration has become mainstream among institutional investors."
**Chinese:** ESG整合是指系统性地将环境、社会和治理因素纳入投资决策。

## 3. Climate Risk /ˈklaɪmət rɪsk/ (气候风险)
**Definition:** Financial risks posed by climate change, including physical risks and transition risks.
**Example:** "Banks are now required to stress-test their portfolios against climate risk scenarios."
**Chinese:** 气候风险是气候变化带来的金融风险，包括物理风险和转型风险。

## 4. Carbon Tax /ˈkɑːbən tæks/ (碳税)
**Definition:** A tax imposed on the burning of carbon-based fuels, proportional to carbon content.
**Example:** "Sweden has one of the highest carbon taxes at approximately €120 per tonne of CO₂."
**Chinese:** 碳税是对含碳燃料燃烧征收的税，与碳含量成比例。

## 5. Sustainable Finance /səˈsteɪnəbl ˈfaɪnæns/ (可持续金融)
**Definition:** Financial services that integrate environmental, social, and governance criteria into business decisions.
**Example:** "The EU Sustainable Finance Disclosure Regulation requires funds to disclose their sustainability risks."
**Chinese:** 可持续金融是将ESG标准融入商业决策的金融服务。`,
    tags: 'vocabulary,finance,green-finance',
  },
  {
    title: 'Academic Research Terms',
    content: `## 1. Methodology /ˌmeθəˈdɒlədʒi/ (方法论)
**Definition:** A systematic approach used to conduct research, including data collection and analysis methods.
**Example:** "The paper employs a difference-in-differences methodology to estimate the policy impact."
**Chinese:** 方法论是进行研究时使用的系统性方法，包括数据收集和分析方法。

## 2. Endogeneity /ˌendəʊdʒəˈniːəti/ (内生性)
**Definition:** A situation where an explanatory variable is correlated with the error term, biasing estimates.
**Example:** "The authors use instrumental variables to address endogeneity concerns."
**Chinese:** 内生性是解释变量与误差项相关导致估计偏误的情况。

## 3. Panel Data /ˈpænəl ˈdeɪtə/ (面板数据)
**Definition:** Data that tracks the same subjects over multiple time periods.
**Example:** "Panel data allows researchers to control for unobserved heterogeneity."
**Chinese:** 面板数据是追踪同一主体在多个时间周期内变化的数据。

## 4. Causal Inference /ˈkɔːzəl ˈɪnfərəns/ (因果推断)
**Definition:** The process of determining whether a cause-effect relationship exists.
**Example:** "Randomized controlled trials are considered the gold standard for causal inference."
**Chinese:** 因果推断是确定因果关系是否存在的过程。

## 5. External Validity /ɪkˈstɜːrnl vəˈlɪdəti/ (外部效度)
**Definition:** The extent to which research findings can be generalized to other contexts.
**Example:** "While the study has strong internal validity, its external validity is limited by the small sample size."
**Chinese:** 外部效度是研究结论能被推广到其他情境的程度。`,
    tags: 'vocabulary,academic,research',
  },
  // ── HKUST-GZ CNGF Course-Specific Vocabulary ──
  {
    title: 'Carbon Pricing & Trading',
    content: '## 1. Emissions Trading System /ɪˈmɪʃənz ˈtreɪdɪŋ ˈsɪstəm/ (碳排放交易体系)\n**Definition:** A market-based approach to controlling pollution by providing economic incentives for reducing emissions.\n**Example:** "The EU ETS is the world\'s first and largest carbon market, covering around 40% of EU emissions."\n**Chinese:** 碳排放交易体系是一种基于市场的方法，通过提供经济激励来控制污染。\n\n## 2. Carbon Allowance /ˈkɑːbən əˈlaʊəns/ (碳配额)\n**Definition:** A permit that authorizes the holder to emit a specified amount of CO₂ or equivalent greenhouse gases.\n**Example:** "The price of carbon allowances in the EU ETS has fluctuated significantly over the past decade."\n**Chinese:** 碳配额是一种许可，授权持有者排放特定数量的CO₂或等量温室气体。\n\n## 3. Offset Mechanism /ˈɒfset ˈmekənɪzəm/ (抵消机制)\n**Definition:** A system that allows emitters to compensate for their emissions by funding emission reduction projects elsewhere.\n**Example:** "The Clean Development Mechanism under the Kyoto Protocol is a well-known offset mechanism."\n**Chinese:** 抵消机制是一种允许排放者通过资助其他地方的减排项目来补偿自身排放的系统。\n\n## 4. Climate Finance /ˈklaɪmət ˈfaɪnæns/ (气候金融)\n**Definition:** Local, national, or transnational financing drawn from public, private and alternative sources to support climate action.\n**Example:** "Developed countries pledged $100 billion annually in climate finance to support developing nations."\n**Chinese:** 气候金融是指来自公共、私人和替代来源的本地、国家或跨国融资，用于支持气候行动。\n\n## 5. Carbon Leakage /ˈkɑːbən ˈliːkɪdʒ/ (碳泄漏)\n**Definition:** The relocation of emissions-intensive production to regions with less stringent climate policies.\n**Example:** "Carbon leakage undermines the environmental effectiveness of unilateral climate policies."\n**Chinese:** 碳泄漏是指排放密集型生产向气候政策较为宽松的地区转移。',
    tags: 'vocabulary,cnf,core,carbon,trading',
  },
  {
    title: 'Carbon Accounting & Management',
    content: '## 1. Carbon Footprint /ˈkɑːbən ˈfʊtprɪnt/ (碳足迹)\n**Definition:** The total amount of greenhouse gases produced directly and indirectly by an individual, organization, or product.\n**Example:** "Scope 1, 2, and 3 emissions together constitute an organization\'s full carbon footprint."\n**Chinese:** 碳足迹是指个人、组织或产品直接和间接产生的温室气体总量。\n\n## 2. Scope Emissions /skoʊp ɪˈmɪʃənz/ (范围排放)\n**Definition:** A classification system dividing emissions into Scope 1 (direct), Scope 2 (energy indirect), and Scope 3 (value chain indirect).\n**Example:** "Scope 3 emissions often account for the largest share of a company\'s total carbon footprint."\n**Chinese:** 范围排放是一种将排放分为范围1（直接）、范围2（能源间接）和范围3（价值链间接）的分类体系。\n\n## 3. Life Cycle Assessment /laɪf ˈsaɪkl əˈsesmənt/ (生命周期评估)\n**Definition:** A methodology for assessing environmental impacts associated with all stages of a product\'s life.\n**Example:** "LCA helps companies identify hotspots in their supply chain for targeted emission reductions."\n**Chinese:** 生命周期评估是一种评估产品全生命周期各阶段环境影响的系统性方法。\n\n## 4. Science-Based Target /ˈsaɪəns beɪst ˈtɑːɡɪt/ (科学碳目标)\n**Definition:** Emission reduction targets aligned with the level of decarbonization required by the Paris Agreement.\n**Example:** "Over 4,000 companies have committed to science-based targets through the SBTi initiative."\n**Chinese:** 科学碳目标是与《巴黎协定》要求的脱碳水平保持一致的减排目标。\n\n## 5. Marginal Abatement Cost /ˈmɑːdʒɪnəl əˈbeɪtmənt kɒst/ (边际减排成本)\n**Definition:** The cost of reducing one additional unit of emissions, used to compare cost-effectiveness of different mitigation options.\n**Example:** "The marginal abatement cost curve helps policymakers identify the most cost-effective emission reduction strategies."\n**Chinese:** 边际减排成本是减少一单位额外排放的成本，用于比较不同减排方案的成本效益。',
    tags: 'vocabulary,cnf,core,accounting',
  },
  {
    title: 'ESG & Sustainable Investing',
    content: '## 1. ESG Integration /iː es dʒiː ˌɪntɪˈɡreɪʃən/ (ESG整合)\n**Definition:** The systematic inclusion of environmental, social, and governance factors into investment analysis and decisions.\n**Example:** "ESG integration has moved from niche to mainstream among institutional investors globally."\n**Chinese:** ESG整合是指系统性地将环境、社会和治理因素纳入投资分析和决策的过程。\n\n## 2. Impact Investing /ˈɪmpækt ɪnˈvestɪŋ/ (影响力投资)\n**Definition:** Investments made with the intention to generate positive, measurable social and environmental impact alongside financial returns.\n**Example:** "Impact investing requires measurable outcomes aligned with the UN Sustainable Development Goals."\n**Chinese:** 影响力投资旨在在获得财务回报的同时，产生积极、可衡量的社会和环境影响的投资。\n\n## 3. Green Bond /ɡriːn bɒnd/ (绿色债券)\n**Definition:** A fixed-income instrument specifically earmarked to raise money for climate and environmental projects.\n**Example:** "The global green bond issuance surpassed $500 billion annually for the first time in 2024."\n**Chinese:** 绿色债券是一种专门为气候和环境项目筹集资金的固定收益工具。\n\n## 4. Transition Risk /trænˈzɪʃən rɪsk/ (转型风险)\n**Definition:** Financial risks arising from the transition to a low-carbon economy, including policy, legal, technology, and market changes.\n**Example:** "Asset managers are increasingly stress-testing portfolios against transition risk scenarios."\n**Chinese:** 转型风险是向低碳经济转型过程中产生的金融风险，包括政策、法律、技术和市场变化。\n\n## 5. Double Materiality /ˈdʌbəl məˌtɪriˈæləti/ (双重重要性)\n**Definition:** The concept that companies should report both how sustainability issues affect their value and how their activities affect society and the environment.\n**Example:** "The EU CSRD mandates double materiality assessment for all large companies operating in Europe."\n**Chinese:** 双重重要性是指公司应同时报告可持续问题如何影响其价值以及其活动如何影响社会和环境的理念。',
    tags: 'vocabulary,cnf,core,esg',
  },
  {
    title: 'Climate Science & Policy',
    content: '## 1. Tipping Point /ˈtɪpɪŋ pɔɪnt/ (临界点)\n**Definition:** A threshold beyond which a system undergoes irreversible, self-reinforcing change, often with cascading effects.\n**Example:** "Scientists warn that the Amazon rainforest may be approaching a critical tipping point."\n**Chinese:** 临界点是指系统超出后会发生不可逆、自我强化变化的阈值，通常具有级联效应。\n\n## 2. Nationally Determined Contribution /ˈnæʃənəli dɪˈtɜːmɪnd ˌkɒntrɪˈbjuːʃən/ (国家自主贡献)\n**Definition:** Climate action plans submitted by each country under the Paris Agreement, outlining emission reduction targets and strategies.\n**Example:** "The next round of NDCs due in 2025 will determine whether the world can limit warming to 1.5°C."\n**Chinese:** 国家自主贡献是各国根据《巴黎协定》提交的气候行动计划，概述减排目标和策略。\n\n## 3. Carbon Budget /ˈkɑːbən ˈbʌdʒɪt/ (碳预算)\n**Definition:** The total cumulative CO₂ emissions allowed to keep global warming below a given temperature threshold.\n**Example:** "At current emission rates, the remaining carbon budget for 1.5°C will be exhausted within a decade."\n**Chinese:** 碳预算是为将全球变暖控制在某一温度阈值以下而允许的累计CO₂排放总量。\n\n## 4. Net Zero Pathway /net ˈzɪroʊ ˈpɑːθweɪ/ (净零路径)\n**Definition:** A trajectory of emission reductions leading to net zero CO₂ emissions by a specified target year.\n**Example:** "The IEA\'s Net Zero by 2050 pathway requires unprecedented deployment of clean energy technologies."\n**Chinese:** 净零路径是到指定目标年实现净零CO₂排放的减排轨迹。\n\n## 5. Climate Adaptation /ˈklaɪmət ˌædæpˈteɪʃən/ (气候适应)\n**Definition:** The process of adjusting to actual or expected climate change effects to moderate harm or exploit beneficial opportunities.\n**Example:** "Climate adaptation financing remains significantly underfunded compared to mitigation efforts."\n**Chinese:** 气候适应是调整以适应实际或预期气候变化影响的过程，以减轻损害或利用有利机会。',
    tags: 'vocabulary,cnf,core,climate,policy',
  },
  {
    title: 'Energy Economics',
    content: '## 1. Levelized Cost of Energy /ˈlevəlaɪzd kɒst ɒv ˈenədʒi/ (平准化能源成本)\n**Definition:** The average net present cost of electricity generation over a plant\'s lifetime, used to compare different energy sources.\n**Example:** "The levelized cost of solar PV has fallen by 90% over the past decade, making it cheaper than coal."\n**Chinese:** 平准化能源成本是发电厂在其生命周期内发电的平均净现值成本，用于比较不同能源来源。\n\n## 2. Energy Intensity /ˈenədʒi ɪnˈtensəti/ (能源强度)\n**Definition:** A measure of the energy consumed per unit of economic output, typically GDP.\n**Example:** "China has committed to reducing its energy intensity by 13.5% during the 14th Five-Year Plan period."\n**Chinese:** 能源强度是单位经济产出所消耗的能源量，通常以GDP衡量。\n\n## 3. Green Premium /ɡriːn ˈpriːmiəm/ (绿色溢价)\n**Definition:** The additional cost of choosing a clean technology over a conventional emitting alternative.\n**Example:** "Bill Gates argues that innovation should focus on reducing the green premium to zero."\n**Chinese:** 绿色溢价是选择清洁技术而非传统排放技术所产生的额外成本。\n\n## 4. Carbon Capture Utilization and Storage /ˈkɑːbən ˈkæptʃər ˌjuːtɪlaɪˈzeɪʃən ænd ˈstɔːrɪdʒ/ (碳捕集利用与封存)\n**Definition:** Technologies that capture CO₂ from emission sources or the atmosphere for utilization or permanent storage.\n**Example:** "CCUS is considered essential for decarbonizing hard-to-abate sectors like cement and steel."\n**Chinese:** 碳捕集利用与封存是从排放源或大气中捕集CO₂进行利用或永久封存的技术。\n\n## 5. Renewable Portfolio Standard /rɪˈnjuːəbəl pɔːrtˈfoʊlioʊ ˈstændərd/ (可再生能源配额标准)\n**Definition:** A regulatory mandate requiring electricity providers to source a specified percentage of power from renewable sources.\n**Example:** "Many US states have implemented renewable portfolio standards with targets reaching 100% by 2050."\n**Chinese:** 可再生能源配额标准是一项监管要求，要求电力供应商从可再生能源中获取指定比例的电力。',
    tags: 'vocabulary,cnf,core,energy',
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
- Market failure /ˈmɑːrkɪt ˈfeɪljər/: 市场失灵
- Irreversible impacts /ˌɪrɪˈvɜːrsəbl ˈɪmpækts/: 不可逆影响
- Business-as-usual /ˈbɪznəs əz ˈjuːʒuəl/: 一切照旧（情景）
- Stabilization /ˌsteɪbɪlaɪˈzeɪʃən/: 稳定化
- Ambitious /æmˈbɪʃəs/: 有雄心的

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
- Cumulative /ˈkjuːmjʊleɪtɪv/: 累计的
- Green loan balance /ɡriːn loʊn ˈbæləns/: 绿色贷款余额
- Comprehensive policy framework /ˌkɒmprɪˈhensɪv ˈpɒləsi ˈfreɪmwɜːrk/: 综合政策框架
- Transition risks /trænˈzɪʃən rɪsks/: 转型风险
- Carbon derivatives /ˈkɑːbən dɪˈrɪvətɪvz/: 碳衍生品

**Discussion Questions:**
1. What are the key components of China's green finance policy framework?
2. Which of the four challenges do you think is most critical and why?
3. How could China's experience apply to other emerging economies?`,
    tags: 'passage,china,green-finance',
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
    update: {}, // no-op: content is static, keep what's already stored
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

export async function getDailyVocabulary() {
  const date = getShanghaiDate()
  const item = pickBySeed(vocabularyContent, getShanghaiWeekOfYear())
  return upsertDailyContent(date, 'vocabulary', {
    title: item.title,
    content: item.content,
    tags: item.tags,
  })
}

export async function getDailyPassage() {
  const date = getShanghaiDate()
  const passageIndex = Math.floor(getShanghaiDayOfYear() / 3)
  const item = pickBySeed(passageContent, passageIndex)
  return upsertDailyContent(date, 'passage', {
    title: item.title,
    content: item.content,
    tags: item.tags,
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
