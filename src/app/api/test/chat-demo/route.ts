import { NextRequest, NextResponse } from "next/server";
import { llm } from "@/lib/llm/client";
import { config } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await llm.chat.completions.create({
      model: config.llm.model,
      messages: [
        {
          role: "system",
          content: "你是一个友善的AI助手，请用简洁的中文回答。",
        },
        ...messages, // 把所有历史消息传给 AI
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "请求失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}