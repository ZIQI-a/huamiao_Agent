import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { styles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await db.delete(styles).where(eq(styles.id, Number(id)));
    return NextResponse.json({ success: true });
}
