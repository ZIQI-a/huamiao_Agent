"use client";

import { useState, useEffect } from "react";
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
import {downloadMarkdown} from "@/lib/export/markdown";

const wordCountOptions = [
  { value: "800", label: "800 字", hint: "短文速写" },
  { value: "1500", label: "1500 字", hint: "标准成稿" },
  { value: "2500", label: "2500 字", hint: "长文展开" },
  { value: "4000", label: "4000 字", hint: "深度表达" },
];

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("专业");
  const [wordCount, setWordCount] = useState("1500");
  const [detailLevel, setDetailLevel] = useState("适中");
  const [stylesList, setStylesList] = useState<{id: number; name: string}[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");
  const [mode, setMode] = useState<"normal" | "imitate">("normal");

  const { completion, isLoading, error, complete } = useCompletion({
    api: "/api/articles/generate",
    // 文章接口返回纯文本流，需要显式按 text 协议解析。
    streamProtocol: "text",
  });

  // 获取所有风格列表
  useEffect(() => {
    fetch("/api/styles")
        .then((res) => res.json())
        .then(setStylesList);
  }, []);

  const handleGenerate = async () => {
    if (!title.trim()) return;

    if (mode === "imitate" && selectedStyleId) {
      // 风格仿写模式
      await complete("", {
        body: { title, styleId: Number(selectedStyleId), wordCount: Number(wordCount) },
      });
    } else {
      // 普通模式
      await complete("", {
        body: { title, style, wordCount: Number(wordCount), detailLevel },
      });
    }
  };

  // 粗略统计字数
  const charCount = completion?.length || 0;
  const hasContent = completion.trim().length > 0;
  const selectedStyleLabel =
    ARTICLE_STYLES.find((item) => item.value === style)?.label || style;
  const selectedDetailLabel =
    DETAIL_LEVELS.find((item) => item.value === detailLevel)?.label || detailLevel;

  return (
    <PageContainer title="文章创作">
      <div className="-mt-2 grid grid-cols-1 gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Card className="overflow-visible rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,240,0.95))] shadow-[0_16px_50px_-42px_rgba(117,67,18,0.5)]">
            <CardHeader className="border-b border-border/50 pb-5">
              <CardTitle className="text-lg font-semibold">创作参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">

              {/* 创作模式 */}
              <div className="space-y-2">
                <Label>创作模式</Label>
                <div className="flex gap-2">
                  <Button
                      variant={mode === "normal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMode("normal")}
                  >
                    自由创作
                  </Button>
                  <Button
                      variant={mode === "imitate" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMode("imitate")}
                  >
                    风格仿写
                  </Button>
                </div>
              </div>

              {/* 风格选择（仿写模式显示） */}
              {mode === "imitate" && (
                  <div className="space-y-2">
                    <Label>选择参考风格</Label>
                    <Select value={selectedStyleId} onValueChange={setSelectedStyleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择风格文库中的文章" />
                      </SelectTrigger>
                      <SelectContent>
                        {stylesList.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {stylesList.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          请先在风格文库中导入文章
                        </p>
                    )}
                  </div>
              )}
                <div className="space-y-2 ">
                  <Label htmlFor="title">文章标题</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入文章标题"
                    className="h-11 rounded-2xl bg-white/85 px-4"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label>写作风格</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="h-11 w-full rounded-2xl bg-white/80 px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ARTICLE_STYLES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>详细程度</Label>
                    <Select value={detailLevel} onValueChange={setDetailLevel}>
                      <SelectTrigger className="h-11 w-full rounded-2xl bg-white/80 px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DETAIL_LEVELS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>目标字数</Label>
                    <span className="text-xs font-medium text-muted-foreground">
                      {wordCount} 字
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {wordCountOptions.map((option) => {
                      const isActive = wordCount === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setWordCount(option.value)}
                          className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                            isActive
                              ? "border-primary/40 bg-primary/10 shadow-[0_12px_30px_-20px_rgba(234,118,41,0.8)]"
                              : "border-border/60 bg-white/75 hover:border-primary/20 hover:bg-white"
                          }`}
                        >
                          <div className="text-sm font-medium text-foreground">{option.label}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{option.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!title.trim() || isLoading}
                  className="h-12 w-full rounded-2xl text-sm font-medium shadow-[0_18px_40px_-22px_rgba(234,118,41,0.8)]"
                  size="lg"
                >
                  {isLoading ? "喵喵正在创作中..." : "开始创作"}
                </Button>
              </CardContent>
            </Card>
          </div>

        <div className="min-w-0">
          <Card className="min-h-[720px] rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,249,243,0.97))] shadow-[0_20px_70px_-48px_rgba(85,52,16,0.5)]">
            <CardHeader className="gap-4 border-b border-border/50">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl font-semibold">文章预览</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                    风格: {selectedStyleLabel}
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                    细节: {selectedDetailLabel}
                  </span>
                  <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                    已生成: {charCount} 字
                  </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadMarkdown(completion, title || "文章")}
                >
                  导出 Markdown
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600">
                    生成失败：{error.message}
                  </div>
                )}

                {!hasContent && !isLoading && (
                  <div className="flex min-h-[580px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,237,213,0.7),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,249,241,0.94))] px-6 text-center">
                    <div className="mb-5 flex h-18 w-18 items-center justify-center rounded-full border border-primary/15 bg-white/80 text-4xl shadow-sm">
                      ✍️
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">等待生成</h3>
                  </div>
                )}

                {isLoading && !hasContent && (
                  <div className="flex min-h-[580px] flex-col items-center justify-center rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,251,235,0.8),rgba(255,255,255,0.92))] px-6 text-center">
                    <div className="mb-5 text-5xl animate-bounce">🐱</div>
                    <h3 className="text-xl font-semibold text-foreground">生成中</h3>
                  </div>
                )}

                {hasContent && (
                  <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <div className="flex items-center justify-between border-b border-border/50 bg-[linear-gradient(180deg,rgba(255,249,243,0.95),rgba(255,255,255,0.8))] px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      </div>
                      <div className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
                        Draft Preview
                      </div>
                    </div>
                    <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,250,246,0.96))] px-5 py-6 sm:px-8 sm:py-8">
                      <div className="relative">
                        <MarkdownRenderer content={completion} />
                        {isLoading && (
                          <span className="mt-2 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
