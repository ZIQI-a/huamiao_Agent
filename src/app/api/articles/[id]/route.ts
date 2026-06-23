import { NextRequest, NextResponse } from "next/server";
import { deleteArticle } from "@/lib/db/operations";

// 删除文章
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await deleteArticle(Number(id));
    return NextResponse.json({ success: true });
}
