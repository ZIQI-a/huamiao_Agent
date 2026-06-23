import { NextRequest, NextResponse } from "next/server";
import { deleteArticle } from "@/lib/db/operations";

// 删除文章
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await deleteArticle(Number(params.id));
    return NextResponse.json({ success: true });
}
