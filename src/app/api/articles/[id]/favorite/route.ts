import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 更新文章收藏状态
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { isFavorite } = await req.json();
    await db
        .update(articles)
        .set({ isFavorite })
        .where(eq(articles.id, Number(id)));
    return NextResponse.json({ success: true });
}
