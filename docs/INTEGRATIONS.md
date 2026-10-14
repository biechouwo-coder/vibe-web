# Notion 与 AI 配置

[返回项目首页](../README.md) · [开发指南](DEVELOPMENT.md)

两项集成均为可选，不影响基本学习与本地任务管理。

## Notion

创建学习数据库，字段名称需与下表一致：

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `Title` | Title | 学习材料标题 |
| `Date` | Date | 学习日期 |
| `Type` | Select | `conversation` / `vocabulary` / `passage` |
| `Tags` | Multi-select | 内容标签；带标签的材料会写入此字段 |

需要推送任务时，再创建计划数据库：

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `Task` | Title | 任务名称 |
| `Date` | Date | 任务日期 |
| `Status` | Select | `pending` / `completed` |
| `CompletedAt` | Date | 任务完成时间；完成记录会写入此字段 |

学习数据库的 `Status` 不是当前代码写入的必需字段。

### 配置方式

1. 在 [Notion Integrations](https://www.notion.so/profile/integrations) 创建内部集成并取得 Token。
2. 给集成授权访问目标数据库，复制数据库 ID。
3. 在 **Settings → Notion Integration** 填入 Token、数据库 ID 并启用；或在本地 `.env` / Railway 环境变量中配置：

```env
NOTION_TOKEN="your-notion-integration-token"
NOTION_ENGLISH_DB_ID="your-learning-database-id"
NOTION_PLANS_DB_ID="your-plans-database-id"
```

变量名是 **`NOTION_TOKEN`**。环境变量同时包含 Token 和学习数据库 ID 时会优先于 Settings 中保存的配置，并视为启用；计划数据库 ID 为可选。

### 推送范围

- 学习详情可手动保存，首页和 Learn 读取当天内容时会尝试自动保存。
- 已成功标记 `pushed` 的学习条目会跳过重复推送。
- 自动推送随请求触发，当前没有独立每日定时任务；后台推送失败不会阻止页面打开。
- 新建任务和完成切换会追加 Notion 页面；删除、拖动排序不向 Notion 同步，已有 Notion 页面也不被更新。

## DeepSeek

在 [DeepSeek API Keys](https://platform.deepseek.com/api_keys) 创建密钥后，可在 **Settings → AI Content Generation** 保存并启用，或配置环境变量：

```env
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

环境变量优先于数据库配置。当前模型是 `deepseek-chat`，用于生成每日口语对话；论文与词汇来自内置材料，不由此调用生成。当天已有对话会复用，调用失败时回退到静态场景。

## 配置存储

Settings 保存的集成密钥目前以明文存在应用数据库中，项目没有账号登录和用户隔离，适用于个人使用。配置文件、数据库与真实密钥不应提交到仓库。
