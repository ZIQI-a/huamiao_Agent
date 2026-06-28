// 集中维护页面路由，避免宣传页和工作台导航中重复写路径。
export const ROUTES = {
  landing: "/",
  home: "/home",
  articles: {
    create: "/articles/create",
  },
  poems: "/poems",
  styles: "/styles",
  history: "/history",
  testAi: "/test-ai",
} as const;

// 工作台主导航配置，侧边栏和后续导航入口应优先复用这里。
export const APP_NAV_ITEMS = [
  { label: "首页", href: ROUTES.home, icon: "🏠" },
  { label: "文章创作", href: ROUTES.articles.create, icon: "✍️" },
  { label: "古诗词", href: ROUTES.poems, icon: "📜" },
  { label: "风格文库", href: ROUTES.styles, icon: "📚" },
  { label: "历史记录", href: ROUTES.history, icon: "📋" },
] as const;
