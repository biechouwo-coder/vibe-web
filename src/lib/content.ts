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
    title: 'Systematic review and meta-analysis of ex-post evaluations on the effectiveness of carbon pricing',
    content: '**Paper:** Systematic review and meta-analysis of ex-post evaluations on the effectiveness of carbon pricing\n**Authors:** Döbbeling-Hildebrandt, N., Miersch, K., Khanna, T.M., Bachelet, M., Kalkuhl, M., Koch, N., Edenhofer, O., Steckel, J.C.\n**Journal:** Nature Communications\n**Year:** 2024\n**DOI:** https://doi.org/10.1038/s41467-024-48512-w\n\nCarbon pricing is widely regarded as a central instrument for achieving climate mitigation targets. This study presents a systematic review and meta-analysis of 483 effect sizes from 80 causal ex-post evaluations covering 21 carbon pricing schemes worldwide.\n\nThe results show that carbon pricing has led to statistically significant emission reductions ranging from 5% to 21%. After correcting for publication bias, the average reduction effect is estimated at 4% to 15%. At least 17 of the 21 policies evaluated produced immediate and substantial emission reductions.\n\n**Key Vocabulary:**\n- Meta-analysis /ˈmetə əˈnæləsɪs/: 荟萃分析\n- Ex-post evaluation /eks poʊst ɪˌvæljuˈeɪʃən/: 事后评估\n- Publication bias /ˌpʌblɪˈkeɪʃən ˈbaɪəs/: 出版偏倚\n- Effect size /ɪˈfekt saɪz/: 效应量\n- Complementary policies /ˌkɒmplɪˈmentəri ˈpɒləsiz/: 补充政策\n\n**Discussion Questions:**\n1. Why is a meta-analysis more reliable than a single empirical study?\n2. How might publication bias affect the perceived effectiveness of carbon pricing?\n3. What policy implications follow from the finding that 17 of 21 schemes reduced emissions?',
    tags: 'passage,journal,carbon-pricing,meta-analysis',
  },
  {
    title: 'Does Pricing Carbon Mitigate Climate Change? Firm-Level Evidence from the European Union Emissions Trading System',
    content: '**Paper:** Does Pricing Carbon Mitigate Climate Change? Firm-Level Evidence from the European Union Emissions Trading System\n**Authors:** Colmer, J., Martin, R., Muûls, M., Wagner, U.\n**Journal:** The Review of Economic Studies\n**Year:** 2024\n**DOI:** https://doi.org/10.1093/restud/rdae055\n\nThe European Union Emissions Trading System (EU ETS) is the world\'s largest carbon market. This paper provides rigorous firm-level evidence that the EU ETS induced regulated manufacturing firms to reduce CO₂ emissions by 14% to 16% relative to unregulated firms, without detectable contractions in economic activity.\n\n**Key Vocabulary:**\n- Emissions Trading System /ɪˈmɪʃənz ˈtreɪdɪŋ ˈsɪstəm/: 碳排放交易体系\n- Carbon leakage /ˈkɑːbən ˈliːkɪdʒ/: 碳泄漏\n- Firm-level /fɜːrm ˈlevəl/: 企业层面\n- Administrative data /ədˈmɪnɪstrətɪv ˈdeɪtə/: 行政数据\n\n**Discussion Questions:**\n1. Why is firm-level evidence important for evaluating carbon pricing?\n2. What does the absence of carbon leakage suggest about EU ETS design?\n3. How might carbon pricing affect firms in developing economies differently?',
    tags: 'passage,journal,eu-ets,carbon-pricing',
  },
  {
    title: 'Quasi-Experimental Evidence on Carbon Pricing',
    content: '**Paper:** Quasi-Experimental Evidence on Carbon Pricing\n**Authors:** Vrolijk, K., Sato, M.\n**Journal:** The World Bank Research Observer\n**Year:** 2023\n**DOI:** https://doi.org/10.1093/wbro/lkad001\n\nCarbon pricing has been implemented in an increasing number of countries. This paper provides a comprehensive review of quasi-experimental studies examining the causal effects of carbon pricing on emissions and economic outcomes.\n\nThe review documents a growing body of evidence showing emission reductions across multiple contexts. The most robust evidence comes from studies of the EU ETS, British Columbia\'s carbon tax, and several Nordic carbon tax schemes. Effects on economic outcomes remain ambiguous.\n\n**Key Vocabulary:**\n- Quasi-experimental /ˈkweɪzaɪ ɪkˌsperɪˈmentəl/: 准实验\n- Counterfactual /ˌkaʊntərˈfæktʃuəl/: 反事实\n- Competitiveness /kəmˈpetətɪvnəs/: 竞争力\n- Causal effect /ˈkɔːzəl ɪˈfekt/: 因果效应\n\n**Discussion Questions:**\n1. Why are quasi-experimental methods preferred over correlations?\n2. What explains the ambiguous findings on economic outcomes?\n3. How could researchers improve evidence for developing countries?',
    tags: 'passage,journal,carbon-pricing,review',
  },
  {
    title: 'The new bond on the block — Designing a carbon-linked bond for sustainable investment projects',
    content: '**Paper:** The new bond on the block — Designing a carbon-linked bond for sustainable investment projects\n**Authors:** Dahlen, N., Fehrenkötter, R., Schreiter, M.\n**Journal:** The Quarterly Review of Economics and Finance\n**Year:** 2024\n**DOI:** https://doi.org/10.1016/j.qref.2024.04.010\n\nGreen bonds have emerged as a key financial instrument for funding climate projects. This paper proposes a novel instrument: the carbon-linked bond, whose coupon payments are tied to the carbon price, creating a direct financial link between environmental performance and investment returns.\n\nThe authors demonstrate how the coupon structure can be calibrated to reflect carbon price developments, providing a natural hedge for investors while creating stronger incentives for emitters to invest in emission-reducing technologies.\n\n**Key Vocabulary:**\n- Carbon-linked bond /ˈkɑːbən lɪŋkt bɒnd/: 碳联结债券\n- Coupon payment /ˈkuːpɒn ˈpeɪmənt/: 票息支付\n- Hedge /hedʒ/: 对冲\n- Calibration /ˌkælɪˈbreɪʃən/: 校准\n\n**Discussion Questions:**\n1. How does a carbon-linked bond differ from a traditional green bond?\n2. What advantage does linking coupons to carbon prices offer investors?\n3. What challenges might arise in implementing these bonds?',
    tags: 'passage,journal,green-bond,carbon-finance',
  },
  {
    title: 'Transitioning to a low-GHG economy: ESG differentiated pricing as a dynamic transition tool and its calibration',
    content: '**Paper:** Transitioning to a low-GHG economy: ESG differentiated pricing as a dynamic transition tool and its calibration\n**Authors:** Ozdemir, B.\n**Journal:** Journal of Risk Management in Financial Institutions\n**Year:** 2024\n**DOI:** https://doi.org/10.69554/CIES4502\n\nThis paper proposes a comprehensive three-layer framework for integrating ESG scores into lending pricing as a dynamic tool for steering portfolios toward a low-carbon economy. The framework incorporates borrower-level ESG scores, sector-level transition risk exposure, and a dynamic calibration mechanism.\n\n**Key Vocabulary:**\n- ESG integration /iː es dʒiː ˌɪntɪˈɡreɪʃən/: ESG整合\n- Transition risk /trænˈzɪʃən rɪsk/: 转型风险\n- Credit risk assessment /ˈkredɪt rɪsk əˈsesmənt/: 信用风险评估\n- Dynamic calibration /daɪˈnæmɪk ˌkælɪˈbreɪʃən/: 动态校准\n\n**Discussion Questions:**\n1. How might ESG-differentiated lending affect borrower behavior?\n2. What are potential drawbacks of linking loan pricing to ESG scores?\n3. How could regulators ensure fair and transparent ESG pricing?',
    tags: 'passage,journal,esg,banking',
  },
  {
    title: 'Corporate credit risk modeling under carbon pricing uncertainty: A Knightian uncertainty approach',
    content: '**Paper:** Corporate credit risk modeling under carbon pricing uncertainty: A Knightian uncertainty approach\n**Authors:** Dominique, C.M.D., Tian, Y.\n**Journal:** Sustainable Futures\n**Year:** 2024\n**DOI:** https://doi.org/10.1016/j.sftr.2024.100283\n\nAs carbon pricing expands globally, firms face increasing uncertainty about future carbon costs. This paper develops a dynamic behavioral credit risk model incorporating carbon pricing uncertainty under Knightian uncertainty. The impact is particularly pronounced for carbon-intensive industries and firms with limited ability to pass through carbon costs.\n\n**Key Vocabulary:**\n- Knightian uncertainty /ˈnaɪtiən ʌnˈsɜːrtənti/: 奈特不确定性\n- Default probability /dɪˈfɔːlt ˌprɒbəˈbɪləti/: 违约概率\n- Carbon-intensive /ˈkɑːbən ɪnˈtensɪv/: 碳密集型\n- Systemic risk /sɪˈstemɪk rɪsk/: 系统性风险\n\n**Discussion Questions:**\n1. How does carbon pricing uncertainty differ from other business risks?\n2. Why might traditional credit risk models underestimate carbon pricing impacts?\n3. What role should financial regulators play?',
    tags: 'passage,journal,credit-risk,carbon-pricing',
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

const readingContent: ReadingContentItem[] = [
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

