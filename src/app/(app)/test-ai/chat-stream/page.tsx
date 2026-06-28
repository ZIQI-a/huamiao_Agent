"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatStream() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat-stream",
    }),
  });
  const [input, setInput] = useState("");

  // 提交用户消息，并在发送成功后清空输入框。
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!input.trim() || status !== "ready") {
      return;
    }

    await sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="hm-page">
      <div className="space-y-4">
        {/* 消息列表 */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {messages.map((message) => {
            // 只渲染文本片段，忽略工具调用等非文本消息块。
            const textContent = message.parts
              .map((part) => (part.type === "text" ? part.text : ""))
              .join("");

            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  <CardContent className="py-2 px-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {textContent}
                      {status === "streaming" &&
                        message.id === messages[messages.length - 1]?.id && (
                          <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5" />
                        )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="text-red-500 text-sm">
            错误：{error.message || "对话生成失败，请稍后重试。"}
          </div>
        )}

        {/* 输入框 */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="输入消息..."
            disabled={status !== "ready"}
          />
          <Button type="submit" disabled={status !== "ready"}>
            {status === "submitted" || status === "streaming" ? "发送中..." : "发送"}
          </Button>
        </form>
      </div>
    </div>
  );
}
