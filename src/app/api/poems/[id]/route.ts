import { NextRequest, NextResponse } from "next/server";
import { deletePoem } from "@/lib/db/operations";

// 删除诗词
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await deletePoem(Number(params.id));
    return NextResponse.json({ success: true });
}
