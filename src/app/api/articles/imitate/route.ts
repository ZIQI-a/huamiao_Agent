import { streamText } from "ai";
import { searchSimilar } from "@/lib/rag/vectorstore";
import { saveArticle } from "@/lib/db/operations";
import { config } from "@/lib/config";
import { llmProvider } from "@/lib/llm/client";

export async function POST(req: Request) {
    const { title, styleId, wordCount } = await req.json();

    if (!title) {
        return new Response("标题不能为空", { status: 400 });
    }

    // 检索参考文章片段
    const similarDocs = await searchSimilar(title, 3);

    // 构建参考上下文
    const referenceContext =
        similarDocs.length > 0
            ? `\n\n## 参考风格\n以下是风格参考文章的片段，请模仿其写作风格：\n\n${similarDocs
                .map((doc: { content: string; styleName: string }, i: number) => `### 参考${i + 1}（来自：${doc.styleName}）\n${doc.content}`)
                .join("\n\n")}`
            : "";

    const system = `你是一位经验丰富的写作专家，擅长模仿各种写作风格。

## 写作要求
- 文章字数：约${wordCount || 1500}字
- 使用 Markdown 格式输出
- 必须有清晰的标题和段落结构
${referenceContext}

## 写作原则
1. 模仿参考文章的语言风格、用词习惯、句式结构
2. 保持内容的原创性，不要照搬参考文章的内容
3. 文章要围绕标题展开，有实质内容
4. 如果没有参考风格，就用自然流畅的写作风格`;

    const result = streamText({
        model: llmProvider.chat(config.llm.model),
        system,
        prompt: `请以《${title}》为题，创作一篇文章。`,
        maxOutputTokens: 100000,
        temperature: 0.8,
        onFinish: async ({ text }) => {
            await saveArticle({
                title,
                content: text,
                style: similarDocs.length > 0 ? "风格仿写" : "默认",
                wordCount: text.length,
                detailLevel: "适中",
            });
        },
    });

    return result.toTextStreamResponse();
}
