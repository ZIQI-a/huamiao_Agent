"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "首页", href: "/", icon: "🏠" },
  { label: "文章创作", href: "/articles/create", icon: "✍️" },
  { label: "古诗词", href: "/poems", icon: "📜" },
  { label: "风格文库", href: "/styles", icon: "📚" },
  { label: "历史记录", href: "/history", icon: "📋" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐱</span>
          <span className="font-bold text-primary">话喵</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-3xl">🐱</span>
            <div>
              <h1 className="text-xl font-bold text-primary">话喵</h1>
              <p className="text-xs text-muted-foreground">AI 智能创作平台</p>
            </div>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 底部信息 */}
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p>Powered by DeepSeek</p>
            <p className="mt-1">v0.1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
