"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/layout/page-container";

interface StyleItem {
    id: number;
    name: string;
    content: string;
    analysis: string | null;
    createdAt: string;
}

export default function StylesPage() {
    const [styles, setStyles] = useState<StyleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState<number | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const fetchStyles = async () => {
        try {
            const res = await fetch("/api/styles");
            const data = await res.json();
            setStyles(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 初次进入页面加载风格库列表。
        fetchStyles();
    }, []);

    const handleUpload = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", nameRef.current?.value || file.name);

        try {
            const res = await fetch("/api/styles/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                await fetchStyles();
                if (fileRef.current) fileRef.current.value = "";
                if (nameRef.current) nameRef.current.value = "";
            } else {
                alert(data.error);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async (id: number) => {
        setAnalyzing(id);
        try {
            const res = await fetch("/api/styles/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();

            if (data.success) {
                await fetchStyles();
            } else {
                alert(data.error);
            }
        } finally {
            setAnalyzing(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("确定删除？")) return;
        await fetch(`/api/styles/${id}`, { method: "DELETE" });
        setStyles(styles.filter((s) => s.id !== id));
    };

    return (
        <PageContainer title="风格文库" description="导入参考文章，分析写作风格，并用于文章仿写。">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
                <section className="hm-input-panel rounded-[24px] border border-[var(--hm-border)]">
                    <div className="hm-panel-heading">
                        <span className="hm-panel-icon">📚</span>
                        <h2 className="hm-panel-title">导入文章</h2>
                    </div>

                    <div className="hm-form-section">
                        <Label className="hm-field-label">文章名称</Label>
                        <Input ref={nameRef} placeholder="如：鲁迅杂文风格" className="hm-text-input" />
                    </div>

                    <div className="hm-form-section">
                        <Label className="hm-field-label">选择文件</Label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".txt,.md"
                            className="block w-full rounded-xl border-2 border-[var(--hm-border)] bg-[var(--hm-surface-2)] p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--hm-accent)] file:px-4 file:py-2 file:text-white"
                        />
                        <div className="hm-field-hint">支持 .txt / .md，内容至少 50 字</div>
                    </div>

                    <Button onClick={handleUpload} disabled={uploading} className="hm-generate-btn">
                        {uploading ? "上传中..." : "导入风格"}
                    </Button>
                </section>

                <section className="hm-preview-panel rounded-[24px] border border-[var(--hm-border)]">
                    <div className="hm-preview-toolbar">
                        <div className="hm-toolbar-left">
                            <span className={`hm-status-badge ${loading ? "loading" : styles.length ? "done" : ""}`}>
                                {loading ? "加载中" : `${styles.length} 个风格`}
                            </span>
                        </div>
                    </div>

                    <div className="hm-preview-content">
                        {loading ? (
                            <div className="hm-loading-state">
                                <div className="hm-loading-cat">📚</div>
                                <h3>正在读取风格库</h3>
                            </div>
                        ) : styles.length === 0 ? (
                            <div className="hm-empty-state">
                                <div className="hm-empty-cat">
                                    <span className="hm-empty-cat-face" />
                                </div>
                                <h3>还没有导入文章</h3>
                                <p>上传一篇参考文章，话喵会分析其语调、用词、句式和写作特点。</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                                {styles.map((item) => (
                                    <Card key={item.id} className="hm-card">
                                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                                <p className="text-sm text-[var(--hm-muted)]">
                                                    {item.content.length} 字 ·{" "}
                                                    {new Date(item.createdAt).toLocaleDateString("zh-CN")}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {!item.analysis && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAnalyze(item.id)}
                                                        disabled={analyzing === item.id}
                                                        className="hm-tool-btn primary"
                                                    >
                                                        {analyzing === item.id ? "分析中" : "分析"}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="hm-tool-btn"
                                                >
                                                    删除
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-4 line-clamp-3 text-sm leading-7 text-[var(--hm-muted)]">
                                                {item.content.slice(0, 300)}...
                                            </p>
                                            {item.analysis && (
                                                <div className="rounded-2xl bg-[var(--hm-surface-2)] p-4">
                                                    <h4 className="mb-2 text-sm font-bold">风格分析</h4>
                                                    <pre className="whitespace-pre-wrap text-xs leading-6 text-[var(--hm-muted)]">
                                                        {item.analysis}
                                                    </pre>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </PageContainer>
    );
}
