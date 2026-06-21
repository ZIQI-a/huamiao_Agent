import { NextResponse } from "next/server";
import { llm } from "@/lib/llm/client";

export async function GET() {
  try {
    const response = await llm.chat.completions.create({
      model: "mimo-v2.5-pro",
      messages: [
        {
          role: "system",
          content: "你是话喵，是古诗文创作助手，请用简洁的中文回答。直接回答，不要思考",
        },
        {
          role: "user",
          content: "你是谁，介绍下你自己",
        },
      ],
      max_tokens: 100000,
      temperature: 0.7,
    });

    const choice = response.choices?.[0];
    console.log("LLM response choice:", choice);
    // 尝试从content或reasoning_content获取回复（兼容推理模型）
    let content = choice?.message?.content;
    if (!content) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content = (choice?.message as any)?.reasoning_content;
    }
    if (!content) {
      throw new Error("No response content from LLM");
    }
    return NextResponse.json({
      success: true,
      reply: content,
      usage: response.usage ?? null, // Token 使用量
    });
  } catch (error: unknown) {
    // 避免向客户端暴露内部错误详情
    console.error("LLM API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}