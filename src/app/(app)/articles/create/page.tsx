"use client";

import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { downloadMarkdown } from "@/lib/export/markdown";

const wordCountOptions = [
  { value: "800", label: "800 字", hint: "短文速写" },
  { value: "1500", label: "1500 字", hint: "标准成稿" },
  { value: "2500", label: "2500 字", hint: "长文展开" },
  { value: "4000", label: "4000 字", hint: "深度表达" },
];

const styleColors = ["#FF6B6B", "#4ECDC4", "#8B5CF6", "#FF8C42", "#C77DFF"];

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("专业");
  const [wordCount, setWordCount] = useState("1500");
  const [detailLevel, setDetailLevel] = useState("适中");
  const [stylesList, setStylesList] = useState<{ id: number; name: string }[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("");
  const [mode, setMode] = useState<"normal" | "imitate">("normal");

  const { completion, isLoading, error, complete } = useCompletion({
    api: mode === "imitate" ? "/api/articles/imitate" : "/api/articles/generate",
    // 文章接口返回纯文本流，需要显式按 text 协议解析。
    streamProtocol: "text",
  });

  useEffect(() => {
    // 加载风格库列表，供风格仿写模式选择参考文章。
    fetch("/api/styles")
      .then((res) => res.json())
      .then(setStylesList)
      .catch(() => setStylesList([]));
  }, []);

  const handleGenerate = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    if (mode === "imitate") {
      if (!selectedStyleId) return;
      await complete("", {
        body: {
          title: normalizedTitle,
          styleId: Number(selectedStyleId),
          wordCount: Number(wordCount),
        },
      });
      return;
    }

    await complete("", {
      body: {
        title: normalizedTitle,
        style,
        wordCount: Number(wordCount),
        detailLevel,
      },
    });
  };

  const hasContent = completion.trim().length > 0;
  const selectedStyleLabel =
    ARTICLE_STYLES.find((item) => item.value === style)?.label || style;
  const selectedDetailLabel =
    DETAIL_LEVELS.find((item) => item.value === detailLevel)?.label || detailLevel;
  const canGenerate =
    title.trim().length > 0 && !isLoading && (mode === "normal" || selectedStyleId);

  return (
    <PageContainer title="文章创作" description="输入主题，选择风格，生成结构完整的文章初稿。">
      <div className="hm-workspace-grid">
        <section className="hm-input-panel" aria-label="文章创作参数">
          <div className="hm-panel-heading">
            <span className="hm-panel-icon">✍️</span>
            <h2 className="hm-panel-title">创作设置</h2>
          </div>

          <div className="hm-form-section">
            <Label className="hm-field-label">创作模式</Label>
            <div className="hm-tag-group">
              <button
                type="button"
                className={`hm-tag ${mode === "normal" ? "active" : ""}`}
                onClick={() => setMode("normal")}
              >
                自由创作
              </button>
              <button
                type="button"
                className={`hm-tag ${mode === "imitate" ? "active" : ""}`}
                onClick={() => setMode("imitate")}
              >
                风格仿写
              </button>
            </div>
          </div>

          <div className="hm-form-section">
            <Label htmlFor="title" className="hm-field-label">
              文章主题 <span className="text-[var(--hm-coral)]">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：数字时代的阅读习惯变迁"
              className="hm-text-input"
            />
            <div className="hm-field-hint">用一句话描述你想写的主题</div>
          </div>

          {mode === "imitate" ? (
            <div className="hm-form-section">
              <Label className="hm-field-label">选择参考风格</Label>
              <Select value={selectedStyleId} onValueChange={setSelectedStyleId}>
                <SelectTrigger className="hm-select-trigger">
                  <SelectValue placeholder="选择风格文库中的文章" />
                </SelectTrigger>
                <SelectContent>
                  {stylesList.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="hm-field-hint">
                {stylesList.length === 0 ? "请先在风格文库中导入文章" : "只会检索所选风格文章"}
              </div>
            </div>
          ) : (
            <div className="hm-form-section">
              <Label className="hm-field-label">文章风格</Label>
              <div className="hm-option-grid">
                {ARTICLE_STYLES.map((item, index) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`hm-option-card ${style === item.value ? "active" : ""}`}
                    onClick={() => setStyle(item.value)}
                  >
                    <span className="hm-option-dot" style={{ background: styleColors[index] }}>
                      {item.label.slice(0, 1)}
                    </span>
                    <span>
                      <span className="hm-option-title block">{item.label}</span>
                      <span className="hm-option-desc">写作预设</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="hm-form-section">
            <Label className="hm-field-label">详细程度</Label>
            <div className="hm-tag-group">
              {DETAIL_LEVELS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`hm-tag ${detailLevel === item.value ? "active" : ""}`}
                  onClick={() => setDetailLevel(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hm-form-section">
            <Label className="hm-field-label">文章篇幅</Label>
            <div className="hm-option-grid">
              {wordCountOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`hm-option-card ${wordCount === option.value ? "active" : ""}`}
                  onClick={() => setWordCount(option.value)}
                >
                  <span className="hm-option-dot">{option.value.slice(0, 1)}</span>
                  <span>
                    <span className="hm-option-title block">{option.label}</span>
                    <span className="hm-option-desc">{option.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="hm-generate-btn"
            size="lg"
          >
            {isLoading ? "话喵创作中..." : mode === "imitate" ? "开始仿写" : "开始创作"}
          </Button>
        </section>

        <section className="hm-preview-panel" aria-label="文章预览">
          <div className="hm-preview-toolbar">
            <div className="hm-toolbar-left">
              <span
                className={`hm-status-badge ${error ? "error" : isLoading ? "loading" : hasContent ? "done" : ""}`}
              >
                {error ? "生成失败" : isLoading ? "创作中" : hasContent ? "创作完成" : "等待创作"}
              </span>
              <span className="text-xs text-[var(--hm-muted)]">{completion.length || ""}</span>
            </div>
            <div className="hm-toolbar-actions">
              <Button
                variant="ghost"
                size="sm"
                className="hm-tool-btn primary"
                disabled={!hasContent}
                onClick={() => downloadMarkdown(completion, title || "文章")}
              >
                导出 Markdown
              </Button>
            </div>
          </div>

          <div className="hm-preview-content">
            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                生成失败：{error.message}
              </div>
            )}

            {!hasContent && !isLoading && (
              <div className="hm-empty-state">
                <div className="hm-empty-cat">
                  <span className="hm-empty-cat-face" />
                </div>
                <h3>等待创作</h3>
                <p>在左边输入主题，选择风格和篇幅，点击开始后这里会实时显示生成内容。</p>
              </div>
            )}

            {isLoading && !hasContent && (
              <div className="hm-loading-state">
                <div className="hm-loading-cat">🐱</div>
                <h3>话喵正在写</h3>
                <p>正在构思结构、组织段落和润色语言。</p>
              </div>
            )}

            {hasContent && (
              <article className="hm-result-paper">
                <div className="hm-result-bar">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  </div>
                  <div className="text-xs text-[var(--hm-muted)]">
                    {mode === "imitate" ? "风格仿写" : selectedStyleLabel} · {selectedDetailLabel}
                  </div>
                </div>
                <div className="hm-result-body">
                  <MarkdownRenderer content={completion} />
                  {isLoading && (
                    <span className="mt-2 inline-block h-5 w-0.5 animate-pulse bg-[var(--hm-accent)] align-middle" />
                  )}
                </div>
              </article>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
