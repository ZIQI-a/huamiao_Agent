import OpenAI from "openai";
import { createOpenAI } from "@ai-sdk/openai";
import { config, type LlmProviderKey } from "@/lib/config";

// 统一维护各供应商的连接配置，避免在业务路由中重复写 baseURL 和密钥读取逻辑。
const providers = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  },
  qwen: {
    apiKey: process.env.QWEN_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  mimo: {
    apiKey: process.env.MIMO_API_KEY,
    baseURL: "https://api.xiaomimimo.com/v1",
  },
} as const;

// 根据统一配置选择默认客户端，避免在多个文件中重复维护默认供应商。
function pickProvider<T>(providerMap: Record<LlmProviderKey, T>): T {
  return providerMap[config.llm.provider];
}

// 创建 DeepSeek 客户端
// apiKey 从环境变量读取，不会暴露到前端
export const deepseek = new OpenAI({
  apiKey: providers.deepseek.apiKey,
  baseURL: providers.deepseek.baseURL,
});

// 如果要切换到通义千问，只需要改这两行
export const qwen = new OpenAI({
  apiKey: providers.qwen.apiKey,
  baseURL: providers.qwen.baseURL,
});

// 如果要切换到小米mimo
export const mimo = new OpenAI({
  apiKey: providers.mimo.apiKey,
  baseURL: providers.mimo.baseURL,
});

// AI SDK 的 provider 与 OpenAI SDK 客户端不是同一类型。
// 前者给 streamText / generateText 用，后者给 chat.completions.create 用。
export const deepseekProvider = createOpenAI({
  apiKey: providers.deepseek.apiKey,
  baseURL: providers.deepseek.baseURL,
});

export const qwenProvider = createOpenAI({
  apiKey: providers.qwen.apiKey,
  baseURL: providers.qwen.baseURL,
});

export const mimoProvider = createOpenAI({
  apiKey: providers.mimo.apiKey,
  baseURL: providers.mimo.baseURL,
});

export const llm = pickProvider({
  deepseek,
  qwen,
  mimo,
});

export const llmProvider = pickProvider({
  deepseek: deepseekProvider,
  qwen: qwenProvider,
  mimo: mimoProvider,
});
