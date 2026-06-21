"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/layout/page-container";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { ARTICLE_STYLES, DETAIL_LEVELS } from "@/lib/prompts/articles";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("专业");
  const [wordCount, setWordCount] = useState("1500");
  const [detailLevel, setDetailLevel] = useState("适中");

  const { completion, isLoading, error, complete } = useCompletion({
    api: "/api/articles/generate",
    // 文章接口返回纯文本流，需要显式按 text 协议解析。
    streamProtocol: "text",
  });

  const handleGenerate = async () => {
    if (!title.trim()) return;

    // 用标题作为 prompt，便于 hook 和接口语义保持一致。
    await complete(title.trim(), {
      body: {
        title: title.trim(),
        style,
        wordCount: Number(wordCount),
        detailLevel,
      },
    });
  };

  // 粗略统计字数
  const charCount = completion?.length || 0;

  return (
    <PageContainer
      title="文章创作"
      description="输入标题即可写出精美文章~"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：参数面板 */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>创作参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title">文章标题</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入文章标题..."
                />
              </div>

              {/* 风格 */}
              <div className="space-y-2">
                <Label>写作风格</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARTICLE_STYLES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 字数 */}
              <div className="space-y-2">
                <Label>目标字数</Label>
                <Select value={wordCount} onValueChange={setWordCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">800 字（短文）</SelectItem>
                    <SelectItem value="1500">1500 字（标准）</SelectItem>
                    <SelectItem value="2500">2500 字（长文）</SelectItem>
                    <SelectItem value="4000">4000 字（深度）</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 详细程度 */}
              <div className="space-y-2">
                <Label>详细程度</Label>
                <Select value={detailLevel} onValueChange={setDetailLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DETAIL_LEVELS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={!title.trim() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "喵喵正在创作中..." : "开始创作"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：预览区 */}
        <div className="lg:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>文章预览</CardTitle>
              {completion && (
                <span className="text-sm text-muted-foreground">
                  {charCount} 字
                </span>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-red-500 mb-4">
                  生成失败：{error.message}
                </div>
              )}

              {!completion && !isLoading && (
                <div className="text-center text-muted-foreground py-20">
                  <div className="text-5xl mb-4">✍️</div>
                  <p>输入标题，选择参数，开始创作</p>
                </div>
              )}

              {isLoading && !completion && (
                <div className="text-center text-muted-foreground py-20">
                  <div className="text-5xl mb-4 animate-bounce">🐱</div>
                  <p>话喵正在思考...</p>
                </div>
              )}

              {completion && (
                <div className="relative">
                  <MarkdownRenderer content={completion} />
                  {isLoading && (
                    <span className="inline-block w-0.5 h-5 bg-primary animate-pulse" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
