"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { APP_NAV_ITEMS, ROUTES } from "@/lib/routes";

function getCurrentTitle(pathname: string) {
  const current = APP_NAV_ITEMS.find((item) => item.href === pathname);
  return current?.label || "创作";
}

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const currentTitle = getCurrentTitle(pathname);

  return (
    <>
      <header className="hm-topbar">
        <div className="hm-topbar-left">
          <Link href={ROUTES.landing} className="hm-logo-link">
            <span className="hm-logo-cat" aria-hidden="true">
              <span className="hm-logo-face" />
            </span>
            <span className="hm-logo-text">话喵</span>
          </Link>
          <div className="hm-breadcrumb">
            <span>工作台</span>
            <span className="hm-breadcrumb-sep">/</span>
            <span className="hm-breadcrumb-current">{currentTitle}</span>
          </div>
        </div>

        <nav className="hm-mode-tabs" aria-label="工作台导航">
          {APP_NAV_ITEMS.slice(0, 3).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("hm-mode-tab", isActive && "active")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hm-topbar-right">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hm-icon-btn"
            aria-label="切换主题"
            title="切换主题"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
          <div className="hm-avatar" title="个人中心">喵</div>
        </div>
      </header>

      <aside className="hm-side-rail" aria-label="工作台侧栏">
        <Link href={ROUTES.home} className="hm-rail-logo" aria-label="工作台首页">
          🐱
        </Link>

        <nav className="hm-rail-nav">
          {APP_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("hm-rail-btn", isActive && "active")}
                data-tooltip={item.label}
                aria-label={item.label}
              >
                <span aria-hidden="true">{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hm-rail-footer">
          <span>v0.1.0</span>
        </div>
      </aside>
    </>
  );
}
