# AGENTS.md

## 目标

本仓库用于开发"话喵"AI 创作应用。核心业务（文章创作、古诗词生成、风格文库、历史记录）已闭环，当前阶段以功能完善和体验优化为主。

## 工作原则

- 先读代码，再下结论，不根据 README 模板或页面文案臆测能力边界。
- 文档、导航、接口、页面状态必须保持一致，禁止把未实现功能写成已上线能力。
- 输出沟通保持简洁，只说结论、依据和下一步。
- 如果需求不符合当前项目结构，先提醒风险，再给出可落地方案。

## 仓库认知

- 前端框架：`Next.js App Router`
- 语言：`TypeScript`
- UI：`Tailwind CSS 4` + `shadcn/ui`
- 模型接入：OpenAI Compatible（Vercel AI SDK 为主）
- 数据库：`SQLite` + `Drizzle ORM`，schema 在 `src/lib/db/schema.ts`，操作在 `src/lib/db/operations.ts`
- RAG 向量检索：`LangChain` + `MemoryVectorStore`，嵌入模型通过硅基流动 API 调用
- 默认模型配置入口：`src/lib/config.ts`
- 模型客户端封装：`src/lib/llm/client.ts`
- 提示词模板：`src/lib/prompts/articles.ts`、`src/lib/prompts/poem.ts`
- 主要接口目录：`src/app/api`

## 编码规范

- 为新增函数、关键流程、复杂判断补充简洁注释，确保结构清晰。
- 优先复用已有组件和配置，不重复创建新的模型接入方式。
- 非必要不要引入新依赖；引入前先确认现有栈是否已覆盖。
- 页面开发要同时处理加载态、错误态、空态。
- 接口开发必须先做输入校验，再发起模型调用。
- 不要在前端暴露密钥，不要把真实密钥写入仓库文件。

## 项目级约束

- 新增导航项前，先保证目标路由真实存在。
- 修改模型相关逻辑时，优先统一到 `config` 和 `client`，避免多个页面各自维护模型名。
- 涉及古诗词生成的提示词、字段命名、结果结构，应围绕"题目 / 正文 / 注释 / 赏析"这类稳定领域模型设计。
- 测试页是调试入口，不应长期替代正式业务页；做正式功能时应尽量沉淀复用逻辑。
- 业务页面默认不要添加解释性文案或自我说明式文案，例如"这里适合…""输出会更贴近…"这类描述；除非用户明确要求，否则页面文案应克制、直接。
- 数据库 schema 变更后，需同步执行 `pnpm db:push` 更新数据库结构。

## 流式生成规范

- 新增 API 路由优先使用 AI SDK 的 `streamText`，返回 `toTextStreamResponse()`。
- 前端单次生成用 `useCompletion`（需设置 `streamProtocol: "text"`），多轮对话用 `useChat`。
- 结构化输出用 `generateObject`（如风格分析），需提供明确的 system prompt 和 JSON 示例。

## 文档规范

- 修改功能时同步更新 `README.md`。
- README 只记录真实可运行能力，未完成功能需要明确标记。
- 若发现现有实现与文档不一致，应优先修正文档或补充说明。

## 验证要求

完成改动后，优先执行以下检查：

```bash
pnpm lint
pnpm build
```

如果没有执行验证，需要明确说明原因；如果发现现有仓库已有缺陷，也要单独指出，不要混在"已完成"描述里。
