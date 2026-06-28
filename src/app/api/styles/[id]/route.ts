import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { styles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { resetVectorStore } from "@/lib/rag/vectorstore";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const styleId = Number(id);

        if (!Number.isInteger(styleId) || styleId <= 0) {
            return NextResponse.json({ error: "风格 ID 不合法" }, { status: 400 });
        }

        await db.delete(styles).where(eq(styles.id, styleId));
        // 风格删除后清空 RAG 内存缓存，避免继续检索已删除内容。
        resetVectorStore();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "删除风格失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
