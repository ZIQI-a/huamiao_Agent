# 话喵（Huamiao Agent）

话喵是一个面向中文内容创作的 AI 应用，基于大模型生成古诗词、文章与风格化内容。核心业务流程已闭环，支持文章创作、古诗词生成、风格文库分析与历史记录管理。

## 项目定位

- 面向中文创作场景，重点是古诗词生成与文章创作。
- 基于 Next.js App Router 构建，前后端同仓开发。
- 通过 OpenAI Compatible 接口接入多家模型，具体模型通过环境变量配置。
- 使用 SQLite + Drizzle ORM 做本地持久化，RAG 向量检索支持风格仿写。

## 技术栈

- `Next.js 16` + `React 19`
- `TypeScript`
- `Tailwind CSS 4` + `shadcn/ui`
- `Vercel AI SDK`（流式生成 + 结构化输出）
- `Drizzle ORM` + `SQLite`（better-sqlite3）
- `LangChain` + `MemoryVectorStore`（RAG 向量检索）
- `OpenAI SDK`（兼容多供应商）

## 目录结构

```text
src/
  app/
    page.tsx             # 产品宣传页（/）
    layout.tsx           # 根布局（字体、ThemeProvider）
    globals.css          # 全局样式 + 宣传页动画
    (app)/               # 路由组：带侧边栏的应用页面
      layout.tsx         # 应用布局（Sidebar + main）
      home/page.tsx      # 功能入口页（/home）
      articles/create/   # 文章创作页
      poems/             # 古诗词生成页
      styles/            # 风格文库页
      history/           # 历史记录页
      test-ai/           # AI 调试页面
    api/
      articles/
        generate/        # 文章生成（流式）
        imitate/         # 风格仿写（RAG + 流式）
        [id]/            # 文章删除
        [id]/favorite/   # 收藏切换
      poems/
        generate/        # 古诗词生成（流式）
        [id]/            # 诗词删除
      styles/
        upload/          # 风格文库上传
        analyze/         # 风格分析（结构化输出）
        [id]/            # 风格删除
      history/           # 历史记录查询
      generate/          # 通用流式生成
      chat-stream/       # 多轮对话
      test/              # 模型连通性测试
  components/
    layout/              # sidebar、page-container
    ui/                  # shadcn/ui 组件
  lib/
    config.ts            # 模型与应用配置
    llm/client.ts        # 多供应商 LLM 客户端
    prompts/             # 文章、诗词提示词模板
    db/                  # Drizzle schema、数据库操作
    rag/                 # 向量嵌入与检索
    export/              # Markdown 导出工具
    utils.ts             # 通用工具函数
```

## 环境要求

- Node.js `>= 20`
- `pnpm`

## 本地启动

```bash
pnpm install
pnpm dev
```

首次运行需初始化数据库：

```bash
pnpm db:push
```

## 环境变量

项目通过 `.env.local` 注入密钥，`.env*` 已被 `.gitignore` 忽略。

```bash
# LLM 供应商（三选一，通过 LLM_PROVIDER 切换）
LLM_PROVIDER=mimo
LLM_MODEL=
MIMO_API_KEY=
DEEPSEEK_API_KEY=
QWEN_API_KEY=

# RAG 向量嵌入（硅基流动）
SILICONFLOW_API_KEY=
```

## 数据库

使用 SQLite（`data/huamiao.db`）+ Drizzle ORM，三张表：

- `articles` — 文章（标题、内容、风格、字数、收藏标记）
- `poems` — 诗词（主题名词、内容、类型、朝代、收藏标记）
- `styles` — 风格文库（名称、原文内容、AI 分析结果）

常用命令：

```bash
pnpm db:push        # 同步 schema 到数据库
pnpm db:generate    # 生成迁移文件
pnpm db:studio      # 打开 Drizzle Studio 可视化
```

## 功能说明

### 产品宣传页 `/`

独立的产品宣传落地页，展示话喵的核心功能、使用流程和创作演示。不含侧边栏，拥有独立导航。包含 CSS 手绘猫咪角色和交互动画。

### 功能入口 `/home`

带侧边栏的功能入口页，提供文章创作、古诗词生成、风格文库三个核心功能的快捷入口。

### 文章创作 `/articles/create`

- 自由创作：输入标题，选择风格（5 种）、详细程度（3 级）、目标字数，流式生成 Markdown 文章。
- 风格仿写：基于风格文库中的参考文章，通过 RAG 向量检索匹配风格片段，生成仿写文章。
- 支持 Markdown 导出、实时字数统计。

### 古诗词生成 `/poems`

- 输入主题名词，选择诗词类型（五言绝句/七言绝句/五言律诗/七言律诗/宋词）和朝代风格（唐/宋/魏晋）。
- 流式生成诗词正文 + 注释 + 赏析，使用专用 `PoemRenderer` 组件排版。

### 风格文库 `/styles`

- 上传 `.txt` / `.md` 文件导入参考文章。
- AI 分析写作风格（语调、用词、句式、特点、总结），结果以 JSON 存储。
- 分析结果用于文章仿写功能的向量检索。

### 历史记录 `/history`

- 分 Tab 展示已保存的文章和诗词，支持删除操作。

## 接口说明

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/articles/generate` | POST | 文章生成（流式） |
| `/api/articles/imitate` | POST | 风格仿写（RAG + 流式） |
| `/api/articles/[id]` | DELETE | 删除文章 |
| `/api/articles/[id]/favorite` | PATCH | 切换收藏 |
| `/api/poems/generate` | POST | 诗词生成（流式） |
| `/api/poems/[id]` | DELETE | 删除诗词 |
| `/api/styles` | GET | 获取风格列表 |
| `/api/styles/upload` | POST | 上传风格文件 |
| `/api/styles/analyze` | POST | AI 分析风格 |
| `/api/styles/[id]` | DELETE | 删除风格 |
| `/api/history` | GET | 获取历史记录 |
| `/api/generate` | POST | 通用流式生成 |
| `/api/chat-stream` | POST | 多轮对话 |
| `/api/test` | GET | 模型连通测试 |

## 开发约束

- 文档描述必须和代码现状一致，未完成能力要明确标注。
- 新增模型接入时，优先复用 `src/lib/config.ts` 与 `src/lib/llm/client.ts`。
- 新增页面前先确认导航是否需要同步更新。
- 涉及 AI 输出的页面，必须处理加载态、错误态、空态。
- 接口开发必须先做输入校验，再发起模型调用。
- 不要在前端暴露密钥。

## 质量检查

```bash
pnpm lint
pnpm build
```

## 后续建议

1. 增加文章/诗词详情查看页，历史列表支持点击跳转。
2. 历史记录增加搜索与筛选（按风格、收藏等）。
3. 收藏功能增加独立页面或筛选入口。
4. 列表接口增加分页支持。
5. 增加 `.env.example` 降低协作成本。
