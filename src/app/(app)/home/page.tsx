import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

const features = [
  {
    title: "文章创作",
    description: "输入标题，AI 帮你写文章。支持选择字数、风格和详细程度。",
    icon: "✍️",
    accent: "bg-[#FF6B6B]",
    href: ROUTES.articles.create,
  },
  {
    title: "古诗词生成",
    description: "输入一个名词，AI 为你创作古诗词，附带注释和赏析。",
    icon: "📜",
    accent: "bg-[#4ECDC4]",
    href: ROUTES.poems,
  },
  {
    title: "风格文库",
    description: "导入你喜欢的文章，AI 学习风格后进行仿写创作。",
    icon: "📚",
    accent: "bg-[#C77DFF]",
    href: ROUTES.styles,
  },
];

export default function Home() {
  return (
    <div className="hm-page">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="hm-card h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[var(--hm-shadow-lg)]">
              <CardHeader>
                <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white ${feature.accent}`}>
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex rounded-full bg-[var(--hm-accent-light)] px-3 py-1 text-xs font-bold text-[var(--hm-accent-deep)]">
                  进入
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="hm-card rounded-[24px] p-6">
          <div className="hm-panel-heading mb-4">
            <span className="hm-panel-icon">🐱</span>
            <h2 className="hm-panel-title">今日创作</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["文章初稿", "诗词正文", "风格分析"].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--hm-border)] bg-[var(--hm-surface-2)] p-4">
                <div className="text-sm font-bold text-[var(--hm-fg)]">{item}</div>
                <div className="mt-1 text-xs text-[var(--hm-muted)]">准备就绪</div>
              </div>
            ))}
          </div>
        </section>

        <section className="hm-card rounded-[24px] p-6">
          <div className="hm-panel-heading mb-4">
            <span className="hm-panel-icon">✨</span>
            <h2 className="hm-panel-title">状态</h2>
          </div>
          <p className="text-sm leading-7 text-[var(--hm-muted)]">
            当前工作台已连接文章、古诗词、风格文库与历史记录。
          </p>
        </section>
      </div>
    </div>
  );
}
