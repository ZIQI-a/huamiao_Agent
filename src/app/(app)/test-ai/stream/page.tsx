"use client";

import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StreamTest() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/generate",
    // 当前后端返回纯文本流，需要显式按 text 协议解析。
    streamProtocol: "text",
  });

  return (
    <div className="hm-page">
      <div className="space-y-6">
        {/* 输入区 */}
        <form onSubmit={(e) => {
          if (!input.trim()) return;
          handleSubmit(e);
        }} className="space-y-4">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="输入你想让 AI 写的内容..."
            rows={3}
            disabled={isLoading}
            maxLength={1000}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "生成中..." : "开始生成"}
          </Button>
        </form>

        {/* 输出区 */}
        {completion && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI 生成结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap leading-relaxed">
                {completion}
                {/* 光标闪烁效果 */}
                {isLoading && (
                  <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-0.5" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="text-red-500 text-sm">
            错误：{error.message || "生成过程中出现错误，请重试。"}
          </div>
        )}
      </div>
    </div>
  );
}
