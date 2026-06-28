// 应用配置文件
// 集中管理所有配置项，便于维护和切换

export const llmModels = {
  deepseek: "deepseek-chat",
  qwen: "qwen-turbo",
  mimo: "mimo-v2.5",
} as const;

export type LlmProviderKey = keyof typeof llmModels;

// 统一解析默认供应商，避免业务层自行判断。
function resolveProvider(): LlmProviderKey {
  const provider = process.env.LLM_PROVIDER;

  if (provider === "deepseek" || provider === "qwen" || provider === "mimo") {
    return provider;
  }

  return "mimo";
}

const defaultProvider = resolveProvider();

export const config = {
  // LLM 模型配置
  llm: {
    // 默认供应商，可通过环境变量 LLM_PROVIDER 覆盖。
    provider: defaultProvider,

    // 默认模型名优先读环境变量，否则跟随当前供应商的默认模型。
    model: process.env.LLM_MODEL || llmModels[defaultProvider],

    // 可用模型列表（用于切换）
    models: llmModels,
  },

  // 其他配置可以在这里添加
  // 例如：max_tokens, temperature 等
};
