# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (also validates types)
pnpm lint         # ESLint (flat config, eslint-config-next)
```

No test framework is configured. Run `pnpm lint` and `pnpm build` before completing changes.

## Architecture Overview

**Huamiao (话喵)** is a Chinese-language AI content creation platform built with Next.js 16 App Router. It generates classical poetry and articles via LLM APIs. There is no database or authentication layer.

### LLM Layer (most critical)

Two files power all LLM interactions:

- `src/lib/config.ts` — Central config. Reads `LLM_PROVIDER` env var (default: `mimo`), resolves provider and model. Exports `config.llm`.
- `src/lib/llm/client.ts` — Creates both OpenAI SDK clients (`llm`) and Vercel AI SDK providers (`llmProvider`) for three vendors: DeepSeek, Qwen/DashScope, Mimo/Xiaomi. Selected via `pickProvider()`.

**Prefer the AI SDK pattern** (`streamText` from `ai` package) over direct OpenAI SDK calls for new API routes. The AI SDK approach is the project standard per AGENTS.md.

### Prompt System

- `src/lib/prompts/articles.ts` — Article generation prompts. Exports `getArticleSystemPrompt(options)`, `ARTICLE_STYLES`, `DETAIL_LEVELS`.
- `src/lib/prompts/poem.ts` — Poetry generation prompts. Exports `getPoemSystemPrompt(options)`, `POEM_TYPES`, `DYNASTIES`.

### API Routes (`src/app/api/`)

- `/api/articles/generate` — Article streaming (fully implemented)
- `/api/generate` — Generic streaming text generation
- `/api/chat-stream` — Streaming multi-turn chat (uses `convertToModelMessages()`, `maxDuration = 30`)
- `/api/poems/generate` — **Empty stub** (needs implementation)
- `/api/test` and `/api/test/chat-demo` — LLM connectivity tests

### UI Layer

- Components in `src/components/ui/` are shadcn/ui (style: `radix-maia`, RSC-enabled, Hugeicons for icons)
- `src/components/layout/sidebar.tsx` — Responsive navigation
- `src/components/layout/page-container.tsx` — Reusable page wrapper (title + description + children)
- `src/components/ui/markdown-renderer.tsx` — React Markdown with custom styling

### Client-Side Streaming

Use `useCompletion` from `@ai-sdk/react` for single-shot streaming (articles, poems). Use `useChat` for multi-turn conversation streaming.

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

## Key Conventions

- Validate all user inputs before making LLM calls
- Never expose API keys on the frontend; all LLM calls go through server-side API routes
- Pages must handle loading, error, and empty states
- Reuse existing LLM config/client patterns in `src/lib/llm/client.ts` — don't create new client instances
- Keep documentation consistent with actual implementation status
