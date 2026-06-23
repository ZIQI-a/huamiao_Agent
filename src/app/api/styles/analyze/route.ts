import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {z} from "zod";
import {styles} from "@/lib/db/schema";
import {eq} from "drizzle-orm";
import {generateObject} from "ai";
import {config} from "@/lib/config";
import {llmProvider} from "@/lib/llm/client";


// 风格分析的 Zod schema，限定字段的类型
const styleSchema = z.object({
    tone: z.enum(["正式", "轻松", "文艺", "幽默", "严肃", "客观"]),
    vocabulary: z.enum(["简单", "适中", "复杂", "学术"]),
    sentenceLength: z.enum(["短句为主", "长短结合", "长句为主"]),
    features: z.array(z.string()).describe("3-5个写作特点"),
    summary: z.string().describe("一句话总结风格"),
});

export async function POST(req: NextRequest) {
    try {
        const {id} = await req.json();

        const result = await db.select().from(styles).where(eq(styles.id, id));
        const style = result[0];

        if (!style) {
            return NextResponse.json({error: "未找到文章"}, {status: 404});
        }

        const { object } = await generateObject({
            model: llmProvider.chat(config.llm.model),
            schema: styleSchema,
            prompt: `分析以下文章的写作风格，用 JSON 格式输出：文章内容：${style.content.slice(0, 3000)}`,
        });
        // 更新数据库
        await db
            .update(styles)
            .set({ analysis: JSON.stringify(object, null, 2) })
            .where(eq(styles.id, id));
        return NextResponse.json({ success: true, analysis: object });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "风格分析失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

