"use client";

import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
    return (
        <div className="text-center py-8">
            <div className="text-4xl mb-4">😿</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            {onRetry && (
                <Button variant="outline" onClick={onRetry}>
                    重试
                </Button>
            )}
        </div>
    );
}
