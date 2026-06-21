"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
    content: string;
}

function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                // 自定义标题样式
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-primary">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-6 mb-3 text-primary/90">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>
                    ),
                    // 自定义段落
                    p: ({ children }) => (
                        <p className="leading-7 mb-4 text-foreground/90">{children}</p>
                    ),
                    // 自定义引用
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">
                            {children}
                        </blockquote>
                    ),
                    // 自定义代码块
                    code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code
                                    className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                    // 自定义列表
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 my-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-1 my-4">{children}</ol>
                    ),
                    // 自定义分割线
                    hr: () => <hr className="my-8 border-border" />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownRenderer
