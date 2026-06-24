import { createOpenAI } from "@ai-sdk/openai";

export interface ModelConfig {
    id: string;
    name: string;
    provider: string;
    baseURL: string;
    apiKey: string;
    model: string;
}

export const models: ModelConfig[] = [
    {
        id: "deepseek",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API_KEY || "",
        model: "deepseek-chat",
    },
    {
        id: "qwen",
        name: "通义千问",
        provider: "阿里云",
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        apiKey: process.env.QWEN_API_KEY || "",
        model: "qwen-turbo",
    },
];

export function getModel(modelId?: string) {
    const config = models.find((m) => m.id === modelId) || models[0];
    const client = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
    });
    return client(config.model);
}
