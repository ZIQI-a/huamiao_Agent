"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PageContainer } from "@/components/layout/page-container";
import { POEM_TYPES, DYNASTIES } from "@/lib/prompts/poem";

export default function Poems() {
    const [noun, setNoun] = useState("");
    const [type, setType] = useState("七言绝句");
    const [dynasty, setDynasty] = useState("唐");

    const { completion, isLoading, error, complete } = useCompletion({
        api: "/api/poems/generate",
    });

    const handleGenerate = async () => {
        if (!noun.trim()) return;
        await complete("", {
            body: { noun, type, dynasty },
        });
    };

    return (
        <PageContainer
            title="古诗词生成"
            description="输入名词，AI 创作古诗词"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧：参数 */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>创作参数</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>主题名词</Label>
                                <Input
                                    value={noun}
                                    onChange={(e) => setNoun(e.target.value)}
                                    placeholder="如：月亮、故乡、春天..."
                                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>诗词类型</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {POEM_TYPES.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>风格朝代</Label>
                                <Select value={dynasty} onValueChange={setDynasty}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DYNASTIES.map((d) => (
                                            <SelectItem key={d.value} value={d.value}>
                                                {d.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={!noun.trim() || isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading ? "诗意酝酿中..." : "创作诗词"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* 右侧：诗词展示 */}
                <div className="lg:col-span-2">
                    <Card className="min-h-[500px]">
                        <CardHeader>
                            <CardTitle>诗词预览</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="text-red-500 mb-4">
                                    生成失败：{error.message}
                                </div>
                            )}

                            {!completion && !isLoading && (
                                <div className="text-center text-muted-foreground py-20">
                                    <div className="text-6xl mb-4">📜</div>
                                    <p>输入一个名词，开始诗意之旅</p>
                                </div>
                            )}

                            {isLoading && !completion && (
                                <div className="text-center text-muted-foreground py-20">
                                    <div className="text-6xl mb-4 animate-pulse">🌙</div>
                                    <p>诗兴大发中...</p>
                                </div>
                            )}

                            {completion && (
                                <div className="poem-content">
                                    <PoemRenderer content={completion} />
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

// 诗词专用渲染组件
function PoemRenderer({ content }: { content: string }) {
    // 按 --- 分割诗词和注释赏析
    const parts = content.split("---");
    const poemPart = parts[0]?.trim();
    const analysisPart = parts[1]?.trim();

    return (
        <div className="space-y-8">
            {/* 诗词正文 - 古风样式 */}
            <div className="text-center py-8">
                <div className="inline-block text-left">
                    {poemPart?.split("\n").map((line, i) => {
                        if (line.trim() === "") return <br key={i} />;
                        // 标题行（不以标点结尾的短行）
                        if (
                            i === 0 &&
                            !line.match(/[，。！？；]$/) &&
                            line.trim().length < 10
                        ) {
                            return (
                                <h3
                                    key={i}
                                    className="text-2xl font-bold text-primary mb-6 text-center"
                                >
                                    {line.trim()}
                                </h3>
                            );
                        }
                        return (
                            <p
                                key={i}
                                className="text-xl leading-loose tracking-wider text-foreground/90"
                            >
                                {line.trim()}
                            </p>
                        );
                    })}
                </div>
            </div>

            {/* 注释赏析 - 普通排版 */}
            {analysisPart && (
                <div className="border-t pt-6">
                    {analysisPart.split("\n").map((line, i) => {
                        if (line.trim() === "") return <br key={i} />;
                        if (line.trim().startsWith("[") || line.trim().startsWith("【")) {
                            return (
                                <h4 key={i} className="font-semibold text-lg mt-4 mb-2">
                                    {line.replace(/[\[\]【】]/g, "")}
                                </h4>
                            );
                        }
                        if (line.trim().startsWith("-")) {
                            return (
                                <p key={i} className="text-muted-foreground ml-4 mb-1">
                                    {line}
                                </p>
                            );
                        }
                        return (
                            <p key={i} className="text-foreground/80 leading-7 mb-2">
                                {line}
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
