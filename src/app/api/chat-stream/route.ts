import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { config } from "@/lib/config";
import { llmProvider } from "@/lib/llm/client";

// 允许聊天流在服务端持续更长时间，避免长回复被过早中断。
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages?: UIMessage[] } = await req.json();

    // 对话接口要求前端传递标准 UIMessage 数组。
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'messages' field" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = streamText({
      model: llmProvider.chat(config.llm.model),
      system: "你是一个有帮助的AI助手，请用简洁的中文回答。",
      // 将前端 UIMessage 转成模型可消费的消息格式。
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 1000,
      temperature: 0.7,
    });

    // useChat 默认按 UI message stream 协议消费，这里返回对应格式。
    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat stream API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
