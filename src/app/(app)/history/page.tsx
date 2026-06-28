"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Article {
    id: number;
    title: string;
    content: string;
    style: string;
    createdAt: string;
}

interface Poem {
    id: number;
    noun: string;
    content: string;
    type: string;
    dynasty: string;
    createdAt: string;
}

export default function History() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [poems, setPoems] = useState<Poem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/history");
            const data = await res.json();
            setArticles(data.articles);
            setPoems(data.poems);
        } catch (error) {
            console.error("加载历史记录失败", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 初次进入历史页读取文章和诗词记录。
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchHistory();
    }, []);

    const handleDeleteArticle = async (id: number) => {
        if (!confirm("确定删除这篇文章？")) return;
        await fetch(`/api/articles/${id}`, { method: "DELETE" });
        setArticles(articles.filter((a) => a.id !== id));
    };

    const handleDeletePoem = async (id: number) => {
        if (!confirm("确定删除这首诗词？")) return;
        await fetch(`/api/poems/${id}`, { method: "DELETE" });
        setPoems(poems.filter((p) => p.id !== id));
    };

    return (
        <div className="hm-page">
            <section className="hm-preview-panel min-h-[calc(100vh-150px)] rounded-[24px] border border-[var(--hm-border)]">
                <div className="hm-preview-toolbar">
                    <div className="hm-toolbar-left">
                        <span className={`hm-status-badge ${loading ? "loading" : articles.length + poems.length ? "done" : ""}`}>
                            {loading ? "加载中" : `${articles.length + poems.length} 条记录`}
                        </span>
                    </div>
                </div>

                <div className="hm-preview-content">
                    {loading ? (
                        <div className="hm-loading-state">
                            <div className="hm-loading-cat">📋</div>
                            <h3>正在读取历史</h3>
                        </div>
                    ) : (
                        <Tabs defaultValue="articles">
                            <TabsList className="mb-5 rounded-2xl bg-[var(--hm-bg-warm)] p-1">
                                <TabsTrigger value="articles" className="rounded-xl">
                                    文章 ({articles.length})
                                </TabsTrigger>
                                <TabsTrigger value="poems" className="rounded-xl">
                                    诗词 ({poems.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="articles" className="space-y-4">
                                {articles.length === 0 ? (
                                    <EmptyHistory title="还没有创作过文章" />
                                ) : (
                                    articles.map((article) => (
                                        <Card key={article.id} className="hm-list-card">
                                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg">{article.title}</CardTitle>
                                                    <p className="mt-1 text-sm text-[var(--hm-muted)]">
                                                        {article.style} · {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    className="hm-tool-btn"
                                                >
                                                    删除
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="line-clamp-3 text-sm leading-7 text-[var(--hm-muted)]">
                                                    {article.content.slice(0, 220)}...
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="poems" className="space-y-4">
                                {poems.length === 0 ? (
                                    <EmptyHistory title="还没有创作过诗词" />
                                ) : (
                                    poems.map((poem) => (
                                        <Card key={poem.id} className="hm-list-card">
                                            <CardHeader className="flex flex-row items-start justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        「{poem.noun}」— {poem.type}
                                                    </CardTitle>
                                                    <p className="mt-1 text-sm text-[var(--hm-muted)]">
                                                        {poem.dynasty}风 · {new Date(poem.createdAt).toLocaleDateString("zh-CN")}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeletePoem(poem.id)}
                                                    className="hm-tool-btn"
                                                >
                                                    删除
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="whitespace-pre-line font-serif text-sm leading-8 text-[var(--hm-fg)]">
                                                    {poem.content.split("---")[0]}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </section>
        </div>
    );
}

function EmptyHistory({ title }: { title: string }) {
    return (
        <div className="hm-empty-state">
            <div className="hm-empty-cat">
                <span className="hm-empty-cat-face" />
            </div>
            <h3>{title}</h3>
            <p>完成一次生成后，内容会自动保存到这里。</p>
        </div>
    );
}
