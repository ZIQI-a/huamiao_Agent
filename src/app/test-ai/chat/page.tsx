"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "错误：" + data.error },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "请求失败：" + error },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="对话测试" description="测试多轮对话">
      <div className="space-y-4">
        {/* 消息列表 */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                <CardContent className="py-2 px-4">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card>
                <CardContent className="py-2 px-4">
                  <p className="text-sm text-muted-foreground">AI 思考中...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 输入框 */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入消息..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            发送
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
