import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { config } from "@/lib/config";

// 创建兼容 OpenAI 接口的提供者。
// Mimo 当前不支持 AI SDK 默认使用的 responses API，因此这里显式走 chat API。
const openai = createOpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

export async function POST(req: Request) {
  try {
    // 解析请求体
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { prompt, system } = body;

    // 验证必填字段
    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'prompt' field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 使用配置中的模型名称
    const model = config.llm.model;

    const result = streamText({
      // 显式使用 chat 接口，避免请求到 /responses 导致 404。
      model: openai.chat(model),
      system: system || "你是一个有帮助的AI助手，请用中文回答。",
      prompt,
      maxOutputTokens: 10000,
      temperature: 0.7,
    });

    // toTextStreamResponse() 把流式结果转为标准响应
    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("Generate API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
