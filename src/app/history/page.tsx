"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
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

    if (loading) {
        return (
            <PageContainer title="历史记录">
                <p className="text-muted-foreground">加载中...</p>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="历史记录" description="查看已创作的文章和诗词">
            <Tabs defaultValue="articles">
                <TabsList>
                    <TabsTrigger value="articles">文章 ({articles.length})</TabsTrigger>
                    <TabsTrigger value="poems">诗词 ({poems.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-4 mt-4">
                    {articles.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            还没有创作过文章
                        </p>
                    ) : (
                        articles.map((article) => (
                            <Card key={article.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{article.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {article.style} · {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteArticle(article.id)}
                                    >
                                        删除
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {article.content.slice(0, 200)}...
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="poems" className="space-y-4 mt-4">
                    {poems.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            还没有创作过诗词
                        </p>
                    ) : (
                        poems.map((poem) => (
                            <Card key={poem.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">
                                            「{poem.noun}」— {poem.type}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {poem.dynasty}风 · {new Date(poem.createdAt).toLocaleDateString("zh-CN")}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeletePoem(poem.id)}
                                    >
                                        删除
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm whitespace-pre-line">
                                        {poem.content.split("---")[0]}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </PageContainer>
    );
}
