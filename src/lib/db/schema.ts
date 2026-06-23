import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 文章表
export const articles = sqliteTable("articles", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    style: text("style").default("专业"),
    wordCount: integer("word_count"),
    detailLevel: text("detail_level").default("适中"),
    createdAt: text("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// 诗词表
export const poems = sqliteTable("poems", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    noun: text("noun").notNull(),
    content: text("content").notNull(),
    type: text("type").default("七言绝句"),
    dynasty: text("dynasty").default("唐"),
    createdAt: text("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});

// 风格库表（后面用）
export const styles = sqliteTable("styles", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    content: text("content").notNull(),
    analysis: text("analysis"),
    createdAt: text("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});
