import { OpenAIEmbeddings } from "@langchain/openai";

export const embeddings = new OpenAIEmbeddings({
    model: "BAAI/bge-large-zh-v1.5",
    apiKey: process.env.SILICONFLOW_API_KEY,
    configuration: {
        baseURL: "https://api.siliconflow.cn/v1",
    },
});
