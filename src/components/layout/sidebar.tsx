"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS, ROUTES } from "@/lib/routes";

function getCurrentTitle(pathname: string) {
  const current = APP_NAV_ITEMS.find((item) => item.href === pathname);
  return current?.label || "创作";
}

export function Sidebar() {
  const pathname = usePathname();
  const currentTitle = getCurrentTitle(pathname);

  return (
    <header className="hm-topbar">
      <div className="hm-topbar-left">
        <Link href={ROUTES.landing} className="hm-logo-link">
          <span className="hm-logo-cat" aria-hidden="true">
            <span className="hm-logo-face" />
          </span>
          <span className="hm-logo-text">话喵</span>
        </Link>
        <div className="hm-breadcrumb">
          <span>创作</span>
          <span className="hm-breadcrumb-sep">/</span>
          <span className="hm-breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      <nav className="hm-mode-tabs" aria-label="工作台导航">
        {APP_NAV_ITEMS.map((item) => {
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
        <button className="hm-icon-btn" aria-label="帮助" title="帮助">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </button>
        <button className="hm-icon-btn" aria-label="通知" title="通知">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <div className="hm-avatar" title="个人中心">喵</div>
      </div>
    </header>
  );
}
