import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "话喵 - AI 智能创作平台",
  description: "AI 驱动的文章创作、古诗词生成、风格仿写平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex h-screen">
          {/* 左侧导航 */}
          <Sidebar />
          {/* 右侧主内容 */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
