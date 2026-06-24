import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "文章创作",
    description: "输入标题，AI 帮你写文章。支持选择字数、风格和详细程度。",
    icon: "✍️",
    href: "/articles/create",
  },
  {
    title: "古诗词生成",
    description: "输入一个名词，AI 为你创作古诗词，附带注释和赏析。",
    icon: "📜",
    href: "/poems",
  },
  {
    title: "风格文库",
    description: "导入你喜欢的文章，AI 学习风格后进行仿写创作。",
    icon: "📚",
    href: "/styles",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-primary">话喵</span>
          <span className="text-3xl ml-2">🐱</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          AI 驱动的文章创作、古诗词生成、风格仿写平台
        </p>
      </div>
      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
