import OpenAI from "openai";

// 创建 DeepSeek 客户端
// apiKey 从环境变量读取，不会暴露到前端
export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

// 如果要切换到通义千问，只需要改这两行
export const qwen = new OpenAI({
  apiKey: process.env.QWEN_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// 如果要切换到小米mimo
export const mimo = new OpenAI({
  apiKey: process.env.MIMO_API_KEY,
  baseURL: "https://token-plan-cn.xiaomimimo.com/v1",
});

// 默认使用 DeepSeek
export const llm = mimo;