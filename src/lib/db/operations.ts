import {db} from "./index"
import {articles, poems} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// ========== 文章操作 ==========

// 保存文章
export async function saveArticle(data: {
    title: string;
    content: string;
    style?: string;
    wordCount?: number;
    detailLevel?: string;
}) {
    const result = await db.insert(articles).values(data).returning();
    return result[0];
}

// 获取所有文章（按创建时间倒序）
export async function getArticles() {
    return db.select().from(articles).orderBy(desc(articles.createdAt));
}

// 获取单篇文章
export async function getArticle(id: number) {
    const result = await db
        .select()
        .from(articles)
        .where(eq(articles.id, id));
    return result[0];
}

// 删除文章
export async function deleteArticle(id: number) {
    return db.delete(articles).where(eq(articles.id, id));
}

// ========== 诗词操作 ==========

// 保存诗词
export async function savePoem(data: {
    noun: string;
    content: string;
    type?: string;
    dynasty?: string;
}) {
    const result = await db.insert(poems).values(data).returning();
    return result[0];
}

// 获取所有诗词
export async function getPoems() {
    return db.select().from(poems).orderBy(desc(poems.createdAt));
}

// 删除诗词
export async function deletePoem(id: number) {
    return db.delete(poems).where(eq(poems.id, id));
}
