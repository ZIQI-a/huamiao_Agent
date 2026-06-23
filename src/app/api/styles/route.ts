import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { styles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    const allStyles = await db
        .select()
        .from(styles)
        .orderBy(desc(styles.createdAt));
    return NextResponse.json(allStyles);
}
