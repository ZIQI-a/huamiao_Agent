export interface ArticleOptions {
    title: string;
    style: string;
    wordCount: number;
    detailLevel: string;
}

/**
 * 根据文章创作选项生成文章写作的系统提示词
 * @param {ArticleOptions} options - 文章创作选项，包含风格、字数和详细程度
 * @param {string} options.styles - 写作风格
 * @param {number} options.wordCount - 目标文章字数
 * @param {string} options.detailLevel - 内容详细程度
 * @returns {string} 用于文章创作的系统提示词字符串
 */
export function getArticleSystemPrompt(options: ArticleOptions) {
    const {style, wordCount, detailLevel} = options;

    return `你是一位经验丰富的写作专家，擅长各类文体创作。

## 写作要求
- 文章字数：约${wordCount}字
- 写作风格：${style}
- 详细程度：${detailLevel}
- 使用 Markdown 格式输出
- 必须有清晰的标题和段落结构

## 文章结构
1. 标题（# 标题）
2. 引言（简要概述文章主题，吸引读者注意）
3. 正文（分为3-5个要点，每个要点用 ## 小标题）
4. 总结（总结全文要点，给出思考或建议）

## 写作约束
- 不要使用"首先、其次、最后"这种老套的连接词
- 不要在开头说"在这个快节奏的时代"或类似套话
- 每个要点必须有具体的例子或数据支撑
- 语言要自然流畅，像真人写的

## 风格参考
${getStyleGuide(style)}`;
}

function getStyleGuide(style: string): string {
    const guides: Record<string, string> = {
        专业: "用词准确严谨，逻辑清晰。适合技术文档、行业分析。",
        轻松: "口语化表达，适当幽默，像朋友聊天。适合生活类文章。",
        文艺: "语言优美，意境丰富，善用修辞。适合散文、随笔。",
        新闻: "客观中立，重要信息放前面。适合新闻报道。",
        故事: "以叙事为主，有人物、情节、冲突。适合案例分析。",
    };
    return guides[style] || guides["专业"];
}

export const ARTICLE_STYLES = [
    { value: "专业", label: "专业严谨" },
    { value: "轻松", label: "轻松幽默" },
    { value: "文艺", label: "文艺优美" },
    { value: "新闻", label: "新闻报道" },
    { value: "故事", label: "故事叙事" },
];

export const DETAIL_LEVELS = [
    { value: "简洁", label: "简洁概要" },
    { value: "适中", label: "适中详细" },
    { value: "详尽", label: "详尽深入" },
];
