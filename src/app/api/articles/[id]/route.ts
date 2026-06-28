import { NextRequest, NextResponse } from "next/server";
import { deleteArticle } from "@/lib/db/operations";

// 删除文章
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const articleId = Number(id);

        if (!Number.isInteger(articleId) || articleId <= 0) {
            return NextResponse.json({ error: "文章 ID 不合法" }, { status: 400 });
        }

        await deleteArticle(articleId);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "删除文章失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
