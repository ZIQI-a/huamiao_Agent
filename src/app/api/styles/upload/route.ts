import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { styles } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;

        if (!file) {
            return NextResponse.json({ error: "请上传文件" }, { status: 400 });
        }

        // 读取文件内容
        const content = await file.text();

        if (content.length < 50) {
            return NextResponse.json(
                { error: "文件内容太短，至少需要50字" },
                { status: 400 }
            );
        }

        // 保存到数据库
        const result = await db
            .insert(styles)
            .values({
                name: name || file.name,
                content,
            })
            .returning();

        return NextResponse.json({ success: true, style: result[0] });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "上传失败";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
