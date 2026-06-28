import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 更新文章收藏状态
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const articleId = Number(id);
        const body = await req.json().catch(() => null);

        if (!Number.isInteger(articleId) || articleId <= 0) {
            return NextResponse.json({ error: "文章 ID 不合法" }, { status: 400 });
        }

        if (!body || typeof body.isFavorite !== "boolean") {
            return NextResponse.json({ error: "收藏状态必须是布尔值" }, { status: 400 });
        }

        await db
            .update(articles)
            .set({ isFavorite: body.isFavorite })
            .where(eq(articles.id, articleId));
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "更新收藏状态失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
