# 开发指南

[返回项目首页](../README.md) · [使用指南](USAGE.md) · [集成配置](INTEGRATIONS.md)

## 本地准备

需要 Node.js ≥ 20.9 和 npm。项目提交了 `package-lock.json`，使用 `npm ci` 复现依赖版本。

在项目根目录创建 `.env`，已有文件则只补充配置：

```env
DATABASE_URL="file:./dev.db"
```

Prisma CLI 会读取根目录 `.env`，Next.js 也会加载它。只创建 `.env.local` 无法保证独立运行的 Prisma 命令获得数据库地址。SQLite 文件位于 `prisma/dev.db`，已被 Git 忽略。

```bash
npm ci
npx prisma db push
npm run dev
```

安装的 `postinstall` 会生成 Prisma Client；首次初始化仍需要 `prisma db push` 创建数据库表。打开 [localhost:3000](http://localhost:3000)。本地默认不填写集成密钥，可独立验证 UI 和任务功能。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | Next.js 开发服务 |
| `npm run lint` | ESLint 检查 |
| `npx tsc --noEmit` | TypeScript 类型检查 |
| `npm run build` | 按数据库配置生成 Prisma Client，再构建 Next.js |
| `npm start` | 数据库推送后启动生产服务 |
| `npx prisma studio` | 查看和管理本地数据库 |

## 数据库与部署

| 场景 | Schema | 连接方式 |
| --- | --- | --- |
| 本地 SQLite | `prisma/schema.prisma` | `file:./dev.db` |
| Railway PostgreSQL | `prisma/schema.postgres.prisma` | `postgresql://…` |

`postinstall`、`scripts/build.js` 和 `scripts/start.js` 仅在 `DATABASE_URL` 以 **`postgresql://`** 开头时选择 PostgreSQL Schema；当前检测不识别 `postgres://`。

在 Railway 设置 `DATABASE_URL`，构建使用 `npm run build`，启动使用 `npm start`。可选集成变量见 [集成配置](INTEGRATIONS.md)。应用包含数据库和服务端操作，需要 Node.js 服务，不能作为纯静态 GitHub Pages 站点运行。

当前启动脚本使用 `prisma db push --accept-data-loss`，数据库推送失败后仍会继续启动 Next.js。因此启动成功不等于数据库初始化成功；部署有现有数据时，应先备份并核对 Schema 变化。`prisma/migrations/` 中保留本地 SQLite 的迁移历史，启动流程并不运行 `migrate deploy`。

## 目录结构

```text
src/
├── app/                    页面：首页、学习、计划、设置
├── actions/                学习与计划的 Server Actions
├── components/             布局、学习卡、任务、主题与基础组件
├── lib/
│   ├── content.ts          内置材料、每日轮换与每周分段
│   ├── date.ts             Asia/Shanghai 日期工具
│   ├── notion.ts           Notion 推送与配置
│   ├── ai.ts               DeepSeek 对话生成
│   └── prisma.ts           Prisma 客户端
└── types/                  共享类型
prisma/                     SQLite / PostgreSQL Schema 与本地迁移
scripts/                    构建、启动和历史任务修复脚本
docs/                       使用、开发和集成说明
video/                      独立演示视频源文件草稿
```

`video/` 当前没有完整的 Remotion 依赖或渲染命令，所引用的截图也未随仓库提供；它不参与主应用构建。历史任务修复脚本会修改或删除重复记录，不属于初次安装步骤。

## 修改约定

- 写代码前阅读 [AGENTS.md](../AGENTS.md) 和安装版本的 `node_modules/next/dist/docs/`。
- 首页、学习和计划使用既有 Server Actions 与 Prisma 数据模型。
- 日期逻辑统一用 `src/lib/date.ts`；UI 优先复用 CSS 变量。
- 保留纸白与深蓝视觉风格，详细约束见 [DESIGN.md](../DESIGN.md)。
- 不提交 `.env*`、本地数据库、依赖目录和构建产物。
