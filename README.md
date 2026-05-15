# vibe.web — 个人学习与计划助手

> 专为 HKUST-GZ 碳中和与绿色金融硕士设计的个人网站，融合**每日英语学习**与**每日计划管理**。

🌐 线上地址：https://vibe-web-production-1f28.up.railway.app（建议手机电脑都收藏这个链接）

---

## 📖 这是什么？

vibe.web 是一个轻量级的个人效率工具，解决两件事：

1. **英语学习** — 每天推送日常对话 + 碳中和/绿色金融专业英语（词汇 + 文献段落）
2. **每日计划** — 追踪每日任务，用连胜机制给你正反馈

所有学习内容可一键推送到 **Notion**，在 Notion 中学习。

---

## 🚀 功能速览

### 🏠 首页 Dashboard
- 今日日期 + 学习桌面标题
- Today's Focus — 每日重点阅读文献（navy 加粗左边框）
- 任务完成进度条（今日完成 X/Y）
- 连续学习天数（Streak）展示
- 今日学习内容预览（对话 / 词汇 / 文献）
- 今日任务清单（可勾选完成）

### 📚 Learn — 英语学习
三种内容类型，每日自动轮换：

| 类型 | 内容 | 更新频率 |
|------|------|----------|
| 💬 日常对话 | 港科广校园场景（课堂讨论、小组项目、展示汇报） | 每日 |
| 📝 专业词汇 | 碳市场、绿色金融、ESG、学术研究术语 | 每日 |
| 📄 文献段落 | 经济学人/HBR 风格的专业文章 + 讨论问题 | 每 3 天 |

每篇内容包括：
- 英文原文
- 关键词汇表（中英对照）
- 讨论问题（帮助思考）
- 一键推送到 Notion 按钮

### ✅ Plans — 每日计划
- ➕ 添加今日任务
- ☑️ 勾选完成任务（🎉 纸屑动画反馈）
- 🔥 连胜 Streak 追踪（连续完成任务天数）
- 🏆 成就徽章（3天🔥 / 7天⭐ / 14天👑 / 30天🏆）
- 📊 历史统计（热力图 + 周/月总结）
- 🤖 学习内容自动生成为今日任务（无需手动添加）

### 🏠 Home — 今日布局
按优先级从上到下：
1. **Today's Focus** — 今日重点阅读文章（navy 左边框高亮），附带 Open Reading 快捷入口
2. **Progress & Streak** — 任务进度条 + 连续学习天数
3. **Today's Tasks** — 今日任务清单（可勾选完成，全部完成触发纸屑动画）
4. **Learning Queue** — 三个学习卡片（Speaking / Vocabulary / Reading）

### 💬 对话知识卡片
点 **Read full →** 进入详情页后可看到：
- **对话气泡** — 教授/同学气泡靠左，你的气泡靠右（navy 强调色）
- **词汇卡片** — 带 IPA 国际音标 + 中英释义双列展示
- **全文翻译** — 对照阅读区域

### 🃏 词汇卡片切换
词汇详情页采用**卡片式浏览**：
- 每张卡片显示一个词汇（术语 → [音标] → 定义 → Example → 中文）
- ◀ ▶ 按钮 + 圆点进度指示器切换
- 🌀 弹性弹簧切换动画

### 📝 词汇音标
所有词汇内容（对话/词汇专题/文献）均标注 **IPA 国际音标**，方便发音学习。

### 📚 专业词汇覆盖
基于港科广 CNGF 硕士课程定制的 5 套词汇专题：
`Carbon Pricing & Trading` · `Carbon Accounting` · `ESG Investing` · `Climate Science & Policy` · `Energy Economics`

### ⚙️ Settings — 设置
- **Appearance** — Light / Dark / System 三选一主题
- **Notion Integration** — 配置 Token + 数据库 ID，启用/禁用自动推送
- **About** — 应用版本及介绍

---

## 🔗 Notion 集成

### 前置条件
1. 有一个 Notion 账号
2. 创建两个 Notion Database：

**英语学习 Database**：
| 属性名 | 类型 | 说明 |
|--------|------|------|
| Date | Date | 日期 |
| Type | Select | conversation / vocabulary / passage |
| Title | Title | 标题 |
| Tags | Multi-select | 标签 |
| Status | Select | ready / studying / reviewed |

**每日计划 Database**：
| 属性名 | 类型 | 说明 |
|--------|------|------|
| Date | Date | 日期 |
| Task | Title | 任务名称 |
| Status | Select | pending / completed |
| CompletedAt | Date | 完成时间 |

### 配置步骤
1. 访问 https://www.notion.so/profile/integrations
2. 创建新的 Integration，获取 Token
3. 在 Notion 中创建上述两个 Database
4. 每个 Database 点击右上角 `···` → `Add connections` → 选择你的 Integration
5. 从 Database URL 中复制 ID（32位字符串）
6. 在 vibe.web → Settings 页面填入 Token 和 DB ID

---

## 💻 本地开发

### 环境要求
- Node.js ≥ 18
- npm 或 yarn

### 快速开始

```bash
# 克隆项目
git clone https://github.com/biechouwo-coder/vibe-web.git
cd vibe-web

# 安装依赖
npm install

# 初始化数据库
npx prisma generate
npx prisma db push

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000

### 环境变量

创建 `.env.local`：

```env
DATABASE_URL="file:./dev.db"

# Notion（可选）
NOTION_INTEGRATION_TOKEN=ntn_xxx
NOTION_ENGLISH_DB_ID=xxx
NOTION_PLANS_DB_ID=xxx

# Anthropic（可选，AI 内容生成用）
ANTHROPIC_API_KEY=sk-ant-xxx
```

---

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** (App Router) | 框架 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS 4** | 样式 |
| **Framer Motion** | 动画 |
| **Prisma** | ORM |
| **SQLite** | 数据库（本地开发） |
| **@notionhq/client** | Notion API |
| **Railway** | 云部署 |

---

## 📁 项目结构

```
src/
├── app/                    # 页面路由
│   ├── page.tsx            # 首页 Dashboard
│   ├── learn/              # 英语学习
│   ├── plans/              # 每日计划
│   └── settings/           # 设置
├── components/
│   ├── layout/             # 导航栏、进度条
│   ├── learn/              # 学习卡片
│   ├── plans/              # 任务组件
│   └── ui/                 # 动画、徽章、加载
├── actions/
│   ├── learn.ts            # 学习相关 Server Actions
│   └── plans.ts            # 计划相关 Server Actions
└── lib/
    ├── prisma.ts           # Prisma 客户端
    ├── notion.ts           # Notion API 封装
    └── content.ts          # 学习内容库
```

---

## 🗺️ 后续规划

- [x] **暗色/亮色模式** — 已支持三种主题：Light / Dark / System
- [ ] **AI 内容生成** — 接入 Claude API 每日自动生成个性化英语内容
- [ ] **PostgreSQL 迁移** — 用 Railway 内置 PostgreSQL 替代 SQLite，数据持久化
- [ ] **定时推送** — 每天自动推送到 Notion（无需手动点击）
- [ ] **自定义学习内容** — 用户可上传自己的学习材料

---

*Built with Next.js · Deployed on Railway · ☕ powered by caffeine and curiosity*
