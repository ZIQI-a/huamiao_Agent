export interface PoemOptions {
    noun: string;
    type: string;
    dynasty: string;
}

export function getPoemSystemPrompt(options: PoemOptions) {
    const { type, dynasty } = options;

    return `你是一位精通古典文学的诗人，深谙${dynasty}代诗词的格律和意境。

## 创作要求
- 诗词类型：${type}
- 风格参考：${dynasty}代诗风
- 根据用户提供的名词或主题创作

## 格律要求
${getTypeRules(type)}

## 创作原则
1. 意境优先：诗要有画面感，让读者"看见"诗中的场景
2. 用典自然：可以用典故，但要自然不生硬
3. 情景交融：景中有情，情中有景
4. 语言凝练：每个字都要有用，不多余

## 输出格式
请严格按以下格式输出，不要添加额外内容：

[诗词标题]

[诗词正文，每句一行]

---

[注释]
- 词语1：解释
- 词语2：解释

[赏析]
（对诗词的意境、手法、情感进行赏析，80-120字）

## 约束
- 不要写现代白话诗
- 不要在诗词正文中加括号注释
- 不要使用过于生僻的字
- 诗词标题要雅致，不要直接用输入的名词`;
}

function getTypeRules(type: string): string {
    const rules: Record<string, string> = {
        五言绝句: "五言绝句，四句，每句五字。注意平仄和押韵。",
        七言绝句: "七言绝句，四句，每句七字。注意平仄和押韵。",
        五言律诗: "五言律诗，八句，每句五字。中间两联（颔联、颈联）要求对仗。",
        七言律诗: "七言律诗，八句，每句七字。中间两联（颔联、颈联）要求对仗。",
        宋词: "宋词，按词牌填写。请注明使用的词牌名，如《浣溪沙》《蝶恋花》等。",
    };
    return rules[type] || rules["七言绝句"];
}

export const POEM_TYPES = [
    { value: "五言绝句", label: "五言绝句" },
    { value: "七言绝句", label: "七言绝句" },
    { value: "五言律诗", label: "五言律诗" },
    { value: "七言律诗", label: "七言律诗" },
    { value: "宋词", label: "宋词" },
];

export const DYNASTIES = [
    { value: "唐", label: "唐诗" },
    { value: "宋", label: "宋词" },
    { value: "魏晋", label: "魏晋风骨" },
];
