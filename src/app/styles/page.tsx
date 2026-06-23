"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

    useEffect(() => {
        fetchStyles();
    }, []);

    const fetchStyles = async () => {
        const res = await fetch("/api/styles");
        const data = await res.json();
        setStyles(data);
        setLoading(false);
    };

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
                fetchStyles();
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
                fetchStyles();
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
        <PageContainer title="风格文库" description="导入文章，分析写作风格">
            {/* 上传区 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>导入文章</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end flex-wrap">
                        <div className="space-y-2">
                            <Label>文章名称（可选）</Label>
                            <Input ref={nameRef} placeholder="如：鲁迅杂文风格" />
                        </div>
                        <div className="space-y-2">
                            <Label>选择文件</Label>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".txt,.md"
                                className="block text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                            />
                        </div>
                        <Button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "上传中..." : "导入"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 风格列表 */}
            {loading ? (
                <p className="text-muted-foreground">加载中...</p>
            ) : styles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <div className="text-5xl mb-4">📚</div>
                    <p>还没有导入任何文章</p>
                    <p className="text-sm">上传 .txt 或 .md 文件，AI 会分析其写作风格</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {styles.map((item) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
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
                                        >
                                            {analyzing === item.id ? "分析中..." : "分析风格"}
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        删除
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* 内容预览 */}
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {item.content.slice(0, 300)}...
                                </p>

                                {/* 风格分析结果 */}
                                {item.analysis && (
                                    <div className="bg-muted rounded-lg p-4">
                                        <h4 className="font-medium mb-2">风格分析</h4>
                                        <pre className="text-sm whitespace-pre-wrap">
                      {item.analysis}
                    </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </PageContainer>
    );
}
