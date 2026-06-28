"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/layout/page-container";
import { POEM_TYPES, DYNASTIES } from "@/lib/prompts/poem";

const poemColors = ["#4ECDC4", "#FF8C42", "#8B5CF6", "#C77DFF", "#FF6B6B"];

export default function Poems() {
    const [noun, setNoun] = useState("");
    const [type, setType] = useState("七言绝句");
    const [dynasty, setDynasty] = useState("唐");

    const { completion, isLoading, error, complete } = useCompletion({
        api: "/api/poems/generate",
        streamProtocol: "text",
    });

    const handleGenerate = async () => {
        const normalizedNoun = noun.trim();
        if (!normalizedNoun) return;

        await complete("", {
            body: { noun: normalizedNoun, type, dynasty },
        });
    };

    const hasContent = completion.trim().length > 0;

    return (
        <PageContainer title="古诗词生成" description="输入一个主题词，生成正文、注释与赏析。">
            <div className="hm-workspace-grid">
                <section className="hm-input-panel" aria-label="古诗词创作参数">
                    <div className="hm-panel-heading">
                        <span className="hm-panel-icon">📜</span>
                        <h2 className="hm-panel-title">诗词设置</h2>
                    </div>

                    <div className="hm-form-section">
                        <Label className="hm-field-label">
                            诗词主题 <span className="text-[var(--hm-coral)]">*</span>
                        </Label>
                        <Input
                            value={noun}
                            onChange={(e) => setNoun(e.target.value)}
                            placeholder="例如：秋日思乡、山间晨雾"
                            className="hm-text-input"
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                        <div className="hm-field-hint">可以是名词、场景或情绪</div>
                    </div>

                    <div className="hm-form-section">
                        <Label className="hm-field-label">诗体</Label>
                        <div className="hm-option-grid">
                            {POEM_TYPES.map((item, index) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`hm-option-card ${type === item.value ? "active" : ""}`}
                                    onClick={() => setType(item.value)}
                                >
                                    <span className="hm-option-dot" style={{ background: poemColors[index] }}>
                                        {item.label.slice(0, 1)}
                                    </span>
                                    <span>
                                        <span className="hm-option-title block">{item.label}</span>
                                        <span className="hm-option-desc">格律预设</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hm-form-section">
                        <Label className="hm-field-label">朝代风格</Label>
                        <div className="hm-tag-group">
                            {DYNASTIES.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`hm-tag ${dynasty === item.value ? "active" : ""}`}
                                    onClick={() => setDynasty(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!noun.trim() || isLoading}
                        className="hm-generate-btn"
                        size="lg"
                    >
                        {isLoading ? "诗意酝酿中..." : "开始赋诗"}
                    </Button>
                </section>

                <section className="hm-preview-panel" aria-label="诗词预览">
                    <div className="hm-preview-toolbar">
                        <div className="hm-toolbar-left">
                            <span
                                className={`hm-status-badge ${error ? "error" : isLoading ? "loading" : hasContent ? "done" : ""}`}
                            >
                                {error ? "生成失败" : isLoading ? "创作中" : hasContent ? "创作完成" : "等待创作"}
                            </span>
                            <span className="text-xs text-[var(--hm-muted)]">{type} · {dynasty}风</span>
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
                                <h3>等待诗意</h3>
                                <p>输入主题，选择诗体和朝代风格，生成的诗词会在这里排版展示。</p>
                            </div>
                        )}

                        {isLoading && !hasContent && (
                            <div className="hm-loading-state">
                                <div className="hm-loading-cat">🌙</div>
                                <h3>诗兴正在酝酿</h3>
                                <p>话喵正在推敲意象、格律和赏析。</p>
                            </div>
                        )}

                        {hasContent && (
                            <article className="hm-result-paper">
                                <div className="hm-result-bar">
                                    <div className="text-xs font-bold text-[var(--hm-accent-deep)]">Poetry Preview</div>
                                    <div className="text-xs text-[var(--hm-muted)]">{type} · {dynasty}风</div>
                                </div>
                                <div className="hm-result-body">
                                    <PoemRenderer content={completion} />
                                    {isLoading && (
                                        <span className="inline-block h-5 w-0.5 animate-pulse bg-[var(--hm-accent)]" />
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

// 诗词专用渲染组件，按模型约定的分隔符拆分正文和注释赏析。
function PoemRenderer({ content }: { content: string }) {
    const parts = content.split("---");
    const poemPart = parts[0]?.trim();
    const analysisPart = parts[1]?.trim();

    return (
        <div className="space-y-8">
            <div className="py-8 text-center">
                <div className="inline-block text-left">
                    {poemPart?.split("\n").map((line, i) => {
                        if (line.trim() === "") return <br key={i} />;
                        if (
                            i === 0 &&
                            !line.match(/[，。！？；]$/) &&
                            line.trim().length < 10
                        ) {
                            return (
                                <h3
                                    key={i}
                                    className="mb-6 text-center font-serif text-3xl font-bold text-[var(--hm-fg)]"
                                >
                                    {line.trim()}
                                </h3>
                            );
                        }
                        return (
                            <p
                                key={i}
                                className="font-serif text-2xl leading-loose tracking-[0.1em] text-[var(--hm-fg)]"
                            >
                                {line.trim()}
                            </p>
                        );
                    })}
                </div>
            </div>

            {analysisPart && (
                <div className="rounded-2xl bg-[var(--hm-surface)] p-5 text-sm leading-8 text-[var(--hm-muted)]">
                    {analysisPart.split("\n").map((line, i) => {
                        if (line.trim() === "") return <br key={i} />;
                        if (line.trim().startsWith("[") || line.trim().startsWith("【")) {
                            return (
                                <h4 key={i} className="mt-3 mb-2 text-base font-bold text-[var(--hm-fg)]">
                                    {line.replace(/[\[\]【】]/g, "")}
                                </h4>
                            );
                        }
                        return <p key={i}>{line}</p>;
                    })}
                </div>
            )}
        </div>
    );
}
