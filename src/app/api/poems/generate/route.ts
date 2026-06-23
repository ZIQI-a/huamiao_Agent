import { streamText } from "ai";
import { getPoemSystemPrompt } from "@/lib/prompts/poem";
import  { config } from "@/lib/config";
import { llmProvider } from "@/lib/llm/client";

export async function POST(req: Request) {
    try {
        // 获取请求数据
        const body = await req.json().catch(() => null);
        if(!body) {
            return new Response(
                JSON.stringify({ error: "请求格式不正确" }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }
        // 有body就结构变量使用；
        const { noun, type, dynasty } = body;
        if(!noun) {
            return new Response(
                JSON.stringify({ error: "名字不能为空" }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }
        const system = getPoemSystemPrompt({
            noun,
            type: type || "七言绝句",
            dynasty: dynasty || "宋代",
        })

        const result = streamText({
            model: llmProvider.chat(config.llm.model),
            system,
            prompt: `请以《${noun}》为题，创作一首诗词`,
            maxOutputTokens: 10000,
            temperature: 1,
        })

        return result.toTextStreamResponse();
    } catch (error: unknown){
        console.error("Poem generate API error:", error);
        return new Response(
            JSON.stringify({ error: "诗词生成失败，请稍后重试" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
