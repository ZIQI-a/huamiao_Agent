import { streamText } from "ai";
import { getArticleSystemPrompt } from "@/lib/prompts/articles";
import { config } from "@/lib/config";
import { llmProvider } from "@/lib/llm/client";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: "请求体格式不正确" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { title, style, wordCount, detailLevel } = body;
    const normalizedTitle =
      typeof title === "string" ? title.trim() : "";

    if (!normalizedTitle) {
      return new Response(
        JSON.stringify({ error: "主题必须存在~" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 根据表单参数生成文章创作提示词，避免页面直接拼接复杂 prompt。
    const system = getArticleSystemPrompt({
      title: normalizedTitle,
      style: typeof style === "string" ? style : "专业",
      wordCount: typeof wordCount === "number" ? wordCount : 800,
      detailLevel: typeof detailLevel === "string" ? detailLevel : "适中",
    });

    const result = streamText({
      model: llmProvider.chat(config.llm.model),
      system,
      prompt: `请以《${normalizedTitle}》为题，创作一篇文章。`,
      maxOutputTokens: 10000,
      temperature: 0.8,
    });

    // useCompletion 消费的是纯文本流，因此接口需要返回 text stream。
    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("Article generate API error:", error);
    return new Response(
      JSON.stringify({ error: "文章生成失败，请稍后重试" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
