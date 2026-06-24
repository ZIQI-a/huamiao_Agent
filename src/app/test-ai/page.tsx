"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/page-container";

export default function TestAI() {
  const [reply, setReply] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<{prompt_tokens: number; completion_tokens: number; total_tokens: number} | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setReply("");
    setUsage(null);

    try {
      const response = await fetch("/api/test");
      const data = await response.json();

      if (data.success) {
        setReply(data.reply);
        setUsage(data.usage);
      } else {
        setReply("错误：" + data.error);
      }
    } catch (error) {
      setReply("请求失败：" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="AI 测试" description="测试 DeepSeek API 调用">
      <div className="space-y-6">
        <Button onClick={handleTest} disabled={loading}>
          {loading ? "AI 思考中..." : "调用 AI"}
        </Button>

        {reply && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI 回复</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{reply}</p>
              {usage && (
                <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                  <p>输入 Token：{usage.prompt_tokens}</p>
                  <p>输出 Token：{usage.completion_tokens}</p>
                  <p>
                    总计 Token：{usage.total_tokens}
                    <span className="ml-2">
                      （约 ¥{((usage.total_tokens / 1000000) * 2).toFixed(4)}）
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
