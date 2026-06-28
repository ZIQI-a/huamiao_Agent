import { NextRequest, NextResponse } from "next/server";
import { deletePoem } from "@/lib/db/operations";

// 删除诗词
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const poemId = Number(id);

        if (!Number.isInteger(poemId) || poemId <= 0) {
            return NextResponse.json({ error: "诗词 ID 不合法" }, { status: 400 });
        }

        await deletePoem(poemId);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "删除诗词失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
