import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "./embeddings";
import { db } from "@/lib/db";
import { styles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 全局向量存储（内存中）
let vectorStore: MemoryVectorStore | null = null;

// 风格库变更后清空内存缓存，下一次检索会重新从数据库加载。
export function resetVectorStore() {
    vectorStore = null;
}

// 文档分块
export async function splitText(content: string) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,       // 每块500字符
        chunkOverlap: 50,     // 块之间重叠50字符
        separators: ["\n\n", "\n", "。", "！", "？", ".", " "],
    });

    return splitter.createDocuments([content]);
}

// 初始化向量存储（从数据库加载所有风格文章）
export async function initVectorStore() {
    const allStyles = await db.select().from(styles);

    if (allStyles.length === 0) {
        vectorStore = null;
        return;
    }

    // 把所有文章分块
    const allDocs = [];
    for (const style of allStyles) {
        const docs = await splitText(style.content);
        // 给每个文档块加上来源信息
        docs.forEach((doc: { metadata: Record<string, unknown> }) => {
            doc.metadata.styleId = style.id;
            doc.metadata.styleName = style.name;
        });
        allDocs.push(...docs);
    }

    // 创建向量存储
    vectorStore = await MemoryVectorStore.fromDocuments(allDocs, embeddings);
}

// 检索相似文档
async function searchSimilarInSelectedStyle(query: string, k: number, styleId: number) {
    const [style] = await db.select().from(styles).where(eq(styles.id, styleId));

    if (!style) {
        return [];
    }

    const docs = await splitText(style.content);
    docs.forEach((doc: { metadata: Record<string, unknown> }) => {
        doc.metadata.styleId = style.id;
        doc.metadata.styleName = style.name;
    });

    // 选中单个风格时使用临时向量库，避免全局检索混入其他风格文章。
    const selectedStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const results = await selectedStore.similaritySearchWithScore(query, k);

    return results.map(([doc, score]: [{ pageContent: string; metadata: Record<string, unknown> }, number]) => ({
        content: doc.pageContent,
        styleId: doc.metadata.styleId as number,
        styleName: doc.metadata.styleName as string,
        score: score.toFixed(3),
    }));
}

// 检索相似文档；传入 styleId 时只在该风格文章内检索。
export async function searchSimilar(query: string, k: number = 3, styleId?: number) {
    if (styleId) {
        return searchSimilarInSelectedStyle(query, k, styleId);
    }

    if (!vectorStore) {
        await initVectorStore();
    }

    if (!vectorStore) {
        return [];
    }

    const results = await vectorStore.similaritySearchWithScore(query, k);

    return results.map(([doc, score]: [{ pageContent: string; metadata: Record<string, unknown> }, number]) => ({
        content: doc.pageContent,
        styleId: doc.metadata.styleId as number,
        styleName: doc.metadata.styleName as string,
        score: score.toFixed(3),
    }));
}
