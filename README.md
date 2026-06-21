# 话喵（Huamiao Agent）

话喵是一个面向中文内容创作的 AI 应用，目标是通过大模型生成古诗词、文章与风格化内容。当前仓库处于第一阶段搭建期，已经完成基础 UI、模型接入与若干测试页面，核心业务页面仍在继续完善。

## 项目定位

- 面向中文创作场景，重点是古诗词生成与文章创作。
- 基于 Next.js App Router 构建，前后端同仓开发。
- 通过 OpenAI Compatible 接口接入多家模型，目前默认走 `mimo-v2.5-pro`。

## 当前实现状态

### 已实现

- 首页与侧边栏导航框架。
- 通用页面容器与基础 UI 组件。
- 大模型基础配置与多供应商客户端封装。
- `/api/test` 基础调用测试接口。
- `/api/generate` 流式文本生成接口。
- `/test-ai`、`/test-ai/stream`、`/test-ai/chat` 调试页面。

### 未完成 / 待补齐

- `/poems` 仍是占位页面，尚未接入“古诗词生成”业务流程。
- `/articles/create` 仍是占位页面，尚未完成文章生成表单与结果页。
- 首页与侧边栏中存在 `/styles`、`/history` 导航，但对应页面当前未实现。
- 部分测试页面与接口路径仍需统一校验，正式上线前建议先收敛调试入口。

## 技术栈

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `shadcn/ui`
- `AI SDK`
- `openai` SDK（兼容多供应商）

## 目录结构

```text
src/
  app/
    api/
      generate/          # 流式生成接口
      test/              # 模型连通性测试接口
      test/chat-demo/    # 多轮对话测试接口
    articles/create/     # 文章创作页面（占位）
    poems/               # 古诗词页面（占位）
    test-ai/             # AI 调试页面
  components/
    layout/              # 布局组件
    ui/                  # 通用 UI 组件
  lib/
    config.ts            # 模型与应用配置
    llm/client.ts        # LLM 客户端封装
    utils.ts             # 工具函数
```

## 环境要求

- Node.js `>= 20`
- `pnpm`（仓库当前使用 `pnpm-lock.yaml`）

## 本地启动

```bash
pnpm install
pnpm dev
```

默认访问地址：

- 首页: [http://localhost:3000](http://localhost:3000)
- AI 测试: [http://localhost:3000/test-ai](http://localhost:3000/test-ai)
- 流式测试: [http://localhost:3000/test-ai/stream](http://localhost:3000/test-ai/stream)
- 对话测试: [http://localhost:3000/test-ai/chat](http://localhost:3000/test-ai/chat)

## 环境变量

项目通过 `.env.local` 注入模型密钥，常用变量如下：

```bash
DEEPSEEK_API_KEY=
QWEN_API_KEY=
MIMO_API_KEY=
LLM_MODEL=mimo-v2.5-pro
```

说明：

- `LLM_MODEL` 用于切换默认模型名。
- `src/lib/llm/client.ts` 中已预置 DeepSeek、Qwen、Mimo 三个客户端。
- `.env*` 已被 `.gitignore` 忽略，不应提交真实密钥。

## 接口说明

### `GET /api/test`

用于验证模型是否可用，返回一段固定问答结果与 token 使用量。

### `POST /api/generate`

流式文本生成接口，请求体示例：

```json
{
  "prompt": "请围绕春雨写一段古风文字",
  "system": "你是一个古典文学助手，请用中文作答。"
}
```

### `POST /api/test/chat-demo`

测试多轮对话能力，请求体示例：

```json
{
  "messages": [
    { "role": "user", "content": "介绍一下你自己" }
  ]
}
```

## 开发约束

- 文档描述必须和代码现状一致，未完成能力要明确标注“占位”或“待实现”。
- 新增模型接入时，优先复用 `src/lib/config.ts` 与 `src/lib/llm/client.ts`，不要把模型名和密钥读取逻辑散落到页面里。
- 新增页面前先确认导航是否需要同步更新，避免出现可点击但不存在的路由。
- 涉及 AI 输出的页面，必须补充异常态、空态和加载态。
- 代码中应保留必要注释，尤其是函数职责、关键流程和非直观逻辑。

## 质量检查

```bash
pnpm lint
pnpm build
```

当前仓库没有完善的自动化测试；在补业务功能时，建议至少补齐：

- 接口输入校验测试
- 关键页面交互测试
- 模型调用失败时的降级验证

## 后续建议

1. 先完成古诗词生成主流程，围绕 `主题 -> 风格/体裁 -> 生成 -> 注释/赏析` 建立最小闭环。
2. 将测试页能力沉淀到正式业务页，避免调试逻辑长期暴露在主导航之外。
3. 增加 `.env.example`、请求参数类型定义与统一错误处理，降低协作成本。
