// 应用配置文件
// 集中管理所有配置项，便于维护和切换

export const config = {
  // LLM 模型配置
  llm: {
    // 默认模型名称，可通过环境变量 LLM_MODEL 覆盖
    model: process.env.LLM_MODEL || "mimo-v2.5-pro",
    
    // 可用的模型列表（用于切换）
    models: {
      deepseek: "deepseek-chat",
      qwen: "qwen-turbo",
      mimo: "mimo-v2.5-pro",
    },
  },
  
  // 其他配置可以在这里添加
  // 例如：max_tokens, temperature 等
};