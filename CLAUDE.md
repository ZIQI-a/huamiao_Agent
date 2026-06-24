# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (also validates types)
pnpm lint         # ESLint (flat config, eslint-config-next)
pnpm db:push      # Sync schema to SQLite database
pnpm db:generate  # Generate migration files
pnpm db:studio    # Open Drizzle Studio
```

No test framework is configured. Run `pnpm lint` and `pnpm build` before completing changes.

## Architecture Overview

**Huamiao (话喵)** is a Chinese-language AI content creation platform built with Next.js 16 App Router. It generates classical poetry and articles via LLM APIs, with SQLite persistence and RAG-based style imitation.

### LLM Layer (most critical)

Two files power all LLM interactions:

- `src/lib/config.ts` — Central config. Reads `LLM_PROVIDER` env var (default: `mimo`), resolves provider and model. Exports `config.llm`.
- `src/lib/llm/client.ts` — Creates both OpenAI SDK clients (`llm`) and Vercel AI SDK providers (`llmProvider`) for three vendors: DeepSeek, Qwen/DashScope, Mimo/Xiaomi. Selected via `pickProvider()`.

**Prefer the AI SDK pattern** (`streamText` from `ai` package) over direct OpenAI SDK calls for new API routes.

### Database Layer

- `src/lib/db/schema.ts` — Drizzle ORM schema with 3 tables: `articles`, `poems`, `styles`
- `src/lib/db/operations.ts` — CRUD operations for articles and poems
- Database file: `data/huamiao.db` (SQLite)
- `src/lib/db/index.ts` — DB client initialization with WAL mode

### RAG / Vector Search

- `src/lib/rag/embeddings.ts` — OpenAI Embeddings via SiliconFlow API (`BAAI/bge-large-zh-v1.5`)
- `src/lib/rag/vectorstore.ts` — MemoryVectorStore with `splitText()`, `initVectorStore()`, `searchSimilar()`
- Used by `/api/articles/imitate` for style-imitation article generation

### Prompt System

- `src/lib/prompts/articles.ts` — Article generation prompts. Exports `getArticleSystemPrompt(options)`, `ARTICLE_STYLES`, `DETAIL_LEVELS`.
- `src/lib/prompts/poem.ts` — Poetry generation prompts. Exports `getPoemSystemPrompt(options)`, `POEM_TYPES`, `DYNASTIES`.

### API Routes (`src/app/api/`)

**Production routes:**
- `/api/articles/generate` — Article streaming generation
- `/api/articles/imitate` — Style-imitation via RAG + streaming
- `/api/articles/[id]` — Delete article
- `/api/articles/[id]/favorite` — Toggle favorite
- `/api/poems/generate` — Poem streaming generation
- `/api/poems/[id]` — Delete poem
- `/api/styles` — List styles
- `/api/styles/upload` — Upload style file
- `/api/styles/analyze` — AI style analysis (generateObject)
- `/api/styles/[id]` — Delete style
- `/api/history` — Get all articles and poems
- `/api/generate` — Generic streaming text generation
- `/api/chat-stream` — Streaming multi-turn chat

**Dev/test routes:**
- `/api/test` — LLM connectivity test
- `/api/test/chat-demo` — Multi-turn chat test

### UI Layer

- Components in `src/components/ui/` are shadcn/ui (style: `radix-maia`, RSC-enabled, Hugeicons for icons)
- `src/components/layout/sidebar.tsx` — Responsive navigation (5 routes: home, articles, poems, styles, history)
- `src/components/layout/page-container.tsx` — Reusable page wrapper
- `src/components/ui/markdown-renderer.tsx` — React Markdown with custom styling

### Client-Side Streaming

Use `useCompletion` from `@ai-sdk/react` for single-shot streaming (articles, poems). Set `streamProtocol: "text"`. Use `useChat` for multi-turn conversation streaming.

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Environment Variables (`.env.local`)

| Variable | Required | Default |
|----------|----------|---------|
| `LLM_PROVIDER` | No | `mimo` |
| `LLM_MODEL` | No | Provider default |
| `MIMO_API_KEY` | Yes (if using mimo) | — |
| `DEEPSEEK_API_KEY` | Yes (if using deepseek) | — |
| `QWEN_API_KEY` | Yes (if using qwen) | — |
| `SILICONFLOW_API_KEY` | Yes (for RAG) | — |

## Key Conventions

- Validate all user inputs before making LLM calls
- Never expose API keys on the frontend; all LLM calls go through server-side API routes
- Pages must handle loading, error, and empty states
- Reuse existing LLM config/client patterns in `src/lib/llm/client.ts`
- Database schema changes require `pnpm db:push` to apply
- Next.js 16 dynamic route params must be awaited (`params` is a Promise)
